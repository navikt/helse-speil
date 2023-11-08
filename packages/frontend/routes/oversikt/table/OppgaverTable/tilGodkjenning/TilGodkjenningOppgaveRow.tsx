import React from 'react';

import { Table } from '@navikt/ds-react';

import { OppgaveTilBehandling } from '@io/graphql';

import { LinkRow } from '../../LinkRow';
import { DatoCell } from '../../cells/DatoCell';
import { EgenskaperCell } from '../../cells/EgenskaperCell';
import { MottakerCell } from '../../cells/MottakerCell';
import { OppgavetypeCell } from '../../cells/OppgavetypeCell';
import { PeriodetypeCell } from '../../cells/PeriodetypeCell';
import { TildelingCell } from '../../cells/TildelingCell';
import { NotatCell } from '../../cells/notat/NotatCell';
import { OptionsCell } from '../../cells/options/OptionsCell';

interface TilGodkjenningOppgaveRowProps {
    oppgave: OppgaveTilBehandling;
    readOnly: boolean;
}

export const TilGodkjenningOppgaveRow = ({ oppgave, readOnly }: TilGodkjenningOppgaveRowProps) => (
    <LinkRow aktørId={oppgave.aktorId}>
        <TildelingCell oppgave={oppgave} kanTildeles={!readOnly} />
        <PeriodetypeCell periodetype={oppgave.periodetype} />
        <OppgavetypeCell oppgavetype={oppgave.oppgavetype} />
        <MottakerCell mottaker={oppgave.mottaker} />
        <EgenskaperCell egenskaper={oppgave.egenskaper} />
        <DatoCell date={oppgave.opprettet} />
        <DatoCell date={oppgave.opprinneligSoknadsdato} />
        {oppgave.tildeling ? <OptionsCell oppgave={oppgave} navn={oppgave.navn} /> : <Table.DataCell />}
        {oppgave.tildeling?.paaVent ? (
            <NotatCell
                vedtaksperiodeId={oppgave.vedtaksperiodeId}
                navn={oppgave.navn}
                erPåVent={oppgave.tildeling.paaVent}
            />
        ) : (
            <Table.DataCell />
        )}
    </LinkRow>
);
