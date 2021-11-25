import styled from '@emotion/styled';
import { Dayjs } from 'dayjs';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Flex } from '../../../components/Flex';
import { LovdataLenke } from '../../../components/LovdataLenke';
import { Oppgaveetikett } from '../../../components/Oppgaveetikett';
import { Advarselikon } from '../../../components/ikoner/Advarselikon';
import { Maksdatoikon } from '../../../components/ikoner/Maksdatoikon';
import { Skjæringstidspunktikon } from '../../../components/ikoner/Skjæringstidspunktikon';
import { SkjæringstidspunktikonInvert } from '../../../components/ikoner/SkjæringstidspunktikonInvert';
import { Sykmeldingsperiodeikon } from '../../../components/ikoner/Sykmeldingsperiodeikon';
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
    align-items: center;
`;

const IconContainer = styled.div`
    justify-self: center;
    display: flex;
`;

const LovdataLenkeContainer = styled(BodyShort)`
    font-size: 14px;
    margin-left: 0.5rem;
`;

const getTextForPeriodetype = (type: Periodetype): string => {
    switch (type) {
        case 'forlengelse':
        case 'infotrygdforlengelse':
            return 'FORLENGELSE';
        case 'førstegangsbehandling':
            return 'FØRSTEGANGSBEHANDLING';
        case 'overgangFraIt':
            return 'FORLENGELSE IT';
        case 'stikkprøve':
            return 'STIKKPRØVE';
        case 'riskQa':
            return 'RISK QA';
        case 'revurdering':
            return 'REVURDERING';
    }
};

const formatertDato = (dato: Dayjs): string => dato.format(NORSK_DATOFORMAT_KORT);

const PeriodeCardTitle = styled(CardTitle)`
    margin-bottom: 0;
`;

interface PeriodeCardProps {
    aktivPeriode: Tidslinjeperiode;
    maksdato: string;
    alderVedSisteSykedag?: number;
    gjenståendeDager: number | null;
    skjæringstidspunkt: string;
}

export const PeriodeCard = React.memo(
    ({ aktivPeriode, maksdato, alderVedSisteSykedag, skjæringstidspunkt, gjenståendeDager }: PeriodeCardProps) => {
        const vedtaksperiode = useVedtaksperiode(aktivPeriode.id) as Vedtaksperiode;
        const periodetype = aktivPeriode.type === 'REVURDERING' ? 'revurdering' : vedtaksperiode.periodetype;
        const infotrygdforlengelse = vedtaksperiode.forlengelseFraInfotrygd;
        const periodetypeLabel = getTextForPeriodetype(periodetype);

        return (
            <Card>
                <Grid>
                    <IconContainer data-tip={capitalize(periodetypeLabel)}>
                        <Oppgaveetikett type={periodetype} tilstand={aktivPeriode.tilstand} />
                    </IconContainer>
                    <PeriodeCardTitle>{periodetypeLabel}</PeriodeCardTitle>
                    <IconContainer data-tip="Sykmeldingsperiode">
                        <Sykmeldingsperiodeikon alt="Sykmeldingsperiode" />
                    </IconContainer>
                    <BodyShort>{`${formatertDato(aktivPeriode.fom)} - ${formatertDato(aktivPeriode.tom)}`}</BodyShort>
                    <IconContainer data-tip="Skjæringstidspunkt">
                        {infotrygdforlengelse ? (
                            <SkjæringstidspunktikonInvert alt="Skjæringstidspunkt" />
                        ) : (
                            <Skjæringstidspunktikon alt="Skjæringstidspunkt" />
                        )}
                    </IconContainer>
                    <BodyShort>
                        {infotrygdforlengelse ? 'Skjæringstidspunkt i Infotrygd/Gosys' : skjæringstidspunkt}
                    </BodyShort>
                    <IconContainer data-tip="Maksdato">
                        <Maksdatoikon alt="Maksdato" />
                    </IconContainer>
                    <Flex justifyContent="space-between">
                        <BodyShort>{`${maksdato} (${gjenståendeDager ?? 'Ukjent antall'} dager igjen)`}</BodyShort>
                        {alderVedSisteSykedag !== undefined &&
                            (alderVedSisteSykedag >= 70 ? (
                                <Flex alignItems="center">
                                    <IconContainer data-tip="Over 70 år">
                                        <Advarselikon alt="Over 70 år" height={16} width={16} />
                                    </IconContainer>
                                    <LovdataLenkeContainer as="p">
                                        <LovdataLenke paragraf="8-3">§ 8-3</LovdataLenke>
                                    </LovdataLenkeContainer>
                                </Flex>
                            ) : (
                                alderVedSisteSykedag >= 67 && (
                                    <Flex alignItems="center">
                                        <IconContainer data-tip="Mellom 67 og 70 år - redusert antall sykepengedager">
                                            <Advarselikon
                                                alt="Mellom 67 og 70 år - redusert antall sykepengedager"
                                                height={16}
                                                width={16}
                                            />
                                        </IconContainer>
                                        <LovdataLenkeContainer as="p">
                                            <LovdataLenke paragraf="8-51">§ 8-51</LovdataLenke>
                                        </LovdataLenkeContainer>
                                    </Flex>
                                )
                            ))}
                    </Flex>
                </Grid>
            </Card>
        );
    }
);
