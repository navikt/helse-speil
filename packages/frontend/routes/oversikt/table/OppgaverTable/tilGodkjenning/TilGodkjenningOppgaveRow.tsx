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
import { TildelingCell } from '../../cells/TildelingCell';
import { NotatCell } from '../../cells/notat/NotatCell';
import { OptionsCell } from '../../cells/options/OptionsCell';

interface TilGodkjenningOppgaveRowProps {
    oppgave: OppgaveForOversiktsvisning;
    readOnly: boolean;
}

export const TilGodkjenningOppgaveRow = ({ oppgave, readOnly }: TilGodkjenningOppgaveRowProps) => (
    <LinkRow aktørId={oppgave.aktorId}>
        <TildelingCell oppgave={oppgave} kanTildeles={!readOnly} />
        <PeriodetypeCell type={oppgave.periodetype ?? Periodetype.Forstegangsbehandling} />
        <OppgavetypeCell oppgavetype={oppgave.type} />
        <MottakerCell mottaker={oppgave.mottaker} />
        <EgenskaperCell
            erBeslutter={oppgave.totrinnsvurdering?.erBeslutteroppgave === true}
            erRetur={oppgave.totrinnsvurdering?.erRetur === true}
            haster={oppgave.haster ?? false}
            harVergemål={oppgave.harVergemal ?? false}
            tilhørerEnhetUtland={oppgave.tilhorerEnhetUtland ?? false}
            spesialsak={oppgave.spesialsak ?? false}
        />
        <InntektskildeCell flereArbeidsgivere={oppgave.flereArbeidsgivere} />
        <DatoCell date={oppgave.opprettet} />
        <DatoCell date={oppgave.opprinneligSoknadsdato ?? oppgave.opprettet} />
        <OptionsCell oppgave={oppgave} navn={oppgave.navn} />
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
