import React, { ReactElement } from 'react';

import { BodyShort, Link, Table, Tooltip } from '@navikt/ds-react';

import { Endringstrekant } from '@components/Endringstrekant';
import { LovdataLenke } from '@components/LovdataLenke';
import { ApiGraderteAndreYtelserDag } from '@io/rest/generated/andre-ytelser/andre-ytelser.schemas';
import { ApiBegrunnelse, ApiLøpendeVilkår, ApiUtfallAvLøpendeVilkår } from '@io/rest/generated/spesialist.schemas';
import { CellContent } from '@saksbilde/table/CellContent';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';

import { visningstekstForGradertAnnenYtelse } from './utbetalingstabelldager';

import styles from './MerknaderCell.module.css';

interface MerknadProps {
    begrunnelse: ApiBegrunnelse;
    alderVedSkjæringstidspunkt?: number | null;
}

const Merknad = ({ begrunnelse, alderVedSkjæringstidspunkt }: MerknadProps): ReactElement | null => {
    switch (begrunnelse) {
        case 'ETTER_DODSDATO':
            return <BodyShort>Personen er død</BodyShort>;
        case 'EGENMELDING_UTENFOR_ARBEIDSGIVERPERIODE':
            return (
                <span className={styles.container} data-testid="Egenmelding utenfor arbeidsgiverperioden">
                    <Tooltip content="Egenmelding utenfor arbeidsgiverperioden" describesChild>
                        <LovdataLenke paragraf="8-7">§ 8-7, 1. avsnitt</LovdataLenke>
                    </Tooltip>
                </span>
            );
        case 'MINIMUM_SYKDOMSGRAD':
            return (
                <span className={styles.container} data-testid="Sykdomsgrad under 20 %">
                    <Tooltip content="Sykdomsgrad under 20 %" describesChild>
                        <LovdataLenke paragraf="8-13">§ 8-13</LovdataLenke>
                    </Tooltip>
                </span>
            );
        case 'MINIMUM_INNTEKT': {
            const paragraf = (alderVedSkjæringstidspunkt ?? 0) >= 67 ? '8-51' : '8-3';
            return (
                <span className={styles.container} data-testid="Inntekt under krav til minste sykepengegrunnlag">
                    <Tooltip content="Inntekt under krav til minste sykepengegrunnlag" describesChild>
                        <LovdataLenke paragraf={paragraf}>§ {paragraf}</LovdataLenke>
                    </Tooltip>
                </span>
            );
        }
        case 'MINIMUM_INNTEKT_OVER_67': {
            return (
                <span className={styles.container} data-testid="Inntekt under krav til minste sykepengegrunnlag">
                    <Tooltip content="Inntekt under krav til minste sykepengegrunnlag" describesChild>
                        <LovdataLenke paragraf="8-51">§ 8-51</LovdataLenke>
                    </Tooltip>
                </span>
            );
        }
        case 'MANGLER_OPPTJENING':
            return (
                <span className={styles.container} data-testid="Krav til 4 ukers opptjening er ikke oppfylt">
                    <Tooltip content="Krav til 4 ukers opptjening er ikke oppfylt" describesChild>
                        <LovdataLenke paragraf="8-2">§ 8-2</LovdataLenke>
                    </Tooltip>
                </span>
            );
        case 'MANGLER_MEDLEMSKAP':
            return (
                <Tooltip content="Krav til medlemskap er ikke oppfylt" describesChild>
                    <span className={styles.container} data-testid="Krav til medlemskap er ikke oppfylt">
                        <LovdataLenke paragraf="8-2">§ 8-2</LovdataLenke>
                        <BodyShort> og </BodyShort>
                        <Link target="_blank" href="https://lovdata.no/pro/#document/NL/lov/1997-02-28-19/KAPITTEL_1-2">
                            kap. 2
                        </Link>
                    </span>
                </Tooltip>
            );
        case 'SYKEPENGEDAGER_OPPBRUKT_OVER_67':
            return (
                <span className={styles.container} data-testid="Maks antall sykepengedager er nådd">
                    <Tooltip content="Maks antall sykepengedager er nådd" describesChild>
                        <LovdataLenke paragraf="8-51">§ 8-51</LovdataLenke>
                    </Tooltip>
                </span>
            );
        case 'SYKEPENGEDAGER_OPPBRUKT': {
            return (
                <span className={styles.container} data-testid="Maks antall sykepengedager er nådd">
                    <Tooltip content="Maks antall sykepengedager er nådd" describesChild>
                        <LovdataLenke paragraf="8-12">§ 8-12</LovdataLenke>
                    </Tooltip>
                </span>
            );
        }
        case 'OVER_70':
            return (
                <span className={styles.container} data-testid="Personen er 70 år eller eldre">
                    <Tooltip content="Personen er 70 år eller eldre" describesChild>
                        <LovdataLenke paragraf="8-3">§ 8-3</LovdataLenke>
                    </Tooltip>
                </span>
            );
        case 'OPPHOLDSKRAV':
            return <OppholdskravMerknad tekst="Krav til opphold er ikke oppfylt" />;
        case 'MELDING_TIL_NAV_DAG_UTENFOR_VENTETID':
            return <BodyShort>Utenfor ventetid</BodyShort>;
        case 'AVSLATT_MELDING_TIL_NAV_DAG':
            return <BodyShort>Avslått av saksbehandler</BodyShort>;
        case 'ANDREYTELSER':
            return <BodyShort>Andre ytelser</BodyShort>;
        default:
            return null;
    }
};

