import styled from '@emotion/styled';
import { Inntektskildetype, Kildetype, OmregnetÅrsinntekt } from 'internal-types';
import React from 'react';

import { Normaltekst, Undertittel } from 'nav-frontend-typografi';

import { InformationFilled } from '@navikt/ds-icons';

import { getKildeType } from '../../../../utils/inntektskilde';
import { somPenger } from '../../../../utils/locale';

const Tabell = styled.div`
    display: grid;
    grid-template-columns: 200px auto;
    grid-column-gap: 1rem;
    grid-row-gap: 0.25rem;
`;

const Verdi = styled(Normaltekst)`
    text-align: right;
`;

const Tittel = styled(Undertittel)`
    display: flex;
    align-items: center;
    font-size: 18px;
    color: var(--navds-color-text-primary);
    margin-bottom: 19px;

    ${({ maxwidth }: { maxwidth?: string }) => maxwidth && `max-width: ${maxwidth};`}
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
            <Tittel tag="h3">
                Rapportert siste 3 måneder
                <InformationIcon />
            </Tittel>
            <Tabell>
                {omregnetÅrsinntekt.inntekterFraAOrdningen?.map((inntekt, i) => {
                    return (
                        <React.Fragment key={i}>
                            <Normaltekst> {getMonthName(inntekt.måned)}</Normaltekst>
                            <Verdi>{somPenger(inntekt.sum)}</Verdi>
                        </React.Fragment>
                    );
                })}
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
                <Normaltekst>Månedsbeløp</Normaltekst>
                <Verdi>{somPenger(omregnetÅrsinntekt?.månedsbeløp)}</Verdi>
                <Normaltekst>
                    {omregnetÅrsinntekt?.kilde === Inntektskildetype.Infotrygd
                        ? 'Sykepengegrunnlag før 6G'
                        : 'Omregnet til årsinntekt'}
                </Normaltekst>
                <Verdi>{somPenger(omregnetÅrsinntekt?.beløp)}</Verdi>
            </Tabell>
        )}
    </>
);
