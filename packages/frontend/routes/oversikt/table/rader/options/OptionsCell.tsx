import React from 'react';

import { Button } from '@navikt/ds-react';

import { useInnloggetSaksbehandler } from '@state/authentication';
import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';

import { Cell } from '../../Cell';
import { CellContent } from '../CellContent';
import { FjernFraPåVentMenuButton } from './FjernFraPåVentMenuButton';
import { LeggPåVentMenuButton } from './LeggPåVentMenuButton';
import { MeldAvMenuButton } from './MeldAvMenuButton';
import { TildelMenuButton } from './TildelMenuButton';
import { useKanFrigiOppgaver } from '@state/toggles';
import { Maybe } from '@io/graphql';
import { Dropdown } from '@navikt/ds-react-internal';
import { EllipsisH } from '@navikt/ds-icons';

import styles from './OptionsCell.module.css';

const erLike = (a?: Maybe<Saksbehandler>, b?: Maybe<Saksbehandler>): boolean => {
    return typeof a?.oid === 'string' && typeof b?.oid === 'string' && a.oid === b.oid;
};

interface OptionsButtonProps {
    oppgave: Oppgave;
    personinfo: Personinfo;
}

export const OptionsCell = React.memo(({ oppgave, personinfo }: OptionsButtonProps) => {
    const innloggetSaksbehandler = useInnloggetSaksbehandler();
    const readOnly = useIsReadOnlyOppgave();
    const erTildeltInnloggetBruker = erLike(oppgave.tildeling?.saksbehandler, innloggetSaksbehandler);
    const kanFrigiAndresOppgaver = useKanFrigiOppgaver();
    const skalViseAvmeldingsknapp = erTildeltInnloggetBruker || (oppgave.tildeling && kanFrigiAndresOppgaver);

    return (
        <Cell>
            <CellContent onClick={(event) => event.stopPropagation()}>
                <Dropdown>
                    <Button
                        as={Dropdown.Toggle}
                        size="xsmall"
                        variant="secondary"
                        title="Mer"
                        className={styles.OptionsButton}
                    >
                        <EllipsisH height={20} width={20} />
                    </Button>
                    <Dropdown.Menu>
                        <Dropdown.Menu.List>
                            {!erTildeltInnloggetBruker && !readOnly && (
                                <TildelMenuButton
                                    oppgavereferanse={oppgave.oppgavereferanse}
                                    saksbehandler={innloggetSaksbehandler}
                                    tildeling={oppgave.tildeling}
                                />
                            )}
                            {erTildeltInnloggetBruker &&
                                (oppgave.tildeling!.påVent ? (
                                    <FjernFraPåVentMenuButton oppgavereferanse={oppgave.oppgavereferanse} />
                                ) : (
                                    <LeggPåVentMenuButton
                                        oppgavereferanse={oppgave.oppgavereferanse}
                                        vedtaksperiodeId={oppgave.vedtaksperiodeId}
                                        personinfo={personinfo}
                                    />
                                ))}
                            {skalViseAvmeldingsknapp && (
                                <MeldAvMenuButton oppgavereferanse={oppgave.oppgavereferanse} />
                            )}
                        </Dropdown.Menu.List>
                    </Dropdown.Menu>
                </Dropdown>
            </CellContent>
        </Cell>
    );
});
