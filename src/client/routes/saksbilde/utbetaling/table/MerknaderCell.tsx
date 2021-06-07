import { AvvistBegrunnelse, Utbetalingsdag } from 'internal-types';
import React from 'react';

import { Normaltekst } from 'nav-frontend-typografi';

import { LovdataLenke } from '../../../../components/LovdataLenke';
import { Tooltip } from '../../../../components/Tooltip';

import { CellContainer } from './CellContainer';

interface MerknadProps {
    begrunnelse: AvvistBegrunnelse;
}

const Merknad = ({ begrunnelse }: MerknadProps) => {
    switch (begrunnelse.tekst) {
        case 'EtterDødsdato':
            return <Normaltekst>Personen er død</Normaltekst>;
        case 'EgenmeldingUtenforArbeidsgiverperiode':
            return <Normaltekst>Egenmelding er utenfor arbeidsgiverperiode</Normaltekst>;
        case 'MinimumSykdomsgrad':
            return (
                <span data-tip="Krav til nedsatt arbeidsevne er ikke oppfylt">
                    <LovdataLenke paragraf="8-13">§ 8-13</LovdataLenke>
                </span>
            );
        case 'MinimumInntekt':
            return (
                <span data-tip="Krav til minste sykepengegrunnlag er ikke oppfylt">
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
                    <Normaltekst> og </Normaltekst>
                    <LovdataLenke paragraf="2-" harParagraf={false}>
                        kap. 2
                    </LovdataLenke>
                </span>
            );
        case 'SykepengedagerOppbrukt':
            return (
                <span data-tip="Sykepengedager er oppbrukt">
                    <LovdataLenke paragraf={begrunnelse.paragraf ?? '8-12'}>
                        § {begrunnelse.paragraf ?? '8-12'}
                    </LovdataLenke>
                </span>
            );
        default:
            return null;
    }
};

interface MerknaderCellProps extends React.HTMLAttributes<HTMLTableDataCellElement> {
    dag: Utbetalingsdag;
    isMaksdato: boolean;
}

export const MerknaderCell = ({ dag, isMaksdato, ...rest }: MerknaderCellProps) => (
    <td {...rest}>
        <CellContainer>
            {isMaksdato
                ? 'Siste utbetalingsdag for sykepenger'
                : dag.avvistÅrsaker?.map((it, i) => (
                      <React.Fragment key={i}>
                          {i !== 0 && <Normaltekst>,&nbsp;</Normaltekst>}
                          <Merknad begrunnelse={it} />
                      </React.Fragment>
                  ))}
            <Tooltip effect="solid" />
        </CellContainer>
    </td>
);
