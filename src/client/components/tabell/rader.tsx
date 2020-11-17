import React from 'react';
import styled from '@emotion/styled';
import Normaltekst from 'nav-frontend-typografi/lib/normaltekst';
import { IkonSyk } from './ikoner/IkonSyk';
import { IkonFerie } from './ikoner/IkonFerie';
import { toKronerOgØre } from '../../utils/locale';
import { IkonOverstyrt } from './ikoner/IkonOverstyrt';
import { IkonEgenmelding } from './ikoner/IkonEgenmelding';
import { NORSK_DATOFORMAT } from '../../utils/date';
import { OverstyrbarDagtype } from './OverstyrbarDagtype';
import { OverstyrbarGradering } from './OverstyrbarGradering';
import { Overstyringsindikator } from '../Overstyringsindikator';
import { Dagtype, Kildetype, Overstyring, Sykdomsdag, Utbetalingsdag } from 'internal-types';
import { Kilde } from '../Kilde';
import './rader.less';
import { IkonAnnullert } from './ikoner/IkonAnnullert';
import { Feilikon } from '../ikoner/Feilikon';
import { IkonKryss } from './ikoner/IkonKryss';

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

const Utbetaling = styled(Normaltekst)`
    text-align: right;
`;

export const utbetaling = (dag: Utbetalingsdag) => {
    if (dag.type === Dagtype.Avvist) return <IngenUtbetaling>Ingen utbetaling</IngenUtbetaling>;
    return dag.utbetaling && <Utbetaling>{toKronerOgØre(dag.utbetaling)} kr</Utbetaling>;
};

export const merknad = (dag: Utbetalingsdag, merknadTekst?: string) => {
    if (merknadTekst) return <Feilmelding>{merknadTekst}</Feilmelding>;
    if (dag.type === Dagtype.Avvist) {
        const tekst = tekstForAvvistÅrsak(dag.avvistÅrsak);
        if (tekst) return <Feilmelding>{tekst}</Feilmelding>;
    }
    return undefined;
};

const tekstForAvvistÅrsak = (årsak?: string) => {
    switch (årsak) {
        case 'EtterDødsdato':
            return 'Personen er død';
        case 'SykepengedagerOppbrukt':
            return '§ 8-12 Sykepengedager er oppbrukt';
        case 'MinimumSykdomsgrad':
            return '§ 8-13 Krav til nedsatt arbeidsevne er ikke oppfylt';
        case 'EgenmeldingUtenforArbeidsgiverperiode':
            return 'Egenmelding er utenfor arbeidsgiverperiode';
        case 'MinimumInntekt':
            return '§ 8-3 Krav til minste sykepengegrunnlag er ikke oppfylt';
        default:
            return undefined;
    }
};

export const Feilmelding = styled(Normaltekst)`
    margin-left: 1rem;
`;

const Feilmeldingsikon = styled(Feilikon)`
    display: flex;
    margin-right: -1rem;
`;
