import styles from './Utbetalingshistorikk.module.scss';
import dayjs from 'dayjs';
import React from 'react';

import { Button } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { Arbeidsgiveroppdrag, Oppdrag, Personoppdrag, Spennoppdrag } from '@io/graphql';
import { NORSK_DATOFORMAT_KORT } from '@utils/date';
import { somPenger } from '@utils/locale';

import { getTom } from './utbetalingshistorikkUtils';

const getFom = (oppdrag: Spennoppdrag): Dayjs | undefined =>
    oppdrag.linjer.length > 0
        ? oppdrag.linjer.reduce((first, { fom }) => (first.isAfter(dayjs(fom)) ? dayjs(fom) : first), dayjs())
        : undefined;

const isPersonoppdrag = (oppdrag: Spennoppdrag): oppdrag is Personoppdrag =>
    (oppdrag as Personoppdrag).fodselsnummer !== undefined;

interface UtbetalingshistorikkRowProps {
    oppdrag: Personoppdrag | Arbeidsgiveroppdrag;
    status: Oppdrag['status'];
    type: Oppdrag['type'];
    setTilAnnullering: () => void;
    kanAnnulleres: boolean;
    oppdaterVarselTekst: () => void;
    visAnnullering: boolean;
}

export const UtbetalingshistorikkRow: React.FC<UtbetalingshistorikkRowProps> = ({
    oppdrag,
    status,
    type,
    kanAnnulleres,
    setTilAnnullering,
    oppdaterVarselTekst,
    visAnnullering,
}) => {
    const fom = getFom(oppdrag);
    const tom = getTom(oppdrag);
    const totalt = oppdrag.linjer.reduce((sum, { totalbelop }) => sum + (totalbelop ?? 0), 0);
    const mottaker = isPersonoppdrag(oppdrag) ? oppdrag.fodselsnummer : oppdrag.organisasjonsnummer;

    return (
        <tr>
            <td className={styles.cell}>
                <Bold>{fom?.format(NORSK_DATOFORMAT_KORT) ?? '-'}</Bold>
            </td>
            <td className={styles.cell}>
                <Bold>{tom?.format(NORSK_DATOFORMAT_KORT) ?? '-'}</Bold>
            </td>
            <td className={styles.cell}>
                <Bold>{oppdrag.fagsystemId}</Bold>
            </td>
            <td className={styles.cell}>
                <Bold>{mottaker}</Bold>
            </td>
            <td className={styles.cell}>
                <Bold>{somPenger(totalt)}</Bold>
            </td>
            <td className={styles.cell}>
                <Bold>{status}</Bold>
            </td>
            <td className={styles.cell}>
                <Bold>{type}</Bold>
            </td>
            <td className={styles.cell}>
                {visAnnullering && (
                    <AnnulleringButton
                        kanAnnulleres={kanAnnulleres}
                        setTilAnnullering={setTilAnnullering}
                        setVarseltekst={oppdaterVarselTekst}
                    />
                )}
            </td>
        </tr>
    );
};

interface AnnulleringButtonProps {
    setTilAnnullering: () => void;
    kanAnnulleres: boolean;
    setVarseltekst: () => void;
}

const AnnulleringButton = ({ setTilAnnullering, kanAnnulleres, setVarseltekst }: AnnulleringButtonProps) => (
    <Button
        size="small"
        onClick={() => {
            if (!kanAnnulleres) setVarseltekst();
            setTilAnnullering();
        }}
    >
        Annuller
    </Button>
);
