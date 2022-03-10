import styled from '@emotion/styled';
import dayjs from 'dayjs';
import 'dayjs/locale/nb';
import React, { useState } from 'react';

import { AxisLabels } from '@navikt/helse-frontend-timeline/lib';
import '@navikt/helse-frontend-timeline/lib/main.css';

import { FlexColumn } from '@components/Flex';

import { Arbeidsgiverrad } from './Arbeidsgiverrad';
import { Markeringer } from './Markeringer';
import { LasterUtsnittsvelger, Utsnittsvelger } from './Utsnittsvelger';
import { useInfotrygdrader } from './useInfotrygdrader';
import { TidslinjeradObject, useTidslinjerader } from './useTidslinjerader';
import { useTidslinjeutsnitt } from './useTidslinjeutsnitt';
import { TidslinjeperiodeObject } from './Tidslinje.types';

dayjs.locale('nb');

const Container = styled(FlexColumn)`
    grid-area: tidslinje;
    padding: 24px 32px 16px 32px;
    border-bottom: 1px solid var(--navds-color-border);
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
    box-sizing: unset;
`;

const RaderContainer = styled.div`
    > *:not(:last-of-type) {
        margin-bottom: 1.5rem;
    }
`;

export const arbeidsgiverNavn = (arbeidsgiver: Arbeidsgiver): string => {
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

export type TidslinjeArbeidsgiver = {
    id: string;
    navn: string;
    rader: TidslinjeradObject[];
};

const finnArbeidsgivereKunIInfotrygd = (
    speilArbeidsgivere: TidslinjeArbeidsgiver[],
    infotrygdArbeidsgivere: TidslinjeradObject[]
): TidslinjeArbeidsgiver[] => {
    return infotrygdArbeidsgivere
        .filter((arbeidsgiver) => speilArbeidsgivere.find((annen) => annen.id === arbeidsgiver.id) === undefined)
        .map((arbeidsgiver) => {
            return {
                id: arbeidsgiver.id,
                navn: arbeidsgiver.arbeidsgiver,
                rader: [arbeidsgiver],
            } as TidslinjeArbeidsgiver;
        });
};

const overlapper = (periode: TidslinjeperiodeObject, other: TidslinjeperiodeObject) =>
    (periode.start.isSameOrAfter(other.start) && periode.start.isSameOrBefore(other.end)) ||
    (periode.end.isSameOrAfter(other.start) && periode.end.isSameOrBefore(other.end));

const overlapperSpeilOgInfotrygd = (
    speilArbeidsgiver: TidslinjeArbeidsgiver,
    infotrygdArbeidsgiver: TidslinjeradObject
) => {
    return infotrygdArbeidsgiver.perioder.some((infotrygdArbeidsgiverPeriode) => {
        return speilArbeidsgiver.rader[0].perioder.some((speilArbeidsgiverPeriode) =>
            overlapper(infotrygdArbeidsgiverPeriode, speilArbeidsgiverPeriode)
        );
    });
};

const leggInfotrygdArbeidsgivereTilSpeilArbeidsgivere = (
    speilArbeidsgivere: TidslinjeArbeidsgiver[],
    infotrygdArbeidsgivere: TidslinjeradObject[]
): TidslinjeArbeidsgiver[] =>
    speilArbeidsgivere.flatMap((speilArbeidsgiver) => {
        const infotrygdArbeidsgiver = infotrygdArbeidsgivere.find(
            (infotrygdArbeidsgiver) => infotrygdArbeidsgiver.id === speilArbeidsgiver.id
        );

        const visInfotrygdPåEgenRad =
            infotrygdArbeidsgiver !== undefined && overlapperSpeilOgInfotrygd(speilArbeidsgiver, infotrygdArbeidsgiver);

        if (visInfotrygdPåEgenRad) {
            return [
                { ...speilArbeidsgiver },
                {
                    id: infotrygdArbeidsgiver.id,
                    navn: infotrygdArbeidsgiver.arbeidsgiver,
                    rader: [
                        {
                            ...speilArbeidsgiver.rader[0],
                            perioder: infotrygdArbeidsgiver.perioder,
                        },
                    ],
                },
            ];
        } else if (infotrygdArbeidsgiver !== undefined) {
            return {
                ...speilArbeidsgiver,
                rader: speilArbeidsgiver.rader.map((rad, index) => {
                    return {
                        ...rad,
                        perioder: index === 0 ? rad.perioder.concat(infotrygdArbeidsgiver.perioder) : rad.perioder,
                    };
                }),
            };
        } else {
            return speilArbeidsgiver;
        }
    });

export const integrerInfotrygdPølserISpeilArbeidsgiverTidslinjer = (
    speilArbeidsgivere: TidslinjeArbeidsgiver[],
    infotrygdArbeidsgivere: TidslinjeradObject[]
): TidslinjeArbeidsgiver[] => {
    const arbeidsgiverKunIInfotrygd = finnArbeidsgivereKunIInfotrygd(speilArbeidsgivere, infotrygdArbeidsgivere);
    const arbeidsgivereISpeil = leggInfotrygdArbeidsgivereTilSpeilArbeidsgivere(
        speilArbeidsgivere,
        infotrygdArbeidsgivere
    );
    return [...arbeidsgivereISpeil, ...arbeidsgiverKunIInfotrygd];
};

export const Tidslinje = React.memo(({ person }: TidslinjeProps) => {
    const { utsnitt, aktivtUtsnitt, setAktivtUtsnitt } = useTidslinjeutsnitt(person);

    const fom = utsnitt[aktivtUtsnitt].fom;
    const tom = utsnitt[aktivtUtsnitt].tom;

    const speilArbeidsgivere = useTidslinjerader(person, fom, tom);
    const infotrygdArbeidsgivere = useInfotrygdrader(person, fom, tom);
    const arbeidsgivere = integrerInfotrygdPølserISpeilArbeidsgiverTidslinjer(
        speilArbeidsgivere,
        infotrygdArbeidsgivere
    );

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
                    {arbeidsgivere.map(({ id, navn, rader }, i) => (
                        <Arbeidsgiverrad
                            key={i}
                            navn={navn}
                            id={id}
                            rader={rader}
                            erEkspandert={ekspanderteRader[id]}
                            toggleEkspanderbarRad={toggleEkspanderbarRad}
                        />
                    ))}
                </RaderContainer>
            </TidslinjeContainer>
            <Utsnittsvelger utsnitt={utsnitt} aktivtUtsnitt={aktivtUtsnitt} setAktivtUtsnitt={setAktivtUtsnitt} />
        </Container>
    );
});
