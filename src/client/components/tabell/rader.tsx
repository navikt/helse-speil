import React from 'react';
import styled from '@emotion/styled';
import { Dagtype, Sykdomsdag, Utbetalingsdag } from '../../context/types.internal';
import { NORSK_DATOFORMAT } from '../../utils/date';
import { IkonEgenmelding } from './ikoner/IkonEgenmelding';
import { IkonSyk } from './ikoner/IkonSyk';
import { IkonFerie } from './ikoner/IkonFerie';
import { toKronerOgØre } from '../../utils/locale';
import './rader.less';
import Normaltekst from 'nav-frontend-typografi/lib/normaltekst';

export const tomCelle = () => undefined;

export const dato = (dag: Sykdomsdag) => dag.dato.format(NORSK_DATOFORMAT);

const IkonContainer = styled.div`
    display: flex;
    align-items: center;
    height: 100%;
    margin-right: -1rem;
`;

export const ikon = (dag: Sykdomsdag) => {
    const ikon = (() => {
        switch (dag.type) {
            case Dagtype.Syk:
                return <IkonSyk />;
            case Dagtype.Ferie:
                return <IkonFerie />;
            case Dagtype.Arbeidsdag:
            case Dagtype.Egenmelding:
            case Dagtype.Arbeidsgiverperiode:
                return <IkonEgenmelding />;
            case Dagtype.Avvist:
            case Dagtype.Foreldet:
            case Dagtype.Ubestemt:
            case Dagtype.Helg:
            default:
                return null;
        }
    })();
    return <IkonContainer>{ikon}</IkonContainer>;
};

const TypeContainer = styled.div`
    min-width: 8rem;
`;

export const type = (dag: Sykdomsdag) => <TypeContainer>{dag.type}</TypeContainer>;

const KildeLabel = styled.div`
    border: 1px solid #0067c5;
    padding: 1px 0.25rem;
    font-size: 14px;
    border-radius: 0.25rem;
    color: #0067c5;
    margin-left: -1rem;
    width: max-content;
`;

export const kilde = (dag: Sykdomsdag) => {
    if (dag.type === Dagtype.Helg) return null;
    switch (dag.kilde) {
        case 'Sykmelding':
            return <KildeLabel>SM</KildeLabel>;
        case 'Søknad':
            return <KildeLabel>SØ</KildeLabel>;
        case 'Inntektsmelding':
            return <KildeLabel>IM</KildeLabel>;
        default:
            return null;
    }
};

export const gradering = (dag: Sykdomsdag) =>
    dag.gradering && dag.type !== Dagtype.Helg ? `${dag.gradering}%` : undefined;

const IngenUtbetaling = styled(Normaltekst)`
    white-space: nowrap;
`;

export const utbetaling = (dag: Utbetalingsdag) => {
    if (dag.type === Dagtype.Avvist) return <IngenUtbetaling>Ingen utbetaling</IngenUtbetaling>;
    return dag.utbetaling && `${toKronerOgØre(dag.utbetaling)} kr`;
};
