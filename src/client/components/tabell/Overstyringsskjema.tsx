import React, { useContext, useState } from 'react';
import { Dagtype, Sykdomsdag } from '../../context/types.internal';
import { Normaltekst } from 'nav-frontend-typografi';
import Textarea from 'nav-frontend-skjema/lib/textarea';
import Checkbox from 'nav-frontend-skjema/lib/checkbox';
import Knapp from 'nav-frontend-knapper/lib/knapp';
import Flatknapp from 'nav-frontend-knapper/lib/flatknapp';
import styled from '@emotion/styled';
import SkjemaGruppe from 'nav-frontend-skjema/lib/skjema-gruppe';
import { postOverstyring } from '../../io/http';
import { PersonContext } from '../../context/PersonContext';
import { SpleisSykdomsdagtype } from '../../context/mapping/types.external';

const Overstyringsskjemagruppe = styled(SkjemaGruppe)`
    color: #3e3832;
    margin: 2.5rem 0 0;
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

const tilOverstyrteDager = (dager: Sykdomsdag[]) => {
    return dager.map((dag) => {
        return {
            dato: dag.dato.format('YYYY-MM-DD'),
            type: dag.type,
            grad: dag.gradering,
        };
    });
};

export const Overstyringsskjema = ({ overstyrteDager, avbrytOverstyring }: OverstyringsskjemaProps) => {
    const { aktivVedtaksperiode, personTilBehandling } = useContext(PersonContext);
    const [begrunnelse, setBegrunnelse] = useState('');
    const [unntaFraInnsyn, setUnntaFraInnsyn] = useState(false);
    const [begrunnelseFeil, setBegrunnelseFeil] = useState<string | undefined>(undefined);

    const sendOverstyring = (event: React.MouseEvent) => {
        event.preventDefault();
        if (begrunnelse.length === 0) {
            setBegrunnelseFeil('Begrunnelse mangler');
        } else {
            const orgnr = personTilBehandling!.arbeidsgivere.find((arbeidsgiver) =>
                arbeidsgiver.vedtaksperioder.find((vedtaksperiode) => vedtaksperiode.id === aktivVedtaksperiode!.id)
            )!.organisasjonsnummer;
            postOverstyring({
                aktørId: personTilBehandling!.aktørId,
                fødselsnummer: personTilBehandling!.fødselsnummer,
                organisasjonsnummer: orgnr,
                dager: tilOverstyrteDager(overstyrteDager),
                begrunnelse,
                unntaFraInnsyn,
            });
        }
    };

    return (
        <Overstyringsskjemagruppe>
            <BeskrivelseLabel>
                <Normaltekst>Begrunnelse</Normaltekst>
                <Textarea
                    value={begrunnelse}
                    onChange={({ target }) => {
                        if (begrunnelseFeil) {
                            setBegrunnelseFeil(undefined);
                        }
                        setBegrunnelse(target.value);
                    }}
                    placeholder="Begrunn hvorfor det er gjort endringer i sykdomstidslinjen. Kommer ikke i vedtaksbrevet, men vil bli forevist bruker ved spørsmål om innsyn."
                    required
                    minLength={1}
                    feil={begrunnelseFeil}
                />
            </BeskrivelseLabel>
            <Checkbox
                label="Unnta fra innsyn grunnet sensitive opplysninger"
                checked={unntaFraInnsyn}
                onChange={({ target }) => setUnntaFraInnsyn(target.checked)}
            />
            <Knappegruppe>
                <Knapp mini onClick={sendOverstyring}>
                    Ferdig
                </Knapp>
                <Flatknapp htmlType="button" mini onClick={avbrytOverstyring}>
                    Avbryt
                </Flatknapp>
            </Knappegruppe>
        </Overstyringsskjemagruppe>
    );
};
