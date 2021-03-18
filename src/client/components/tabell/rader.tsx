import React, { ReactNode } from 'react';
import styled from '@emotion/styled';
import Normaltekst from 'nav-frontend-typografi/lib/normaltekst';
import { IkonSyk } from './ikoner/IkonSyk';
import { IkonFerie } from './ikoner/IkonFerie';
import { toKronerOgØre } from '../../utils/locale';
import { IkonOverstyrt } from './ikoner/IkonOverstyrt';
import { IkonEgenmelding } from './ikoner/IkonEgenmelding';
import { IkonArbeidsgiverperiode } from './ikoner/IkonArbeidsgiverperiode';
import { NORSK_DATOFORMAT } from '../../utils/date';
import { OverstyrbarDagtype } from './OverstyrbarDagtype';
import { OverstyrbarGradering } from './OverstyrbarGradering';
import { Overstyringsindikator } from './Overstyringsindikator';
import { Dagtype, Kildetype, Overstyring, Sykdomsdag, Utbetalingsdag } from 'internal-types';
import { Kilde } from '../Kilde';
import './rader.less';
import { IkonAnnullert } from './ikoner/IkonAnnullert';
import { IkonKryss } from './ikoner/IkonKryss';
import { IkonArbeidsdag } from './ikoner/IkonArbeidsdag';
import { IkonPermisjon } from './ikoner/IkonPermisjon';
import { LovdataLenke } from '../LovdataLenke';

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

const Feilmelding = styled(Normaltekst)`
    margin-left: 1rem;
`;

const TypeContainer = styled.div`
    min-width: 8rem;
`;

export const ikon = (dag: Sykdomsdag) => {
    const ikon = (() => {
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
    })();
    return <IkonContainer>{ikon}</IkonContainer>;
};

export const type = (dag: Sykdomsdag) => <TypeContainer>{dag.type}</TypeContainer>;

export const overstyrbarType = (dag: Sykdomsdag, onOverstyr: (dag: Sykdomsdag) => void) =>
    dag.type !== Dagtype.Helg ? <OverstyrbarDagtype dag={dag} onOverstyr={onOverstyr} /> : type(dag);

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

export const overstyrbarKilde = (dag: Sykdomsdag, erOverstyrt: boolean) =>
    erOverstyrt ? (
        <KildeContainer>
            <Overstyrtikon />
        </KildeContainer>
    ) : (
        kilde(dag)
    );

const skalViseGradering = (dag: Sykdomsdag) =>
    dag.gradering !== undefined &&
    ![Dagtype.Helg, Dagtype.Arbeidsdag, Dagtype.Ferie, Dagtype.Permisjon].includes(dag.type);

export const gradering = (dag: Sykdomsdag) =>
    skalViseGradering(dag) ? <HøyrejustertTekst>{dag.gradering} %</HøyrejustertTekst> : undefined;

const skalViseTotalGradering = (dag: Utbetalingsdag) =>
    dag.totalGradering !== undefined &&
    ![Dagtype.Helg, Dagtype.Arbeidsdag, Dagtype.Ferie, Dagtype.Permisjon].includes(dag.type);

export const totalGradering = (dag: Utbetalingsdag) =>
    skalViseTotalGradering(dag) ? <HøyrejustertTekst>{dag.totalGradering} %</HøyrejustertTekst> : undefined;

export const overstyrbarGradering = (dag: Sykdomsdag, onOverstyr: (dag: Sykdomsdag) => void) =>
    skalViseGradering(dag) ? <OverstyrbarGradering dag={dag} onOverstyr={onOverstyr} /> : undefined;

export const utbetaling = (dag: Utbetalingsdag) => {
    if (dag.type === Dagtype.Avvist) return <HøyrejustertTekst>-</HøyrejustertTekst>;
    return dag.utbetaling && <HøyrejustertTekst>{toKronerOgØre(dag.utbetaling)} kr</HøyrejustertTekst>;
};

export const merknad = (dag: Utbetalingsdag, merknadTekst?: string): ReactNode =>
    merknadTekst ? (
        <Feilmelding>{merknadTekst}</Feilmelding>
    ) : dag.type === Dagtype.Avvist ? (
        <AvvistÅrsak dag={dag} />
    ) : undefined;

const AvvistÅrsak = ({ dag }: { dag: Utbetalingsdag }) => {
    switch (dag.avvistÅrsak?.tekst) {
        case 'EtterDødsdato':
            return <Feilmelding>Personen er død</Feilmelding>;
        case 'SykepengedagerOppbrukt':
            return (
                <Feilmelding>
                    <LovdataLenke paragraf={dag.avvistÅrsak.paragraf ?? '8-12'}>
                        § {dag.avvistÅrsak.paragraf ?? '8-12'}
                    </LovdataLenke>{' '}
                    Sykepengedager er oppbrukt
                </Feilmelding>
            );
        case 'MinimumSykdomsgrad':
            return (
                <Feilmelding>
                    <LovdataLenke paragraf="8-13">§ 8-13</LovdataLenke> Krav til nedsatt arbeidsevne er ikke oppfylt
                </Feilmelding>
            );
        case 'EgenmeldingUtenforArbeidsgiverperiode':
            return <Feilmelding>Egenmelding er utenfor arbeidsgiverperiode</Feilmelding>;
        case 'MinimumInntekt':
            return (
                <Feilmelding>
                    <LovdataLenke paragraf="8-3">§ 8-3</LovdataLenke> Krav til minste sykepengegrunnlag er ikke oppfylt
                </Feilmelding>
            );
        default:
            return null;
    }
};
