import classNames from 'classnames';
import dayjs from 'dayjs';
import { AnimatePresence, motion } from 'framer-motion';
import React, { ReactElement, useState } from 'react';

import {
    ArrowUndoIcon,
    ArrowsSquarepathIcon,
    CheckmarkCircleIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    PaperplaneIcon,
    TimerPauseIcon,
    XMarkOctagonIcon,
} from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

import { Maybe, PeriodehistorikkType } from '@io/graphql';
import { ExpandableHistorikkContent } from '@saksbilde/historikk/hendelser/ExpandableHistorikkContent';
import { KommentarerContent } from '@saksbilde/historikk/hendelser/notat/KommentarerContent';
import { HistorikkhendelseObject } from '@typer/historikk';
import { NORSK_DATOFORMAT } from '@utils/date';

import { Hendelse } from './Hendelse';
import { HendelseDate } from './HendelseDate';
import { MAX_TEXT_LENGTH_BEFORE_TRUNCATION } from './notat/constants';

import styles from './Historikkhendelse.module.css';
import notatStyles from './notat/Notathendelse.module.css';

type HistorikkhendelseProps = Omit<HistorikkhendelseObject, 'type' | 'id'>;

export const Historikkhendelse = ({
    historikktype,
    saksbehandler,
    timestamp,
    årsaker,
    frist,
    notattekst,
    dialogRef,
    historikkinnslagId,
    kommentarer,
    erNyesteHistorikkhendelseMedType = false,
}: HistorikkhendelseProps): ReactElement => {
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const isExpandable = () =>
        (notattekst && notattekst.length > MAX_TEXT_LENGTH_BEFORE_TRUNCATION) ||
        (notattekst && notattekst.split('\n').length > 2) ||
        (årsaker && årsaker.length >= 2) ||
        (årsaker && årsaker.length > 0 && !!notattekst) ||
        false;

    const toggleNotat = (event: React.KeyboardEvent) => {
        if (event.code === 'Enter' || event.code === 'Space') {
            setExpanded(isExpandable() && !expanded);
        }
    };

    return (
        <Hendelse title={getTitle(historikktype)} icon={getIcon(historikktype)}>
            <div
                role="button"
                tabIndex={0}
                onKeyDown={toggleNotat}
                onClick={() => {
                    // ikke minimer når man markerer tekst
                    if (window.getSelection()?.type !== 'Range') setExpanded(isExpandable() && !expanded);
                }}
                className={classNames(notatStyles.NotatTextWrapper, isExpandable() && notatStyles.cursorpointer)}
            >
                <Historikkinnhold
                    expanded={expanded}
                    tekst={notattekst}
                    årsaker={årsaker}
                    frist={frist}
                    erNyesteHistorikkhendelseMedType={erNyesteHistorikkhendelseMedType}
                />
                {isExpandable() && <ExpandButton expanded={expanded} />}
            </div>
            <HendelseDate timestamp={timestamp} ident={saksbehandler} />
            {dialogRef && (
                <ExpandableHistorikkContent
                    openText={`Kommentarer (${kommentarer?.length})`}
                    closeText="Lukk kommentarer"
                >
                    <KommentarerContent
                        historikktype={historikktype}
                        kommentarer={kommentarer}
                        dialogRef={dialogRef}
                        historikkinnslagId={historikkinnslagId}
                        showAddDialog={showAddDialog}
                        setShowAddDialog={setShowAddDialog}
                    />
                </ExpandableHistorikkContent>
            )}
        </Hendelse>
    );
};

interface HistorikkinnholdProps {
    expanded: boolean;
    tekst: Maybe<string>;
    årsaker?: string[];
    frist?: string | null;
    erNyesteHistorikkhendelseMedType?: boolean;
}

