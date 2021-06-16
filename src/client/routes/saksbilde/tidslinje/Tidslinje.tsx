import styled from '@emotion/styled';
import dayjs from 'dayjs';
import 'dayjs/locale/nb';
import { Arbeidsgiver, Person } from 'internal-types';
import React, { useState } from 'react';

import { AxisLabels } from '@navikt/helse-frontend-timeline/lib';
import '@navikt/helse-frontend-timeline/lib/main.css';

import { FlexColumn } from '../../../components/Flex';
import { usePersondataSkalAnonymiseres } from '../../../state/person';

import { getAnonymArbeidsgiverForOrgnr } from '../../../agurkdata';
import { Markeringer } from './Markeringer';
import { LasterUtsnittsvelger, Utsnittsvelger } from './Utsnittsvelger';
import { Rad } from './rader';
import { useInfotrygdrader } from './useInfotrygdrader';
import { useTidslinjerader } from './useTidslinjerader';
import { useTidslinjeutsnitt } from './useTidslinjeutsnitt';

dayjs.locale('nb');

const Container = styled(FlexColumn)`
    position: relative;
    padding: 24px 32px 16px 32px;
    border-bottom: 1px solid var(--navds-color-border);
    min-width: var(--speil-total-min-width);
    box-sizing: border-box;
    --tidslinje-rad-offset: 250px;
`;

const TidslinjeContainer = styled.div`
    position: relative;
    height: 100%;
    margin-bottom: 1rem;
`;

const AxisLabelsContainer = styled.div`
    margin-left: var(--tidslinje-rad-offset);
`;

const MarkeringerContainer = styled.div`
    position: absolute;
    top: 0;
    width: calc(100% - var(--tidslinje-rad-offset));
    height: 100%;
    left: var(--tidslinje-rad-offset);
`;

const RaderContainer = styled.div`
    > *:not(:last-of-type) {
        margin-bottom: 1.5rem;
    }
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

interface TidslinjeProps {
    person: Person;
}

export const Tidslinje = ({ person }: TidslinjeProps) => {
    const { utsnitt, aktivtUtsnitt, setAktivtUtsnitt } = useTidslinjeutsnitt(person);
    const anonymiseringEnabled = usePersondataSkalAnonymiseres();

    const fom = utsnitt[aktivtUtsnitt].fom;
    const tom = utsnitt[aktivtUtsnitt].tom;

    const tidslinjerader = useTidslinjerader(person, fom, tom, anonymiseringEnabled);
    const infotrygdrader = useInfotrygdrader(person, fom, tom, anonymiseringEnabled);

    const [ekspanderteRader, setEkspanderteRader] = useState<{ [key: string]: boolean }>({});

    const toggleEkspanderbarRad = (organisasjonsnummer: string) => {
        setEkspanderteRader((rader) => ({ ...rader, [organisasjonsnummer]: !rader[organisasjonsnummer] }));
    };

    return (
        <Container className="Tidslinje">
            <TidslinjeContainer>
                <AxisLabelsContainer>
                    <AxisLabels start={fom.toDate()} slutt={tom.toDate()} direction="right" />
                </AxisLabelsContainer>
                <MarkeringerContainer>
                    <Markeringer person={person} fom={fom} tom={tom} />
                </MarkeringerContainer>
                <RaderContainer>
                    {tidslinjerader.map(({ id, navn, rader }, i) => (
                        <Rad.Arbeidsgiver
                            key={i}
                            navn={navn}
                            id={id}
                            rader={rader}
                            erEkspandert={ekspanderteRader[id]}
                            toggleEkspanderbarRad={toggleEkspanderbarRad}
                        />
                    ))}
                    {infotrygdrader.map((it, i) => (
                        <Rad.Infotrygd key={i} rad={it} navn={it.arbeidsgivernavn} />
                    ))}
                </RaderContainer>
            </TidslinjeContainer>
            <Utsnittsvelger utsnitt={utsnitt} aktivtUtsnitt={aktivtUtsnitt} setAktivtUtsnitt={setAktivtUtsnitt} />
        </Container>
    );
};
