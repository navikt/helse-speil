import styled from '@emotion/styled';
import React, { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { Button, ErrorSummary, Textarea } from '@navikt/ds-react';

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
    toggleOverstyring: () => void;
    onSubmit: () => void;
}

export const OverstyringForm: React.FC<OverstyringFormProps> = ({ overstyrteDager, toggleOverstyring, onSubmit }) => {
    const { handleSubmit, register, formState, setError, clearErrors } = useFormContext();
    const [oppsummering, setOppsummering] = useState('');
    const oppsummeringRef = useRef<HTMLDivElement>(null);

    const begrunnelseValidation = register('begrunnelse', { required: 'Begrunnelse må fylles ut', minLength: 1 });

    const arbeidsdagValidering = () => {
        clearErrors(['arbeidsdagerKanIkkeOverstyres']);

        const overstyrtTilArbeidsdager = Array.from(overstyrteDager.values()).filter((dag) => dag.type === 'Arbeid');

        if (overstyrtTilArbeidsdager.length === 0) {
            handleSubmit(onSubmit)();
            return;
        }

        let dagerSomKanOverstyresTilArbeidsdag: UtbetalingstabellDag[] = overstyrtTilArbeidsdager.filter(
            (dag) => dag.erAGP || dag.erNyDag || !['Syk', 'SykHelg', 'Ferie'].includes(dag?.fraType ?? ''),
        );

        if (dagerSomKanOverstyresTilArbeidsdag.length !== overstyrtTilArbeidsdager.length) {
            setError('arbeidsdagerKanIkkeOverstyres', {
                type: 'custom',
                message: `Du kan ikke overstyre Syk eller Ferie til Arbeidsdag. Arbeidsdag kan legges til som en ny dag eller endres i arbeidsgiverperioden`,
            });
            return;
        }
        handleSubmit(onSubmit)();
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
                    onClick={arbeidsdagValidering}
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
