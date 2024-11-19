import classNames from 'classnames';
import dayjs from 'dayjs';
import { AnimatePresence, motion } from 'framer-motion';
import React, { ReactElement, useState } from 'react';

import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

import { Maybe } from '@io/graphql';
import { ExpandableHistorikkContent } from '@saksbilde/historikk/hendelser/ExpandableHistorikkContent';
import { getIcon, getTitle } from '@saksbilde/historikk/hendelser/Historikkhendelse';
import { DialogContent } from '@saksbilde/historikk/hendelser/notat/DialogContent';
import { HistorikkhendelseMedInnholdObject } from '@typer/historikk';
import { NORSK_DATOFORMAT } from '@utils/date';

import { Hendelse } from './Hendelse';
import { HendelseDate } from './HendelseDate';
import { MAX_TEXT_LENGTH_BEFORE_TRUNCATION } from './notat/constants';

import notatStyles from './notat/Notathendelse.module.css';

type HistorikkhendelseMedInnholdProps = Omit<HistorikkhendelseMedInnholdObject, 'type' | 'id'>;

export const HistorikkhendelseMedInnhold = ({
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
}: HistorikkhendelseMedInnholdProps): ReactElement => {
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
