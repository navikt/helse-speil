import styled from '@emotion/styled';
import React from 'react';

import { BodyShort, Heading } from '@navikt/ds-react';

import { PopoverHjelpetekst } from '../../../../components/PopoverHjelpetekst';
import { SortInfoikon } from '../../../../components/ikoner/SortInfoikon';
import { getKildeType } from '../../../../utils/inntektskilde';
import { somPenger } from '../../../../utils/locale';

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

const Tittel = styled(Heading)`
    display: flex;
    align-items: center;
    font-size: 18px;
    color: var(--navds-color-text-primary);
    margin-bottom: 1.25rem;
`;

const Tittellinje = styled.div`
    display: flex;
`;

const Divider = styled.hr`
    border: none;
    border-bottom: 1px solid #b7b1a9;
    grid-column-start: 1;
    grid-column-end: 3;
    margin: 38px 0 42px 0;
`;

const InfobobleContainer = styled.div`
    min-height: 24px;
    margin-left: 1rem;
`;

const Popovertekst = styled.div`
    width: 30rem;

    p {
        line-height: 1.5rem;
    }
`;

const getMonthName = (yearMonth: string) => {
    const monthNumberToMonthName: Record<string, string> = {
        '01': 'Januar',
        '02': 'Februar',
        '03': 'Mars',
        '04': 'April',
        '05': 'Mai',
        '06': 'Juni',
        '07': 'Juli',
        '08': 'August',
        '09': 'September',
        '10': 'Oktober',
        '11': 'November',
        '12': 'Desember',
    };
    return monthNumberToMonthName[yearMonth.split('-')[1]] ?? 'Fant ikke måned';
};

const InntektFraAordningen = ({ omregnetÅrsinntekt }: { omregnetÅrsinntekt: ExternalOmregnetÅrsinntekt }) => {
    return (
        <>
            <Tittellinje>
                <Tittel as="h3" size="medium">
                    Rapportert siste 3 måneder
                </Tittel>
                <InfobobleContainer>
                    <PopoverHjelpetekst ikon={<SortInfoikon />}>
                        <Popovertekst>
                            <Bold as="p">
                                Ved manglende inntektsmelding legges 3 siste måneders innrapporterte inntekt til grunn
                            </Bold>
                            <br />
                            <p>
                                Avviket regnes ut ved å ta 3 siste måneders innrapporte inntekt, regne det om til 12
                                måneder - og sammenligne med 12 siste måneders innrapporterte inntekt. Avviket brukes
                                for å sannsynliggjøre at inntekten som legges til grunn er normal.
                            </p>
                        </Popovertekst>
                    </PopoverHjelpetekst>
                </InfobobleContainer>
            </Tittellinje>
            <Tabell>
                {omregnetÅrsinntekt.inntekterFraAOrdningen?.map((inntekt, i) => {
                    return (
                        <React.Fragment key={i}>
                            <BodyShort as="p"> {getMonthName(inntekt.måned)}</BodyShort>
                            <Verdi as="p">{somPenger(inntekt.sum)}</Verdi>
                        </React.Fragment>
                    );
                })}
            </Tabell>
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
