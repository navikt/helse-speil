import React, { ReactElement } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { BodyShort, ErrorMessage, Fieldset, HStack, Select, TextField, VStack } from '@navikt/ds-react';

import { kanVelgeGrad } from '@saksbilde/utbetaling/utbetalingstabell/endringForm/kanVelgeGrad';
import { Utbetalingstabelldagtype } from '@typer/utbetalingstabell';
import { useSkalSeGraderteAndreYtelser } from '@utils/featureToggles';

import { typeendringerAndreYtelser } from '../utbetalingstabell/endringForm/endringFormUtils';
import { DagtypeSelect } from './DagtypeSelect';
import { DagtypeSelectInput } from './DagtypeSelectInput';
import type { DagtypeSelectProps } from './type';

const ANNEN_YTELSE = 'GradertAnnenYtelse';

export function DagtypeMedAndreYtelserSelect(props: DagtypeSelectProps): ReactElement {
    const skalSeGraderteAndreYtelser = useSkalSeGraderteAndreYtelser();

    if (!skalSeGraderteAndreYtelser) return <DagtypeSelect {...props} />;

    return <DagtypeMedAndreYtelserSelectAktivert {...props} />;
}

function DagtypeMedAndreYtelserSelectAktivert({
    name,
    erSelvstendig,
    overstyringsdagtyper,
    className,
    hideError = false,
}: DagtypeSelectProps): ReactElement {
    const { setValue } = useFormContext();
    const { field, fieldState } = useController({ name });
    const { field: valgtGradertAnnenYtelse } = useController({ name: 'gradererAnnenYtelse' });

    const { field: innvigletGrad, fieldState: innvigletGradState } = useController({ name: 'innvigletGrad' });

    const { field: sykepengerGradField, fieldState: sykepengerGradFieldState } = useController({
        name: 'sykepengerGrad',
    });
    const { field: gradAndreYtelserField, fieldState: gradAndreYtelserFieldState } = useController({
        name: 'gradAndreYtelser',
        rules: { deps: ['sykepengerGrad'] as string[] }, // revalider når sykepengerGrad endres
    });

    const gradererAnnenYtelse = valgtGradertAnnenYtelse.value;
    const StackWrapper = gradererAnnenYtelse ? VStack : HStack;

    const handleVisGradertAnnenYtelse = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const isAnnenYtelse = event.target.value === ANNEN_YTELSE;
        valgtGradertAnnenYtelse.onChange(isAnnenYtelse);
        if (!isAnnenYtelse) {
            innvigletGrad.onChange(null);
            sykepengerGradField.onChange(null);
            gradAndreYtelserField.onChange(null);
            if (!kanVelgeGrad(event.target.value as Utbetalingstabelldagtype)) setValue('grad', null);
        }
        field.onChange(isAnnenYtelse ? '' : event.target.value);
    };

    const oppdaterProsent =
        (onChange: (value: number | null) => void) => (event: React.ChangeEvent<HTMLInputElement>) => {
            const grad = Number.parseInt(event.target.value, 10);
            onChange(Number.isNaN(grad) ? null : grad);
        };

    const arbeidsgrad = Math.max(0, 100 - (sykepengerGradField.value ?? 0) - (gradAndreYtelserField.value ?? 0));
    const feilmeldinger = [sykepengerGradFieldState.error?.message, gradAndreYtelserFieldState.error?.message].filter(
        (feil) => feil != undefined,
    );

    return (
        <StackWrapper gap="space-16">
            <DagtypeSelectInput
                erSelvstendig={erSelvstendig}
                overstyringsdagtyper={overstyringsdagtyper}
                className={className}
                error={gradererAnnenYtelse ? undefined : fieldState.error?.message}
                hideError={hideError}
                style={{ width: 'auto' }}
                field={{
                    ...field,
                    value: gradererAnnenYtelse ? ANNEN_YTELSE : field.value,
                    onChange: handleVisGradertAnnenYtelse,
                }}
            >
                <option value={ANNEN_YTELSE}>Gradert annen ytelse</option>
            </DagtypeSelectInput>
            {gradererAnnenYtelse && (
                <>
                    <Select
                        size="small"
                        style={{ width: 'auto' }}
                        label="Velg annen ytelse"
                        data-testid="andre-ytelser-dropdown"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        disabled={field.disabled}
                        error={fieldState.error != undefined}
                    >
                        <option value="">- Velg -</option>
                        {typeendringerAndreYtelser.map((dag) => (
                            <option key={dag.speilDagtype} value={dag.speilDagtype}>
                                {dag.visningstekst}
                            </option>
                        ))}
                    </Select>

                    <VStack gap="space-8">
                        <BodyShort weight="semibold">Innvilget grad i hele prosent</BodyShort>

                        <TextField
                            htmlSize={10}
                            label={field.value}
                            size="small"
                            type="text"
                            inputMode="numeric"
                            id="innvilget-grad"
                            value={innvigletGrad.value ?? ''}
                            onChange={oppdaterProsent(innvigletGrad.onChange)}
                            onBlur={innvigletGrad.onBlur}
                            error={innvigletGradState.error?.message}
                        />
                    </VStack>

                    <Fieldset legend="Prosentvis fordeling mellom ytelser og arbeid" size="medium">
                        <HStack gap="space-20">
                            <TextField
                                label="Sykepenger"
                                size="small"
                                type="text"
                                inputMode="numeric"
                                id="sykepenger"
                                value={sykepengerGradField.value ?? ''}
                                onChange={oppdaterProsent(sykepengerGradField.onChange)}
                                onBlur={sykepengerGradField.onBlur}
                            />
                            <TextField
                                label={field.value}
                                size="small"
                                type="text"
                                inputMode="numeric"
                                id="annen-ytelse-fordeling"
                                value={gradAndreYtelserField.value ?? ''}
                                onChange={oppdaterProsent(gradAndreYtelserField.onChange)}
                                onBlur={gradAndreYtelserField.onBlur}
                            />
                            <TextField
                                label="Arbeid"
                                size="small"
                                type="text"
                                inputMode="numeric"
                                id="arbeid"
                                readOnly
                                value={arbeidsgrad}
                            />
                        </HStack>
                        {feilmeldinger.map((feil) => (
                            <ErrorMessage key={feil} showIcon size="small">
                                {feil}
                            </ErrorMessage>
                        ))}
                    </Fieldset>
                </>
            )}
        </StackWrapper>
    );
}
