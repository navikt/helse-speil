import { AvvistBegrunnelse, Dagtype, Utbetalingsdag } from 'internal-types';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { LovdataLenke } from '../../../../components/LovdataLenke';
import { Tooltip } from '../../../../components/Tooltip';

import { CellContent } from '../../table/CellContent';

interface MerknadProps {
    begrunnelse: AvvistBegrunnelse;
}

const Merknad = ({ begrunnelse }: MerknadProps) => {
    switch (begrunnelse.tekst) {
        case 'EtterDødsdato':
            return <BodyShort>Personen er død</BodyShort>;
        case 'EgenmeldingUtenforArbeidsgiverperiode':
            return (
                <span data-tip="Egenmelding utenfor arbeidsgiverperioden">
                    <LovdataLenke paragraf="8-23">§ 8-23</LovdataLenke>
                </span>
            );
        case 'MinimumSykdomsgrad':
            return (
                <span data-tip="Sykdomsgrad under 20%">
                    <LovdataLenke paragraf="8-13">§ 8-13</LovdataLenke>
                </span>
            );
        case 'MinimumInntekt':
            return (
                <span data-tip="Over 70 år">
                    <LovdataLenke paragraf="8-3">§ 8-3</LovdataLenke>
                </span>
            );
        case 'ManglerOpptjening':
            return (
                <span data-tip="Krav til 4 ukers opptjening er ikke oppfylt">
                    <LovdataLenke paragraf="8-2">§ 8-2</LovdataLenke>
                </span>
            );
        case 'ManglerMedlemskap':
            return (
                <span data-tip="Krav til medlemskap er ikke oppfylt">
                    <LovdataLenke paragraf="8-2">§ 8-2</LovdataLenke>
                    <BodyShort> og </BodyShort>
                    <LovdataLenke paragraf="2-" harParagraf={false}>
                        kap. 2
                    </LovdataLenke>
                </span>
            );
        case 'SykepengedagerOppbrukt':
            return (
                <span data-tip="Maks antall sykepengedager er nådd">
                    <LovdataLenke paragraf={begrunnelse.paragraf ?? '8-12'}>
                        § {begrunnelse.paragraf ?? '8-12'}
                    </LovdataLenke>
                </span>
            );
        default:
            return null;
    }
};

const sisteUtbetalingsdagMerknad = (isMaksdato: boolean): React.ReactNode | undefined =>
    isMaksdato ? 'Siste utbetalingsdag for sykepenger' : undefined;

const foreldetDagMerknad = (isForeldet: boolean): React.ReactNode | undefined =>
    isForeldet ? (
        <span data-tip="Foreldet">
            <LovdataLenke paragraf="22-13">§ 22-13</LovdataLenke>
        </span>
    ) : undefined;

const avvisningsårsakerMerknad = (avvisningsårsaker?: AvvistBegrunnelse[]) =>
    avvisningsårsaker?.map((it, i) => (
        <React.Fragment key={i}>
            {i !== 0 && <BodyShort>,&nbsp;</BodyShort>}
            <Merknad begrunnelse={it} />
        </React.Fragment>
    ));

interface MerknaderCellProps extends React.HTMLAttributes<HTMLTableDataCellElement> {
    dag: Utbetalingsdag;
    isMaksdato: boolean;
}

export const MerknaderCell = ({ dag, isMaksdato, ...rest }: MerknaderCellProps) => (
    <td {...rest}>
        <CellContent>
            {sisteUtbetalingsdagMerknad(isMaksdato) ??
                foreldetDagMerknad(dag.type === Dagtype.Foreldet) ??
                avvisningsårsakerMerknad(dag.avvistÅrsaker)}
            <Tooltip effect="solid" />
        </CellContent>
    </td>
);
