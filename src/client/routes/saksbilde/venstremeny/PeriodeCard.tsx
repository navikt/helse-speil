import styled from '@emotion/styled';
import { Periodetype } from 'internal-types';
import React from 'react';

import { Normaltekst, Undertekst } from 'nav-frontend-typografi';

import { LovdataLenke } from '../../../components/LovdataLenke';
import { Oppgaveetikett } from '../../../components/Oppgaveetikett';
import { Advarselikon } from '../../../components/ikoner/Advarselikon';
import { Maksdatoikon } from '../../../components/ikoner/Maksdatoikon';
import { Skjæringstidspunktikon } from '../../../components/ikoner/Skjæringstidspunktikon';
import { Sykmeldingsperiodeikon } from '../../../components/ikoner/Sykmeldingsperiodeikon';
import { Periodetype as Historikkperiodetype, Tidslinjeperiode } from '../../../modell/UtbetalingshistorikkElement';
import { useVedtaksperiode } from '../../../state/tidslinje';
import { NORSK_DATOFORMAT_KORT } from '../../../utils/date';

import { Card } from './Card';
import { CardTitle } from './CardTitle';

const Grid = styled.div`
    display: grid;
    grid-template-columns: 1.25rem auto;
    grid-column-gap: 0.75rem;
    grid-row-gap: 0.125rem;
`;

const IconContainer = styled.div`
    justify-self: center;
`;

const getTextForPeriodetype = (type: Periodetype): string => {
    switch (type) {
        case Periodetype.Forlengelse:
        case Periodetype.Infotrygdforlengelse:
            return 'FORLENGELSE';
        case Periodetype.Førstegangsbehandling:
            return 'FØRSTEGANGSBEHANDLING';
        case Periodetype.OvergangFraInfotrygd:
            return 'FORLENGELSE IT';
        case Periodetype.Stikkprøve:
            return 'STIKKPRØVE';
        case Periodetype.RiskQa:
            return 'RISK QA';
        case Periodetype.Revurdering:
            return 'REVURDERING';
    }
};

interface PeriodeCardProps {
    aktivPeriode: Tidslinjeperiode;
    maksdato: string;
    over67år: boolean;
    gjenståendeDager?: number;
    skjæringstidspunkt: string;
}

export const PeriodeCard = ({
    aktivPeriode,
    maksdato,
    over67år,
    skjæringstidspunkt,
    gjenståendeDager,
}: PeriodeCardProps) => {
    const vedtaksperiode = useVedtaksperiode(aktivPeriode.id);
    const periodeText = `${aktivPeriode.fom.format(NORSK_DATOFORMAT_KORT)} - ${aktivPeriode.tom.format(
        NORSK_DATOFORMAT_KORT
    )}`;

    const periodetype =
        aktivPeriode.type === Historikkperiodetype.REVURDERING ? Periodetype.Revurdering : vedtaksperiode.periodetype;

    return (
        <Card>
            <Grid>
                <IconContainer>
                    <Oppgaveetikett type={periodetype} />
                </IconContainer>
                <CardTitle>{getTextForPeriodetype(periodetype)}</CardTitle>
                <IconContainer>
                    <Sykmeldingsperiodeikon />
                </IconContainer>
                <Normaltekst>{periodeText}</Normaltekst>
                <IconContainer>
                    <Skjæringstidspunktikon />
                </IconContainer>
                <Normaltekst>{skjæringstidspunkt}</Normaltekst>
                <IconContainer>
                    <Maksdatoikon />
                </IconContainer>
                <Normaltekst>{`${maksdato} (${gjenståendeDager ?? 'Ukjent antall'} dager igjen)`}</Normaltekst>
                {over67år && (
                    <>
                        <IconContainer>
                            @
                            <Advarselikon height={16} width={16} />
                        </IconContainer>
                        <Undertekst>
                            <LovdataLenke paragraf="8-51">§ 8-51</LovdataLenke>
                        </Undertekst>
                    </>
                )}
            </Grid>
        </Card>
    );
};
