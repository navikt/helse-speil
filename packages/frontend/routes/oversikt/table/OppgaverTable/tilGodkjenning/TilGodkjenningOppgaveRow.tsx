import React from 'react';

import { Table } from '@navikt/ds-react';

import { OppgaveTilBehandling } from '@io/graphql';
import { fellesPåVentBenk } from '@utils/featureToggles';

import { LinkRow } from '../../LinkRow';
import { DatoCell } from '../../cells/DatoCell';
import { EgenskaperTagsCell } from '../../cells/EgenskaperTagsCell';
import { TildelingCell } from '../../cells/TildelingCell';
import { PåVentCell } from '../../cells/notat/PåVentCell';
import { OptionsCell } from '../../cells/options/OptionsCell';
import { useVisningsDato } from '../../state/sortation';

interface TilGodkjenningOppgaveRowProps {
    oppgave: OppgaveTilBehandling;
    readOnly: boolean;
}

export const TilGodkjenningOppgaveRow = ({ oppgave, readOnly }: TilGodkjenningOppgaveRowProps) => {
    const erPåVent =
        oppgave.tildeling?.paaVent || oppgave.egenskaper.filter((it) => it.egenskap === 'PA_VENT').length === 1;

    return (
        <LinkRow aktørId={oppgave.aktorId}>
            <TildelingCell oppgave={oppgave} kanTildeles={!readOnly} />
            <EgenskaperTagsCell egenskaper={oppgave.egenskaper} />
            <DatoCell date={useVisningsDato(oppgave)} />
            {oppgave.tildeling || fellesPåVentBenk ? (
                <OptionsCell oppgave={oppgave} navn={oppgave.navn} />
            ) : (
                <Table.DataCell />
            )}
            <PåVentCell vedtaksperiodeId={oppgave.vedtaksperiodeId} navn={oppgave.navn} erPåVent={erPåVent} />
        </LinkRow>
    );
};
