import styled from '@emotion/styled';
import { Inntektskildetype, Kildetype, OmregnetÅrsinntekt } from 'internal-types';
import React from 'react';

import { InformationFilled } from '@navikt/ds-icons';
import { BodyShort, Title } from '@navikt/ds-react';

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

const Tittel = styled(Title)`
    display: flex;
    align-items: center;
    font-size: 18px;
    color: var(--navds-color-text-primary);
    margin-bottom: 1.25rem;
`;

const Divider = styled.hr`
    border: none;
    border-bottom: 1px solid #b7b1a9;
    grid-column-start: 1;
    grid-column-end: 3;
    margin: 38px 0 42px 0;
`;

const InformationIcon = styled(InformationFilled)`
    color: var(--speil-info-ikon);
    margin-left: 17px;
    height: 24px;
    width: 24px;
`;

interface ReadOnlyInntektProps {
    omregnetÅrsinntekt?: OmregnetÅrsinntekt;
}

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

const InntektFraAordningen = ({ omregnetÅrsinntekt }: { omregnetÅrsinntekt: OmregnetÅrsinntekt }) => {
    return (
        <>
            <Tittel component="h3" size="m">
                Rapportert siste 3 måneder
                <InformationIcon />
            </Tittel>
            <Tabell>
                {omregnetÅrsinntekt.inntekterFraAOrdningen?.map((inntekt, i) => {
                    return (
                        <React.Fragment key={i}>
                            <BodyShort component="p"> {getMonthName(inntekt.måned)}</BodyShort>
                            <Verdi component="p">{somPenger(inntekt.sum)}</Verdi>
                        </React.Fragment>
                    );
                })}
            </Tabell>
            <Divider />
            <Tabell>
                <BodyShort component="p">Gj.snittlig månedsinntekt</BodyShort>
                <Verdi component="p">{somPenger(omregnetÅrsinntekt.månedsbeløp)}</Verdi>
                <Bold component="p">Omregnet rapportert årsinntekt</Bold>
                <FetVerdi component="p">{somPenger(omregnetÅrsinntekt.beløp)}</FetVerdi>
            </Tabell>
        </>
    );
};

export const ReadOnlyInntekt = ({ omregnetÅrsinntekt }: ReadOnlyInntektProps) => (
    <>
        {getKildeType(omregnetÅrsinntekt?.kilde) === Kildetype.Aordningen ? (
            <InntektFraAordningen omregnetÅrsinntekt={omregnetÅrsinntekt!} />
        ) : (
            <Tabell>
                <BodyShort component="p">Månedsbeløp</BodyShort>
                <Verdi component="p">{somPenger(omregnetÅrsinntekt?.månedsbeløp)}</Verdi>
                <Bold component="p">
                    {omregnetÅrsinntekt?.kilde === Inntektskildetype.Infotrygd
                        ? 'Sykepengegrunnlag før 6G'
                        : 'Omregnet til årsinntekt'}
                </Bold>
                <FetVerdi component="p">{somPenger(omregnetÅrsinntekt?.beløp)}</FetVerdi>
            </Tabell>
        )}
    </>
);
