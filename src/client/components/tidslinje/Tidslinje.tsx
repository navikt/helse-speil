import React, { CSSProperties, ReactNode } from 'react';
import styled from '@emotion/styled';
import { LasterUtsnittsvelger, Utsnittsvelger } from './Utsnittsvelger';
import { useInfotrygdrader } from './useInfotrygdrader';
import { Flex, FlexColumn } from '../Flex';
import { Arbeidsgiver, Person, Vedtaksperiode } from 'internal-types';
import { useSetAktivVedtaksperiode } from '../../state/vedtaksperiode';
import { AxisLabels, Pins, Row } from '@navikt/helse-frontend-timeline/lib';
import '@navikt/helse-frontend-timeline/lib/main.css';
import { TekstMedEllipsis } from '../TekstMedEllipsis';
import { Tidslinjeperiode } from './Tidslinjeperiode';
import { Arbeidsgiverikon } from '../ikoner/Arbeidsgiverikon';
import { Infotrygdikon } from '../ikoner/Infotrygdikon';
import { PinsTooltip, TidslinjeTooltip } from './TidslinjeTooltip';
import { useTidslinjeutsnitt } from './useTidslinjeutsnitt';
import { maksdatoForPeriode, sisteValgbarePeriode } from '../../mapping/selectors';
import { Undertekst } from 'nav-frontend-typografi';
import { NORSK_DATOFORMAT } from '../../utils/date';
import { useTidslinjerader } from './useTidslinjerader';
import dayjs from 'dayjs';
import 'dayjs/locale/nb';
import { useSkalAnonymiserePerson } from '../../state/person';
import { getAnonymArbeidsgiverForOrgnr } from '../../agurkdata';

dayjs.locale('nb');

const Container = styled(FlexColumn)`
    position: relative;
    padding: 14px 32px 16px 32px;
    border-bottom: 1px solid var(--navds-color-border);
    margin-top: 1rem;
`;

const TidslinjeContainer = styled.div`
    position: relative;
    height: 100%;
    padding-bottom: calc(1rem - 2px);
    margin-bottom: 2px;
`;

const ArbeidsgiverContainer = styled(Flex)`
    &:not(:last-of-type) {
        margin-bottom: 24px;
    }
    align-items: start;
`;

const RaderContainer = styled(FlexColumn)`
    width: 100%;
    height: 100%;
    flex: 1;
`;

interface ArbeidsgivernavnProps {
    width: number;
}

const Arbeidsgivernavn = styled(Flex)<ArbeidsgivernavnProps>`
    align-items: center;
    font-size: 14px;
    color: var(--navds-color-text-primary);
    line-height: 1rem;
    padding-right: 1rem;
    box-sizing: border-box;

    > svg:first-of-type {
        margin-right: 1rem;
    }

    ${({ width }) => `width: ${width}px;`};
`;
interface HorizontalOffsetProps {
    horizontalOffset: number;
}

const AxisLabelsContainer = styled.div<HorizontalOffsetProps>`
    ${({ horizontalOffset }) => `margin-left: ${horizontalOffset}px;`}
`;

const PinsContainer = styled.div<HorizontalOffsetProps>`
    ${({ horizontalOffset }) => `margin-left: ${horizontalOffset}px;
    width: calc(100% - ${horizontalOffset}px);`}
    position: absolute;
    height: 100%;
    top: 0;
`;

interface TidslinjeradProps {
    erAktiv: boolean;
}

const Tidslinjerad = styled(Row)<TidslinjeradProps>`
    ${({ erAktiv }) =>
        erAktiv
            ? `
    background-color: #E5F3FF;
    `
            : `
    button:hover {
        z-index: 20;
    }
    `}
    box-sizing: border-box;
    margin-bottom: 10px;
`;

interface Props {
    person: Person;
    aktivVedtaksperiode?: Vedtaksperiode;
}

export const arbeidsgiverNavn = (arbeidsgiver: Arbeidsgiver, skalAnonymiseres: boolean): string => {
    if (skalAnonymiseres) return getAnonymArbeidsgiverForOrgnr(arbeidsgiver.organisasjonsnummer).navn;
    return arbeidsgiver.navn.toLowerCase() !== 'ukjent' && arbeidsgiver.navn.toLowerCase() !== 'ikke tilgjengelig'
        ? arbeidsgiver.navn
        : arbeidsgiver.organisasjonsnummer;
};

export const LasterTidslinje = () => {
    return (
        <Container>
            <LasterUtsnittsvelger />
        </Container>
    );
};

