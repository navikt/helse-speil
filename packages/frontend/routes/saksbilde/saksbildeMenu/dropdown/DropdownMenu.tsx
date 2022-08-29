import React, { useRef, useState } from 'react';
import { Dropdown } from '@navikt/ds-react-internal';
import { Collapse, Expand } from '@navikt/ds-icons';

import { isArbeidsgiver, isBeregnetPeriode, isPerson } from '@utils/typeguards';
import { TabButton } from '@components/TabButton';
import { LoadingShimmer } from '@components/LoadingShimmer';
import { useInteractOutside } from '@hooks/useInteractOutside';
import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useCurrentPerson } from '@state/person';
import { useActivePeriod } from '@state/periode';

import { AnnullerButton } from './AnnullerButton';
import OppdaterPersondataButton from './OppdaterPersondataButton';
import PåVentDropdownMenuButton from './PåVentDropdownMenuButton';
import TildelingDropdownMenuButton from './TildelingDropdownMenuButton';
import AnonymiserDataDropdownMenuButton from './AnonymiserDataDropdownMenuButton';
import SkrivGenereltNotatDropdownMenuButton from './SkrivGenereltNotatDropdownMenuButton';

import styles from './DropdownMenu.module.css';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';

const DropdownMenuContentSkeleton: React.FC = () => {
    return (
        <Dropdown.Menu placement="bottom-start">
            <Dropdown.Menu.List>
                <Dropdown.Menu.List.Item>
                    <LoadingShimmer />
                </Dropdown.Menu.List.Item>
                <Dropdown.Menu.List.Item>
                    <LoadingShimmer />
                </Dropdown.Menu.List.Item>
                <Dropdown.Menu.List.Item>
                    <LoadingShimmer />
                </Dropdown.Menu.List.Item>
            </Dropdown.Menu.List>
        </Dropdown.Menu>
    );
};

const DropdownMenuContent: React.FC = () => {
    const activePeriod = useActivePeriod();
    const currentUser = useInnloggetSaksbehandler();
    const arbeidsgiver = useCurrentArbeidsgiver();
    const currentPerson = useCurrentPerson();
    const readOnly = useIsReadOnlyOppgave();

    const personIsAssignedUser =
        (currentPerson?.tildeling && currentPerson?.tildeling?.oid === currentUser.oid) ?? false;

    return (
        <Dropdown.Menu placement="bottom-start" className={styles.DropdownMenu}>
            {isBeregnetPeriode(activePeriod) && activePeriod.oppgavereferanse && !readOnly && (
                <>
                    <Dropdown.Menu.List>
                        {isPerson(currentPerson) && (
                            <Dropdown.Menu.List.Item>
                                <SkrivGenereltNotatDropdownMenuButton
                                    vedtaksperiodeId={activePeriod.vedtaksperiodeId}
                                    personinfo={currentPerson.personinfo}
                                />
                            </Dropdown.Menu.List.Item>
                        )}
                        <Dropdown.Menu.List.Item>
                            <TildelingDropdownMenuButton
                                oppgavereferanse={activePeriod.oppgavereferanse}
                                erTildeltInnloggetBruker={personIsAssignedUser}
                                tildeling={currentPerson?.tildeling}
                            />
                        </Dropdown.Menu.List.Item>
                        {isPerson(currentPerson) && personIsAssignedUser && (
                            <Dropdown.Menu.List.Item>
                                <PåVentDropdownMenuButton
                                    oppgavereferanse={activePeriod.oppgavereferanse}
                                    vedtaksperiodeId={activePeriod.vedtaksperiodeId}
                                    personinfo={currentPerson.personinfo}
                                    erPåVent={currentPerson.tildeling?.reservert}
                                />
                            </Dropdown.Menu.List.Item>
                        )}
                    </Dropdown.Menu.List>
                    <Dropdown.Menu.Divider />
                </>
            )}
            <Dropdown.Menu.List>
                {isPerson(currentPerson) && (
                    <Dropdown.Menu.List.Item>
                        <React.Suspense>
                            <OppdaterPersondataButton person={currentPerson} />
                        </React.Suspense>
                    </Dropdown.Menu.List.Item>
                )}
                <Dropdown.Menu.List.Item>
                    <AnonymiserDataDropdownMenuButton />
                </Dropdown.Menu.List.Item>
                {isPerson(currentPerson) && isBeregnetPeriode(activePeriod) && isArbeidsgiver(arbeidsgiver) && (
                    <AnnullerButton person={currentPerson} periode={activePeriod} arbeidsgiver={arbeidsgiver} />
                )}
            </Dropdown.Menu.List>
        </Dropdown.Menu>
    );
};

export const DropdownMenu: React.FC = () => {
    const [open, setOpen] = useState(false);
    const content = useRef<HTMLSpanElement>(null);

    const toggleDropdown = () => {
        setOpen((prevState) => !prevState);
    };

    const closeDropdown = () => {
        setOpen(false);
    };

    useInteractOutside({
        ref: content,
        onInteractOutside: closeDropdown,
        active: open,
    });

    return (
        <span ref={content}>
            <Dropdown onSelect={closeDropdown}>
                <TabButton as={Dropdown.Toggle} className={styles.MenuButton} onClick={toggleDropdown}>
                    Meny {open ? <Collapse /> : <Expand />}
                </TabButton>
                <React.Suspense fallback={<DropdownMenuContentSkeleton />}>
                    <DropdownMenuContent />
                </React.Suspense>
            </Dropdown>
        </span>
    );
};
