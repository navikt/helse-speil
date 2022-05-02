import styled from '@emotion/styled';
import React from 'react';
import { BodyShort } from '@navikt/ds-react';

import { LovdataLenke } from '@components/LovdataLenke';
import { Tooltip } from '@components/Tooltip';

import { CellContent } from '../../table/CellContent';

const Container = styled.span`
    display: flex;
    white-space: nowrap;
    gap: 0.25rem;
`;

interface MerknadProps {
    begrunnelse: Begrunnelse;
    alderVedSkjæringstidspunkt?: Maybe<number>;
}

const Merknad: React.VFC<MerknadProps> = ({ begrunnelse, alderVedSkjæringstidspunkt }) => {
    switch (begrunnelse) {
        case 'ETTER_DODSDATO':
            return <BodyShort>Personen er død</BodyShort>;
        case 'EGENMELDING_UTENFOR_ARBEIDSGIVERPERIODE':
            return (
                <Container data-tip="Egenmelding utenfor arbeidsgiverperioden">
                    <LovdataLenke paragraf="8-23">§ 8-23</LovdataLenke>
                </Container>
            );
        case 'MINIMUM_SYKDOMSGRAD':
            return (
                <Container data-tip="Sykdomsgrad under 20 %">
                    <LovdataLenke paragraf="8-13">§ 8-13</LovdataLenke>
                </Container>
            );
        case 'MINIMUM_INNTEKT': {
            const paragraf = (alderVedSkjæringstidspunkt ?? 0) >= 67 ? '8-51' : '8-3';
            return (
                <Container data-tip="Inntekt under krav til minste sykepengegrunnlag">
                    <LovdataLenke paragraf={paragraf}>§ {paragraf}</LovdataLenke>
                </Container>
            );
        }
        case 'MINIMUM_INNTEKT_OVER_67': {
            return (
                <Container data-tip="Inntekt under krav til minste sykepengegrunnlag">
                    <LovdataLenke paragraf="8-51">§ 8-51</LovdataLenke>
                </Container>
            );
        }
        case 'MANGLER_OPPTJENING':
            return (
                <Container data-tip="Krav til 4 ukers opptjening er ikke oppfylt">
                    <LovdataLenke paragraf="8-2">§ 8-2</LovdataLenke>
                </Container>
            );
        case 'MANGLER_MEDLEMSKAP':
            return (
                <Container data-tip="Krav til medlemskap er ikke oppfylt">
                    <LovdataLenke paragraf="8-2">§ 8-2</LovdataLenke>
                    <BodyShort> og </BodyShort>
                    <LovdataLenke paragraf="2-" harParagraf={false}>
                        kap. 2
                    </LovdataLenke>
                </Container>
            );
        case 'SYKEPENGEDAGER_OPPBRUKT_OVER_67':
            return (
                <Container data-tip="Maks antall sykepengedager er nådd">
                    <LovdataLenke paragraf="8-51">§ 8-51</LovdataLenke>
                </Container>
            );
        case 'SYKEPENGEDAGER_OPPBRUKT': {
            return (
                <Container data-tip="Maks antall sykepengedager er nådd">
                    <LovdataLenke paragraf="8-12">§ 8-12</LovdataLenke>
                </Container>
            );
        }
        case 'OVER_70':
            return (
                <Container data-tip="Personen er 70 år eller eldre">
                    <LovdataLenke paragraf="8-3">§ 8-3</LovdataLenke>
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

const avvisningsårsakerMerknad = (dag: UtbetalingstabellDag, alderVedSkjæringstidspunkt?: Maybe<number>) =>
    dag.begrunnelser?.map((begrunnelse, i) => (
        <React.Fragment key={i}>
            {i !== 0 && <BodyShort>,&nbsp;</BodyShort>}
            <Merknad begrunnelse={begrunnelse} alderVedSkjæringstidspunkt={alderVedSkjæringstidspunkt} />
        </React.Fragment>
    ));

interface MerknaderCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
    dag: UtbetalingstabellDag;
    alderVedSkjæringstidspunkt?: Maybe<number>;
}

export const MerknaderCell = ({ dag, alderVedSkjæringstidspunkt, ...rest }: MerknaderCellProps) => (
    <td {...rest}>
        <CellContent>
            {sisteUtbetalingsdagMerknad(dag.erMaksdato) ??
                foreldetDagMerknad(dag.erForeldet) ??
                avvisningsårsakerMerknad(dag, alderVedSkjæringstidspunkt)}
            <Tooltip effect="solid" />
        </CellContent>
    </td>
);
