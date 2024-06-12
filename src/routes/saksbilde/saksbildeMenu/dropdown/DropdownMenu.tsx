import styles from './DropdownMenu.module.scss';
import React, { ReactElement, useRef, useState } from 'react';

import { Collapse, Expand } from '@navikt/ds-icons';
import { Dropdown } from '@navikt/ds-react';

import { LoadingShimmer } from '@components/LoadingShimmer';
import { useInteractOutside } from '@hooks/useInteractOutside';
import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { useCurrentPerson } from '@person/query';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useActivePeriod } from '@state/periode';
import { isArbeidsgiver, isBeregnetPeriode, isPerson } from '@utils/typeguards';

import { AnnullerButton } from './AnnullerButton';
import { OppdaterPersondataButton } from './OppdaterPersondataButton';
import { PåVentButton } from './PåVentButton';
import { TildelingDropdownMenuButton } from './TildelingDropdownMenuButton';

// TODO: kan brukes i vanlig useQuery loading?
const DropdownMenuContentSkeleton = (): ReactElement => {
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

const DropdownMenuContent = (): ReactElement | null => {
    const user = useInnloggetSaksbehandler();
    const period = useActivePeriod();
    const person = useCurrentPerson();
    const readOnly = useIsReadOnlyOppgave();
    const arbeidsgiver = useCurrentArbeidsgiver();

    if (!isPerson(person)) {
        return null;
    }

    const personIsAssignedUser = (person?.tildeling && person?.tildeling?.oid === user.oid) ?? false;

    return (
        <Dropdown.Menu placement="bottom-start" className={styles.dropdown}>
            {isBeregnetPeriode(period) && period.oppgave?.id && !readOnly && (
                <>
                    <Dropdown.Menu.List>
                        <>
                            <TildelingDropdownMenuButton
                                oppgavereferanse={period.oppgave.id}
                                erTildeltInnloggetBruker={personIsAssignedUser}
                                tildeling={person?.tildeling}
                            />
                            <PåVentButton personinfo={person.personinfo} />
                        </>
                    </Dropdown.Menu.List>
                    <Dropdown.Menu.Divider />
                </>
            )}
            <Dropdown.Menu.List>
                <OppdaterPersondataButton />
                {isBeregnetPeriode(period) && isArbeidsgiver(arbeidsgiver) && (
                    <AnnullerButton person={person} periode={period} arbeidsgiver={arbeidsgiver} />
                )}
            </Dropdown.Menu.List>
        </Dropdown.Menu>
    );
};

export const DropdownMenu = (): ReactElement => {
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
                <Dropdown.Toggle className={styles.menu} onClick={toggleDropdown}>
                    Meny {open ? <Collapse title="collapse" /> : <Expand title="expand" />}
                </Dropdown.Toggle>
                <DropdownMenuContent />
            </Dropdown>
        </span>
    );
};
