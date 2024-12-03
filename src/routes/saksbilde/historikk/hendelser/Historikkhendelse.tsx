import classNames from 'classnames';
import dayjs from 'dayjs';
import { AnimatePresence, motion } from 'framer-motion';
import React, { PropsWithChildren, ReactElement, useState } from 'react';

import {
    ArrowUndoIcon,
    ArrowsSquarepathIcon,
    CheckmarkCircleIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    MenuElipsisHorizontalIcon,
    PaperplaneIcon,
    TimerPauseIcon,
    XMarkOctagonIcon,
} from '@navikt/aksel-icons';
import { BodyShort, Button, Dropdown } from '@navikt/ds-react';

import { Maybe, PeriodehistorikkType, PersonFragment } from '@io/graphql';
import { ExpandableHistorikkContent } from '@saksbilde/historikk/hendelser/ExpandableHistorikkContent';
import { KommentarerContent } from '@saksbilde/historikk/hendelser/notat/KommentarerContent';
import { PåVentButton } from '@saksbilde/saksbildeMenu/dropdown/PåVentButton';
import { useActivePeriod } from '@state/periode';
import { HistorikkhendelseObject } from '@typer/historikk';
import { NORSK_DATOFORMAT } from '@utils/date';
import { isBeregnetPeriode } from '@utils/typeguards';

import { Hendelse } from './Hendelse';
import { HendelseDate } from './HendelseDate';
import { MAX_TEXT_LENGTH_BEFORE_TRUNCATION } from './notat/constants';

import styles from './Historikkhendelse.module.css';
import dropdownStyles from './notat/HendelseDropdownMenu.module.css';
import notatStyles from './notat/Notathendelse.module.css';

type HistorikkhendelseProps = Omit<HistorikkhendelseObject, 'type' | 'id'> & {
    person: PersonFragment;
};

export const Historikkhendelse = ({
    person,
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
    const aktivPeriode = useActivePeriod(person);
    const erAktivPeriodePåVent = isBeregnetPeriode(aktivPeriode) && aktivPeriode?.paVent !== null;
    const erPeriodehistorikkElementPåVent = [
        PeriodehistorikkType.LeggPaVent,
        PeriodehistorikkType.OppdaterPaVentFrist,
    ].includes(historikktype);

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
            {erPeriodehistorikkElementPåVent && erAktivPeriodePåVent && erNyesteHistorikkhendelseMedType && (
                <PåVentDropdown person={person} />
            )}
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
                {[PeriodehistorikkType.LeggPaVent, PeriodehistorikkType.OppdaterPaVentFrist].includes(historikktype) ? (
                    <Påventinnhold
                        expanded={expanded}
                        tekst={notattekst}
                        årsaker={årsaker}
                        frist={frist}
                        erNyesteHistorikkhendelseMedType={erNyesteHistorikkhendelseMedType}
                    />
                ) : (
                    <UtvidbartInnhold expanded={expanded}>{notattekst}</UtvidbartInnhold>
                )}
                {isExpandable() && <ExpandButton expanded={expanded} />}
            </div>
            <HendelseDate timestamp={timestamp} ident={getIdenttekst(saksbehandler, historikktype)} />
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

interface UtvidbartInnholdProps {
    expanded: boolean;
    erPåvent?: boolean;
}

const UtvidbartInnhold = ({
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

interface PåventinnholdProps {
    expanded: boolean;
    tekst: Maybe<string>;
    årsaker?: string[];
    frist?: string | null;
    erNyesteHistorikkhendelseMedType?: boolean;
}

const Påventinnhold = ({
    expanded,
    tekst,
    årsaker,
    frist,
    erNyesteHistorikkhendelseMedType,
}: PåventinnholdProps): ReactElement => (
    <>
        <UtvidbartInnhold expanded={expanded}>
            {expanded ? (
                <>
                    <pre className={notatStyles.Notat}>{årsaker?.map((årsak) => årsak + '\n')}</pre>
                    {tekst && årsaker && årsaker.length > 0 && (
                        <>
                            <span className={notatStyles.bold}>Notat</span>
                        </>
                    )}
                    <pre className={notatStyles.Notat}>{tekst}</pre>
                </>
            ) : årsaker && årsaker.length > 0 ? (
                årsaker.map((årsak) => årsak + '\n')
            ) : (
                tekst
            )}
        </UtvidbartInnhold>
        {erNyesteHistorikkhendelseMedType && frist && (
            <BodyShort className={notatStyles.tidsfrist} size="medium">
                Frist: <span className={notatStyles.bold}>{dayjs(frist).format(NORSK_DATOFORMAT)}</span>
            </BodyShort>
        )}
    </>
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

const PåVentDropdown = ({ person }: { person: PersonFragment }) => (
    <Dropdown>
        <Button
            as={Dropdown.Toggle}
            size="xsmall"
            variant="tertiary"
            title="Mer"
            className={dropdownStyles.ToggleButton}
        >
            <MenuElipsisHorizontalIcon title="Alternativer" height={20} width={20} />
        </Button>
        <Dropdown.Menu className={dropdownStyles.Menu}>
            <Dropdown.Menu.List>
                <PåVentButton person={person} />
            </Dropdown.Menu.List>
        </Dropdown.Menu>
    </Dropdown>
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
        case PeriodehistorikkType.OppdaterPaVentFrist:
            return 'Lagt på vent – frist endret';
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
        case PeriodehistorikkType.OppdaterPaVentFrist:
        case PeriodehistorikkType.FjernFraPaVent: {
            return <TimerPauseIcon title="Timer ikon" className={classNames(styles.Innrammet, styles.pavent)} />;
        }
        case PeriodehistorikkType.StansAutomatiskBehandling: {
            return <XMarkOctagonIcon title="Stopp ikon" className={classNames(styles.Innrammet, styles.opphevstans)} />;
        }
    }
};

const getIdenttekst = (ident: Maybe<string>, type: PeriodehistorikkType): Maybe<string> => {
    // Kunne ha differensiert på om det er skrevet notat eller ikke, men ident føles mer nærliggende :thunkies:
    if (type == PeriodehistorikkType.TotrinnsvurderingRetur && ident == null) return 'Automatisk';
    return ident;
};
