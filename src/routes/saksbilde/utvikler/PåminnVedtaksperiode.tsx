import React, { useState } from 'react';

import { BodyShort, Button, Heading, Link, LocalAlert, ReadMore, TextField, Textarea, VStack } from '@navikt/ds-react';

import { SpleisVedtaksperiode, getSpleisVedtaksperiodeQueryKey } from '@io/rest/spleis';
import { SPOUT_MINSTE_LENGDE_BEGRUNNELSE, SpoutMeldingResponse, usePostSpoutMelding } from '@io/rest/spout';
import { JsonVisning } from '@saksbilde/utvikler/JsonVisning';
import { useQueryClient } from '@tanstack/react-query';

interface PåminnVedtaksperiodeProps {
    vedtaksperiode: SpleisVedtaksperiode;
    fødselsnummer: string;
}

// {{now}} og {{now+1h}} er Spout-templates som erstattes med tidspunktet Spout sender meldingen
const lagPåminnelse = (vedtaksperiode: SpleisVedtaksperiode, fødselsnummer: string) => ({
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
    flagg: [],
});

export const PåminnVedtaksperiode = ({ vedtaksperiode, fødselsnummer }: PåminnVedtaksperiodeProps) => {
    const [begrunnelse, setBegrunnelse] = useState('');
    const [slacklenke, setSlacklenke] = useState('');
    const [visValideringsfeil, setVisValideringsfeil] = useState(false);
    const queryClient = useQueryClient();
    const { mutate, isPending, error, data, reset } = usePostSpoutMelding();

    const påminnelse = lagPåminnelse(vedtaksperiode, fødselsnummer);
    const begrunnelseErForKort = begrunnelse.trim().length < SPOUT_MINSTE_LENGDE_BEGRUNNELSE;

    const påminn = (event: React.FormEvent) => {
        event.preventDefault();
        if (begrunnelseErForKort) {
            setVisValideringsfeil(true);
            return;
        }
        mutate(
            { melding: påminnelse, begrunnelse: begrunnelse.trim(), slacklenke: slacklenke.trim() || undefined },
            {
                onSuccess: () => {
                    setBegrunnelse('');
                    setSlacklenke('');
                    setVisValideringsfeil(false);
                    void queryClient.invalidateQueries({
                        queryKey: getSpleisVedtaksperiodeQueryKey(vedtaksperiode.id, fødselsnummer),
                    });
                },
            },
        );
    };

    return (
        <VStack as="form" gap="space-12" maxWidth="40rem" onSubmit={påminn}>
            <Heading level="2" size="small">
                Påminn vedtaksperiode
            </Heading>
            <BodyShort size="small">
                Sender en påminnelse for vedtaksperioden i tilstand {vedtaksperiode.tilstand} via Spout. Meldingen
                markeres med deg som avsender og auditlogges med begrunnelsen.
            </BodyShort>
            <Textarea
                label="Begrunnelse"
                description={`Minst ${SPOUT_MINSTE_LENGDE_BEGRUNNELSE} tegn`}
                size="small"
                value={begrunnelse}
                onChange={(event) => {
                    setBegrunnelse(event.target.value);
                    reset();
                }}
                error={
                    visValideringsfeil && begrunnelseErForKort
                        ? `Begrunnelsen må være minst ${SPOUT_MINSTE_LENGDE_BEGRUNNELSE} tegn`
                        : undefined
                }
            />
            <TextField
                label="Slack-lenke"
                size="small"
                value={slacklenke}
                onChange={(event) => setSlacklenke(event.target.value)}
            />
            <ReadMore header="Vis meldingen som sendes" size="small">
                <JsonVisning data={påminnelse} />
            </ReadMore>
            <div>
                <Button type="submit" size="small" variant="secondary" loading={isPending}>
                    Påminn vedtaksperiode
                </Button>
            </div>
            {error && (
                <LocalAlert status="error" size="small">
                    <LocalAlert.Header>
                        <LocalAlert.Title>Kunne ikke sende påminnelse</LocalAlert.Title>
                    </LocalAlert.Header>
                    <LocalAlert.Content>{error.message}</LocalAlert.Content>
                </LocalAlert>
            )}
            {data && <Kvittering response={data} />}
        </VStack>
    );
};

const Kvittering = ({ response }: { response: SpoutMeldingResponse }) => (
    <LocalAlert status="success" size="small">
        <LocalAlert.Header>
            <LocalAlert.Title>Påminnelse sendt</LocalAlert.Title>
        </LocalAlert.Header>
        <LocalAlert.Content>
            <VStack gap="space-4">
                {response.meldinger.map((melding) =>
                    'feil' in melding ? (
                        <BodyShort key={melding.feil} size="small">
                            Feil: {melding.feil}
                        </BodyShort>
                    ) : (
                        <BodyShort key={melding.id} size="small">
                            Melding-id: {melding.id}
                        </BodyShort>
                    ),
                )}
                {response.lenker?.kibana && (
                    <Link href={response.lenker.kibana} target="_blank" rel="noreferrer">
                        Se meldingen i Kibana
                    </Link>
                )}
                {response.lenker?.consoleCloudGoogle && (
                    <Link href={response.lenker.consoleCloudGoogle} target="_blank" rel="noreferrer">
                        Se meldingen i Google Cloud Console
                    </Link>
                )}
                {response.lenker?.trace && (
                    <Link href={response.lenker.trace} target="_blank" rel="noreferrer">
                        Se tracen i Google Cloud Console
                    </Link>
                )}
            </VStack>
        </LocalAlert.Content>
    </LocalAlert>
);
