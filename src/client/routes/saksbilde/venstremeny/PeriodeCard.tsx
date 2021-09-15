import styled from '@emotion/styled';
import { Dayjs } from 'dayjs';
import { Periodetype, Vedtaksperiode } from 'internal-types';
import React from 'react';

import { Normaltekst, Undertekst } from 'nav-frontend-typografi';

import { Flex } from '../../../components/Flex';
import { LovdataLenke } from '../../../components/LovdataLenke';
import { Oppgaveetikett } from '../../../components/Oppgaveetikett';
import { Advarselikon } from '../../../components/ikoner/Advarselikon';
import { Maksdatoikon } from '../../../components/ikoner/Maksdatoikon';
import { Skjæringstidspunktikon } from '../../../components/ikoner/Skjæringstidspunktikon';
import { Sykmeldingsperiodeikon } from '../../../components/ikoner/Sykmeldingsperiodeikon';
import { Periodetype as Historikkperiodetype, Tidslinjeperiode } from '../../../modell/utbetalingshistorikkelement';
import { useVedtaksperiode } from '../../../state/tidslinje';
import { NORSK_DATOFORMAT_KORT } from '../../../utils/date';
import { capitalize } from '../../../utils/locale';

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

const formatertDato = (dato: Dayjs): string => dato.format(NORSK_DATOFORMAT_KORT);

interface PeriodeCardProps {
    aktivPeriode: Tidslinjeperiode;
    maksdato: string;
    over67år: boolean;
    gjenståendeDager?: number;
    skjæringstidspunkt: string;
}

export const PeriodeCard = React.memo(
    ({ aktivPeriode, maksdato, over67år, skjæringstidspunkt, gjenståendeDager }: PeriodeCardProps) => {
        const vedtaksperiode = useVedtaksperiode(aktivPeriode.id) as Vedtaksperiode;
        const periodetype =
            aktivPeriode.type === Historikkperiodetype.REVURDERING
                ? Periodetype.Revurdering
                : vedtaksperiode.periodetype;
        const periodetypeLabel = getTextForPeriodetype(periodetype);

        return (
            <Card>
                <Grid>
                    <IconContainer data-tip={capitalize(periodetypeLabel)}>
                        <Oppgaveetikett type={periodetype} tilstand={aktivPeriode.tilstand} />
                    </IconContainer>
                    <CardTitle>{periodetypeLabel}</CardTitle>
                    <IconContainer data-tip="Sykmeldingsperiode">
                        <Sykmeldingsperiodeikon alt="Sykmeldingsperiode" />
                    </IconContainer>
                    <Normaltekst>{`${formatertDato(aktivPeriode.fom)} - ${formatertDato(
                        aktivPeriode.tom
                    )}`}</Normaltekst>
                    <IconContainer data-tip="Skjæringstidspunkt">
                        <Skjæringstidspunktikon alt="Skjæringstidspunkt" />
                    </IconContainer>
                    <Normaltekst>{skjæringstidspunkt}</Normaltekst>
                    <IconContainer data-tip="Maksdato">
                        <Maksdatoikon alt="Maksdato" />
                    </IconContainer>
                    <Flex justifyContent="space-between">
                        <Normaltekst>{`${maksdato} (${gjenståendeDager ?? 'Ukjent antall'} dager igjen)`}</Normaltekst>
                        {over67år && (
                            <Flex alignItems="center">
                                <IconContainer data-tip="Mellom 62 og 70 år - redusert antall sykepengedager">
                                    <Advarselikon
                                        alt="Mellom 62 og 70 år - redusert antall sykepengedager"
                                        height={16}
                                        width={16}
                                    />
                                </IconContainer>
                                <Undertekst style={{ marginLeft: '.5rem' }}>
                                    <LovdataLenke paragraf="8-51">§ 8-51</LovdataLenke>
                                </Undertekst>
                            </Flex>
                        )}
                    </Flex>
                </Grid>
            </Card>
        );
    }
);
