import React from 'react';
import { useRecoilValue } from 'recoil';

import { Table } from '@navikt/ds-react';

import { OppgaveTilBehandling } from '@io/graphql';
import { slimOppgavetabell } from '@utils/featureToggles';

import { LinkRow } from '../../LinkRow';
import { DatoCell } from '../../cells/DatoCell';
import { EgenskaperCell } from '../../cells/EgenskaperCell';
import { MottakerCell } from '../../cells/MottakerCell';
import { OppgavetypeCell } from '../../cells/OppgavetypeCell';
import { PeriodetypeCell } from '../../cells/PeriodetypeCell';
import { TildelingCell } from '../../cells/TildelingCell';
import { NotatCell } from '../../cells/notat/NotatCell';
import { OptionsCell } from '../../cells/options/OptionsCell';
import { SortKey, dateSortKey } from '../../state/sortation';
import { SisteNotatCell } from '../SisteNotatCell';

interface TilGodkjenningOppgaveRowProps {
    oppgave: OppgaveTilBehandling;
    readOnly: boolean;
}

export const TilGodkjenningOppgaveRow = ({ oppgave, readOnly }: TilGodkjenningOppgaveRowProps) => {
    const datoKey = useRecoilValue(dateSortKey);
    const erPåVent =
        oppgave.tildeling?.paaVent || oppgave.egenskaper.filter((it) => it.egenskap === 'PA_VENT').length === 1;

    return (
        <LinkRow aktørId={oppgave.aktorId}>
            <TildelingCell oppgave={oppgave} kanTildeles={!readOnly} />
            {!slimOppgavetabell && (
                <>
                    <PeriodetypeCell periodetype={oppgave.periodetype} />
                    <OppgavetypeCell oppgavetype={oppgave.oppgavetype} />
                    <MottakerCell mottaker={oppgave.mottaker} />
                    <EgenskaperCell egenskaper={oppgave.egenskaper} />
                    <DatoCell date={oppgave.opprettet} />
                    <DatoCell date={oppgave.opprinneligSoknadsdato} />
                </>
            )}
            {slimOppgavetabell && (
                <DatoCell
                    date={datoKey === SortKey.SøknadMottatt ? oppgave.opprinneligSoknadsdato : oppgave.opprettet}
                />
            )}
            {oppgave.tildeling ? <OptionsCell oppgave={oppgave} navn={oppgave.navn} /> : <Table.DataCell />}
            {erPåVent ? (
                <NotatCell vedtaksperiodeId={oppgave.vedtaksperiodeId} navn={oppgave.navn} erPåVent={erPåVent} />
            ) : (
                <Table.DataCell />
            )}
            {slimOppgavetabell && <SisteNotatCell vedtaksperiodeId={oppgave.vedtaksperiodeId} erPåVent={erPåVent} />}
        </LinkRow>
    );
};
