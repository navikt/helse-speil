import { useParams } from 'next/navigation';
import React, { ReactElement } from 'react';

import { TasklistIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, HStack, Heading, InlineMessage, VStack } from '@navikt/ds-react';

import { erUtvikling } from '@/env';
import { LoadingShimmer } from '@components/LoadingShimmer';
import { useGetForsikringsvurderingForPerson } from '@io/rest/generated/forsikringer/forsikringer';
import {
    ApiForsikringsvurdering,
    ApiKollektivForsikring,
    ApiNavKjøptForsikring,
} from '@io/rest/generated/spesialist.schemas';
import { FolketrygdlovenLenke, ForsikringDialog } from '@saksbilde/venstremeny/ForsikringDialog';
import { somNorskDato } from '@utils/date';

export const ForsikringSeksjon = ({
    forsikringsvurderingId,
    skjæringstidspunkt,
}: {
    forsikringsvurderingId: string | null;
    skjæringstidspunkt: string;
}): ReactElement => {
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const { data, isLoading, error } = useGetForsikringsvurderingForPerson(personPseudoId, forsikringsvurderingId!, {
        query: {
            enabled: !!forsikringsvurderingId,
        },
    });

    return (
        <VStack gap="space-8">
            <HStack gap="space-8">
                <Heading size="xsmall">Forsikring</Heading>
                {erUtvikling && data && (
                    <ForsikringDialog
                        forsikringsvurdering={data}
                        skjæringstidspunkt={skjæringstidspunkt}
                        trigger={
                            <Button
                                size="xsmall"
                                variant="tertiary"
                                iconPosition="left"
                                icon={<TasklistIcon aria-hidden />}
                            >
                                Se vurdering
                            </Button>
                        }
                    />
                )}
            </HStack>
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
    const navKjøpteForsikringer = (forsikringsvurdering?.navKjøpteForsikringer ?? [])
        .filter((forsikring) => forsikring.lagtTilGrunn)
        .sort((a, b) => a.virkningsdato.localeCompare(b.virkningsdato));
    const kollektivForsikring = forsikringsvurdering?.kollektivForsikring;

    if (navKjøpteForsikringer.length === 0 && !kollektivForsikring) {
        return <BodyShort>Ingen forsikring</BodyShort>;
    }

    return (
        <>
            {kollektivForsikring && <KollektivForsikringInnhold forsikring={kollektivForsikring} />}
            {navKjøpteForsikringer.map((forsikring) => (
                <NavKjøptForsikringInnhold
                    key={`${forsikring.virkningsdato}-${forsikring.navn}`}
                    forsikring={forsikring}
                />
            ))}
        </>
    );
};

const NavKjøptForsikringInnhold = ({ forsikring }: { forsikring: ApiNavKjøptForsikring }): ReactElement => (
    <VStack>
        <BodyShort weight="semibold">
            {somNorskDato(forsikring.virkningsdato)} — {somNorskDato(forsikring.opphørsdato ?? undefined)}
        </BodyShort>
        <BodyShort>
            {forsikring.navn} <FolketrygdlovenLenke referanse={forsikring.dekningFolketrygdlovenreferanse} />
        </BodyShort>
    </VStack>
);

const KollektivForsikringInnhold = ({ forsikring }: { forsikring: ApiKollektivForsikring }): ReactElement => (
    <VStack>
        <BodyShort weight="semibold">Kollektiv</BodyShort>
        <BodyShort>
            {forsikring.navn} <FolketrygdlovenLenke referanse={forsikring.kollektivFolketrygdlovenreferanse} />
            {' + '}
            <FolketrygdlovenLenke referanse={forsikring.dekningFolketrygdlovenreferanse} />
        </BodyShort>
    </VStack>
);
