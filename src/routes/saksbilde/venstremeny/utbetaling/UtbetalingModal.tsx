import { ReactElement } from 'react';

import { BodyShort, Button, ErrorMessage, HStack, Heading, Modal, Spacer } from '@navikt/ds-react';

import { Inntektsforholdnavn } from '@components/Inntektsforholdnavn';
import { AnonymizableTextWithEllipsis } from '@components/anonymizable/AnonymizableText';
import { Arbeidsgiverikon } from '@components/ikoner/Arbeidsgiverikon';
import { SykmeldtikonMedTooltip } from '@components/ikoner/SykmeldtikonMedTooltip';
import { Personinfo, Utbetaling, Utbetalingstatus } from '@io/graphql';
import { InntektsforholdReferanse } from '@state/inntektsforhold/inntektsforhold';
import { capitalizeName, somPenger } from '@utils/locale';

import styles from '../BeløpTilUtbetaling.module.css';

type UtbetalingModalProps = {
    showModal: boolean;
    isSending: boolean;
    onApprove: () => void;
    closeModal: () => void;
    error: BackendFeil | null;
    totrinnsvurdering: boolean;
    utbetaling?: Utbetaling;
    inntektsforholdReferanse: InntektsforholdReferanse;
    personinfo?: Personinfo;
};

export type BackendFeil = {
    message: string;
};

export const UtbetalingModal = ({
    showModal,
    isSending,
    onApprove,
    closeModal,
    error,
    totrinnsvurdering,
    utbetaling,
    inntektsforholdReferanse,
    personinfo,
}: UtbetalingModalProps): ReactElement => (
    <Modal
        className={styles.modal}
        aria-label="utbetaling-modal"
        closeOnBackdropClick
        open={showModal}
        onClose={closeModal}
    >
        <Modal.Header>
            <Heading level="1" size="medium">
                Er du sikker?
            </Heading>
        </Modal.Header>
        <Modal.Body className={styles.modalBody}>
            {utbetaling && personinfo && (
                <TilUtbetaling
                    utbetaling={utbetaling}
                    inntektsforholdReferanse={inntektsforholdReferanse}
                    personinfo={personinfo}
                />
            )}
            <BodyShort>
                Når du trykker ja{' '}
                {totrinnsvurdering
                    ? 'sendes oppgaven til beslutter for godkjenning.'
                    : 'blir utbetalingen sendt til oppdragsystemet.'}
            </BodyShort>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="primary" type="button" loading={isSending} onClick={onApprove}>
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
    inntektsforholdReferanse: InntektsforholdReferanse;
    personinfo: Personinfo;
};

const TilUtbetaling = ({ utbetaling, inntektsforholdReferanse, personinfo }: TilUtbetalingProps): ReactElement => (
    <div className={styles.TilUtbetaling}>
        <HStack align="center" gap="space-16" className={styles.Row}>
            <BodyShort weight="semibold">
                {utbetaling.status !== Utbetalingstatus.Ubetalt ? 'Utbetalt beløp' : 'Beløp til utbetaling'}
            </BodyShort>
            <Spacer />
            <BodyShort weight="semibold">
                {somPenger(utbetaling.arbeidsgiverNettoBelop + utbetaling.personNettoBelop)}
            </BodyShort>
        </HStack>
        {inntektsforholdReferanse.type === 'Arbeidsgiver' && (
            <HStack align="center" gap="space-16" className={styles.Row}>
                <Arbeidsgiverikon />
                <Inntektsforholdnavn inntektsforholdReferanse={inntektsforholdReferanse} />
                <Spacer />
                <BodyShort>{somPenger(utbetaling.arbeidsgiverNettoBelop)}</BodyShort>
            </HStack>
        )}
        <HStack align="center" gap="space-16" className={styles.Row}>
            <SykmeldtikonMedTooltip />
            <AnonymizableTextWithEllipsis>{capitalizeName(getFormattedName(personinfo))}</AnonymizableTextWithEllipsis>
            <Spacer />
            <BodyShort>{somPenger(utbetaling.personNettoBelop)}</BodyShort>
        </HStack>
    </div>
);

const getFormattedName = (personinfo: Personinfo): string => {
    return `${personinfo.fornavn} ${
        personinfo.mellomnavn ? `${personinfo.mellomnavn} ${personinfo.etternavn}` : personinfo.etternavn
    }`;
};
