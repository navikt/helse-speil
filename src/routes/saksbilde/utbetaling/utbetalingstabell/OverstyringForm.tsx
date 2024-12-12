import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { Button, ErrorMessage, ErrorSummary, HStack, Textarea, VStack } from '@navikt/ds-react';

import { Utbetalingstabelldag } from '@typer/utbetalingstabell';

import {
    andreYtelserValidering,
    arbeidIkkeGjenopptattValidering,
    arbeidsdagValidering,
    egenmeldingValidering,
    sykNavValidering,
} from './validering';

interface OverstyringFormProps {
    overstyrteDager: Map<string, Utbetalingstabelldag>;
    alleDager: Map<string, Utbetalingstabelldag>;
    error?: string;
    toggleOverstyring: () => void;
    onSubmit: () => void;
}

export const OverstyringForm = ({
    overstyrteDager,
    alleDager,
    error,
    toggleOverstyring,
    onSubmit,
}: OverstyringFormProps): ReactElement => {
    const { handleSubmit, register, formState, setError, clearErrors } = useFormContext();
    const [oppsummering, setOppsummering] = useState('');
    const oppsummeringRef = useRef<HTMLDivElement>(null);

    const begrunnelseValidation = register('begrunnelse', { required: 'Begrunnelse må fylles ut', minLength: 1 });

    const setCustomError = (name: string, message: string) => {
        setError(name, {
            type: 'custom',
            message: message,
        });
    };

    const validering = () => {
        clearErrors([
            'arbeidsdagerKanIkkeOverstyres',
            'kanIkkeOverstyreTilArbeidIkkeGjenopptatt',
            'kanIkkeOverstyreTilAnnenYtelse',
            'kanIkkeOverstyreTilSykNav',
            'kanIkkeOverstyreTilEgenmelding',
        ]);
        if (
            arbeidsdagValidering(overstyrteDager, alleDager, setCustomError) &&
            arbeidIkkeGjenopptattValidering(overstyrteDager, setCustomError) &&
            andreYtelserValidering(overstyrteDager, alleDager, setCustomError) &&
            sykNavValidering(overstyrteDager, setCustomError) &&
            egenmeldingValidering(overstyrteDager, setCustomError)
        ) {
            handleSubmit(onSubmit)();
        }
    };

    const harFeil = !formState?.isValid;

    useEffect(() => {
        harFeil && oppsummeringRef.current?.focus();
    }, [harFeil]);

    const visFeilOppsummering = !formState.isValid && Object.entries(formState.errors).length > 0;

    return (
        <VStack marginInline="8" width="640px" gap="8">
            <Textarea
                id="begrunnelse"
                label="Notat til beslutter"
                value={oppsummering}
                description={
                    <span>
                        Begrunn hvorfor det er gjort endringer i sykdomstidslinjen. <br />
                        Teksten vises ikke til den sykmeldte, med mindre hen ber om innsyn.
                    </span>
                }
                error={formState.errors.begrunnelse ? (formState.errors.begrunnelse.message as string) : null}
                data-testid="overstyring-begrunnelse"
                maxLength={1000}
                {...begrunnelseValidation}
                onChange={(event) => {
                    void begrunnelseValidation.onChange(event);
                    setOppsummering(event.target.value);
                }}
                rows={6}
            />
            {visFeilOppsummering && (
                <ErrorSummary ref={oppsummeringRef} heading="Skjemaet inneholder følgende feil:">
                    {Object.entries(formState.errors).map(([id, error], index) => {
                        return <ErrorSummary.Item key={`${id}${index}`}>{error?.message as string}</ErrorSummary.Item>;
                    })}
                </ErrorSummary>
            )}
            <HStack gap="2" marginBlock="0 2">
                <Button
                    size="small"
                    variant="secondary"
                    type="button"
                    data-testid="oppdater"
                    onClick={validering}
                    disabled={overstyrteDager.size < 1}
                >
                    Ferdig ({overstyrteDager.size})
                </Button>
                <Button size="small" variant="tertiary" type="button" onClick={toggleOverstyring}>
                    Avbryt
                </Button>
            </HStack>
            {error && <ErrorMessage size="small">{error}</ErrorMessage>}
        </VStack>
    );
};
