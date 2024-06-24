import React, { ReactElement } from 'react';

import { BodyShort, Button, Heading, Loader, Modal } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { ErrorMessage } from '@components/ErrorMessage';
import { AnonymizableTextWithEllipsis } from '@components/TextWithEllipsis';
import { ArbeidsgiverikonMedTooltip } from '@components/ikoner/ArbeidsgiverikonMedTooltip';
import { SykmeldtikonMedTooltip } from '@components/ikoner/SykmeldtikonMedTooltip';
import { Personinfo, Utbetaling, Utbetalingstatus } from '@io/graphql';
import { somPenger } from '@utils/locale';

import { BackendFeil } from './Utbetaling';

import styles from '../BeløpTilUtbetaling.module.css';

type UtbetalingModalProps = {
    showModal: boolean;
    isSending: boolean;
    onApprove: () => void;
    onClose: () => void;
    error: BackendFeil | undefined;
    totrinnsvurdering: boolean;
    utbetaling?: Utbetaling;
    arbeidsgiver?: string;
    personinfo?: Personinfo;
};

export const UtbetalingModal = ({
    showModal,
    isSending,
    onApprove,
    onClose,
    error,
    totrinnsvurdering,
    utbetaling,
    arbeidsgiver,
    personinfo,
}: UtbetalingModalProps): ReactElement => (
    <Modal aria-label="Legg på vent modal" portal closeOnBackdropClick open={showModal} onClose={onClose}>
        <Modal.Header>
            <Heading level="1" size="medium">
                Er du sikker?
            </Heading>
        </Modal.Header>
        <Modal.Body className={styles.modal}>
            {utbetaling && arbeidsgiver && personinfo && (
                <TilUtbetaling utbetaling={utbetaling} arbeidsgiver={arbeidsgiver} personinfo={personinfo} />
            )}
            <BodyShort>
                Når du trykker ja{' '}
                {totrinnsvurdering
                    ? 'sendes saken til beslutter for godkjenning.'
                    : 'blir utbetalingen sendt til oppdragsystemet.'}
            </BodyShort>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="primary" type="button" onClick={onApprove} disabled={isSending} autoFocus>
                <div className={styles.spinnerknapp}>
                    <span>Ja</span>
                    {isSending && <Loader size="xsmall" />}
                </div>
            </Button>
            <Button variant="tertiary" type="button" onClick={onClose}>
                Avbryt
            </Button>
            {error && (
                <ErrorMessage className={styles.Feilmelding}>{error.message ?? 'En feil har oppstått.'}</ErrorMessage>
            )}
        </Modal.Footer>
    </Modal>
);

type TilUtbetalingProps = {
    utbetaling: Utbetaling;
    arbeidsgiver: string;
    personinfo: Personinfo;
};

const TilUtbetaling = ({ utbetaling, arbeidsgiver, personinfo }: TilUtbetalingProps): ReactElement => (
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
