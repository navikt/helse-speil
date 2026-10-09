import React from 'react';

import { SpleisVedtaksperiode } from '@io/rest/spleis';
import { SpoutHandling } from '@saksbilde/utvikler/SpoutHandling';

interface ForkastVedtaksperiodeProps {
    vedtaksperiode: SpleisVedtaksperiode;
    fødselsnummer: string;
}

const lagAnmodningOmForkasting = (vedtaksperiode: SpleisVedtaksperiode, fødselsnummer: string) => ({
    '@event_name': 'anmodning_om_forkasting',
    yrkesaktivitetstype: vedtaksperiode.yrkesaktivitetstype,
    fødselsnummer,
    organisasjonsnummer: vedtaksperiode.organisasjonsnummer,
    vedtaksperiodeId: vedtaksperiode.id,
    årsaker: ['Forkastet manuelt av utvikler'],
});

export const ForkastVedtaksperiode = ({ vedtaksperiode, fødselsnummer }: ForkastVedtaksperiodeProps) => (
    <SpoutHandling
        tittel="Forkast vedtaksperiode"
        beskrivelse={`Sender en anmodning om forkasting for vedtaksperioden i tilstand ${vedtaksperiode.tilstand} via Spout. Meldingen markeres med deg som avsender og auditlogges med begrunnelsen.`}
        knappetekst="Forkast vedtaksperiode"
        knappevariant="danger"
        kvitteringstittel="Anmodning om forkasting sendt"
        feiltittel="Kunne ikke sende anmodning om forkasting"
        melding={lagAnmodningOmForkasting(vedtaksperiode, fødselsnummer)}
        vedtaksperiodeId={vedtaksperiode.id}
        fødselsnummer={fødselsnummer}
    />
);
