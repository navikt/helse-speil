import React, { useState } from 'react';
import { Sykdomsdag } from '../../context/types.internal';
import Normaltekst from 'nav-frontend-typografi/lib/normaltekst';
import Textarea from 'nav-frontend-skjema/lib/textarea';
import Checkbox from 'nav-frontend-skjema/lib/checkbox';
import Knapp from 'nav-frontend-knapper/lib/knapp';
import Flatknapp from 'nav-frontend-knapper/lib/flatknapp';
import styled from '@emotion/styled';
import SkjemaGruppe from 'nav-frontend-skjema/lib/skjema-gruppe';

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

export const Overstyringsskjema = ({ overstyrteDager, avbrytOverstyring }: OverstyringsskjemaProps) => {
    const [overstyringsbeskrivelse, setOverstyringsbeskrivelse] = useState('');
    const [unntaFraInnsyn, setUnntaFraInnsyn] = useState(false);

    const sendOverstyring = () => {};

    return (
        <Overstyringsskjemagruppe>
            <BeskrivelseLabel>
                <Normaltekst>Beskrivelse</Normaltekst>
                <Textarea
                    value={overstyringsbeskrivelse}
                    onChange={({ target }) => setOverstyringsbeskrivelse(target.value)}
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
                <Flatknapp mini onClick={avbrytOverstyring}>
                    Avbryt
                </Flatknapp>
            </Knappegruppe>
        </Overstyringsskjemagruppe>
    );
};
