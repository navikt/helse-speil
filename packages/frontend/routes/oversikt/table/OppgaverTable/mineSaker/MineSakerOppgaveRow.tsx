import React from 'react';

import { Table } from '@navikt/ds-react';

import { OppgaveForOversiktsvisning, Periodetype } from '@io/graphql';

import { LinkRow } from '../../LinkRow';
import { DatoCell } from '../../cells/DatoCell';
import { EgenskaperCell } from '../../cells/EgenskaperCell';
import { InntektskildeCell } from '../../cells/InntektskildeCell';
import { MottakerCell } from '../../cells/MottakerCell';
import { OppgavetypeCell } from '../../cells/OppgavetypeCell';
import { PeriodetypeCell } from '../../cells/PeriodetypeCell';
import { SøkerCell } from '../../cells/SøkerCell';
import { NotatCell } from '../../cells/notat/NotatCell';
import { OptionsCell } from '../../cells/options/OptionsCell';

interface MineSakerOppgaveRowProps {
    oppgave: OppgaveForOversiktsvisning;
}

export const MineSakerOppgaveRow = ({ oppgave }: MineSakerOppgaveRowProps) => (
    <LinkRow aktørId={oppgave.aktorId}>
        <PeriodetypeCell type={oppgave.periodetype ?? Periodetype.Forstegangsbehandling} />
        <OppgavetypeCell oppgavetype={oppgave.type} />
        <MottakerCell mottaker={oppgave.mottaker} />
        <EgenskaperCell
            erBeslutter={oppgave.totrinnsvurdering?.erBeslutteroppgave === true}
            erRetur={oppgave.totrinnsvurdering?.erRetur === true}
        />
        <InntektskildeCell flereArbeidsgivere={oppgave.flereArbeidsgivere} />
        <SøkerCell name={oppgave.navn} />
        <DatoCell date={oppgave.sistSendt ?? oppgave.opprettet} />
        <DatoCell date={oppgave.opprinneligSoknadsdato ?? oppgave.opprettet} />
        <OptionsCell oppgave={oppgave} navn={oppgave.navn} />
        {oppgave.tildeling?.reservert ? (
            <NotatCell
                vedtaksperiodeId={oppgave.vedtaksperiodeId}
                navn={oppgave.navn}
                erPåVent={oppgave.tildeling.reservert}
            />
        ) : (
            <Table.DataCell />
        )}
    </LinkRow>
);
