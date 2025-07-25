import React, { ReactElement } from 'react';

import { MenuElipsisHorizontalIcon } from '@navikt/aksel-icons';
import { Button, Dropdown, Table } from '@navikt/ds-react';

import { Egenskap, Maybe, OppgaveTilBehandling, Personnavn } from '@io/graphql';
import { useInnloggetSaksbehandler } from '@state/authentication';

import { MeldAvMenuButton } from './MeldAvMenuButton';
import { PåVentMenuButton } from './PåVentMenuButton';
import { TildelMenuButton } from './TildelMenuButton';

import styles from './OptionsCell.module.css';

const erLike = (a?: Maybe<string>, b?: Maybe<string>): boolean => {
    return typeof a === 'string' && typeof b === 'string' && a === b;
};

interface OptionsButtonProps {
    oppgave: OppgaveTilBehandling;
    navn: Personnavn;
}

export const OptionsCell = ({ oppgave, navn }: OptionsButtonProps): ReactElement => {
    const innloggetSaksbehandler = useInnloggetSaksbehandler();
    const erTildeltInnloggetBruker = erLike(oppgave.tildeling?.oid, innloggetSaksbehandler.oid);
    const erTildelt = oppgave.tildeling?.oid !== undefined;
    const erPåVent = oppgave.egenskaper.filter((it) => it.egenskap === Egenskap.PaVent).length !== 0;

    return (
        <Table.DataCell onClick={(event) => event.stopPropagation()} className={styles.ikoncell}>
            <span className={styles.wrapper}>
                <Dropdown>
                    <Button
                        as={Dropdown.Toggle}
                        size="xsmall"
                        variant="secondary"
                        title="Mer"
                        className={styles.OptionsButton}
                    >
                        <MenuElipsisHorizontalIcon title="Alternativer" height={20} width={20} />
                    </Button>
                    <Dropdown.Menu>
                        <Dropdown.Menu.List>
                            {!erTildeltInnloggetBruker && !erTildelt && (
                                <TildelMenuButton oppgavereferanse={oppgave.id} tildeling={oppgave.tildeling} />
                            )}
                            <PåVentMenuButton
                                oppgavereferanse={oppgave.id}
                                tildeling={oppgave?.tildeling ?? null}
                                navn={navn}
                                erPåVent={erPåVent}
                            />
                            <MeldAvMenuButton
                                oppgavereferanse={oppgave.id}
                                erTildeltInnloggetBruker={erTildeltInnloggetBruker}
                            />
                        </Dropdown.Menu.List>
                    </Dropdown.Menu>
                </Dropdown>
            </span>
        </Table.DataCell>
    );
};
