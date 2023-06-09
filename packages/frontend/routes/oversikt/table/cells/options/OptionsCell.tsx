import { FjernFraPåVentMenuButton } from './FjernFraPåVentMenuButton';
import { LeggPåVentMenuButton } from './LeggPåVentMenuButton';
import React from 'react';

import { EllipsisH } from '@navikt/ds-icons';
import { Button, Table } from '@navikt/ds-react';
import { Dropdown } from '@navikt/ds-react-internal';

import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { Maybe, OppgaveForOversiktsvisning, Personnavn } from '@io/graphql';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useKanFrigiOppgaver } from '@state/toggles';

import { MeldAvMenuButton } from './MeldAvMenuButton';
import { TildelMenuButton } from './TildelMenuButton';

import styles from './OptionsCell.module.css';

const erLike = (a?: Maybe<string>, b?: Maybe<string>): boolean => {
    return typeof a === 'string' && typeof b === 'string' && a === b;
};

interface OptionsButtonProps {
    oppgave: OppgaveForOversiktsvisning;
    navn: Personnavn;
}

export const OptionsCell = ({ oppgave, navn }: OptionsButtonProps) => {
    const innloggetSaksbehandler = useInnloggetSaksbehandler();
    const readOnly = useIsReadOnlyOppgave();
    const erTildeltInnloggetBruker = erLike(oppgave.tildeling?.oid, innloggetSaksbehandler.oid);
    const kanFrigiAndresOppgaver = useKanFrigiOppgaver();
    const skalViseAvmeldingsknapp = erTildeltInnloggetBruker || (oppgave.tildeling && kanFrigiAndresOppgaver);

    return (
        <Table.DataCell onClick={(event) => event.stopPropagation()}>
            <span className={styles.wrapper}>
                <Dropdown>
                    <Button
                        as={Dropdown.Toggle}
                        size="xsmall"
                        variant="secondary"
                        title="Mer"
                        className={styles.OptionsButton}
                    >
                        <EllipsisH title="Alternativer" height={20} width={20} />
                    </Button>
                    <Dropdown.Menu>
                        <Dropdown.Menu.List>
                            {!erTildeltInnloggetBruker && !readOnly && (
                                <TildelMenuButton oppgavereferanse={oppgave.id} tildeling={oppgave.tildeling} />
                            )}
                            {erTildeltInnloggetBruker &&
                                (oppgave.tildeling!.reservert ? (
                                    <FjernFraPåVentMenuButton oppgavereferanse={oppgave.id} />
                                ) : (
                                    <LeggPåVentMenuButton
                                        oppgavereferanse={oppgave.id}
                                        vedtaksperiodeId={oppgave.vedtaksperiodeId}
                                        navn={navn}
                                    />
                                ))}
                            {skalViseAvmeldingsknapp && <MeldAvMenuButton oppgavereferanse={oppgave.id} />}
                        </Dropdown.Menu.List>
                    </Dropdown.Menu>
                </Dropdown>
            </span>
        </Table.DataCell>
    );
};
