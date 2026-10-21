import React, { ReactElement } from 'react';

import { ApiPeriodehistorikkType, ApiSaksbildePerson } from '@io/rest/generated/spesialist.schemas';
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
    person: ApiSaksbildePerson;
}

export const HistorikkHendelse = ({ hendelse, person }: HistorikkHendelseProps): ReactElement => {
    const HendelseComponent = historikkhendelseComponents[hendelse.historikktype];
    return <HendelseComponent person={person} hendelse={hendelse} />;
};
const historikkhendelseComponents = {
    [ApiPeriodehistorikkType.LEGG_PA_VENT]: LagtPåVentHendelse,
    [ApiPeriodehistorikkType.ENDRE_PA_VENT]: LagtPåVentHendelse,
    [ApiPeriodehistorikkType.FJERN_FRA_PA_VENT]: FjernetFraPåVentHendelse,
    [ApiPeriodehistorikkType.TOTRINNSVURDERING_ATTESTERT]: TotrinnsvurderingAttestertHendelse,
    [ApiPeriodehistorikkType.TOTRINNSVURDERING_TIL_GODKJENNING]: TotrinnsvurderingTilGodkjenningHendelse,
    [ApiPeriodehistorikkType.VEDTAKSPERIODE_REBEREGNET]: VedtaksperiodeReberegnetHendelse,
    [ApiPeriodehistorikkType.STANS_AUTOMATISK_BEHANDLING]: StansAutomatiskBehandlingHendelse,
    [ApiPeriodehistorikkType.TOTRINNSVURDERING_RETUR]: TotrinnsvurderingReturHendelse,
    [ApiPeriodehistorikkType.STANS_AUTOMATISK_BEHANDLING_SAKSBEHANDLER]: StansAutomatiskBehandlingSaksbehandlerHendelse,
    [ApiPeriodehistorikkType.OPPHEV_STANS_AUTOMATISK_BEHANDLING_SAKSBEHANDLER]:
        OpphevStansAutomatiskBehandlingSaksbehandlerHendelse,
};
