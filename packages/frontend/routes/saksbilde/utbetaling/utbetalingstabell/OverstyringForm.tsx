import styled from '@emotion/styled';
import React, { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { Button, ErrorSummary, Textarea } from '@navikt/ds-react';

import {
    andreYtelserValidering,
    arbeidsdagValidering,
    ferieUtenSykmeldingValidering,
    sykNavValidering,
} from './validering';

const Container = styled.div`
    margin: 0 2rem;
`;

const FeiloppsummeringContainer = styled(ErrorSummary)`
    margin: 48px 0;
`;

const BegrunnelseInput = styled(Textarea)`
    margin-bottom: 2rem;
    max-width: 640px;
    min-height: 100px;
`;

const Buttons = styled.span`
    > button:not(:last-of-type) {
        margin-right: 1rem;
    }
`;

interface OverstyringFormProps {
    overstyrteDager: Map<string, UtbetalingstabellDag>;
    hale: DateString;
    snute: DateString;
    toggleOverstyring: () => void;
    onSubmit: () => void;
}

export const OverstyringForm: React.FC<OverstyringFormProps> = ({
    overstyrteDager,
    hale,
    snute,
    toggleOverstyring,
    onSubmit,
}) => {
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
            'kanIkkeOverstyreTilFerieUtenSykmelding',
            'kanIkkeOverstyreTilAnnenYtelse',
            'kanIkkeOverstyreTilSykNav',
        ]);
        if (
            arbeidsdagValidering(overstyrteDager, hale, setCustomError) &&
            ferieUtenSykmeldingValidering(overstyrteDager, setCustomError) &&
            andreYtelserValidering(overstyrteDager, hale, snute, setCustomError) &&
            sykNavValidering(overstyrteDager, setCustomError)
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
        <Container>
            <BegrunnelseInput
                id="begrunnelse"
                label="Begrunnelse for endringer"
                value={oppsummering}
                description={
                    <span>
                        Begrunn hvorfor det er gjort endringer i sykdomstidslinjen. <br />
                        Blir ikke forevist den sykmeldte, med mindre den sykmeldte ber om innsyn.
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
            />
            {visFeilOppsummering && (
                <FeiloppsummeringContainer ref={oppsummeringRef} heading="Skjemaet inneholder følgende feil:">
                    {Object.entries(formState.errors).map(([id, error], index) => {
                        return <ErrorSummary.Item key={`${id}${index}`}>{error?.message as string}</ErrorSummary.Item>;
                    })}
                </FeiloppsummeringContainer>
            )}
            <Buttons>
                <Button
                    onClick={validering}
                    type="button"
                    disabled={overstyrteDager.size < 1}
                    size="small"
                    data-testid="oppdater"
                    variant="secondary"
                >
                    Ferdig ({overstyrteDager.size})
                </Button>
                <Button type="button" variant="tertiary" size="small" onClick={toggleOverstyring}>
                    Avbryt
                </Button>
            </Buttons>
        </Container>
    );
};
