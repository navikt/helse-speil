import React, { useContext } from 'react';
import Navigasjonsknapper from '../../components/NavigationButtons';
import { Normaltekst } from 'nav-frontend-typografi';
import { PersonContext } from '../../context/PersonContext';
import styled from '@emotion/styled';
import { NORSK_DATOFORMAT } from '../../utils/date';
import { useMaksdato } from '../../hooks/useMaksdato';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { Tabell } from '@navikt/helse-frontend-tabell';
import { dato, gradering, ikon, type, utbetaling } from '../../components/tabell/rader';
import { Dagtype, Utbetalingsdag } from '../../context/types.internal';
import Element from 'nav-frontend-typografi/lib/element';
import Feilikon from '../../components/Ikon/Feilikon';
import classNames from 'classnames';

const Container = styled.div`
    padding: 1.5rem 2rem;

    .NavigationButtons {
        margin-top: 2.5rem;
    }
`;

// const status = (dag: Utbetalingsdag, maksdato?: Dayjs): Dagstatus | undefined =>
//     [Dagtype.Avvist, Dagtype.Foreldet].includes(dag.type)
//         ? Dagstatus.Inaktiv
//         : maksdato && dag.dato.isSame(maksdato, 'day')
//         ? Dagstatus.Feil
//         : undefined;
//
// const feilmelding = (dag: Utbetalingsdag, maksdato?: Dayjs) =>
//     maksdato && dag.dato.isSame(maksdato, 'day') ? 'Siste utbetalingsdag for sykepenger' : undefined;
//
// const gradering = (dag: Utbetalingsdag): number | undefined =>
//     (dag.type !== Dagtype.Helg && dag.type !== Dagtype.Ferie && dag.gradering) || undefined;

const Feilmeldingsikon = styled(Feilikon)`
    display: flex;
    margin-right: -1rem;
`;

const Feilmelding = styled(Normaltekst)`
    margin-left: 1rem;
`;

const Utbetalingsoversikt = () => {
    const { aktivVedtaksperiode } = useContext(PersonContext);
    const { maksdato } = useMaksdato();
    const fom = aktivVedtaksperiode?.fom.format(NORSK_DATOFORMAT);
    const tom = aktivVedtaksperiode?.tom.format(NORSK_DATOFORMAT);
    const tabellbeskrivelse = `Utbetalinger for sykmeldingsperiode fra ${fom} til ${tom}`;

    const headere = [
        '',
        {
            render: <Element>Sykmeldingsperiode</Element>,
            kolonner: 3,
        },
        <Element>Gradering</Element>,
        <Element>Utbetaling</Element>,
        '',
    ];

    const erMaksdato = (dag: Utbetalingsdag) => maksdato && dag.dato.isSame(maksdato, 'day');
    const erEtterMaksdato = (dag: Utbetalingsdag) => maksdato && dag.dato.isAfter(maksdato, 'day');

    const rader =
        aktivVedtaksperiode?.utbetalingstidslinje.map((dag) => ({
            celler: [
                erMaksdato(dag) ? <Feilmeldingsikon height={20} width={20} /> : undefined,
                dato(dag),
                ikon(dag),
                type(dag),
                gradering(dag),
                utbetaling(dag),
                erMaksdato(dag) ? <Feilmelding>Siste utbetalingsdag for sykepenger</Feilmelding> : undefined,
            ],
            className: classNames(
                erMaksdato(dag) && 'error',
                erEtterMaksdato(dag) && 'inactive',
                dag.type === Dagtype.Helg && 'disabled'
            ),
        })) ?? [];

    return (
        <Container>
            <ErrorBoundary>
                {rader ? (
                    <Tabell beskrivelse={tabellbeskrivelse} rader={rader} headere={headere} />
                ) : (
                    <Normaltekst>Ingen data</Normaltekst>
                )}
            </ErrorBoundary>
            <Navigasjonsknapper />
        </Container>
    );
};

export default Utbetalingsoversikt;
