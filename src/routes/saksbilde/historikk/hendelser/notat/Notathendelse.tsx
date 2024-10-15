import classNames from 'classnames';
import dayjs from 'dayjs';
import { AnimatePresence, motion } from 'framer-motion';
import React, { ReactElement, useState } from 'react';

import {
    ChatIcon,
    CheckmarkCircleIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    PaperplaneIcon,
    TimerPauseIcon,
} from '@navikt/aksel-icons';
import { BodyShort, ErrorMessage } from '@navikt/ds-react';

import { useMutation } from '@apollo/client';
import { FeilregistrerNotatMutationDocument, PersonFragment } from '@io/graphql';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useActivePeriod } from '@state/periode';
import { NotathendelseObject } from '@typer/historikk';
import { NotatType } from '@typer/notat';
import { NORSK_DATOFORMAT } from '@utils/date';
import { isBeregnetPeriode } from '@utils/typeguards';

import { ExpandableHistorikkContent } from '../ExpandableHistorikkContent';
import { Hendelse } from '../Hendelse';
import { HendelseDate } from '../HendelseDate';
import { HendelseDropdownMenu } from './HendelseDropdownMenu';
import { NotatHendelseContent } from './NotathendelseContent';
import { MAX_TEXT_LENGTH_BEFORE_TRUNCATION } from './constants';

import styles from './Notathendelse.module.css';

type NotathendelseProps = Omit<NotathendelseObject, 'type'> & {
    person: PersonFragment;
};

export const Notathendelse = ({
    id,
    tekst,
    notattype,
    saksbehandler,
    saksbehandlerOid,
    timestamp,
    feilregistrert,
    kommentarer,
    erNyesteNotatMedType = false,
    person,
}: NotathendelseProps): ReactElement => {
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const innloggetSaksbehandler = useInnloggetSaksbehandler();
    const activePeriod = useActivePeriod(person);

    const [feilregistrerNotat, { loading, error }] = useMutation(FeilregistrerNotatMutationDocument, {
        variables: { id: parseInt(id) },
        update: (cache, { data }) => {
            cache.modify({
                id: cache.identify({ __typename: 'Notat', id: data?.feilregistrerNotat?.id }),
                fields: {
                    feilregistrert() {
                        return true;
                    },
                    feilregistert_tidspunkt() {
                        return data?.feilregistrerNotat?.feilregistrert_tidspunkt ?? '';
                    },
                },
            });
        },
        onCompleted: () => {
            setShowAddDialog(false);
        },
    });

    const isExpandable = () => tekst.length > MAX_TEXT_LENGTH_BEFORE_TRUNCATION || tekst.split('\n').length > 2;
    const toggleNotat = (event: React.KeyboardEvent) => {
        if (event.code === 'Enter' || event.code === 'Space') {
            setExpanded(isExpandable() && !expanded);
        }
    };

    return (
        <Hendelse
            title={<NotatTittel feilregistrert={feilregistrert} notattype={notattype} />}
            icon={<NotatIkon notattype={notattype} />}
        >
            {!feilregistrert && innloggetSaksbehandler.oid === saksbehandlerOid && (
                <HendelseDropdownMenu feilregistrerAction={feilregistrerNotat} isFetching={loading} />
            )}
            <div
                role="button"
                tabIndex={0}
                onKeyDown={toggleNotat}
                onClick={() => {
                    // ikke minimer når man markerer tekst
                    if (window.getSelection()?.type !== 'Range') setExpanded(isExpandable() && !expanded);
                }}
                className={styles.NotatTextWrapper}
            >
                <AnimatePresence mode="wait">
                    {expanded ? (
                        <motion.pre
                            key="pre"
                            className={styles.Notat}
                            initial={{ height: 40 }}
                            exit={{ height: 40 }}
                            animate={{ height: 'auto' }}
                            transition={{
                                type: 'tween',
                                duration: 0.2,
                                ease: 'easeInOut',
                            }}
                        >
                            {tekst}
                        </motion.pre>
                    ) : (
                        <motion.p key="p" className={styles.NotatTruncated}>
                            {tekst}
                        </motion.p>
                    )}
                    {notattype === 'PaaVent' &&
                        erNyesteNotatMedType &&
                        isBeregnetPeriode(activePeriod) &&
                        activePeriod.paVent?.frist && (
                            <BodyShort className={styles.tidsfrist} size="medium">
                                Tidsfrist:{' '}
                                <span className={styles.frist}>
                                    {dayjs(activePeriod.paVent.frist).format(NORSK_DATOFORMAT)}
                                </span>
                            </BodyShort>
                        )}
                </AnimatePresence>
                {isExpandable() && (
                    <span className={styles.lesmer}>
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
            {error && <ErrorMessage>Kunne ikke feilregistrere notat. Prøv igjen senere.</ErrorMessage>}
            <HendelseDate timestamp={timestamp} ident={saksbehandler} />
            <ExpandableHistorikkContent openText={`Kommentarer (${kommentarer.length})`} closeText="Lukk kommentarer">
                <NotatHendelseContent
                    kommentarer={kommentarer}
                    saksbehandlerOid={saksbehandlerOid}
                    id={id}
                    showAddDialog={showAddDialog}
                    setShowAddDialog={setShowAddDialog}
                />
            </ExpandableHistorikkContent>
        </Hendelse>
    );
};

interface NotatTittelProps {
    feilregistrert: boolean;
    notattype: NotatType;
}

const NotatTittel = ({ feilregistrert, notattype }: NotatTittelProps): ReactElement => (
    <span className={classNames(feilregistrert)}>
        {notattype === 'OpphevStans' && 'Stans opphevet'}
        {notattype === 'PaaVent' && 'Lagt på vent'}
        {notattype === 'Retur' && 'Returnert'}
        {notattype === 'Generelt' && 'Notat'}
        {feilregistrert && ' (feilregistrert)'}
    </span>
);

interface NotatIkonProps {
    notattype: NotatType;
}

const NotatIkon = ({ notattype }: NotatIkonProps): ReactElement => {
    switch (notattype) {
        case 'OpphevStans':
            return <CheckmarkCircleIcon title="Sjekkmerke ikon" className={styles.Innrammet} />;
        case 'PaaVent':
            return <TimerPauseIcon title="Timer ikon" className={classNames(styles.Innrammet, styles.LagtPaaVent)} />;
        case 'Retur':
            return <PaperplaneIcon title="Papirfly ikon" className={classNames(styles.Innrammet, styles.Retur)} />;
        case 'Generelt':
            return <ChatIcon title="Chat ikon" className={styles.Innrammet} />;
    }
};
