import styled from '@emotion/styled';
import { Oppgave } from 'internal-types';
import React from 'react';

import { Meatball } from '@navikt/helse-frontend-meatball';

import { Tooltip } from '../../../components/Tooltip';
import { Dropdown } from '../../../components/dropdown/Dropdown';
import { useInnloggetSaksbehandler } from '../../../state/authentication';

import { OversiktPåVentKnapp } from '../OversiktPåVentKnapp';
import { OversiktTildelingsknapp } from '../OversiktTildelingsknapp';
import { CellContainer, tooltipId } from './rader';

const SpicyMeatball = styled(Meatball)`
    align-self: center;

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

const Kjøttbolleknapp = styled(Dropdown)`
    height: 20px;
`;

interface KjøttbolleProps {
    oppgave: Oppgave;
}

export const Kjøttbolle = React.memo(({ oppgave }: KjøttbolleProps) => {
    const saksbehandler = useInnloggetSaksbehandler();
    const erTildeltInnloggetBruker = oppgave.tildeling?.saksbehandler?.oid === saksbehandler.oid;

    return (
        <CellContainer>
            <span data-tip="Mer" data-for={tooltipId('kjottbolle', oppgave)}>
                <Kjøttbolleknapp labelRenderer={(_, onClick) => <SpicyMeatball size="s" onClick={onClick} />}>
                    <OversiktTildelingsknapp
                        oppgavereferanse={oppgave.oppgavereferanse}
                        tildeling={oppgave.tildeling}
                        erTildeltInnloggetBruker={erTildeltInnloggetBruker}
                    />
                    {erTildeltInnloggetBruker && (
                        <OversiktPåVentKnapp
                            erPåVent={oppgave.tildeling!.påVent}
                            oppgavereferanse={oppgave.oppgavereferanse}
                        />
                    )}
                </Kjøttbolleknapp>
            </span>
            <Tooltip id={tooltipId('kjottbolle', oppgave)} effect={'solid'} offset={{ top: -10 }} />
        </CellContainer>
    );
});
