import React, { useContext, useState } from 'react';
import styled from '@emotion/styled';
import Normaltekst from 'nav-frontend-typografi/lib/normaltekst';
import Navigasjonsknapper from '../../components/NavigationButtons';
import { Tabell } from '@navikt/helse-frontend-tabell';
import { dato, gradering, ikon, kilde, type } from '../../components/tabell/rader';
import { PersonContext } from '../../context/PersonContext';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { NORSK_DATOFORMAT } from '../../utils/date';
import '@navikt/helse-frontend-tabell/lib/main.css';
import Element from 'nav-frontend-typografi/lib/element';
import { Dagtype } from '../../context/types.internal';
import { IkonLukketLås } from '../../components/tabell/ikoner/IkonLukketLås';
import { IkonÅpenLås } from '../../components/tabell/ikoner/IkonÅpenLås';
import { Select } from '../../components/Select';
import { overstyrbareTabellerEnabled } from '../../featureToggles';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1.5rem 2rem;

    .NavigationButtons {
        margin-top: 2.5rem;
    }
`;

const RedigerKnapp = styled.button`
    border: none;
    background: none;
    display: flex;
    align-items: flex-end;
    outline: none;
    cursor: pointer;
    color: #0067c5;
    font-size: 1rem;
    font-family: inherit;
    align-self: flex-end;

    > svg {
        margin-right: 0.25rem;
    }

    &:focus,
    &:hover {
        text-decoration: underline;
    }
`;

const OverstyrbarSelect = styled(Select)`
    font-size: 14px;
    padding: 3px 12px 3px 8px;
`;

interface OverstyrbarDagtypeProps {
    defaultDagtype: Dagtype;
}

const valgbareDager = [Dagtype.Syk, Dagtype.Ferie, Dagtype.Arbeidsdag, Dagtype.Egenmelding];

const OverstyrbarDagtype = ({ defaultDagtype }: OverstyrbarDagtypeProps) => {
    return (
        <OverstyrbarSelect defaultValue={defaultDagtype}>
            {Object.values(Dagtype).map((dagtype) => (
                <option key={dagtype} disabled={!valgbareDager.includes(dagtype) && dagtype !== defaultDagtype}>
                    {dagtype}
                </option>
            ))}
        </OverstyrbarSelect>
    );
};

export const Sykmeldingsperiode = () => {
    const { aktivVedtaksperiode } = useContext(PersonContext);
    const [overstyrer, setOverstyrer] = useState(false);
    const [overstyrteDager, setOverstyrteDager] = useState([]);

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
            celler: [
                undefined,
                dato(dag),
                ikon(dag),
                overstyrer && dag.type !== Dagtype.Helg ? <OverstyrbarDagtype defaultDagtype={dag.type} /> : type(dag),
                kilde(dag),
                gradering(dag),
                kilde(dag),
            ],
            className: dag.type === Dagtype.Helg ? 'disabled' : undefined,
        })) ?? [];

    return (
        <Container>
            <ErrorBoundary>
                {rader ? (
                    <>
                        {overstyrbareTabellerEnabled && (
                            <RedigerKnapp onClick={() => setOverstyrer((r) => !r)}>
                                {overstyrer ? (
                                    <>
                                        <IkonÅpenLås />
                                        Lukk
                                    </>
                                ) : (
                                    <>
                                        <IkonLukketLås />
                                        Overstyre
                                    </>
                                )}
                            </RedigerKnapp>
                        )}
                        <Tabell beskrivelse={tabellbeskrivelse} headere={headere} rader={rader} />
                    </>
                ) : (
                    <Normaltekst>Ingen data</Normaltekst>
                )}
            </ErrorBoundary>
            <Navigasjonsknapper />
        </Container>
    );
};
