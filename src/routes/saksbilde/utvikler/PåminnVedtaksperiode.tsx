import React, { useState } from 'react';

import { Checkbox } from '@navikt/ds-react';

import { SpleisVedtaksperiode } from '@io/rest/spleis';
import { SpoutHandling } from '@saksbilde/utvikler/SpoutHandling';

interface PåminnVedtaksperiodeProps {
    vedtaksperiode: SpleisVedtaksperiode;
    fødselsnummer: string;
}

// {{now}} og {{now+1h}} er Spout-templates som erstattes med tidspunktet Spout sender meldingen
const lagPåminnelse = (vedtaksperiode: SpleisVedtaksperiode, fødselsnummer: string, ønskerReberegning: boolean) => ({
    '@event_name': 'påminnelse',
    fødselsnummer,
    organisasjonsnummer: vedtaksperiode.organisasjonsnummer,
    yrkesaktivitetstype: vedtaksperiode.yrkesaktivitetstype,
    vedtaksperiodeId: vedtaksperiode.id,
    tilstand: vedtaksperiode.tilstand,
    påminnelsestidspunkt: '{{now}}',
    nestePåminnelsestidspunkt: '{{now+1h}}',
    tilstandsendringstidspunkt: vedtaksperiode.oppdatert,
    antallGangerPåminnet: 1,
    flagg: ønskerReberegning ? ['ønskerReberegning'] : [],
});

export const PåminnVedtaksperiode = ({ vedtaksperiode, fødselsnummer }: PåminnVedtaksperiodeProps) => {
    const [ønskerReberegning, setØnskerReberegning] = useState(false);

    return (
        <SpoutHandling
            tittel="Påminn vedtaksperiode"
            beskrivelse={`Sender en påminnelse for vedtaksperioden i tilstand ${vedtaksperiode.tilstand} via Spout. Meldingen markeres med deg som avsender og auditlogges med begrunnelsen.`}
            knappetekst="Påminn vedtaksperiode"
            kvitteringstittel="Påminnelse sendt"
            feiltittel="Kunne ikke sende påminnelse"
            melding={lagPåminnelse(vedtaksperiode, fødselsnummer, ønskerReberegning)}
            vedtaksperiodeId={vedtaksperiode.id}
            fødselsnummer={fødselsnummer}
        >
            <Checkbox
                size="small"
                checked={ønskerReberegning}
                onChange={(event) => setØnskerReberegning(event.target.checked)}
                description="Setter flagget ønskerReberegning på påminnelsen"
            >
                Ønsker reberegning
            </Checkbox>
        </SpoutHandling>
    );
};
