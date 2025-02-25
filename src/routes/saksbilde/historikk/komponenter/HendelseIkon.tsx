import React, { ReactElement } from 'react';

import {
    ArrowUndoIcon,
    ArrowsSquarepathIcon,
    ChatIcon,
    CheckmarkCircleIcon,
    PaperplaneIcon,
    PersonPencilFillIcon,
    TimerPauseIcon,
    XMarkOctagonIcon,
} from '@navikt/aksel-icons';

import { Kilde } from '@components/Kilde';
import { Inntektskilde } from '@io/graphql';

import styles from './HendelseIkon.module.css';

export const HistorikkArrowSquarepathIkon = (): ReactElement => <ArrowsSquarepathIcon className={styles.ikon} />;

export const HistorikkArrowUndoIkon = (): ReactElement => <ArrowUndoIcon className={styles.ikon} />;

export const HistorikkChatIkon = (): ReactElement => <ChatIcon className={styles.ikon} />;

export const HistorikkCheckmarkCircleIkon = (): ReactElement => <CheckmarkCircleIcon className={styles.ikon} />;

export const HistorikkPaperplaneIkon = (): ReactElement => <PaperplaneIcon className={styles.ikon} />;

export const HistorikkTimerPauseIkon = (): ReactElement => <TimerPauseIcon className={styles.ikon} />;

export const HistorikkXMarkOctagonIkon = (): ReactElement => <XMarkOctagonIcon className={styles.ikon} />;

export const HistorikkKildeSaksbehandlerIkon = (): ReactElement => (
    <Kilde type={Inntektskilde.Saksbehandler}>
        <PersonPencilFillIcon title="Saksbehandler ikon" />
    </Kilde>
);

export const HistorikkKildeInntektHentetFraAordningenIkon = (): ReactElement => (
    <Kilde type="InntektHentetFraAordningen">AO</Kilde>
);

export const HistorikkKildeVedtakIkon = (): ReactElement => <Kilde type="VEDTAK">MV</Kilde>;

export const HistorikkKildeSykmeldingIkon = (): ReactElement => <Kilde type="Sykmelding">SM</Kilde>;

export const HistorikkKildeInntektsmeldingIkon = (): ReactElement => <Kilde type="Inntektsmelding">IM</Kilde>;

export const HistorikkKildeSøknadIkon = (): ReactElement => <Kilde type="Soknad">SØ</Kilde>;
