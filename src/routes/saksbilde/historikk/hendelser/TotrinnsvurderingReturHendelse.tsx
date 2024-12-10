import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import React, { PropsWithChildren, ReactElement, useState } from 'react';

import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';

import { PeriodehistorikkType } from '@io/graphql';
import { ExpandableHistorikkContent } from '@saksbilde/historikk/hendelser/ExpandableHistorikkContent';
import { TotrinnsvurderingReturIkon } from '@saksbilde/historikk/hendelser/HendelseIkon';
import { KommentarerContent } from '@saksbilde/historikk/hendelser/notat/KommentarerContent';
import { HistorikkhendelseObject } from '@typer/historikk';

import { Hendelse } from './Hendelse';
import { HendelseDate } from './HendelseDate';
import { MAX_TEXT_LENGTH_BEFORE_TRUNCATION } from './notat/constants';

import notatStyles from './notat/Notathendelse.module.css';

type TotrinnsvurderingReturHendelseProps = Omit<HistorikkhendelseObject, 'type' | 'id'>;

export const TotrinnsvurderingReturHendelse = ({
    saksbehandler,
    timestamp,
    notattekst,
    dialogRef,
    historikkinnslagId,
    kommentarer,
}: TotrinnsvurderingReturHendelseProps): ReactElement => {
    const [expanded, setExpanded] = useState(false);
    const isExpandable = () =>
        (notattekst && notattekst.length > MAX_TEXT_LENGTH_BEFORE_TRUNCATION) ||
        (notattekst && notattekst.split('\n').length > 2) ||
        false;

    const toggleNotat = (event: React.KeyboardEvent) => {
        if (event.code === 'Enter' || event.code === 'Space') {
            setExpanded(isExpandable() && !expanded);
        }
    };

    return (
        <Hendelse title="Returnert" icon={<TotrinnsvurderingReturIkon />}>
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
                <UtvidbartInnhold expanded={expanded}>{notattekst}</UtvidbartInnhold>
                {isExpandable() && <ExpandButton expanded={expanded} />}
            </div>
            <HendelseDate timestamp={timestamp} ident={saksbehandler ?? 'Automatisk'} />
            {dialogRef && (
                <ExpandableHistorikkContent
                    openText={`Kommentarer (${kommentarer?.length})`}
                    closeText="Lukk kommentarer"
                >
                    <KommentarerContent
                        historikktype={PeriodehistorikkType.TotrinnsvurderingRetur}
                        kommentarer={kommentarer}
                        dialogRef={dialogRef}
                        historikkinnslagId={historikkinnslagId}
                    />
                </ExpandableHistorikkContent>
            )}
        </Hendelse>
    );
};

interface UtvidbartInnholdProps {
    expanded: boolean;
    erPåvent?: boolean;
}

export const UtvidbartInnhold = ({
    expanded,
    erPåvent = false,
    children,
}: PropsWithChildren<UtvidbartInnholdProps>): ReactElement => (
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
                {erPåvent ? children : <pre className={notatStyles.Notat}>{children}</pre>}
            </motion.div>
        ) : (
            <motion.p key="p" className={notatStyles.NotatTruncated}>
                {children}
            </motion.p>
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
                Vis mindre <ChevronUpIcon title="Vis mindre av teksten" fontSize="1.5rem" />
            </>
        ) : (
            <>
                Vis mer <ChevronDownIcon title="Vis mer av teksten" fontSize="1.5rem" />
            </>
        )}
    </span>
);
