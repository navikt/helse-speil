import styled from '@emotion/styled';
import { Dagtype, Kildetype, Overstyring, Sykdomsdag, Utbetalingsdag } from 'internal-types';
import React from 'react';

import Normaltekst from 'nav-frontend-typografi/lib/normaltekst';

import { NORSK_DATOFORMAT } from '../../utils/date';

import { Kilde } from '../Kilde';
import { OverstyrbarDagtype } from './OverstyrbarDagtype';
import { OverstyrbarGradering } from './OverstyrbarGradering';
import { Overstyringsindikator } from './Overstyringsindikator';
import { IkonAnnullert } from './ikoner/IkonAnnullert';
import { IkonArbeidsdag } from './ikoner/IkonArbeidsdag';
import { IkonArbeidsgiverperiode } from './ikoner/IkonArbeidsgiverperiode';
import { IkonEgenmelding } from './ikoner/IkonEgenmelding';
import { IkonFerie } from './ikoner/IkonFerie';
import { IkonKryss } from './ikoner/IkonKryss';
import { IkonOverstyrt } from './ikoner/IkonOverstyrt';
import { IkonPermisjon } from './ikoner/IkonPermisjon';
import { IkonSyk } from './ikoner/IkonSyk';
import './rader.less';

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

const HøyrejustertTekst = styled(Normaltekst)`
    text-align: right;
    white-space: nowrap;
`;

const TypeContainer = styled.div`
    min-width: 8rem;
`;

export const ikonSyk = (syk: Sykdomsdag) => {
    return <IkonContainer>{ikon(syk)}</IkonContainer>;
};

const ikon = (dag: Sykdomsdag) => {
    switch (dag.type) {
        case Dagtype.Syk:
            return <IkonSyk />;
        case Dagtype.Ferie:
            return <IkonFerie />;
        case Dagtype.Permisjon:
            return <IkonPermisjon />;
        case Dagtype.Arbeidsdag:
            return <IkonArbeidsdag />;
        case Dagtype.Egenmelding:
            return <IkonEgenmelding />;
        case Dagtype.Arbeidsgiverperiode:
            return <IkonArbeidsgiverperiode />;
        case Dagtype.Annullert:
            return <IkonAnnullert />;
        case Dagtype.Avvist:
        case Dagtype.Foreldet:
            return <IkonKryss />;
        case Dagtype.Ubestemt:
        case Dagtype.Helg:
        default:
            return null;
    }
};

export const typeSyk = (syk: Sykdomsdag) => {
    return <TypeContainer>{syk.type}</TypeContainer>;
};

export const overstyrbarType = (dag: Sykdomsdag, erAGPDag: boolean, onOverstyr: (_: Sykdomsdag) => void) =>
    dag.type !== Dagtype.Helg && !erAGPDag ? <OverstyrbarDagtype dag={dag} onOverstyr={onOverstyr} /> : typeSyk(dag);

const KildeContainer = styled.div`
    display: flex;
    flex: 1;
`;

export const kilde = (dag: Sykdomsdag, overstyring?: Overstyring) => {
    if (dag.type === Dagtype.Helg) return null;
    const label = (() => {
        switch (dag.kilde) {
            case Kildetype.Sykmelding:
                return <Kilde>SM</Kilde>;
            case Kildetype.Søknad:
                return <Kilde>SØ</Kilde>;
            case Kildetype.Inntektsmelding:
                return <Kilde>IM</Kilde>;
            case Kildetype.Saksbehandler:
                return overstyring ? (
                    <Overstyringsindikator
                        begrunnelse={overstyring.begrunnelse}
                        saksbehandler={overstyring.saksbehandlerNavn}
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

export const overstyrbarKilde = (dag: Sykdomsdag, erAGPDag: boolean, erOverstyrt: boolean) =>
    erOverstyrt && !erAGPDag ? (
        <KildeContainer>
            <Overstyrtikon />
        </KildeContainer>
    ) : (
        kilde(dag)
    );

const skalViseGradering = (dag: Sykdomsdag) =>
    dag.gradering !== undefined &&
    dag.gradering !== null &&
    ![Dagtype.Helg, Dagtype.Arbeidsdag, Dagtype.Ferie, Dagtype.Permisjon].includes(dag.type);

export const gradering = (dag: Sykdomsdag) =>
    skalViseGradering(dag) ? <HøyrejustertTekst>{dag.gradering} %</HøyrejustertTekst> : undefined;

const skalViseTotalGradering = (dag: Utbetalingsdag) =>
    dag.totalGradering !== undefined &&
    dag.totalGradering !== null &&
    ![Dagtype.Helg, Dagtype.Arbeidsdag, Dagtype.Ferie, Dagtype.Permisjon].includes(dag.type);

export const totalGradering = (dag: Utbetalingsdag) =>
    skalViseTotalGradering(dag) ? <HøyrejustertTekst>{dag.totalGradering} %</HøyrejustertTekst> : undefined;

export const overstyrbarGradering = (dag: Sykdomsdag, erAGPDag: boolean, onOverstyr: (dag: Sykdomsdag) => void) =>
    skalViseGradering(dag) && !erAGPDag ? <OverstyrbarGradering dag={dag} onOverstyr={onOverstyr} /> : undefined;
