import { ReactElement } from 'react';

import { Table } from '@navikt/ds-react';

import { ApiOppgaveProjeksjon } from '@io/rest/generated/spesialist.schemas';
import { LinkRow } from '@oversikt/table/LinkRow';
import { EgenskaperTagsCell } from '@oversikt/table/cells/EgenskaperTagsCell';
import { TildelingCell } from '@oversikt/table/cells/TildelingCell';
import { OptionsCell } from '@oversikt/table/cells/options/OptionsCell';
import { PåVentCell } from '@oversikt/table/cells/påvent/PåVentCell';
import { NORSK_DATOFORMAT, somDato } from '@utils/date';

interface OppgavelisterOppgaveRowProps {
    oppgave: ApiOppgaveProjeksjon;
}

export const OppgavelisterOppgaveRow = ({ oppgave }: OppgavelisterOppgaveRowProps): ReactElement => {
    return (
        <LinkRow personPseudoId={oppgave.personPseudoId}>
            <TildelingCell oppgave={oppgave} />
            <EgenskaperTagsCell egenskaper={oppgave.egenskaper} />
            <Table.DataCell>{somDato(oppgave.behandlingOpprettetTidspunkt).format(NORSK_DATOFORMAT)}</Table.DataCell>
            <Table.DataCell>{somDato(oppgave.opprettetTidspunkt).format(NORSK_DATOFORMAT)}</Table.DataCell>
            <OptionsCell oppgave={oppgave} navn={oppgave.navn} />
            <PåVentCell navn={oppgave.navn} påVentInfo={oppgave.påVentInfo} />
        </LinkRow>
    );
};
