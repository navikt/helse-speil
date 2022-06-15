import styled from '@emotion/styled';
import React, { useRef, useState } from 'react';

import { Button as NavButton, Popover, Tooltip } from '@navikt/ds-react';

import { useInnloggetSaksbehandler } from '@state/authentication';
import { useReadOnlyOppgave } from '@hooks/useReadOnlyOppgave';

import { Cell } from '../../Cell';
import { CellContent } from '../CellContent';
import { FjernFraPåVentMenuButton } from './FjernFraPåVentMenuButton';
import { LeggPåVentMenuButton } from './LeggPåVentMenuButton';
import { MeldAvMenuButton } from './MeldAvMenuButton';
import { TildelMenuButton } from './TildelMenuButton';
import { toggleKanFrigiAndresOppgaver } from '@state/toggles';
import { useRecoilValue } from 'recoil';

const Button = styled(NavButton)`
    margin: 0;
    padding: 0;
    border: 0;
    outline: none;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    box-sizing: border-box;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    min-width: unset;
    background: transparent;
    box-shadow: inset 0 0 0 2px var(--navds-semantic-color-interaction-primary);

    > span {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 2px;
        transform: scale(65%);
    }

    > span > div {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: var(--navds-semantic-color-interaction-primary);
    }

    &:hover > span > div,
    &:active > span > div {
        background: var(--navds-semantic-color-text-inverted);
    }
`;

const OptionsButton = React.forwardRef<HTMLButtonElement, React.HTMLAttributes<HTMLButtonElement>>((props, ref) => (
    <Button as="button" ref={ref} {...props}>
        <div />
        <div />
        <div />
    </Button>
));

const Container = styled.span`
    > .navds-popover {
        padding: 16px 0;
        border-radius: 4px;
    }

    display: flex;
    align-items: center;
`;

interface OptionsButtonProps {
    oppgave: Oppgave;
    personinfo: Personinfo;
}

export const OptionsCell = React.memo(({ oppgave, personinfo }: OptionsButtonProps) => {
    const [popoverIsActive, setPopoverIsActive] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const innloggetSaksbehandler = useInnloggetSaksbehandler();
    const readOnly = useReadOnlyOppgave();
    const erTildeltInnloggetBruker =
        typeof oppgave.tildeling?.saksbehandler?.oid === 'string' &&
        oppgave.tildeling?.saksbehandler.oid === innloggetSaksbehandler.oid;
    const kanFrigiAndresOppgaver = useRecoilValue(toggleKanFrigiAndresOppgaver);
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
                        <OptionsButton
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
