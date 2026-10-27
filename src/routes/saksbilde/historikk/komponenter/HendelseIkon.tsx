import React, { ReactElement } from 'react';

import {
    ArrowUndoIcon,
    ArrowsSquarepathIcon,
    ChatIcon,
    CheckmarkCircleIcon,
    HourglassTopFilledIcon,
    PaperplaneIcon,
    PersonPencilFillIcon,
    TimerPauseIcon,
    XMarkOctagonIcon,
} from '@navikt/aksel-icons';

import { Kilde } from '@components/Kilde';
import { ApiInntektskilde } from '@io/rest/generated/spesialist.schemas';

import styles from './HendelseIkon.module.css';

export const HistorikkArrowSquarepathIkon = (): ReactElement => (
    <ArrowsSquarepathIcon aria-hidden className={styles.ikon} />
);

export const HistorikkArrowUndoIkon = (): ReactElement => <ArrowUndoIcon aria-hidden className={styles.ikon} />;

export const HistorikkChatIkon = (): ReactElement => <ChatIcon aria-hidden className={styles.ikon} />;

export const HistorikkCheckmarkCircleIkon = (): ReactElement => (
    <CheckmarkCircleIcon aria-hidden className={styles.ikon} />
);

export const HistorikkPaperplaneIkon = (): ReactElement => <PaperplaneIcon aria-hidden className={styles.ikon} />;

export const HistorikkTimerPauseIkon = (): ReactElement => <TimerPauseIcon aria-hidden className={styles.ikon} />;

export const HistorikkHourglassTopFilledIkon = (): ReactElement => (
    <HourglassTopFilledIcon aria-hidden className={styles.ikon} />
);

export const HistorikkXMarkOctagonIkon = (): ReactElement => <XMarkOctagonIcon aria-hidden className={styles.ikon} />;

export const HistorikkKildeSaksbehandlerIkon = (): ReactElement => (
    <Kilde type={ApiInntektskilde.SAKSBEHANDLER}>
        <PersonPencilFillIcon aria-hidden />
    </Kilde>
);

export const HistorikkKildeInntektHentetFraAordningenIkon = (): ReactElement => (
    <Kilde type="InntektHentetFraAordningen">AO</Kilde>
);

export const HistorikkKildeVedtakIkon = (): ReactElement => <Kilde type="VEDTAK">MV</Kilde>;

export const HistorikkKildeSykmeldingIkon = (): ReactElement => <Kilde type="Sykmelding">SM</Kilde>;

export const HistorikkKildeInntektsmeldingIkon = (): ReactElement => <Kilde type="Inntektsmelding">IM</Kilde>;

export const HistorikkKildeSøknadIkon = (): ReactElement => <Kilde type="Soknad">SØ</Kilde>;
