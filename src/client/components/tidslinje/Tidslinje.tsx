import React, { CSSProperties, ReactNode, useState } from 'react';
import styled from '@emotion/styled';
import { LasterUtsnittsvelger, Utsnittsvelger } from './Utsnittsvelger';
import { useInfotrygdrader } from './useInfotrygdrader';
import { Flex, FlexColumn } from '../Flex';
import { Arbeidsgiver, Person } from 'internal-types';
import { AxisLabels, Pins } from '@navikt/helse-frontend-timeline/lib';
import '@navikt/helse-frontend-timeline/lib/main.css';
import { TekstMedEllipsis } from '../TekstMedEllipsis';
import { Arbeidsgiverikon } from '../ikoner/Arbeidsgiverikon';
import { Infotrygdikon } from '../ikoner/Infotrygdikon';
import { PinsTooltip } from './TidslinjeTooltip';
import { useTidslinjeutsnitt } from './useTidslinjeutsnitt';
import { maksdatoForPeriode, sisteValgbarePeriode } from '../../mapping/selectors';
import { Undertekst } from 'nav-frontend-typografi';
import { NORSK_DATOFORMAT } from '../../utils/date';
import { useTidslinjerader } from './useTidslinjerader';
import { useSkalAnonymiserePerson } from '../../state/person';
import { getAnonymArbeidsgiverForOrgnr } from '../../agurkdata';
import { Tidslinjerad } from './Tidslinjerad';
import NavFrontendChevron from 'nav-frontend-chevron';
import dayjs from 'dayjs';
import 'dayjs/locale/nb';
import { atom, useRecoilState, useRecoilValue } from 'recoil';

dayjs.locale('nb');

const aktivChevronState = atom<{ [organisasjonsnummer: string]: boolean }>({
    key: 'aktivChevronState',
    default: {},
});

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

interface ChevronProps {
    organisasjonsnummer: string;
}

const Chevron = ({ organisasjonsnummer }: ChevronProps) => {
    const [erAktiv, setErAktiv] = useRecoilState(aktivChevronState);

    const erDenneAktiv = erAktiv[organisasjonsnummer];

    const StyledChevron = styled(NavFrontendChevron)`
        align-content: flex-end;
        justify-self: end;
    `;

    return (
        <div
            onClick={() => {
                setErAktiv({
                    [organisasjonsnummer]: !erDenneAktiv,
                });
            }}
        >
            <StyledChevron type={erDenneAktiv ? 'ned' : 'høyre'} />
        </div>
    );
};

interface HorizontalOffsetProps {
    horizontalOffset: number;
}

interface AccordionProps {
    erSynlig: boolean;
}

const Accordion = styled.div<AccordionProps>`
    ${({ erSynlig }) =>
        erSynlig
            ? `
    display: initial;
    `
            : `    
    display: none;`}
`;

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

interface Props {
    person: Person;
}

export const Tidslinje = ({ person }: Props) => {
    const { utsnitt, aktivtUtsnitt, setAktivtUtsnitt } = useTidslinjeutsnitt(person);
    const anonymiseringEnabled = useSkalAnonymiserePerson();

    const erAktiv = useRecoilValue(aktivChevronState);

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
                    <AxisLabels start={fom.toDate()} slutt={tom.toDate()} direction="right" />
                </AxisLabelsContainer>
                <PinsContainer horizontalOffset={tidslinjeradOffset}>
                    <Pins start={fom.toDate()} slutt={tom.toDate()} direction="right" pins={pins()} />
                </PinsContainer>
                {tidslinjerader.map(({ id, navn, rader }) => (
                    <ArbeidsgiverContainer key={id}>
                        <Arbeidsgivernavn width={tidslinjeradOffset}>
                            <Arbeidsgiverikon />
                            <TekstMedEllipsis data-tip="Arbeidsgiver">{navn}</TekstMedEllipsis>
                            {rader.length > 1 && <Chevron organisasjonsnummer={id} />}
                        </Arbeidsgivernavn>
                        <RaderContainer>
                            <Tidslinjerad rad={rader[0]} index={0} erKlikkbar={true} />
                            <Accordion erSynlig={erAktiv[id]}>
                                {rader.slice(1).map((it, index) => (
                                    <Tidslinjerad rad={it} index={index} erKlikkbar={true} />
                                ))}
                            </Accordion>
                        </RaderContainer>
                    </ArbeidsgiverContainer>
                ))}
                {infotrygdrader.map((it, index) => (
                    <ArbeidsgiverContainer key={it.arbeidsgivernavn}>
                        <Arbeidsgivernavn width={tidslinjeradOffset}>
                            <Infotrygdikon />
                            <TekstMedEllipsis data-tip="Arbeidsgiver (Infotrygd)">
                                {it.arbeidsgivernavn}
                            </TekstMedEllipsis>
                        </Arbeidsgivernavn>
                        <RaderContainer>
                            <Tidslinjerad rad={it} index={index} erKlikkbar={false} />
                        </RaderContainer>
                    </ArbeidsgiverContainer>
                ))}
            </TidslinjeContainer>
            <Utsnittsvelger utsnitt={utsnitt} aktivtUtsnitt={aktivtUtsnitt} setAktivtUtsnitt={setAktivtUtsnitt} />
        </Container>
    );
};
