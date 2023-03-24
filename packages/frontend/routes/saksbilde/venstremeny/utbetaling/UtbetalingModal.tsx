import styled from '@emotion/styled';
import React from 'react';

import { BodyShort, Button, Heading, Loader } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { Modal } from '@components/Modal';
import { AnonymizableTextWithEllipsis } from '@components/TextWithEllipsis';
import { ArbeidsgiverikonMedTooltip } from '@components/ikoner/ArbeidsgiverikonMedTooltip';
import { SykmeldtikonMedTooltip } from '@components/ikoner/SykmeldtikonMedTooltip';
import { Personinfo, Utbetaling, Utbetalingstatus } from '@io/graphql';
import { somPenger } from '@utils/locale';

import styles from '../BeløpTilUtbetaling.module.css';

const Buttons = styled.div`
    > button:not(:last-of-type) {
        margin-right: 1rem;
    }
`;

const KnappMedSpinner = styled.div`
    display: flex;

    > svg {
        margin-left: 0.5rem;
    }
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-top: 1rem;

    p:first-of-type {
        font-weight: bold;
    }
`;

interface UtbetalingModalProps {
    isSending: boolean;
    onApprove: () => void;
    onClose: () => void;
    totrinnsvurdering: boolean;
    utbetaling?: Utbetaling;
    arbeidsgiver?: string;
    personinfo?: Personinfo;
}

export const UtbetalingModal = ({
    isSending,
    onApprove,
    onClose,
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
        <Container>
            {utbetaling && arbeidsgiver && personinfo && (
                <TilUtbetaling utbetaling={utbetaling} arbeidsgiver={arbeidsgiver} personinfo={personinfo} />
            )}
            <BodyShort>
                Når du trykker ja{' '}
                {totrinnsvurdering
                    ? 'sendes saken til beslutter for godkjenning.'
                    : 'blir utbetalingen sendt til oppdragsystemet.'}
            </BodyShort>
            <Buttons>
                <Button variant="primary" onClick={onApprove} disabled={isSending}>
                    <KnappMedSpinner>
                        <span>Ja</span>
                        {isSending && <Loader size="xsmall" />}
                    </KnappMedSpinner>
                </Button>
                <Button variant="secondary" onClick={onClose}>
                    Avbryt
                </Button>
            </Buttons>
        </Container>
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
