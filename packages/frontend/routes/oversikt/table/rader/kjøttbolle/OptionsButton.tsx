import styled from '@emotion/styled';
import React, { useRef, useState } from 'react';

import { Popover } from '@navikt/ds-react';
import { Meatball } from '@navikt/helse-frontend-meatball';
import '@navikt/helse-frontend-meatball/lib/main.css';

import { Tooltip } from '../../../../../components/Tooltip';
import { useInnloggetSaksbehandler } from '../../../../../state/authentication';

import { kanFrigiAndresOppgaver } from '../../../../../featureToggles';
import { CellContent } from '../CellContent';
import { FjernFraPåVentMenuButton } from './FjernFraPåVentMenuButton';
import { LeggPåVentMenuButton } from './LeggPåVentMenuButton';
import { MeldAvMenuButton } from './MeldAvMenuButton';
import { TildelMenuButton } from './TildelMenuButton';

const SpicyMeatball = styled(Meatball)`
    #circle_fill {
        fill: transparent;
    }

    :hover {
        #circle_fill {
            fill: var(--navds-color-action-hover);
        }

        #inner_circle_left,
        #inner_circle_center,
        #inner_circle_right {
            fill: var(--navds-color-text-inverse);
        }
    }
`;

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

export const OptionsButton = React.memo(({ oppgave, personinfo }: OptionsButtonProps) => {
    const [popoverIsActive, setPopoverIsActive] = useState(false);
    const meatballRef = useRef<HTMLButtonElement>(null);

    const innloggetSaksbehandler = useInnloggetSaksbehandler();
    const erTildeltInnloggetBruker = oppgave.tildeling?.saksbehandler?.oid === innloggetSaksbehandler.oid;
    const skalViseAvmeldingsknapp = erTildeltInnloggetBruker || (oppgave.tildeling && kanFrigiAndresOppgaver);

    const id = `options-${oppgave.oppgavereferanse}`;

    const togglePopover = (event: React.MouseEvent) => {
        event.stopPropagation();
        setPopoverIsActive((active) => !active);
    };

    const closePopover = () => {
        setPopoverIsActive(false);
    };

    return (
        <CellContent>
            <Container data-tip="Mer" data-for={id}>
                <SpicyMeatball
                    // @ts-ignore
                    ref={meatballRef}
                    size="s"
                    onClick={togglePopover}
                />
                <Popover
                    anchorEl={meatballRef.current}
                    open={popoverIsActive}
                    onClose={closePopover}
                    placement="bottom"
                    arrow={false}
                    offset={0}
                >
                    {!erTildeltInnloggetBruker && (
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
                    {skalViseAvmeldingsknapp && <MeldAvMenuButton oppgavereferanse={oppgave.oppgavereferanse} />}
                </Popover>
            </Container>
            <Tooltip id={id} effect="solid" offset={{ top: -10 }} />
        </CellContent>
    );
});
