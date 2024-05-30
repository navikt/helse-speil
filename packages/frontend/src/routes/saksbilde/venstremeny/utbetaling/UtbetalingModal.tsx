import React from 'react';

import { BodyShort, Button, Heading, Loader } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { ErrorMessage } from '@components/ErrorMessage';
import { Modal } from '@components/Modal';
import { AnonymizableTextWithEllipsis } from '@components/TextWithEllipsis';
import { ArbeidsgiverikonMedTooltip } from '@components/ikoner/ArbeidsgiverikonMedTooltip';
import { SykmeldtikonMedTooltip } from '@components/ikoner/SykmeldtikonMedTooltip';
import { Personinfo, Utbetaling, Utbetalingstatus } from '@io/graphql';
import { somPenger } from '@utils/locale';

import { BackendFeil } from './Utbetaling';

import styles from '../BeløpTilUtbetaling.module.css';

interface UtbetalingModalProps {
    isSending: boolean;
    onApprove: () => void;
    onClose: () => void;
    error: BackendFeil | undefined;
    totrinnsvurdering: boolean;
    utbetaling?: Utbetaling;
    arbeidsgiver?: string;
    personinfo?: Personinfo;
}

export const UtbetalingModal = ({
    isSending,
    onApprove,
    onClose,
    error,
    totrinnsvurdering,
    utbetaling,
    arbeidsgiver,
    personinfo,
}: UtbetalingModalProps) => (
    <Modal
        isOpen
        title={
            <Heading as="h2" size="large">
                Er du sikker?
            </Heading>
        }
        contentLabel="Godkjenn utbetaling"
        onRequestClose={onClose}
    >
        <div className={styles.modal}>
            {utbetaling && arbeidsgiver && personinfo && (
                <TilUtbetaling utbetaling={utbetaling} arbeidsgiver={arbeidsgiver} personinfo={personinfo} />
            )}
            <BodyShort>
                Når du trykker ja{' '}
                {totrinnsvurdering
                    ? 'sendes saken til beslutter for godkjenning.'
                    : 'blir utbetalingen sendt til oppdragsystemet.'}
            </BodyShort>
            <div className={styles.buttons}>
                <Button variant="primary" onClick={onApprove} disabled={isSending} autoFocus>
                    <div className={styles.spinnerknapp}>
                        <span>Ja</span>
                        {isSending && <Loader size="xsmall" />}
                    </div>
                </Button>
                <Button variant="secondary" onClick={onClose}>
                    Avbryt
                </Button>
            </div>
        </div>
        <ErrorMessage className={styles.Feilmelding}>
            {error && (error.message || 'En feil har oppstått.')}
        </ErrorMessage>
    </Modal>
);

interface TilUtbetalingProps {
    utbetaling: Utbetaling;
    arbeidsgiver: string;
    personinfo: Personinfo;
}

const TilUtbetaling = ({ utbetaling, arbeidsgiver, personinfo }: TilUtbetalingProps) => (
    <div className={styles.TilUtbetaling}>
        <div className={styles.Row}>
            <Bold>{utbetaling.status !== Utbetalingstatus.Ubetalt ? 'Utbetalt beløp' : 'Beløp til utbetaling'}</Bold>
            <Bold className={styles.Total}>
                {somPenger(utbetaling.arbeidsgiverNettoBelop + utbetaling.personNettoBelop)}
            </Bold>
        </div>
        <div className={styles.Row}>
            <ArbeidsgiverikonMedTooltip />
            <AnonymizableTextWithEllipsis>{arbeidsgiver}</AnonymizableTextWithEllipsis>
            <BodyShort>{somPenger(utbetaling.arbeidsgiverNettoBelop)}</BodyShort>
        </div>
        <div className={styles.Row}>
            <SykmeldtikonMedTooltip />
            <AnonymizableTextWithEllipsis>{getFormattedName(personinfo)}</AnonymizableTextWithEllipsis>
            <BodyShort>{somPenger(utbetaling.personNettoBelop)}</BodyShort>
        </div>
    </div>
);

const getFormattedName = (personinfo: Personinfo): string => {
    return `${personinfo.fornavn} ${
        personinfo.mellomnavn ? `${personinfo.mellomnavn} ${personinfo.etternavn}` : personinfo.etternavn
    }`;
};
