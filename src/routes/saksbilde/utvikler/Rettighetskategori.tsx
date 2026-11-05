import { FormEvent, useState } from 'react';

import { BodyShort, Checkbox, Loader, LocalAlert, Textarea, VStack } from '@navikt/ds-react';

import { erUtvikling } from '@/env';
import { ButtonKreverSkrivetilgang } from '@components/skrivetilgang/ButtonKreverSkrivetilgang';
import { useHarSkrivetilgang } from '@hooks/brukerrolleHooks';
import {
    Rettighetskategori as Avgjørelse,
    usePostManuellVurdering,
    useRettighetskategoriQuery,
} from '@io/rest/rettighetskategori';
import { JsonVisning } from '@saksbilde/utvikler/JsonVisning';

interface RettighetskategoriProps {
    personPseudoId: string;
    rettighetskategoriId?: string;
}

export function Rettighetskategori({ personPseudoId, rettighetskategoriId }: RettighetskategoriProps) {
    const { data, isPending, error } = useRettighetskategoriQuery(personPseudoId, rettighetskategoriId);

    return (
        <>
            {!rettighetskategoriId ? (
                <BodyShort>Vedtaksperioden har ikke vilkårsgrunnlag med rettighetskategori</BodyShort>
            ) : isPending ? (
                <Loader size="small" title="Henter rettighetskategori" />
            ) : error ? (
                <BodyShort>Kunne ikke hente rettighetskategori: {error.message}</BodyShort>
            ) : (
                <VStack gap="space-16">
                    {erUtvikling && (
                        <ManuellVurdering
                            key={`${personPseudoId}/${data.id}`}
                            personPseudoId={personPseudoId}
                            avgjørelse={data}
                        />
                    )}
                    <JsonVisning data={data} />
                </VStack>
            )}
        </>
    );
}

function ManuellVurdering({ personPseudoId, avgjørelse }: { personPseudoId: string; avgjørelse: Avgjørelse }) {
    const [jordbruker, setJordbruker] = useState(avgjørelse.tilleggskategorier.includes('JORDBRUKER'));
    const [begrunnelse, setBegrunnelse] = useState('');
    const harSkrivetilgang = useHarSkrivetilgang();
    const { mutate, isPending, data, error } = usePostManuellVurdering(personPseudoId, avgjørelse.id);
    const kanVurdere =
        avgjørelse.hovedkategori === 'SELVSTENDIG_NAERINGSDRIVENDE' ||
        avgjørelse.hovedkategori === 'ARBEIDSTAKER_OG_SELVSTENDIG_NAERINGSDRIVENDE';
    const avgjørelsenErUtdatert = error?.status === 409;

    function lagre(event: FormEvent) {
        event.preventDefault();
        if (!harSkrivetilgang || !kanVurdere || isPending || data || avgjørelsenErUtdatert) return;
        mutate({ tilleggskategorier: jordbruker ? ['JORDBRUKER'] : [], begrunnelse: begrunnelse.trim() || null });
    }

    return (
        <VStack as="form" gap="space-12" maxWidth="40rem" onSubmit={lagre}>
            <Checkbox
                size="small"
                checked={jordbruker}
                disabled={!kanVurdere || isPending || !!data}
                onChange={(event) => setJordbruker(event.target.checked)}
                description={
                    !kanVurdere
                        ? 'Jordbruker gjelder bare for hovedkategoriene «Selvstendig næringsdrivende» og «Arbeidstaker og selvstendig næringsdrivende».'
                        : undefined
                }
            >
                Jordbruker
            </Checkbox>
            <Textarea
                label="Begrunnelse (valgfritt)"
                size="small"
                value={begrunnelse}
                readOnly={isPending || !!data}
                onChange={(event) => setBegrunnelse(event.target.value)}
            />
            <div>
                <ButtonKreverSkrivetilgang
                    type="submit"
                    size="small"
                    variant="secondary"
                    loading={isPending}
                    disabled={!kanVurdere || !!data || avgjørelsenErUtdatert}
                >
                    Lagre
                </ButtonKreverSkrivetilgang>
            </div>
            {error && (
                <LocalAlert status="error" size="small" role="alert">
                    <LocalAlert.Header>
                        <LocalAlert.Title>Kunne ikke lagre vurderingen</LocalAlert.Title>
                    </LocalAlert.Header>
                    <LocalAlert.Content>
                        {avgjørelsenErUtdatert
                            ? 'Rettighetskategorien er endret. Last siden på nytt før du vurderer den manuelt.'
                            : 'Vurderingen er ikke lagret. Prøv igjen senere.'}
                    </LocalAlert.Content>
                </LocalAlert>
            )}
            {data && (
                <LocalAlert status="success" size="small" role="status">
                    <LocalAlert.Header>
                        <LocalAlert.Title>Vurderingen er lagret</LocalAlert.Title>
                    </LocalAlert.Header>
                    <LocalAlert.Content>
                        <BodyShort size="small">Rettighetskategori-ID: {data.id}</BodyShort>
                        <BodyShort size="small">Last siden på nytt for å se den nye tilstanden i Spleis.</BodyShort>
                    </LocalAlert.Content>
                </LocalAlert>
            )}
        </VStack>
    );
}
