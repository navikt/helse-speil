import React from 'react';
import { useRecoilValue } from 'recoil';

import { OppgaveTilBehandling } from '@io/graphql';
import { slimOppgavetabell } from '@utils/featureToggles';

import { LinkRow } from '../../LinkRow';
import { DatoCell } from '../../cells/DatoCell';
import { EgenskaperCell } from '../../cells/EgenskaperCell';
import { EgenskaperTagsCell } from '../../cells/EgenskaperTagsCell';
import { MottakerCell } from '../../cells/MottakerCell';
import { OppgavetypeCell } from '../../cells/OppgavetypeCell';
import { PeriodetypeCell } from '../../cells/PeriodetypeCell';
import { SøkerCell } from '../../cells/SøkerCell';
import { PåVentCell } from '../../cells/notat/PåVentCell';
import { OptionsCell } from '../../cells/options/OptionsCell';
import { SortKey, dateSortKey } from '../../state/sortation';
import { SisteNotatCell } from '../SisteNotatCell';

interface MineSakerOppgaveRowProps {
    oppgave: OppgaveTilBehandling;
}

export const MineSakerOppgaveRow = ({ oppgave }: MineSakerOppgaveRowProps) => {
    const datoKey = useRecoilValue(dateSortKey);
    const erPåVent =
        oppgave.tildeling?.paaVent || oppgave.egenskaper.filter((it) => it.egenskap === 'PA_VENT').length === 1;

    return (
        <LinkRow aktørId={oppgave.aktorId}>
            {!slimOppgavetabell && (
                <>
                    <PeriodetypeCell periodetype={oppgave.periodetype} />
                    <OppgavetypeCell oppgavetype={oppgave.oppgavetype} />
                    <MottakerCell mottaker={oppgave.mottaker} />
                    <EgenskaperCell egenskaper={oppgave.egenskaper} />
                </>
            )}
            <SøkerCell name={oppgave.navn} />
            {!slimOppgavetabell && (
                <>
                    <DatoCell date={oppgave.opprettet} />
                    <DatoCell date={oppgave.opprinneligSoknadsdato ?? oppgave.opprettet} />
                </>
            )}
            {slimOppgavetabell && (
                <>
                    <EgenskaperTagsCell egenskaper={oppgave.egenskaper} />
                    <DatoCell
                        date={datoKey === SortKey.SøknadMottatt ? oppgave.opprinneligSoknadsdato : oppgave.opprettet}
                    />
                </>
            )}
            <OptionsCell oppgave={oppgave} navn={oppgave.navn} />
            <PåVentCell vedtaksperiodeId={oppgave.vedtaksperiodeId} navn={oppgave.navn} erPåVent={erPåVent} />

            {slimOppgavetabell && <SisteNotatCell vedtaksperiodeId={oppgave.vedtaksperiodeId} erPåVent={erPåVent} />}
        </LinkRow>
    );
};