const sisteUtbetalingsdagMerknad = (isMaksdato: boolean): string | null =>
    isMaksdato ? 'Siste utbetalingsdag for sykepenger' : null;

const foreldetDagMerknad = (isForeldet: boolean): ReactElement | null =>
    isForeldet ? (
        <span className={styles.container} data-testid="Foreldet">
            <Tooltip content="Foreldet" describesChild>
                <LovdataLenke paragraf="22-13">§ 22-13</LovdataLenke>
            </Tooltip>
        </span>
    ) : null;

const avvisningsårsakerMerknad = (
    begrunnelser: ApiBegrunnelse[] | null,
    alderVedSkjæringstidspunkt?: number | null,
): ReactElement[] | undefined =>
    begrunnelser?.map((begrunnelse, i) => (
        <React.Fragment key={i}>
            {i !== 0 && <BodyShort>,&nbsp;</BodyShort>}
            <Merknad begrunnelse={begrunnelse} alderVedSkjæringstidspunkt={alderVedSkjæringstidspunkt} />
        </React.Fragment>
    ));

function graderteAndreYtelserMerknad(
    graderteAndreYtelserDag?: ApiGraderteAndreYtelserDag,
    endredeYtelser?: string[],
): string | null {
    const ytelsetyper = endredeYtelser ?? Object.keys(graderteAndreYtelserDag?.andreYtelserGrader ?? {});
    const ytelser = ytelsetyper.map((ytelse) => visningstekstForGradertAnnenYtelse(ytelse).toLowerCase());
    if (ytelser.length === 0) return null;
    const tekst = ytelser.join(', ');
    return tekst.charAt(0).toUpperCase() + tekst.slice(1);
}

function harSammeYtelser(graderteAndreYtelserDag: ApiGraderteAndreYtelserDag | undefined, ytelser: string[]): boolean {
    const lagredeYtelser = Object.keys(graderteAndreYtelserDag?.andreYtelserGrader ?? {});
    return lagredeYtelser.length === ytelser.length && ytelser.every((ytelse) => lagredeYtelser.includes(ytelse));
}

function harAndreMerknader(dag: Utbetalingstabelldag): boolean {
    return dag.erMaksdato || dag.erForeldet || (dag.begrunnelser?.length ?? 0) > 0;
}

interface MerknaderCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
    dag: Utbetalingstabelldag;
    alderVedSkjæringstidspunkt?: number | null;
    graderteAndreYtelserDag?: ApiGraderteAndreYtelserDag;
    endredeYtelser?: string[];
}

export const MerknaderCell = ({
    dag,
    alderVedSkjæringstidspunkt,
    graderteAndreYtelserDag,
    endredeYtelser,
    ...rest
}: MerknaderCellProps): ReactElement => {
    const andreYtelserMerknad = graderteAndreYtelserMerknad(graderteAndreYtelserDag, endredeYtelser);
    const ytelseErEndret = !!endredeYtelser && !harSammeYtelser(graderteAndreYtelserDag, endredeYtelser);
    const oppholdskravOppfylt = erOppholdskravOppfylt(dag);
    return (
        <Table.DataCell {...rest}>
            {ytelseErEndret && <Endringstrekant />}
            <CellContent>
                {sisteUtbetalingsdagMerknad(dag.erMaksdato) ??
                    foreldetDagMerknad(dag.erForeldet) ??
                    avvisningsårsakerMerknad(dag.begrunnelser ?? null, alderVedSkjæringstidspunkt)}
                {oppholdskravOppfylt && (
                    <>
                        {harAndreMerknader(dag) && <BodyShort>,&nbsp;</BodyShort>}
                        <OppholdskravMerknad tekst="Krav til opphold er oppfylt" />
                    </>
                )}
                {andreYtelserMerknad && (
                    <BodyShort>
                        {(harAndreMerknader(dag) || oppholdskravOppfylt) && ', '}
                        {andreYtelserMerknad}
                    </BodyShort>
                )}
            </CellContent>
        </Table.DataCell>
    );
};

function OppholdskravMerknad({ tekst }: { tekst: string }): ReactElement {
    return (
        <span className={styles.container} data-testid={tekst}>
            <Tooltip content={tekst} describesChild>
                <LovdataLenke paragraf="8-9">§ 8-9</LovdataLenke>
            </Tooltip>
        </span>
    );
}

function erOppholdskravOppfylt(dag: Utbetalingstabelldag): boolean {
    return (
        dag.vurderingerAvLøpendeVilkår?.some(
            (vurdering) =>
                vurdering.vilkår === ApiLøpendeVilkår.OPPHOLDSKRAV &&
                vurdering.utfall === ApiUtfallAvLøpendeVilkår.OPPFYLT,
        ) ?? false
    );
}
