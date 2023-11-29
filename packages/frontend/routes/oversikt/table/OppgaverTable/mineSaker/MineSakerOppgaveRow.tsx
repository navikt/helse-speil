import dayjs from 'dayjs';
import React from 'react';
import { useRecoilValue } from 'recoil';

import { OppgaveTilBehandling } from '@io/graphql';
import { ISO_DATOFORMAT } from '@utils/date';
import { fellesPåVentBenk } from '@utils/featureToggles';

import { LinkRow } from '../../LinkRow';
import { DatoCell } from '../../cells/DatoCell';
import { EgenskaperTagsCell } from '../../cells/EgenskaperTagsCell';
import { SøkerCell } from '../../cells/SøkerCell';
import { PåVentCell } from '../../cells/notat/PåVentCell';
import { OptionsCell } from '../../cells/options/OptionsCell';
import { SortKey, dateSortKey, getVisningsDato } from '../../state/sortation';

interface MineSakerOppgaveRowProps {
    oppgave: OppgaveTilBehandling;
}

export const MineSakerOppgaveRow = ({ oppgave }: MineSakerOppgaveRowProps) => {
    const sorteringsnøkkel = useRecoilValue(dateSortKey);

    const erPåVent =
        oppgave.tildeling?.paaVent || oppgave.egenskaper.filter((it) => it.egenskap === 'PA_VENT').length === 1;

    const utgåttFrist: boolean =
        fellesPåVentBenk &&
        oppgave.tidsfrist != null &&
        dayjs(oppgave.tidsfrist, ISO_DATOFORMAT).isSameOrBefore(dayjs());

    return (
        <LinkRow aktørId={oppgave.aktorId}>
            <SøkerCell name={oppgave.navn} />
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
