import styled from '@emotion/styled';
import React, { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { Button, ErrorSummary, ErrorSummaryItem, Textarea } from '@navikt/ds-react';

import { UtbetalingstabellDag } from './Utbetalingstabell.types';

const Container = styled.div`
    margin: 0 2rem 2rem;
`;

const FeiloppsummeringContainer = styled.div`
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
    const { handleSubmit, register, formState } = useFormContext();

    const [oppsummering, setOppsummering] = useState('');
    const oppsummeringRef = useRef<HTMLDivElement>(null);

    const begrunnelseValidation = register('begrunnelse', { required: 'Begrunnelse må fylles ut', minLength: 1 });

    const harFeil = !formState?.isValid;

    useEffect(() => {
        harFeil && oppsummeringRef.current?.focus();
    }, [harFeil]);

    return (
        <Container>
            <BegrunnelseInput
                id="begrunnelse"
                label="Begrunnelse"
                value={oppsummering}
                description={
                    <span>
                        Begrunn hvorfor det er gjort endringer i sykdomstidslinjen. <br />
                        Kommer ikke i vedtaksbrevet, men vil bli forevist bruker ved spørsmål om innsyn.
                    </span>
                }
                error={formState.errors.begrunnelse?.message}
                aria-invalid={formState.errors.begrunnelse?.message}
                aria-errormessage={formState.errors.begrunnelse?.message}
                data-testid="overstyring-begrunnelse"
                maxLength={500}
                {...begrunnelseValidation}
                onChange={(event) => {
                    begrunnelseValidation.onChange(event);
                    setOppsummering(event.target.value);
                }}
            />
            {formState.isSubmitted && harFeil && (
                <FeiloppsummeringContainer>
                    <ErrorSummary ref={oppsummeringRef} heading="Skjemaet inneholder følgende feil:">
                        {Object.entries(formState.errors).map(([id, error]) => (
                            <ErrorSummaryItem onClick={() => document.getElementById(id)?.focus()} key={id}>
                                {error.message}
                            </ErrorSummaryItem>
                        ))}
                    </ErrorSummary>
                </FeiloppsummeringContainer>
            )}
            <Buttons>
                <Button
                    onClick={handleSubmit(onSubmit)}
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
