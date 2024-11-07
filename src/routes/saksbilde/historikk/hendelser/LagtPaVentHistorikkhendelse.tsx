import classNames from 'classnames';
import dayjs from 'dayjs';
import { AnimatePresence, motion } from 'framer-motion';
import React, { ReactElement, useState } from 'react';

import { ChevronDownIcon, ChevronUpIcon, TimerPauseIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

import { Maybe } from '@io/graphql';
import { ExpandableHistorikkContent } from '@saksbilde/historikk/hendelser/ExpandableHistorikkContent';
import styles from '@saksbilde/historikk/hendelser/Historikkhendelse.module.css';
import { DialogContent } from '@saksbilde/historikk/hendelser/notat/DialogContent';
import { LagtPaVentHistorikkhendelseObject } from '@typer/historikk';
import { NORSK_DATOFORMAT } from '@utils/date';

import { Hendelse } from './Hendelse';
import { HendelseDate } from './HendelseDate';
import { MAX_TEXT_LENGTH_BEFORE_TRUNCATION } from './notat/constants';

import notatStyles from './notat/Notathendelse.module.css';

type LagtPaVentHistorikkhendelseProps = Omit<LagtPaVentHistorikkhendelseObject, 'type' | 'id'>;

export const LagtPaVentHistorikkhendelse = ({
    historikktype,
    saksbehandler,
    timestamp,
    årsaker,
    frist,
    notatTekst,
    dialogRef,
    historikkinnslagId,
    kommentarer,
    erNyesteHistorikkhendelseMedType = false,
}: LagtPaVentHistorikkhendelseProps): ReactElement => {
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const isExpandable = () =>
        (notatTekst && notatTekst.length > MAX_TEXT_LENGTH_BEFORE_TRUNCATION) ||
        (notatTekst && notatTekst.split('\n').length > 2) ||
        (årsaker && årsaker.length >= 2) ||
        (årsaker && årsaker.length > 0 && !!notatTekst) ||
        false;

    const toggleNotat = (event: React.KeyboardEvent) => {
        if (event.code === 'Enter' || event.code === 'Space') {
            setExpanded(isExpandable() && !expanded);
        }
    };

    return (
        <Hendelse
            title="Lagt på vent"
            icon={<TimerPauseIcon title="Timer ikon" className={classNames(styles.Innrammet, styles.pavent)} />}
        >
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
                <LeggPåVentHistorikkinnhold
                    expanded={expanded}
                    tekst={notatTekst}
                    årsaker={årsaker}
                    frist={frist}
                    erNyesteHistorikkhendelseMedType={erNyesteHistorikkhendelseMedType}
                />
                {isExpandable() && (
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
                )}
            </div>
            <HendelseDate timestamp={timestamp} ident={saksbehandler} />
            {dialogRef && (
                <ExpandableHistorikkContent
                    openText={`Kommentarer (${kommentarer?.length})`}
                    closeText="Lukk kommentarer"
                >
                    <DialogContent
                        kommentarer={kommentarer}
                        saksbehandlerIdent={saksbehandler}
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

interface LeggPåVentProps {
    expanded: boolean;
    tekst: Maybe<string>;
    årsaker?: string[];
    frist?: string | null;
    erNyesteHistorikkhendelseMedType?: boolean;
}

const LeggPåVentHistorikkinnhold = ({
    expanded,
    tekst,
    årsaker,
    frist,
    erNyesteHistorikkhendelseMedType,
}: LeggPåVentProps): ReactElement => (
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
