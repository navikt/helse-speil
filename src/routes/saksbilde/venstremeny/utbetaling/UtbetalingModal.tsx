import React, { ReactElement } from 'react';

import { BodyShort, Button, ErrorMessage, Heading, Modal } from '@navikt/ds-react';

import { AnonymizableTextWithEllipsis } from '@components/anonymizable/AnonymizableText';
import { ArbeidsgiverikonMedTooltip } from '@components/ikoner/ArbeidsgiverikonMedTooltip';
import { SykmeldtikonMedTooltip } from '@components/ikoner/SykmeldtikonMedTooltip';
import { Personinfo, Utbetaling, Utbetalingstatus } from '@io/graphql';
import { capitalize, capitalizeArbeidsgiver, somPenger } from '@utils/locale';

import { BackendFeil } from './Utbetaling';

import styles from '../BeløpTilUtbetaling.module.css';

type UtbetalingModalProps = {
    showModal: boolean;
    isSending: boolean;
    onApprove: () => void;
    closeModal: () => void;
    error: BackendFeil | undefined;
    totrinnsvurdering: boolean;
    utbetaling?: Utbetaling;
    arbeidsgiverNavn?: string;
    personinfo?: Personinfo;
};

export const UtbetalingModal = ({
    showModal,
    isSending,
    onApprove,
    closeModal,
    error,
    totrinnsvurdering,
    utbetaling,
    arbeidsgiverNavn,
    personinfo,
}: UtbetalingModalProps): ReactElement => (
    <Modal aria-label="Legg på vent modal" portal closeOnBackdropClick open={showModal} onClose={closeModal}>
        <Modal.Header>
            <Heading level="1" size="medium">
                Er du sikker?
            </Heading>
        </Modal.Header>
        <Modal.Body className={styles.modal}>
            {utbetaling && arbeidsgiverNavn && personinfo && (
                <TilUtbetaling utbetaling={utbetaling} arbeidsgiver={arbeidsgiverNavn} personinfo={personinfo} />
            )}
            <BodyShort>
                Når du trykker ja{' '}
                {totrinnsvurdering
                    ? 'sendes saken til beslutter for godkjenning.'
                    : 'blir utbetalingen sendt til oppdragsystemet.'}
            </BodyShort>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="primary" type="button" autoFocus loading={isSending} onClick={onApprove}>
                Ja
            </Button>
            <Button variant="tertiary" type="button" onClick={closeModal}>
                Avbryt
            </Button>
        </Modal.Footer>
        {error && (
            <ErrorMessage className={styles.Feilmelding}>{error.message ?? 'En feil har oppstått.'}</ErrorMessage>
        )}
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
            <BodyShort weight="semibold">
                {utbetaling.status !== Utbetalingstatus.Ubetalt ? 'Utbetalt beløp' : 'Beløp til utbetaling'}
            </BodyShort>
            <BodyShort weight="semibold">
                {somPenger(utbetaling.arbeidsgiverNettoBelop + utbetaling.personNettoBelop)}
            </BodyShort>
        </div>
        <div className={styles.Row}>
            <ArbeidsgiverikonMedTooltip />
            <AnonymizableTextWithEllipsis>{capitalizeArbeidsgiver(arbeidsgiver)}</AnonymizableTextWithEllipsis>
            <BodyShort>{somPenger(utbetaling.arbeidsgiverNettoBelop)}</BodyShort>
        </div>
        <div className={styles.Row}>
            <SykmeldtikonMedTooltip />
            <AnonymizableTextWithEllipsis>{capitalize(getFormattedName(personinfo))}</AnonymizableTextWithEllipsis>
            <BodyShort>{somPenger(utbetaling.personNettoBelop)}</BodyShort>
        </div>
    </div>
);

const getFormattedName = (personinfo: Personinfo): string => {
    return `${personinfo.fornavn} ${
        personinfo.mellomnavn ? `${personinfo.mellomnavn} ${personinfo.etternavn}` : personinfo.etternavn
    }`;
};
