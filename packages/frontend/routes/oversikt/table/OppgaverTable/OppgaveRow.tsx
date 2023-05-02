import React from 'react';

import { OppgaveForOversiktsvisning, Periodetype } from '@io/graphql';

import { Cell } from '../Cell';
import { LinkRow } from '../LinkRow';
import { DatoCell } from '../rader/DatoCell';
import { EgenskaperCell } from '../rader/EgenskaperCell';
import { InntektskildeCell } from '../rader/InntektskildeCell';
import { MottakerCell } from '../rader/MottakerCell';
import { OppgavetypeCell } from '../rader/OppgavetypeCell';
import { PeriodetypeCell } from '../rader/PeriodetypeCell';
import { TildelingCell } from '../rader/TildelingCell';
import { NotatCell } from '../rader/notat/NotatCell';
import { OptionsCell } from '../rader/options/OptionsCell';

interface OppgaveRowProps {
    oppgave: OppgaveForOversiktsvisning;
    readOnly: boolean;
}

export const OppgaveRow = ({ oppgave, readOnly }: OppgaveRowProps) => (
    <LinkRow aktørId={oppgave.aktorId} key={oppgave.id}>
        <TildelingCell oppgave={oppgave} kanTildeles={!readOnly} />
        <PeriodetypeCell type={oppgave.periodetype ?? Periodetype.Forstegangsbehandling} />
        <OppgavetypeCell oppgavetype={oppgave.type} />
        <MottakerCell mottaker={oppgave.mottaker} />
        <EgenskaperCell
            erBeslutter={oppgave.totrinnsvurdering?.erBeslutteroppgave === true}
            erRetur={oppgave.totrinnsvurdering?.erRetur === true}
        />
        <InntektskildeCell flereArbeidsgivere={oppgave.flereArbeidsgivere} />
        <DatoCell date={oppgave.sistSendt ?? oppgave.opprettet} />
        <DatoCell date={oppgave.opprinneligSoknadsdato ?? oppgave.opprettet} />
        <OptionsCell oppgave={oppgave} personinfo={oppgave.personinfo} />
        {oppgave.tildeling?.reservert ? (
            <NotatCell
                vedtaksperiodeId={oppgave.vedtaksperiodeId}
                personinfo={oppgave.personinfo}
                erPåVent={oppgave.tildeling.reservert}
            />
        ) : (
            <Cell />
        )}
    </LinkRow>
);