const Historikkinnhold = ({
    expanded,
    tekst,
    årsaker,
    frist,
    erNyesteHistorikkhendelseMedType,
}: HistorikkinnholdProps): ReactElement => (
    <AnimatePresence mode="wait">
        {expanded ? (
            <motion.div
                key="div"
                className={notatStyles.Notat}
                initial={{ height: 40 }}
                exit={{ height: 40 }}
                animate={{ height: 'auto' }}
                transition={{
                    type: 'tween',
                    duration: 0.2,
                    ease: 'easeInOut',
                }}
            >
                <pre className={notatStyles.Notat}>{årsaker?.map((årsak) => årsak + '\n')}</pre>
                {tekst && årsaker && årsaker.length > 0 && (
                    <>
                        <span className={notatStyles.bold}>Notat</span>
                    </>
                )}
                <pre className={notatStyles.Notat}>{tekst}</pre>
            </motion.div>
        ) : (
            <motion.p key="p" className={notatStyles.NotatTruncated}>
                {årsaker && årsaker.length > 0 ? årsaker.map((årsak) => årsak + '\n') : tekst}
            </motion.p>
        )}
        {erNyesteHistorikkhendelseMedType && frist && (
            <BodyShort className={notatStyles.tidsfrist} size="medium">
                Frist: <span className={notatStyles.bold}>{dayjs(frist).format(NORSK_DATOFORMAT)}</span>
            </BodyShort>
        )}
    </AnimatePresence>
);

interface ExpandButtonProps {
    expanded: boolean;
}

const ExpandButton = ({ expanded }: ExpandButtonProps): ReactElement => (
    <span className={notatStyles.lesmer}>
        {expanded ? (
            <>
                Vis mindre <ChevronUpIcon title="Vis mer av notatet" fontSize="1.5rem" />
            </>
        ) : (
            <>
                Vis mer
                <ChevronDownIcon title="Vis mindre av notatet" fontSize="1.5rem" />
            </>
        )}
    </span>
);

const getTitle = (type: PeriodehistorikkType): string => {
    switch (type) {
        case PeriodehistorikkType.TotrinnsvurderingTilGodkjenning:
            return 'Sendt til godkjenning';
        case PeriodehistorikkType.TotrinnsvurderingRetur:
            return 'Returnert';
        case PeriodehistorikkType.TotrinnsvurderingAttestert:
            return 'Godkjent og utbetalt';
        case PeriodehistorikkType.VedtaksperiodeReberegnet:
            return 'Periode reberegnet';
        case PeriodehistorikkType.LeggPaVent:
            return 'Lagt på vent';
        case PeriodehistorikkType.FjernFraPaVent:
            return 'Fjernet fra på vent';
        case PeriodehistorikkType.StansAutomatiskBehandling:
            return 'Automatisk behandling stanset';
        default:
            return '';
    }
};

const getIcon = (type: PeriodehistorikkType): ReactElement => {
    switch (type) {
        case PeriodehistorikkType.TotrinnsvurderingAttestert: {
            return <CheckmarkCircleIcon title="Sjekkmerke ikon" className={styles.Innrammet} />;
        }
        case PeriodehistorikkType.TotrinnsvurderingRetur: {
            return <ArrowUndoIcon title="Pil tilbake ikon" className={classNames(styles.Innrammet)} />;
        }
        case PeriodehistorikkType.TotrinnsvurderingTilGodkjenning: {
            return <PaperplaneIcon title="Papirfly ikon" className={styles.Innrammet} />;
        }
        case PeriodehistorikkType.VedtaksperiodeReberegnet: {
            return <ArrowsSquarepathIcon title="Piler Firkantsti ikon" className={classNames(styles.Innrammet)} />;
        }
        case PeriodehistorikkType.LeggPaVent:
        case PeriodehistorikkType.FjernFraPaVent: {
            return <TimerPauseIcon title="Timer ikon" className={classNames(styles.Innrammet, styles.pavent)} />;
        }
        case PeriodehistorikkType.StansAutomatiskBehandling: {
            return <XMarkOctagonIcon title="Stopp ikon" className={classNames(styles.Innrammet, styles.opphevstans)} />;
        }
    }
};
