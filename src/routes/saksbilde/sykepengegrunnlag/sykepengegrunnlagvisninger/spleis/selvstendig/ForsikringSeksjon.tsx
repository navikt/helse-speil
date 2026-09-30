import { useParams } from 'next/navigation';
import React, { ReactElement } from 'react';

import { BodyShort, Detail, HStack, Heading, InlineMessage, VStack } from '@navikt/ds-react';

import { LoadingShimmer } from '@components/LoadingShimmer';
import { LovdataLenke } from '@components/LovdataLenke';
import { PersonFragment } from '@io/graphql';
import { useGetForsikringsvurderingForPerson } from '@io/rest/generated/forsikringer/forsikringer';
import {
    ApiFolketrygdlovenreferanse,
    ApiForsikringsvurdering,
    ApiIndividuellForsikring,
    ApiKollektivForsikring,
} from '@io/rest/generated/spesialist.schemas';
import { EndringssjekkKnapp } from '@saksbilde/sykepengegrunnlag/sykepengegrunnlagvisninger/spleis/selvstendig/EndringssjekkKnapp';
import { useAktivtInntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { useActivePeriod } from '@state/periode';
import { useErPersonUnderLasting } from '@state/person';
import { isInCurrentGeneration } from '@state/selectors/period';
import { getFormattedDatetimeString, somNorskDato } from '@utils/date';

interface ForsikringSeksjonProps {
    forsikringsvurderingId: string | null;
    skjæringstidspunkt: string;
    person: PersonFragment;
}

export const ForsikringSeksjon = ({
    forsikringsvurderingId,
    skjæringstidspunkt,
    person,
}: ForsikringSeksjonProps): ReactElement => {
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const isPersonLoading = useErPersonUnderLasting();
    const { data, isLoading, error } = useGetForsikringsvurderingForPerson(personPseudoId, forsikringsvurderingId!, {
        query: {
            enabled: !!forsikringsvurderingId,
        },
    });
    const aktivPeriode = useActivePeriod(person);
    const inntektsforhold = useAktivtInntektsforhold(person);
    if (aktivPeriode == null || inntektsforhold == undefined) return <></>;
    const skalViseEndringssjekkKnapp =
        isInCurrentGeneration(aktivPeriode, inntektsforhold) && data !== undefined && forsikringsvurderingId !== null;

    return (
        <VStack gap="space-8">
            <HStack gap="space-8" align="center">
                <Heading size="xsmall">Forsikring</Heading>
                {skalViseEndringssjekkKnapp && (
                    <EndringssjekkKnapp
                        identitetsnummer={person.fodselsnummer}
                        skjæringstidspunkt={skjæringstidspunkt}
                        forsikringsvurderingId={forsikringsvurderingId}
                    />
                )}
            </HStack>
            {data && (
                <Detail textColor="subtle">
                    {`Hentet ${getFormattedDatetimeString(data.sistHentet?.tidspunkt)} og vurdert ${getFormattedDatetimeString(data.vurdertTidspunkt)}`}
                </Detail>
            )}

            {isLoading || isPersonLoading ? (
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
