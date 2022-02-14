import styled from '@emotion/styled';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { PopoverHjelpetekst } from '@components/PopoverHjelpetekst';
import { SortInfoikon } from '@components/ikoner/SortInfoikon';
import { getKildeType } from '@utils/inntektskilde';
import { getMonthName, somPenger } from '@utils/locale';
import { sorterInntekterFraAOrdningen } from '@utils/inntekt';

const Tabell = styled.div`
    display: grid;
    grid-template-columns: 220px auto;
    grid-column-gap: 1rem;
    grid-row-gap: 0.25rem;
`;

const Verdi = styled(BodyShort)`
    text-align: right;
`;

const Bold = styled(BodyShort)`
    font-weight: 600;
`;

const FetVerdi = styled(Bold)`
    text-align: right;
`;

const Tittel = styled(BodyShort)`
    font-size: 14px;
    color: var(--navds-color-text-disabled);
`;

const Tittellinje = styled.div`
    display: flex;
    align-items: center;
`;

const Divider = styled.hr`
    border: none;
    border-bottom: 1px solid #b7b1a9;
    grid-column-start: 1;
    grid-column-end: 3;
    margin: 12px 0 12px 0;
`;

const InfobobleContainer = styled.div`
    min-height: 24px;
    margin-left: 1rem;
`;

const InntektFraAordningen = ({ omregnetÅrsinntekt }: { omregnetÅrsinntekt: ExternalOmregnetÅrsinntekt }) => {
    return (
        <>
            <InntektFraAordningenTabell omregnetÅrsinntekt={omregnetÅrsinntekt} />
            <Divider />
            <Tabell>
                <BodyShort as="p">Gj.snittlig månedsinntekt</BodyShort>
                <Verdi as="p">{somPenger(omregnetÅrsinntekt.månedsbeløp)}</Verdi>
                <Bold as="p">Omregnet rapportert årsinntekt</Bold>
                <FetVerdi as="p">{somPenger(omregnetÅrsinntekt.beløp)}</FetVerdi>
            </Tabell>
        </>
    );
};

const InntektFraAordningenTabell = ({ omregnetÅrsinntekt }: { omregnetÅrsinntekt: ExternalOmregnetÅrsinntekt }) => (
    <>
        <Tittellinje>
            <Tittel as="h3">RAPPORTERT SISTE 3 MÅNEDER</Tittel>
            <InfobobleContainer>
                <PopoverHjelpetekst ikon={<SortInfoikon />}>
                    <p>
                        Ved manglende inntektsmelding legges 3 siste måneders innrapporterte inntekter fra A-ordningen
                        til grunn
                    </p>
                </PopoverHjelpetekst>
            </InfobobleContainer>
        </Tittellinje>
        <Tabell>
            {sorterInntekterFraAOrdningen(omregnetÅrsinntekt.inntekterFraAOrdningen)?.map((inntekt, i) => (
                <React.Fragment key={i}>
                    <BodyShort as="p"> {getMonthName(inntekt.måned)}</BodyShort>
                    <Verdi as="p">{somPenger(inntekt.sum)}</Verdi>
                </React.Fragment>
            ))}
        </Tabell>
    </>
);

interface ReadOnlyInntektProps {
    omregnetÅrsinntekt: ExternalOmregnetÅrsinntekt | null;
}

export const ReadOnlyInntekt = ({ omregnetÅrsinntekt }: ReadOnlyInntektProps) => (
    <>
        {getKildeType(omregnetÅrsinntekt?.kilde) === 'Aordningen' ? (
            <InntektFraAordningen omregnetÅrsinntekt={omregnetÅrsinntekt!} />
        ) : (
            <Tabell>
                <BodyShort as="p">Månedsbeløp</BodyShort>
                <Verdi as="p">{somPenger(omregnetÅrsinntekt?.månedsbeløp)}</Verdi>
                <Bold as="p">
                    {omregnetÅrsinntekt?.kilde === 'Infotrygd' ? 'Sykepengegrunnlag før 6G' : 'Omregnet til årsinntekt'}
                </Bold>
                <FetVerdi as="p">{somPenger(omregnetÅrsinntekt?.beløp)}</FetVerdi>
            </Tabell>
        )}
    </>
);
