import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { Button, ErrorSummary, Textarea } from '@navikt/ds-react';

import { Utbetalingstabelldag } from '@typer/utbetalingstabell';

import {
    andreYtelserValidering,
    arbeidIkkeGjenopptattValidering,
    arbeidsdagValidering,
    egenmeldingValidering,
    sykNavValidering,
} from './validering';

import styles from './OverstyringForm.module.css';

interface OverstyringFormProps {
    overstyrteDager: Map<string, Utbetalingstabelldag>;
    alleDager: Map<string, Utbetalingstabelldag>;
    toggleOverstyring: () => void;
    onSubmit: () => void;
}

export const OverstyringForm = ({
    overstyrteDager,
    alleDager,
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
        <div className={styles.container}>
            <Textarea
                id="begrunnelse"
                label="Begrunnelse for endringer"
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
                    begrunnelseValidation.onChange(event);
                    setOppsummering(event.target.value);
                }}
                className={styles.begrunnelse}
            />
            {visFeilOppsummering && (
                <ErrorSummary
                    className={styles.feiloppsummering}
                    ref={oppsummeringRef}
                    heading="Skjemaet inneholder følgende feil:"
                >
                    {Object.entries(formState.errors).map(([id, error], index) => {
                        return <ErrorSummary.Item key={`${id}${index}`}>{error?.message as string}</ErrorSummary.Item>;
                    })}
                </ErrorSummary>
            )}
            <span className={styles.buttons}>
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
            </span>
        </div>
    );
};
