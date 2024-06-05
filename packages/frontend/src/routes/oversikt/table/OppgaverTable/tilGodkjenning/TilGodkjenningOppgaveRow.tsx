import dayjs from 'dayjs';
import React from 'react';
import { useRecoilValue } from 'recoil';

import { OppgaveTilBehandling } from '@io/graphql';
import { ISO_DATOFORMAT } from '@utils/date';

import { LinkRow } from '../../LinkRow';
import { DatoCell } from '../../cells/DatoCell';
import { EgenskaperTagsCell } from '../../cells/EgenskaperTagsCell';
import { TildelingCell } from '../../cells/TildelingCell';
import { PåVentCell } from '../../cells/notat/PåVentCell';
import { OptionsCell } from '../../cells/options/OptionsCell';
import { SortKey, dateSortKey, getVisningsDato } from '../../state/sortation';

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
