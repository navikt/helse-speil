import React from 'react';
import styled from '@emotion/styled';
import { somPenger } from '../../utils/locale';
import { Normaltekst } from 'nav-frontend-typografi';
import { Dagtype, Person, Vedtaksperiode, Vedtaksperiodetilstand } from 'internal-types';

const Container = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    margin: 2px 0;
`;

const Tekster = styled.div`
    display: flex;
    align-items: baseline;
    padding: 2px 0;

    > *:not(:last-child) {
        margin-right: 12px;
    }
`;

const Vertikal = styled.div`
    height: 22px;
    border-left: 1px solid #c6c2bf;
    transform: translateY(25%);
`;

const Separator = styled.hr`
    flex: 1;
    border: none;
    width: 100%;
    border-bottom: 1px solid #c6c2bf;
`;

const Tekst = styled(Normaltekst)`
    font-size: 18px;
`;

const Bold = styled(Tekst)`
    font-weight: 600;
`;

const antallDagerAvType = (type: Dagtype) => (totalt: number, periode: Vedtaksperiode) =>
    totalt + periode.utbetalingstidslinje.filter((dag) => dag.type === type).length;

const antallUtbetalingsdager = antallDagerAvType(Dagtype.Syk);

const antallFeriedager = antallDagerAvType(Dagtype.Ferie);

export const sykepengedager = (person: Person): number =>
    person.arbeidsgivere[0].vedtaksperioder
        .filter((periode: Vedtaksperiode) => periode.utbetalingstidslinje)
        .reduce(antallUtbetalingsdager, 0);

export const feriedager = (person: Person): number =>
    person.arbeidsgivere[0].vedtaksperioder
        .filter((periode: Vedtaksperiode) => periode.utbetalingstidslinje)
        .reduce(antallFeriedager, 0);

export const utbetalt = (person: Person): number =>
    person.arbeidsgivere
        .flatMap((arbeidsgiver) => arbeidsgiver.vedtaksperioder)
        .filter((periode: Vedtaksperiode) => periode.tilstand === Vedtaksperiodetilstand.Utbetalt)
        .flatMap((periode: Vedtaksperiode) => periode.utbetalingstidslinje)
        .reduce((totalt, dag) => totalt + (dag.utbetaling ?? 0), 0);

interface SammendragProps {
    person: Person;
}

export const Sammendrag = ({ person }: SammendragProps) => (
    <Container>
        <Tekster>
            <Bold>TOTAL:</Bold>
            <Tekst>Sykepengedager:</Tekst>
            <Bold>{sykepengedager(person)}</Bold>
            <Vertikal />
            <Tekst>Feriedager:</Tekst>
            <Bold>{feriedager(person)}</Bold>
            <Vertikal />
            <Tekst>Utbetalt:</Tekst>
            <Bold>{somPenger(utbetalt(person))}</Bold>
        </Tekster>
        <Separator />
    </Container>
);
