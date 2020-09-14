import React, { useEffect, useRef } from 'react';
import { Sykdomsdag } from 'internal-types';
import { Normaltekst } from 'nav-frontend-typografi';
import Knapp from 'nav-frontend-knapper/lib/knapp';
import Flatknapp from 'nav-frontend-knapper/lib/flatknapp';
import styled from '@emotion/styled';
import SkjemaGruppe from 'nav-frontend-skjema/lib/skjema-gruppe';
import { useFormContext } from 'react-hook-form';
import { Feiloppsummering, TextareaControlled } from 'nav-frontend-skjema';

const Overstyringsskjemagruppe = styled(SkjemaGruppe)`
    color: #3e3832;
    margin: 2.5rem 0 0;
`;

const FeiloppsummeringContainer = styled.div`
    margin: 48px 0;
`;

const BeskrivelseLabel = styled.label`
    max-width: 500px;
    > *:not(:last-child) {
        margin-bottom: 1rem;
    }

    > *:last-child {
        margin-bottom: 2.5rem;
    }

    > .skjemaelement,
    textarea {
        min-height: 120px;
        width: 500px;
    }
`;

const Knappegruppe = styled.span`
    > button:not(:last-of-type) {
        margin-right: 1rem;
    }
`;

interface OverstyringsskjemaProps {
    overstyrteDager: Sykdomsdag[];
    avbrytOverstyring: () => void;
}

export const Overstyringsskjema = ({ avbrytOverstyring }: OverstyringsskjemaProps) => {
    const { register, errors, formState } = useFormContext();

    const oppsummeringRef = useRef<HTMLDivElement>(null);

    const harFeil = !formState.isValid;

    useEffect(() => {
        harFeil && oppsummeringRef.current?.focus();
    }, [harFeil]);

    return (
        <Overstyringsskjemagruppe>
            <BeskrivelseLabel>
                <Normaltekst>Kort begrunnelse</Normaltekst>
                <TextareaControlled
                    name="begrunnelse"
                    id="begrunnelse"
                    // @ts-ignore
                    textareaRef={register({ required: 'Begrunnelse må fylles ut', minLength: 1 })}
                    defaultValue=""
                    placeholder="Begrunn kort hvorfor det er gjort endringer på dager i sykdomstidslinjen. Bruk tydelig språk, denne vil bli vist for den sykmeldte og arbeidsgiver.
"
                    feil={errors.begrunnelse?.message}
                    aria-invalid={errors.begrunnelse?.message}
                    aria-errormessage={errors.begrunnelse?.message}
                    maxLength={500}
                />
            </BeskrivelseLabel>
            {formState.isSubmitted && harFeil && (
                <FeiloppsummeringContainer>
                    <Feiloppsummering
                        innerRef={oppsummeringRef}
                        tittel="Skjemaet inneholder følgende feil:"
                        feil={Object.entries(errors).map(([id, error]) => ({
                            skjemaelementId: id,
                            feilmelding: error.message,
                        }))}
                    ></Feiloppsummering>
                </FeiloppsummeringContainer>
            )}
            <Knappegruppe>
                <Knapp mini>Oppdater</Knapp>
                <Flatknapp mini onClick={avbrytOverstyring}>
                    Avbryt
                </Flatknapp>
            </Knappegruppe>
        </Overstyringsskjemagruppe>
    );
};
