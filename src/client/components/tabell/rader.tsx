import React from 'react';
import styled from '@emotion/styled';
import { Dagtype, Kildetype, Overstyring, Sykdomsdag, Utbetalingsdag } from '../../context/types.internal';
import { NORSK_DATOFORMAT } from '../../utils/date';
import { IkonEgenmelding } from './ikoner/IkonEgenmelding';
import { IkonSyk } from './ikoner/IkonSyk';
import { IkonFerie } from './ikoner/IkonFerie';
import { toKronerOgØre } from '../../utils/locale';
import './rader.less';
import Normaltekst from 'nav-frontend-typografi/lib/normaltekst';
import { OverstyrbarDagtype } from './OverstyrbarDagtype';
import { OverstyrbarGradering } from './OverstyrbarGradering';
import { IkonOverstyrt } from './ikoner/IkonOverstyrt';
import { Overstyringsindikator } from '../Overstyringsindikator';

export const tomCelle = () => undefined;

export const dato = (dag: Sykdomsdag) => dag.dato.format(NORSK_DATOFORMAT);

const Overstyrtikon = styled(IkonOverstyrt)`
    display: flex;
`;

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

export const overstyrbarType = (
    dag: Sykdomsdag,
    onOverstyr: (dag: Sykdomsdag) => void,
    onFjernOverstyring: (dag: Sykdomsdag) => void
) =>
    dag.type !== Dagtype.Helg ? (
        <OverstyrbarDagtype dag={dag} onOverstyr={onOverstyr} onFjernOverstyring={onFjernOverstyring} />
    ) : (
        type(dag)
    );

const KildeLabel = styled.div`
    border: 1px solid #0067c5;
    padding: 1px 0.25rem;
    font-size: 14px;
    border-radius: 0.25rem;
    color: #0067c5;
    width: 28px;
    box-sizing: border-box;
`;

const KildeContainer = styled.div`
    display: flex;
    flex: 1;
`;

export const kilde = (dag: Sykdomsdag, overstyring?: Overstyring) => {
    if (dag.type === Dagtype.Helg) return null;
    const label = (() => {
        switch (dag.kilde) {
            case Kildetype.Sykmelding:
                return <KildeLabel>SM</KildeLabel>;
            case Kildetype.Søknad:
                return <KildeLabel>SØ</KildeLabel>;
            case Kildetype.Inntektsmelding:
                return <KildeLabel>IM</KildeLabel>;
            case Kildetype.Saksbehandler:
                return overstyring ? (
                    <Overstyringsindikator
                        begrunnelse={overstyring.begrunnelse}
                        saksbehandler={overstyring.saksbehandler}
                        dato={overstyring.timestamp}
                    />
                ) : (
                    <Overstyrtikon />
                );
            default:
                return null;
        }
    })();
    return <KildeContainer>{label}</KildeContainer>;
};

export const overstyrbarKilde = (dag: Sykdomsdag, erOverstyrt: boolean) =>
    erOverstyrt ? (
        <KildeContainer>
            <Overstyrtikon />
        </KildeContainer>
    ) : (
        kilde(dag)
    );

const skalViseGradering = (dag: Sykdomsdag) =>
    dag.gradering !== undefined && ![Dagtype.Helg, Dagtype.Arbeidsdag, Dagtype.Ferie].includes(dag.type);

export const gradering = (dag: Sykdomsdag) => (skalViseGradering(dag) ? `${dag.gradering}%` : undefined);

export const overstyrbarGradering = (
    dag: Sykdomsdag,
    onOverstyr: (dag: Sykdomsdag) => void,
    onFjernOverstyring: (dag: Sykdomsdag) => void
) =>
    skalViseGradering(dag) ? (
        <OverstyrbarGradering dag={dag} onOverstyr={onOverstyr} onFjernOverstyring={onFjernOverstyring} />
    ) : undefined;

const IngenUtbetaling = styled(Normaltekst)`
    white-space: nowrap;
`;

export const utbetaling = (dag: Utbetalingsdag) => {
    if (dag.type === Dagtype.Avvist) return <IngenUtbetaling>Ingen utbetaling</IngenUtbetaling>;
    return dag.utbetaling && `${toKronerOgØre(dag.utbetaling)} kr`;
};
