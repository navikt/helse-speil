import React, { ReactElement } from 'react';

import { BodyShort, Tooltip } from '@navikt/ds-react';

import { Utbetalingstabelldag } from '@/routes/saksbilde/utbetaling/utbetalingstabell/types';
import { LovdataLenke } from '@components/LovdataLenke';
import { Begrunnelse } from '@io/graphql';
import { Maybe } from '@utils/ts';

import { CellContent } from '../../table/CellContent';

import styles from './MerknaderCell.module.css';

interface MerknadProps {
    begrunnelse: Begrunnelse;
    alderVedSkjæringstidspunkt?: Maybe<number>;
}

const Merknad = ({ begrunnelse, alderVedSkjæringstidspunkt }: MerknadProps): ReactElement | null => {
    switch (begrunnelse) {
        case 'ETTER_DODSDATO':
            return <BodyShort>Personen er død</BodyShort>;
        case 'EGENMELDING_UTENFOR_ARBEIDSGIVERPERIODE':
            return (
                <Tooltip content="Egenmelding utenfor arbeidsgiverperioden">
                    <span className={styles.container} data-testid="Egenmelding utenfor arbeidsgiverperioden">
                        <LovdataLenke paragraf="8-7">§ 8-7, 1. avsnitt</LovdataLenke>
                    </span>
                </Tooltip>
            );
        case 'MINIMUM_SYKDOMSGRAD':
            return (
                <Tooltip content="Sykdomsgrad under 20 %">
                    <span className={styles.container} data-testid="Sykdomsgrad under 20 %">
                        <LovdataLenke paragraf="8-13">§ 8-13</LovdataLenke>
                    </span>
                </Tooltip>
            );
        case 'MINIMUM_INNTEKT': {
            const paragraf = (alderVedSkjæringstidspunkt ?? 0) >= 67 ? '8-51' : '8-3';
            return (
                <Tooltip content="Inntekt under krav til minste sykepengegrunnlag">
                    <span className={styles.container} data-testid="Inntekt under krav til minste sykepengegrunnlag">
                        <LovdataLenke paragraf={paragraf}>§ {paragraf}</LovdataLenke>
                    </span>
                </Tooltip>
            );
        }
        case 'MINIMUM_INNTEKT_OVER_67': {
            return (
                <Tooltip content="Inntekt under krav til minste sykepengegrunnlag">
                    <span className={styles.container} data-testid="Inntekt under krav til minste sykepengegrunnlag">
                        <LovdataLenke paragraf="8-51">§ 8-51</LovdataLenke>
                    </span>
                </Tooltip>
            );
        }
        case 'MANGLER_OPPTJENING':
            return (
                <Tooltip content="Krav til 4 ukers opptjening er ikke oppfylt">
                    <span className={styles.container} data-testid="Krav til 4 ukers opptjening er ikke oppfylt">
                        <LovdataLenke paragraf="8-2">§ 8-2</LovdataLenke>
                    </span>
                </Tooltip>
            );
        case 'MANGLER_MEDLEMSKAP':
            return (
                <Tooltip content="Krav til medlemskap er ikke oppfylt">
                    <span className={styles.container} data-testid="Krav til medlemskap er ikke oppfylt">
                        <LovdataLenke paragraf="8-2">§ 8-2</LovdataLenke>
                        <BodyShort> og </BodyShort>
                        <LovdataLenke paragraf="2-" harParagraf={false}>
                            kap. 2
                        </LovdataLenke>
                    </span>
                </Tooltip>
            );
        case 'SYKEPENGEDAGER_OPPBRUKT_OVER_67':
            return (
                <Tooltip content="Maks antall sykepengedager er nådd">
                    <span className={styles.container} data-testid="Maks antall sykepengedager er nådd">
                        <LovdataLenke paragraf="8-51">§ 8-51</LovdataLenke>
                    </span>
                </Tooltip>
            );
        case 'SYKEPENGEDAGER_OPPBRUKT': {
            return (
                <Tooltip content="Maks antall sykepengedager er nådd">
                    <span className={styles.container} data-testid="Maks antall sykepengedager er nådd">
                        <LovdataLenke paragraf="8-12">§ 8-12</LovdataLenke>
                    </span>
                </Tooltip>
            );
        }
        case 'OVER_70':
            return (
                <Tooltip content="Personen er 70 år eller eldre">
                    <span className={styles.container} data-testid="Personen er 70 år eller eldre">
                        <LovdataLenke paragraf="8-3">§ 8-3</LovdataLenke>
                    </span>
                </Tooltip>
            );
        case 'ANDREYTELSER':
            return <BodyShort>Andre ytelser</BodyShort>;
        default:
            return null;
    }
};

const sisteUtbetalingsdagMerknad = (isMaksdato: boolean): string | undefined =>
    isMaksdato ? 'Siste utbetalingsdag for sykepenger' : undefined;

const foreldetDagMerknad = (isForeldet: boolean): React.ReactNode | undefined =>
    isForeldet ? (
        <Tooltip content="Foreldet">
            <span className={styles.container} data-testid="Foreldet">
                <LovdataLenke paragraf="22-13">§ 22-13</LovdataLenke>
            </span>
        </Tooltip>
    ) : undefined;

const avvisningsårsakerMerknad = (
    begrunnelser: Begrunnelse[] | null,
    alderVedSkjæringstidspunkt?: Maybe<number>,
): ReactElement[] | undefined =>
    begrunnelser?.map((begrunnelse, i) => (
        <React.Fragment key={i}>
            {i !== 0 && <BodyShort>,&nbsp;</BodyShort>}
            <Merknad begrunnelse={begrunnelse} alderVedSkjæringstidspunkt={alderVedSkjæringstidspunkt} />
        </React.Fragment>
    ));

interface MerknaderCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
    dag: Utbetalingstabelldag;
    alderVedSkjæringstidspunkt?: Maybe<number>;
}

export const MerknaderCell = ({ dag, alderVedSkjæringstidspunkt, ...rest }: MerknaderCellProps): ReactElement => (
    <td {...rest}>
        <CellContent>
            {sisteUtbetalingsdagMerknad(dag.erMaksdato) ??
                foreldetDagMerknad(dag.erForeldet) ??
                avvisningsårsakerMerknad(dag.begrunnelser ?? null, alderVedSkjæringstidspunkt)}
        </CellContent>
    </td>
);
