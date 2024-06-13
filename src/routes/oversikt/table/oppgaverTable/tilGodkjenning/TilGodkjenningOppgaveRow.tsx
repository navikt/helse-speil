import dayjs from 'dayjs';
import React from 'react';
import { useRecoilValue } from 'recoil';

import { OppgaveTilBehandling } from '@io/graphql';
import { LinkRow } from '@oversikt/table/LinkRow';
import { DatoCell } from '@oversikt/table/cells/DatoCell';
import { EgenskaperTagsCell } from '@oversikt/table/cells/EgenskaperTagsCell';
import { TildelingCell } from '@oversikt/table/cells/TildelingCell';
import { PåVentCell } from '@oversikt/table/cells/notat/PåVentCell';
import { OptionsCell } from '@oversikt/table/cells/options/OptionsCell';
import { SortKey, dateSortKey, getVisningsDato } from '@oversikt/table/state/sortation';
import { ISO_DATOFORMAT } from '@utils/date';

interface TilGodkjenningOppgaveRowProps {
    oppgave: OppgaveTilBehandling;
    readOnly: boolean;
}

export const TilGodkjenningOppgaveRow = ({ oppgave, readOnly }: TilGodkjenningOppgaveRowProps) => {
    const sorteringsnøkkel = useRecoilValue(dateSortKey);

    const erPåVent = oppgave.egenskaper.filter((it) => it.egenskap === 'PA_VENT').length === 1;

    const utgåttFrist: boolean =
        oppgave.tidsfrist != null && dayjs(oppgave.tidsfrist, ISO_DATOFORMAT).isSameOrBefore(dayjs());

    return (
        <LinkRow aktørId={oppgave.aktorId}>
            <TildelingCell oppgave={oppgave} kanTildeles={!readOnly} />
            <EgenskaperTagsCell egenskaper={oppgave.egenskaper} />
            <DatoCell
                date={getVisningsDato(oppgave, sorteringsnøkkel)}
                erUtgåttDato={sorteringsnøkkel === SortKey.Tidsfrist && utgåttFrist}
            />
            <OptionsCell oppgave={oppgave} navn={oppgave.navn} />
            <PåVentCell
                vedtaksperiodeId={oppgave.vedtaksperiodeId}
                navn={oppgave.navn}
                erPåVent={erPåVent}
                utgåttFrist={utgåttFrist}
            />
        </LinkRow>
    );
};
