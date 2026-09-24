import dayjs from 'dayjs';
import { useParams } from 'next/navigation';
import React, { ReactElement, useState } from 'react';

import { ArrowCirclepathIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Detail, HStack, Heading, InlineMessage, VStack } from '@navikt/ds-react';

import { erUtvikling } from '@/env';
import { LoadingShimmer } from '@components/LoadingShimmer';
import { LovdataLenke } from '@components/LovdataLenke';
import { useRevurderForsikring } from '@io/rest/forsikringer-midlertidig';
import {
    getGetForsikringsvurderingForPersonQueryKey,
    useGetForsikringsvurderingForPerson,
} from '@io/rest/generated/forsikringer/forsikringer';
import {
    ApiFolketrygdlovenreferanse,
    ApiForsikringsvurdering,
    ApiIndividuellForsikring,
    ApiKollektivForsikring,
} from '@io/rest/generated/spesialist.schemas';
import { useQueryClient } from '@tanstack/react-query';
import { NORSK_DATOFORMAT_MED_KLOKKESLETT, somNorskDato } from '@utils/date';

export const ForsikringSeksjon = ({
    forsikringsvurderingId,
    skjæringstidspunkt,
}: {
    forsikringsvurderingId: string | null;
    skjæringstidspunkt: string;
}): ReactElement => {
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const queryClient = useQueryClient();
    const [ingenNyVurdering, setIngenNyVurdering] = useState(false);
    const { data, isLoading, error } = useGetForsikringsvurderingForPerson(personPseudoId, forsikringsvurderingId!, {
        query: {
            enabled: !!forsikringsvurderingId,
        },
    });
    const { mutate: revurderForsikring, isPending: revurderer } = useRevurderForsikring(
        personPseudoId,
        skjæringstidspunkt,
        {
            onSuccess: ({ nyForsikringsvurdering }) => {
                setIngenNyVurdering(!nyForsikringsvurdering);
                if (nyForsikringsvurdering) {
                    queryClient.invalidateQueries({
                        queryKey: getGetForsikringsvurderingForPersonQueryKey(
                            personPseudoId,
                            forsikringsvurderingId ?? undefined,
                        ),
                    });
                }
            },
        },
    );

    return (
        <VStack gap="space-8">
            <HStack gap="space-8" align="center">
                <Heading size="xsmall">Forsikring</Heading>
                {erUtvikling && data && (
                    <Button
                        size="xsmall"
                        variant="tertiary"
                        icon={<ArrowCirclepathIcon />}
                        loading={revurderer}
                        onClick={() => {
                            setIngenNyVurdering(false);
                            revurderForsikring();
                        }}
                    >
                        Hent på nytt
                    </Button>
                )}
            </HStack>
            {erUtvikling && data && (
                <VStack>
                    <Detail textColor="subtle">
                        {`Hentet og vurdert ${dayjs(data.vurdertTidspunkt).tz('Europe/Oslo').format(NORSK_DATOFORMAT_MED_KLOKKESLETT)}`}
                    </Detail>
                    {ingenNyVurdering && <Detail textColor="subtle">Ingen ny forsikringsvurdering</Detail>}
                </VStack>
            )}

            {isLoading ? (
                <LoadingShimmer />
            ) : error ? (
                <HStack align="center" gap="space-8">
                    <InlineMessage status="error">Klarte ikke hente informasjon om forsikring</InlineMessage>
                </HStack>
            ) : (
                <VStack align="start" gap="space-8">
                    <Forsikringsinnhold forsikringsvurdering={data} />
                </VStack>
            )}
        </VStack>
    );
};

const Forsikringsinnhold = ({
    forsikringsvurdering,
}: {
    forsikringsvurdering: ApiForsikringsvurdering | undefined;
}): ReactElement => {
    const individuelleForsikringer = (forsikringsvurdering?.individuelleForsikringer ?? [])
        .filter((forsikring) => forsikring.lagtTilGrunn)
        .sort((a, b) => a.virkningsdato.localeCompare(b.virkningsdato));
    const kollektivForsikring = forsikringsvurdering?.kollektivForsikring;

    if (individuelleForsikringer.length === 0 && !kollektivForsikring) {
        return <BodyShort>Ingen forsikring</BodyShort>;
    }

    return (
        <>
            {kollektivForsikring && <KollektivForsikringInnhold forsikring={kollektivForsikring} />}
            {individuelleForsikringer.map((forsikring) => (
                <IndividuellForsikringInnhold
                    key={`${forsikring.virkningsdato}-${forsikring.navn}`}
                    forsikring={forsikring}
                />
            ))}
        </>
    );
};

const IndividuellForsikringInnhold = ({ forsikring }: { forsikring: ApiIndividuellForsikring }): ReactElement => (
    <VStack>
        <BodyShort as="span" weight="semibold">
            {somNorskDato(forsikring.virkningsdato)} — {somNorskDato(forsikring.opphørsdato ?? undefined)}
        </BodyShort>
        <BodyShort>
            <BodyShort as="span" weight="semibold">
                Selvstendig næringsdrivende
            </BodyShort>
            {', '}
            {forsikring.navn} <FolketrygdlovenLenke referanse={forsikring.dekningFolketrygdlovenreferanse} />
        </BodyShort>
    </VStack>
);

const KollektivForsikringInnhold = ({ forsikring }: { forsikring: ApiKollektivForsikring }): ReactElement => (
    <BodyShort>
        <BodyShort as="span" weight="semibold">
            Kollektiv
        </BodyShort>
        {', '}
        {forsikring.navn} <FolketrygdlovenLenke referanse={forsikring.kollektivFolketrygdlovenreferanse} />
        {' og '}
        <FolketrygdlovenLenke referanse={forsikring.dekningFolketrygdlovenreferanse} />
    </BodyShort>
);

export const FolketrygdlovenLenke = ({
    referanse,
}: {
    referanse?: ApiFolketrygdlovenreferanse | null;
}): ReactElement | string => {
    if (!referanse) return '–';

    const paragraf = `${referanse.kapittel}-${referanse.paragrafIKapittel}`;
    const ledd = referanse.ledd ? ` ${referanse.ledd}. ledd` : '';
    const bokstav = referanse.bokstav ? ` bokstav ${referanse.bokstav}` : '';

    return <LovdataLenke paragraf={paragraf}>{`§ ${paragraf}${ledd}${bokstav}`}</LovdataLenke>;
};