export const Tidslinje = ({ person, aktivVedtaksperiode }: Props) => {
    const setAktivVedtaksperiode = useSetAktivVedtaksperiode();
    const { utsnitt, aktivtUtsnitt, setAktivtUtsnitt } = useTidslinjeutsnitt(person);
    const anonymiseringEnabled = useSkalAnonymiserePerson();

    const fom = utsnitt[aktivtUtsnitt].fom;
    const tom = utsnitt[aktivtUtsnitt].tom;

    const infotrygdrader = useInfotrygdrader(person, fom, tom, anonymiseringEnabled);
    const tidslinjerader = useTidslinjerader(person, fom, tom, anonymiseringEnabled);

    const tidslinjeradOffset = 250;

    const maksdato = () => {
        const sistePeriode = sisteValgbarePeriode(person);
        const dato = sistePeriode && maksdatoForPeriode(sistePeriode);
        return dato && dato.isBefore(tom) && dato.isAfter(fom)
            ? {
                  date: dato.endOf('day').toDate(),
                  render: (
                      <PinsTooltip>
                          <Undertekst>Maksdato: {dato.format(NORSK_DATOFORMAT)}</Undertekst>
                      </PinsTooltip>
                  ),
              }
            : undefined;
    };

    const pins = (): { date: Date; render: ReactNode; style?: CSSProperties }[] => {
        const _maksdato = maksdato();
        return _maksdato ? [_maksdato] : [];
    };

    return (
        <Container>
            <TidslinjeContainer>
                <AxisLabelsContainer horizontalOffset={tidslinjeradOffset}>
                    <AxisLabels start={fom.toDate()} slutt={tom.toDate()} direction={'right'} />
                </AxisLabelsContainer>
                <PinsContainer horizontalOffset={tidslinjeradOffset}>
                    <Pins start={fom.toDate()} slutt={tom.toDate()} direction={'right'} pins={pins()} />
                </PinsContainer>
                {tidslinjerader.map(({ id, navn, rader }) => (
                    <ArbeidsgiverContainer key={id}>
                        <Arbeidsgivernavn width={tidslinjeradOffset}>
                            <Arbeidsgiverikon />
                            <TekstMedEllipsis data-tip={navn}>{navn}</TekstMedEllipsis>
                        </Arbeidsgivernavn>
                        <RaderContainer>
                            {rader.map((it, index) => (
                                <Tidslinjerad
                                    key={index}
                                    erAktiv={!!it.perioder.find((it) => it.id === aktivVedtaksperiode?.id)}
                                >
                                    {it.perioder.map((it, index) => (
                                        <Tidslinjeperiode
                                            key={index}
                                            id={it.id}
                                            style={it.style}
                                            className={it.tilstand}
                                            hoverLabel={
                                                it.hoverLabel ? (
                                                    <TidslinjeTooltip>{it.hoverLabel}</TidslinjeTooltip>
                                                ) : undefined
                                            }
                                            skalVisePin={it.skalVisePin}
                                            onClick={setAktivVedtaksperiode}
                                            erAktiv={it.id === aktivVedtaksperiode?.id}
                                        />
                                    ))}
                                </Tidslinjerad>
                            ))}
                        </RaderContainer>
                    </ArbeidsgiverContainer>
                ))}
                {infotrygdrader.map(({ arbeidsgivernavn, perioder }) => (
                    <ArbeidsgiverContainer key={arbeidsgivernavn}>
                        <Arbeidsgivernavn width={tidslinjeradOffset}>
                            <Infotrygdikon />
                            <TekstMedEllipsis data-tip={arbeidsgivernavn}>{arbeidsgivernavn}</TekstMedEllipsis>
                        </Arbeidsgivernavn>
                        <RaderContainer>
                            <Tidslinjerad erAktiv={false}>
                                {perioder.map((it) => (
                                    <Tidslinjeperiode
                                        key={it.id}
                                        id={it.id}
                                        style={it.style}
                                        skalVisePin={it.skalVisePin}
                                        className={it.tilstand}
                                        hoverLabel={<TidslinjeTooltip>{it.hoverLabel}</TidslinjeTooltip>}
                                    />
                                ))}
                            </Tidslinjerad>
                        </RaderContainer>
                    </ArbeidsgiverContainer>
                ))}
            </TidslinjeContainer>
            <Utsnittsvelger utsnitt={utsnitt} aktivtUtsnitt={aktivtUtsnitt} setAktivtUtsnitt={setAktivtUtsnitt} />
        </Container>
    );
};
