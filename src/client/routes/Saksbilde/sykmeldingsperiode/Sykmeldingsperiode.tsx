import React, { useContext } from 'react';
import styled from '@emotion/styled';
import Normaltekst from 'nav-frontend-typografi/lib/normaltekst';
import Navigasjonsknapper from '../../../components/NavigationButtons';
import { Tabell } from '@navikt/helse-frontend-tabell';
import { dato, gradering, ikon, kilde, type } from '../../../components/tabell/rader';
import { PersonContext } from '../../../context/PersonContext';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { NORSK_DATOFORMAT } from '../../../utils/date';
import '@navikt/helse-frontend-tabell/lib/main.css';
import Element from 'nav-frontend-typografi/lib/element';
import { Dagtype } from '../../../context/types.internal';

const Container = styled.div`
    padding: 1.5rem 2rem;

    .NavigationButtons {
        margin-top: 2.5rem;
    }
`;

export const Sykmeldingsperiode = () => {
    const { aktivVedtaksperiode } = useContext(PersonContext);
    const fom = aktivVedtaksperiode?.fom.format(NORSK_DATOFORMAT);
    const tom = aktivVedtaksperiode?.tom.format(NORSK_DATOFORMAT);
    const tabellbeskrivelse = `Sykmeldingsperiode fra ${fom} til ${tom}`;

    const headere = [
        '',
        {
            render: <Element>Sykmeldingsperiode</Element>,
            kolonner: 4,
        },
        {
            render: <Element>Gradering</Element>,
            kolonner: 2,
        },
    ];

    const rader =
        aktivVedtaksperiode?.sykdomstidslinje.map((dag) => ({
            celler: [undefined, dato(dag), ikon(dag), type(dag), kilde(dag), gradering(dag), kilde(dag)],
            className: dag.type === Dagtype.Helg ? 'disabled' : undefined,
        })) ?? [];

    return (
        <Container>
            <ErrorBoundary>
                {rader ? (
                    <Tabell beskrivelse={tabellbeskrivelse} headere={headere} rader={rader} />
                ) : (
                    <Normaltekst>Ingen data</Normaltekst>
                )}
            </ErrorBoundary>
            <Navigasjonsknapper />
        </Container>
    );
};

// enum Kildetypelabel {
//     Søknad = 'SØ',
//     Sykmelding = 'SM',
//     Inntektsmelding = 'IM',
// }

// const mapKilde = (type: Kildetype | undefined): Kilde | undefined => {
//     return type !== undefined ? { label: label(type) } : undefined;
// };

// const label = (type: Kildetype): Kildetypelabel => {
//     switch (type) {
//         case Kildetype.Sykmelding:
//             return Kildetypelabel.Sykmelding;
//         case Kildetype.Søknad:
//             return Kildetypelabel.Søknad;
//         case Kildetype.Inntektsmelding:
//             return Kildetypelabel.Inntektsmelding;
//     }
// };
