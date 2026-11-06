import { ReactElement } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { BodyShort, ErrorMessage, Fieldset, HStack, Select, TextField, VStack } from '@navikt/ds-react';

import { ButtonKreverSkrivetilgang } from '@components/skrivetilgang/ButtonKreverSkrivetilgang';
import {
    GraderteAndreYtelserFormFields,
    lagGraderteAndreYtelserSchema,
} from '@form-schemas/graderteAndreYtelserSkjema';
import { zodResolver } from '@hookform/resolvers/zod';
import { tilGraderteAndreYtelserEndring } from '@saksbilde/utbetaling/utbetalingstabell/graderteAndreYtelserUtils';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';

import { typeendringerAndreYtelser } from './endringFormUtils';
import type { Dagendring } from './types';

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
        defaultValues: { ytelse: '', sykepengerGrad: null, gradAndreYtelser: null },
    });
    const [ytelse, sykepengerGrad, gradAndreYtelser] = useWatch({
        control: form.control,
        name: ['ytelse', 'sykepengerGrad', 'gradAndreYtelser'],
    });

    const arbeidsgrad = Math.max(0, 100 - (sykepengerGrad ?? 0) - (gradAndreYtelser ?? 0));
    const { errors } = form.formState;
    const prosentfeil = [errors.sykepengerGrad?.message, errors.gradAndreYtelser?.message].filter(
        (feil) => feil != undefined,
    );

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
                    <Select
                        size="small"
                        label="Velg annen ytelse"
                        error={errors.ytelse?.message}
                        {...form.register('ytelse')}
                    >
                        <option value="">- Velg -</option>
                        {typeendringerAndreYtelser.map((dag) => (
                            <option key={dag.speilDagtype} value={dag.speilDagtype}>
                                {dag.visningstekst}
                            </option>
                        ))}
                    </Select>
                    <Fieldset legend="Prosentvis fordeling mellom ytelser og arbeid" size="medium">
                        <HStack gap="space-20" align="end">
                            <TextField
                                label="Sykepenger"
                                size="small"
                                inputMode="numeric"
                                {...form.register('sykepengerGrad', { setValueAs: tilProsent })}
                            />
                            <TextField
                                label={ytelse}
                                size="small"
                                inputMode="numeric"
                                {...form.register('gradAndreYtelser', {
                                    setValueAs: tilProsent,
                                    deps: ['sykepengerGrad'],
                                })}
                            />
                            <TextField label="Arbeid" size="small" readOnly value={arbeidsgrad} />
                        </HStack>
                        {prosentfeil.map((feil) => (
                            <ErrorMessage key={feil} showIcon size="small">
                                {feil}
                            </ErrorMessage>
                        ))}
                    </Fieldset>
                    <ButtonKreverSkrivetilgang
                        size="small"
                        type="submit"
                        variant="secondary"
                        disabled={markerteDager.size === 0}
                        data-testid="endre"
                    >
                        Endre ({markerteDager.size})
                    </ButtonKreverSkrivetilgang>
                </VStack>
            </form>
        </VStack>
    );
}

function tilProsent(verdi: string): number | null {
    const prosent = Number.parseInt(verdi, 10);
    return Number.isNaN(prosent) ? null : prosent;
}
