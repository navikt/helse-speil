import { useParams } from 'next/navigation';
import React, { ReactElement } from 'react';

import { TasklistIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, HStack, Heading, InlineMessage, VStack } from '@navikt/ds-react';

import { erUtvikling } from '@/env';
import { LoadingShimmer } from '@components/LoadingShimmer';
import { useGetForsikringsvurderingForPerson } from '@io/rest/generated/forsikringer/forsikringer';
import { ApiForsikringsvurdering } from '@io/rest/generated/spesialist.schemas';
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
                    <VStack>
                        <Forsikringsinnhold forsikringsvurdering={data} />
                    </VStack>
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
    const gjeldendeForsikring = forsikringsvurdering?.gjeldendeForsikring;

    if (!forsikringsvurdering?.eksisterer || !gjeldendeForsikring) {
        return <BodyShort>Ingen forsikring</BodyShort>;
    }

    const opphørsdato = somNorskDato(gjeldendeForsikring.opphørsdato ?? undefined);

    return (
        <>
            <BodyShort weight="semibold">
                {somNorskDato(gjeldendeForsikring.virkningsdato)} — {opphørsdato}
            </BodyShort>
            <BodyShort>
                {gjeldendeForsikring.navn}{' '}
                <FolketrygdlovenLenke referanse={gjeldendeForsikring.folketrygdlovenreferanse} />
            </BodyShort>
        </>
    );
};
