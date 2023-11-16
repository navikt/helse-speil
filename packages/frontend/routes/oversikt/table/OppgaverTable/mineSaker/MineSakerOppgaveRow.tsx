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
import { SøkerCell } from '../../cells/SøkerCell';
import { NotatCell } from '../../cells/notat/NotatCell';
import { OptionsCell } from '../../cells/options/OptionsCell';
import { SortKey, dateSortKey } from '../../state/sortation';
import { SisteNotatCell } from '../SisteNotatCell';

interface MineSakerOppgaveRowProps {
    oppgave: OppgaveTilBehandling;
}

export const MineSakerOppgaveRow = ({ oppgave }: MineSakerOppgaveRowProps) => {
    const datoKey = useRecoilValue(dateSortKey);

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
                <DatoCell
                    date={datoKey === SortKey.SøknadMottatt ? oppgave.opprinneligSoknadsdato : oppgave.opprettet}
                />
            )}
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
            {slimOppgavetabell && (
                <SisteNotatCell vedtaksperiodeId={oppgave.vedtaksperiodeId} erPåVent={oppgave.tildeling?.paaVent} />
            )}
        </LinkRow>
    );
};
