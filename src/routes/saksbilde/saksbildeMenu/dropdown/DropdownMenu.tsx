import React, { ReactElement, useRef, useState } from 'react';

import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Dropdown } from '@navikt/ds-react';

import { useInteractOutside } from '@hooks/useInteractOutside';
import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { Maybe, PersonFragment } from '@io/graphql';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { ActivePeriod } from '@typer/shared';
import { isArbeidsgiver, isBeregnetPeriode, isPerson } from '@utils/typeguards';

import { AnnullerButton } from './AnnullerButton';
import { OppdaterPersondataButton } from './OppdaterPersondataButton';
import { PåVentButton } from './PåVentButton';
import { TildelingDropdownMenuButton } from './TildelingDropdownMenuButton';

import styles from './DropdownMenu.module.scss';

type DropdownMenuProps = {
    person: PersonFragment;
    activePeriod: ActivePeriod;
};

const DropdownMenuContent = ({ person, activePeriod }: DropdownMenuProps): Maybe<ReactElement> => {
    const user = useInnloggetSaksbehandler();
    const readOnly = useIsReadOnlyOppgave();
    const arbeidsgiver = useCurrentArbeidsgiver();

    if (!isPerson(person)) {
        return null;
    }

    const personIsAssignedUser = (person?.tildeling && person?.tildeling?.oid === user.oid) ?? false;

    return (
        <Dropdown.Menu placement="bottom-start" className={styles.dropdown}>
            {isBeregnetPeriode(activePeriod) && activePeriod.oppgave?.id && !readOnly && (
                <>
                    <Dropdown.Menu.List>
                        <>
                            <TildelingDropdownMenuButton
                                oppgavereferanse={activePeriod.oppgave.id}
                                erTildeltInnloggetBruker={personIsAssignedUser}
                                tildeling={person?.tildeling}
                            />
                            <PåVentButton person={person} />
                        </>
                    </Dropdown.Menu.List>
                    <Dropdown.Menu.Divider />
                </>
            )}
            <Dropdown.Menu.List>
                <OppdaterPersondataButton person={person} />
                {isBeregnetPeriode(activePeriod) && isArbeidsgiver(arbeidsgiver) && (
                    <AnnullerButton person={person} periode={activePeriod} arbeidsgiver={arbeidsgiver} />
                )}
            </Dropdown.Menu.List>
        </Dropdown.Menu>
    );
};

export const DropdownMenu = ({ person, activePeriod }: DropdownMenuProps): ReactElement => {
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
                    Meny{' '}
                    {open ? (
                        <ChevronUpIcon title="lukke" fontSize="1.25rem" />
                    ) : (
                        <ChevronDownIcon title="åpne" fontSize="1.25rem" />
                    )}
                </Dropdown.Toggle>
                <DropdownMenuContent person={person} activePeriod={activePeriod} />
            </Dropdown>
        </span>
    );
};
