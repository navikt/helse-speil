import React from 'react';
import { useRecoilValue } from 'recoil';

import { OppgaveTilBehandling } from '@io/graphql';

import { LinkRow } from '../../LinkRow';
import { DatoCell } from '../../cells/DatoCell';
import { EgenskaperTagsCell } from '../../cells/EgenskaperTagsCell';
import { SøkerCell } from '../../cells/SøkerCell';
import { PåVentCell } from '../../cells/notat/PåVentCell';
import { OptionsCell } from '../../cells/options/OptionsCell';
import { SortKey, dateSortKey } from '../../state/sortation';

interface MineSakerOppgaveRowProps {
    oppgave: OppgaveTilBehandling;
}

export const MineSakerOppgaveRow = ({ oppgave }: MineSakerOppgaveRowProps) => {
    const datoKey = useRecoilValue(dateSortKey);
    const erPåVent =
        oppgave.tildeling?.paaVent || oppgave.egenskaper.filter((it) => it.egenskap === 'PA_VENT').length === 1;

    return (
        <LinkRow aktørId={oppgave.aktorId}>
            <SøkerCell name={oppgave.navn} />
            <EgenskaperTagsCell egenskaper={oppgave.egenskaper} />
            <DatoCell date={datoKey === SortKey.SøknadMottatt ? oppgave.opprinneligSoknadsdato : oppgave.opprettet} />
            <OptionsCell oppgave={oppgave} navn={oppgave.navn} />
            <PåVentCell vedtaksperiodeId={oppgave.vedtaksperiodeId} navn={oppgave.navn} erPåVent={erPåVent} />
        </LinkRow>
    );
};
