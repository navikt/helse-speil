import React, { ReactNode, useState } from 'react';

import {
    BodyShort,
    Button,
    ButtonProps,
    Heading,
    Link,
    LocalAlert,
    ReadMore,
    TextField,
    Textarea,
    VStack,
} from '@navikt/ds-react';

import { getSpleisVedtaksperiodeQueryKey } from '@io/rest/spleis';
import { SPOUT_MINSTE_LENGDE_BEGRUNNELSE, SpoutMeldingResponse, usePostSpoutMelding } from '@io/rest/spout';
import { JsonVisning } from '@saksbilde/utvikler/JsonVisning';
import { useQueryClient } from '@tanstack/react-query';

interface SpoutHandlingProps {
    tittel: string;
    beskrivelse: ReactNode;
    knappetekst: string;
    knappevariant?: ButtonProps['variant'];
    kvitteringstittel: string;
    feiltittel: string;
    melding: Record<string, unknown>;
    vedtaksperiodeId: string;
    fødselsnummer: string;
    children?: ReactNode;
}

export const SpoutHandling = ({
    tittel,
    beskrivelse,
    knappetekst,
    knappevariant = 'secondary',
    kvitteringstittel,
    feiltittel,
    melding,
    vedtaksperiodeId,
    fødselsnummer,
    children,
}: SpoutHandlingProps) => {
    const [begrunnelse, setBegrunnelse] = useState('');
    const [slacklenke, setSlacklenke] = useState('');
    const [visValideringsfeil, setVisValideringsfeil] = useState(false);
    const queryClient = useQueryClient();
    const { mutate, isPending, error, data, reset } = usePostSpoutMelding();

    const begrunnelseErForKort = begrunnelse.trim().length < SPOUT_MINSTE_LENGDE_BEGRUNNELSE;

    const send = (event: React.FormEvent) => {
        event.preventDefault();
        if (begrunnelseErForKort) {
            setVisValideringsfeil(true);
            return;
        }
        mutate(
            { melding, begrunnelse: begrunnelse.trim(), slacklenke: slacklenke.trim() || undefined },
            {
                onSuccess: () => {
                    setBegrunnelse('');
                    setSlacklenke('');
                    setVisValideringsfeil(false);
                    void queryClient.invalidateQueries({
                        queryKey: getSpleisVedtaksperiodeQueryKey(vedtaksperiodeId, fødselsnummer),
                    });
                },
            },
        );
    };

    return (
        <VStack as="form" gap="space-12" maxWidth="40rem" onSubmit={send}>
            <Heading level="2" size="small">
                {tittel}
            </Heading>
            <BodyShort size="small">{beskrivelse}</BodyShort>
            {children}
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
                <JsonVisning data={melding} />
            </ReadMore>
            <div>
                <Button type="submit" size="small" variant={knappevariant} loading={isPending}>
                    {knappetekst}
                </Button>
            </div>
            {error && (
                <LocalAlert status="error" size="small">
                    <LocalAlert.Header>
                        <LocalAlert.Title>{feiltittel}</LocalAlert.Title>
                    </LocalAlert.Header>
                    <LocalAlert.Content>{error.message}</LocalAlert.Content>
                </LocalAlert>
            )}
            {data && <Kvittering tittel={kvitteringstittel} response={data} />}
        </VStack>
    );
};

const Kvittering = ({ tittel, response }: { tittel: string; response: SpoutMeldingResponse }) => (
    <LocalAlert status="success" size="small">
        <LocalAlert.Header>
            <LocalAlert.Title>{tittel}</LocalAlert.Title>
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
