import React, { useEffect, useRef } from 'react';
import { Sykdomsdag } from '../../context/types.internal';
import { Normaltekst } from 'nav-frontend-typografi';
import Checkbox from 'nav-frontend-skjema/lib/checkbox';
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
    const { register, errors, trigger, formState } = useFormContext();

    const oppsummeringRef = useRef<HTMLDivElement>(null);

    const harFeil = !formState.isValid;

    useEffect(() => {
        harFeil && oppsummeringRef.current?.focus();
    }, [harFeil]);

    return (
        <Overstyringsskjemagruppe>
            <BeskrivelseLabel>
                <Normaltekst>Begrunnelse</Normaltekst>
                <TextareaControlled
                    name="begrunnelse"
                    id="begrunnelse"
                    textareaRef={register({ required: 'Begrunnelse må fylles ut', minLength: 1 })}
                    defaultValue=""
                    placeholder="Begrunn hvorfor det er gjort endringer i sykdomstidslinjen. Kommer ikke i vedtaksbrevet, men vil bli forevist bruker ved spørsmål om innsyn."
                    feil={errors.begrunnelse?.message}
                    aria-invalid={errors.begrunnelse?.message}
                    aria-errormessage={errors.begrunnelse?.message}
                />
            </BeskrivelseLabel>
            <Checkbox name="unntaFraInnsyn" ref={register} label="Unnta fra innsyn grunnet sensitive opplysninger" />
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
                <Knapp mini>Ferdig</Knapp>
                <Flatknapp mini onClick={avbrytOverstyring}>
                    Avbryt
                </Flatknapp>
            </Knappegruppe>
        </Overstyringsskjemagruppe>
    );
};
