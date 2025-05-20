import React, { PropsWithChildren, ReactElement, useRef, useState } from 'react';

import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Dropdown } from '@navikt/ds-react';

import { useInteractOutside } from '@hooks/useInteractOutside';
import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { Maybe, PersonFragment } from '@io/graphql';
import { OpphevStansAutomatiskBehandlingButton } from '@saksbilde/saksbildeMenu/dropdown/stansAutomatiskBehandling/OpphevStansAutomatiskBehandlingButton';
import { StansAutomatiskBehandlingButton } from '@saksbilde/saksbildeMenu/dropdown/stansAutomatiskBehandling/StansAutomatiskBehandlingButton';
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

export const DropdownMenuContent = ({ person, activePeriod }: DropdownMenuProps): ReactElement | null => {
    const user = useInnloggetSaksbehandler();
    const readOnly = useIsReadOnlyOppgave(person);
    const arbeidsgiver = useCurrentArbeidsgiver(person);

    if (!isPerson(person)) {
        return null;
    }

    const personIsAssignedUser = (person?.tildeling && person?.tildeling?.oid === user.oid) ?? false;

    const automatiskBehandlingStansetAvSaksbehandler =
        person.personinfo.automatiskBehandlingStansetAvSaksbehandler ?? false;

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
                {automatiskBehandlingStansetAvSaksbehandler ? (
                    <OpphevStansAutomatiskBehandlingButton fødselsnummer={person.fodselsnummer} />
                ) : (
                    <StansAutomatiskBehandlingButton fødselsnummer={person.fodselsnummer} />
                )}
                <OppdaterPersondataButton person={person} />
                {isBeregnetPeriode(activePeriod) && isArbeidsgiver(arbeidsgiver) && (
                    <AnnullerButton person={person} periode={activePeriod} arbeidsgiver={arbeidsgiver} />
                )}
            </Dropdown.Menu.List>
        </Dropdown.Menu>
    );
};

export const TilkommenInntektDropdownMenuContent = ({
    person,
}: {
    person?: Maybe<PersonFragment>;
}): ReactElement | null => {
    if (!isPerson(person)) {
        return null;
    }

    const automatiskBehandlingStansetAvSaksbehandler =
        person.personinfo.automatiskBehandlingStansetAvSaksbehandler ?? false;

    return (
        <Dropdown.Menu placement="bottom-start" className={styles.dropdown}>
            <Dropdown.Menu.List>
                {automatiskBehandlingStansetAvSaksbehandler ? (
                    <OpphevStansAutomatiskBehandlingButton fødselsnummer={person.fodselsnummer} />
                ) : (
                    <StansAutomatiskBehandlingButton fødselsnummer={person.fodselsnummer} />
                )}
                <OppdaterPersondataButton person={person} />
            </Dropdown.Menu.List>
        </Dropdown.Menu>
    );
};

export const DropdownMenu = ({ children }: PropsWithChildren): ReactElement => {
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
                {children}
            </Dropdown>
        </span>
    );
};
