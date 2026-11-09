import { ReactElement } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import {
    BodyShort,
    ErrorMessage,
    Fieldset,
    HStack,
    TextField,
    Textarea,
    UNSAFE_Combobox,
    VStack,
} from '@navikt/ds-react';

import { ButtonKreverSkrivetilgang } from '@components/skrivetilgang/ButtonKreverSkrivetilgang';
import { VisesIkkeIVedtakTag } from '@components/tags/VisesIkkeIVedtakTag';
import {
    GraderteAndreYtelserFormFields,
    lagGraderteAndreYtelserSchema,
} from '@form-schemas/graderteAndreYtelserSkjema';
import { zodResolver } from '@hookform/resolvers/zod';
import { tilGraderteAndreYtelserEndring } from '@saksbilde/utbetaling/utbetalingstabell/graderteAndreYtelserUtils';
import { visningstekstForGradertAnnenYtelse } from '@saksbilde/utbetaling/utbetalingstabell/utbetalingstabelldager';
import { gradertAnnenYtelsetypeValues } from '@typer/overstyring';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';

import type { Dagendring } from './types';

const ytelsevalg = gradertAnnenYtelsetypeValues.map((ytelse) => ({
    label: visningstekstForGradertAnnenYtelse(ytelse),
    value: ytelse,
}));

interface GraderteAndreYtelserFormProps {
    markerteDager: Map<string, Utbetalingstabelldag>;
    onSubmitEndring: (endring: Dagendring) => void;
}

export function GraderteAndreYtelserForm({
    markerteDager,
    onSubmitEndring,
}: GraderteAndreYtelserFormProps): ReactElement {
    const form = useForm<GraderteAndreYtelserFormFields>({
        resolver: zodResolver(lagGraderteAndreYtelserSchema([...markerteDager.values()])),
        defaultValues: { ytelser: [], sykepengerGrad: null, andreYtelserGrader: {}, begrunnelse: '' },
    });
    const [ytelser, sykepengerGrad, andreYtelserGrader] = useWatch({
        control: form.control,
        name: ['ytelser', 'sykepengerGrad', 'andreYtelserGrader'],
    });

    const ytelsesgrad = ytelser.reduce((sum, ytelse) => sum + (andreYtelserGrader[ytelse] ?? 0), 0);
    const arbeidsgrad = Math.max(0, 100 - (sykepengerGrad ?? 0) - ytelsesgrad);
    const { errors } = form.formState;
    const prosentfeil = [
        errors.sykepengerGrad?.message,
        ...ytelser.map((ytelse) => errors.andreYtelserGrader?.[ytelse]?.message),
    ].filter((feil) => feil != undefined);

    return (
        <VStack gap="space-8" paddingInline="space-32" className="[&_label]:text-base [&_label]:font-normal">
            <BodyShort weight="semibold">
                Fyll inn hva {markerteDager.size === 1 ? `den valgte dagen` : `de ${markerteDager.size} valgte dagene`}{' '}
                skal endres til
            </BodyShort>
            <form
                onSubmit={form.handleSubmit((values) => onSubmitEndring(tilGraderteAndreYtelserEndring(values)))}
                autoComplete="off"
            >
                <VStack gap="space-16" align="start">
                    <Controller
                        control={form.control}
                        name="ytelser"
                        render={({ field, fieldState }) => (
                            <UNSAFE_Combobox
                                size="small"
                                label="Velg annen ytelse"
                                isMultiSelect
                                options={ytelsevalg}
                                selectedOptions={ytelsevalg.filter((valg) => field.value.includes(valg.value))}
                                onToggleSelected={(ytelse, erValgt) =>
                                    field.onChange(
                                        erValgt
                                            ? [...field.value, ytelse]
                                            : field.value.filter((valgt) => valgt !== ytelse),
                                    )
                                }
                                error={fieldState.error?.message}
                            />
                        )}
                    />
                    <Fieldset legend="Prosentvis fordeling mellom ytelser og arbeid" size="medium">
                        <HStack gap="space-20" align="end">
                            <TextField
                                label="Sykepenger"
                                size="small"
                                inputMode="numeric"
                                {...form.register('sykepengerGrad', { setValueAs: tilProsent })}
                            />
                            {ytelser.map((ytelse) => (
                                <TextField
                                    key={ytelse}
                                    label={visningstekstForGradertAnnenYtelse(ytelse)}
                                    size="small"
                                    inputMode="numeric"
                                    {...form.register(`andreYtelserGrader.${ytelse}`, {
                                        setValueAs: tilProsent,
                                        deps: ['sykepengerGrad'],
                                        shouldUnregister: true,
                                    })}
                                />
                            ))}
                            <TextField label="Arbeid" size="small" readOnly value={arbeidsgrad} />
                        </HStack>
                        {prosentfeil.map((feil) => (
                            <ErrorMessage key={feil} showIcon size="small">
                                {feil}
                            </ErrorMessage>
                        ))}
                    </Fieldset>
                    <VStack align="start" gap="space-8" paddingBlock="space-8">
                        <Textarea
                            id="graderte-andre-ytelser-begrunnelse"
                            data-testid="graderte-andre-ytelser-begrunnelse"
                            label={
                                <VisesIkkeIVedtakTag
                                    label={
                                        <BodyShort as="span" weight="semibold">
                                            Begrunnelse for endringer
                                        </BodyShort>
                                    }
                                />
                            }
                            description="Teksten vises ikke til den sykmeldte, med mindre hen ber om innsyn."
                            error={errors.begrunnelse?.message}
                            rows={6}
                            maxLength={2000}
                            {...form.register('begrunnelse')}
                            size="medium"
                        />
                    </VStack>
                    <HStack gap="space-8" marginBlock="space-0 space-8">
                        <ButtonKreverSkrivetilgang
                            size="small"
                            type="submit"
                            variant="secondary"
                            disabled={markerteDager.size === 0}
                            data-testid="endre"
                        >
                            Endre ({markerteDager.size})
                        </ButtonKreverSkrivetilgang>
                    </HStack>
                </VStack>
            </form>
        </VStack>
    );
}

function tilProsent(verdi: string): number | null {
    const prosent = Number.parseInt(verdi, 10);
    return Number.isNaN(prosent) ? null : prosent;
}
