import React, { ReactElement } from 'react';

import { PeriodehistorikkType, PersonFragment } from '@io/graphql';
import { FjernetFraPåVentHendelse } from '@saksbilde/historikk/hendelser/FjernetFraPåVentHendelse';
import { LagtPåVentHendelse } from '@saksbilde/historikk/hendelser/LagtPåVentHendelse';
import { OpphevStansAutomatiskBehandlingSaksbehandlerHendelse } from '@saksbilde/historikk/hendelser/OpphevStansAutomatiskBehandlingSaksbehandlerHendelse';
import { StansAutomatiskBehandlingHendelse } from '@saksbilde/historikk/hendelser/StansAutomatiskBehandlingHendelse';
import { StansAutomatiskBehandlingSaksbehandlerHendelse } from '@saksbilde/historikk/hendelser/StansAutomatiskBehandlingSaksbehandlerHendelse';
import { TotrinnsvurderingAttestertHendelse } from '@saksbilde/historikk/hendelser/TotrinnsvurderingAttestertHendelse';
import { TotrinnsvurderingReturHendelse } from '@saksbilde/historikk/hendelser/TotrinnsvurderingReturHendelse';
import { TotrinnsvurderingTilGodkjenningHendelse } from '@saksbilde/historikk/hendelser/TotrinnsvurderingTilGodkjenningHendelse';
import { VedtaksperiodeReberegnetHendelse } from '@saksbilde/historikk/hendelser/VedtaksperiodeReberegnetHendelse';
import { HistorikkhendelseObject } from '@typer/historikk';

interface HistorikkHendelseProps {
    hendelse: HistorikkhendelseObject;
    person: PersonFragment;
}

export const HistorikkHendelse = ({ hendelse, person }: HistorikkHendelseProps): ReactElement => {
    const HendelseComponent = historikkhendelseComponents[hendelse.historikktype];
    return <HendelseComponent person={person} hendelse={hendelse} {...hendelse} />;
};
const historikkhendelseComponents = {
    [PeriodehistorikkType.LeggPaVent]: LagtPåVentHendelse,
    [PeriodehistorikkType.EndrePaVent]: LagtPåVentHendelse,
    [PeriodehistorikkType.FjernFraPaVent]: FjernetFraPåVentHendelse,
    [PeriodehistorikkType.TotrinnsvurderingAttestert]: TotrinnsvurderingAttestertHendelse,
    [PeriodehistorikkType.TotrinnsvurderingTilGodkjenning]: TotrinnsvurderingTilGodkjenningHendelse,
    [PeriodehistorikkType.VedtaksperiodeReberegnet]: VedtaksperiodeReberegnetHendelse,
    [PeriodehistorikkType.StansAutomatiskBehandling]: StansAutomatiskBehandlingHendelse,
    [PeriodehistorikkType.TotrinnsvurderingRetur]: TotrinnsvurderingReturHendelse,
    [PeriodehistorikkType.StansAutomatiskBehandlingSaksbehandler]: StansAutomatiskBehandlingSaksbehandlerHendelse,
    [PeriodehistorikkType.OpphevStansAutomatiskBehandlingSaksbehandler]:
        OpphevStansAutomatiskBehandlingSaksbehandlerHendelse,
};
