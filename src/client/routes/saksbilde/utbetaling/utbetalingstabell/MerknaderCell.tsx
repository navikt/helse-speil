import styled from '@emotion/styled';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { LovdataLenke } from '../../../../components/LovdataLenke';
import { Tooltip } from '../../../../components/Tooltip';

import { CellContent } from '../../table/CellContent';
import { UtbetalingstabellDag } from './Utbetalingstabell.types';

const Container = styled.span`
    display: flex;
    white-space: nowrap;
    gap: 0.25rem;
`;

interface MerknadProps {
    begrunnelse: Avvisning;
    alderPåDagen?: number;
}

const Merknad: React.VFC<MerknadProps> = ({ begrunnelse, alderPåDagen }) => {
    console.log(alderPåDagen);
    switch (begrunnelse.tekst) {
        case 'EtterDødsdato':
            return <BodyShort>Personen er død</BodyShort>;
        case 'EgenmeldingUtenforArbeidsgiverperiode':
            return (
                <Container data-tip="Egenmelding utenfor arbeidsgiverperioden">
                    <LovdataLenke paragraf="8-23">§ 8-23</LovdataLenke>
                </Container>
            );
        case 'MinimumSykdomsgrad':
            return (
                <Container data-tip="Sykdomsgrad under 20%">
                    <LovdataLenke paragraf="8-13">§ 8-13</LovdataLenke>
                </Container>
            );
        case 'MinimumInntekt':
            return (
                <Container data-tip="Over 70 år">
                    <LovdataLenke paragraf="8-3">§ 8-3</LovdataLenke>
                </Container>
            );
        case 'ManglerOpptjening':
            return (
                <Container data-tip="Krav til 4 ukers opptjening er ikke oppfylt">
                    <LovdataLenke paragraf="8-2">§ 8-2</LovdataLenke>
                </Container>
            );
        case 'ManglerMedlemskap':
            return (
                <Container data-tip="Krav til medlemskap er ikke oppfylt">
                    <LovdataLenke paragraf="8-2">§ 8-2</LovdataLenke>
                    <BodyShort> og </BodyShort>
                    <LovdataLenke paragraf="2-" harParagraf={false}>
                        kap. 2
                    </LovdataLenke>
                </Container>
            );
        case 'SykepengedagerOppbrukt':
            return (
                <Container data-tip="Maks antall sykepengedager er nådd">
                    <LovdataLenke paragraf={begrunnelse.paragraf ?? '8-12'}>
                        § {begrunnelse.paragraf ?? '8-12'}
                    </LovdataLenke>
                </Container>
            );
        default:
            return null;
    }
};

const sisteUtbetalingsdagMerknad = (isMaksdato: boolean): React.ReactNode | undefined =>
    isMaksdato ? 'Siste utbetalingsdag for sykepenger' : undefined;

const foreldetDagMerknad = (isForeldet: boolean): React.ReactNode | undefined =>
    isForeldet ? (
        <Container data-tip="Foreldet">
            <LovdataLenke paragraf="22-13">§ 22-13</LovdataLenke>
        </Container>
    ) : undefined;

const avvisningsårsakerMerknad = (dag: UtbetalingstabellDag) =>
    dag.avvistÅrsaker?.map((it, i) => (
        <React.Fragment key={i}>
            {i !== 0 && <BodyShort>,&nbsp;</BodyShort>}
            <Merknad begrunnelse={it} alderPåDagen={dag.alderPåDagen} />
        </React.Fragment>
    ));

interface MerknaderCellProps extends React.HTMLAttributes<HTMLTableDataCellElement> {
    dag: UtbetalingstabellDag;
    isMaksdato: boolean;
}

export const MerknaderCell = ({ dag, isMaksdato, ...rest }: MerknaderCellProps) => (
    <td {...rest}>
        <CellContent>
            {sisteUtbetalingsdagMerknad(isMaksdato) ??
                foreldetDagMerknad(dag.type === 'Foreldet') ??
                avvisningsårsakerMerknad(dag)}
            <Tooltip effect="solid" />
        </CellContent>
    </td>
);
