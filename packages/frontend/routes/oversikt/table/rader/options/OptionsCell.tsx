import styled from '@emotion/styled';
import React, { useRef, useState } from 'react';

import { Popover, Tooltip } from '@navikt/ds-react';

import { useInnloggetSaksbehandler } from '@state/authentication';
import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { KebabButton } from '@components/KebabButton';

import { Cell } from '../../Cell';
import { CellContent } from '../CellContent';
import { FjernFraPåVentMenuButton } from './FjernFraPåVentMenuButton';
import { LeggPåVentMenuButton } from './LeggPåVentMenuButton';
import { MeldAvMenuButton } from './MeldAvMenuButton';
import { TildelMenuButton } from './TildelMenuButton';
import { useKanFrigiOppgaver } from '@state/toggles';
import { Maybe } from '@io/graphql';

const Container = styled.span`
    > .navds-popover {
        padding: 16px 0;
        border-radius: 4px;
    }

    display: flex;
    align-items: center;
`;

const erLike = (a?: Maybe<Saksbehandler>, b?: Maybe<Saksbehandler>): boolean => {
    return typeof a?.oid === 'string' && typeof b?.oid === 'string' && a.oid === b.oid;
};

interface OptionsButtonProps {
    oppgave: Oppgave;
    personinfo: Personinfo;
}

export const OptionsCell = React.memo(({ oppgave, personinfo }: OptionsButtonProps) => {
    const [popoverIsActive, setPopoverIsActive] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const innloggetSaksbehandler = useInnloggetSaksbehandler();
    const readOnly = useIsReadOnlyOppgave();
    const erTildeltInnloggetBruker = erLike(oppgave.tildeling?.saksbehandler, innloggetSaksbehandler);
    const kanFrigiAndresOppgaver = useKanFrigiOppgaver();
    const skalViseAvmeldingsknapp = erTildeltInnloggetBruker || (oppgave.tildeling && kanFrigiAndresOppgaver);

    const togglePopover = (event: React.SyntheticEvent) => {
        event.stopPropagation();
        setPopoverIsActive((active) => !active);
    };

    const closePopover = () => {
        setPopoverIsActive(false);
    };

    return (
        <Cell>
            <CellContent>
                <Tooltip content="Mer">
                    <Container>
                        <KebabButton
                            ref={buttonRef}
                            onClick={togglePopover}
                            onKeyPress={(event) => {
                                event.stopPropagation();
                                event.code === 'Space' || (event.code === 'Return' && togglePopover(event));
                            }}
                        />
                        <Popover
                            anchorEl={buttonRef.current}
                            open={popoverIsActive}
                            onClose={closePopover}
                            placement="bottom"
                            arrow={false}
                            offset={0}
                        >
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
                        </Popover>
                    </Container>
                </Tooltip>
            </CellContent>
        </Cell>
    );
});
