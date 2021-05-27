import { Oppgave, Personinfo } from 'internal-types';
import React from 'react';

import { TekstMedEllipsis } from '../../../components/TekstMedEllipsis';
import { Tooltip } from '../../../components/Tooltip';
import { usePersondataSkalAnonymiseres } from '../../../state/person';
import { capitalizeName } from '../../../utils/locale';

import { anonymisertPersoninfo } from '../../../agurkdata';
import { CellContainer, SkjultSakslenke, tooltipId } from './rader';

const formaterNavn = (personinfo: Personinfo): string => {
    const { fornavn, mellomnavn, etternavn } = personinfo;
    return capitalizeName(`${etternavn}, ${fornavn} ${mellomnavn ? `${mellomnavn} ` : ''}`);
};

export const Søker = React.memo(({ oppgave }: { oppgave: Oppgave }) => {
    const anonymiseringEnabled = usePersondataSkalAnonymiseres();
    const formatertNavn = formaterNavn(anonymiseringEnabled ? anonymisertPersoninfo : oppgave.personinfo);
    return (
        <CellContainer width={128} data-for={tooltipId('søker', oppgave)} data-tip={formatertNavn}>
            <TekstMedEllipsis>{formatertNavn}</TekstMedEllipsis>
            <SkjultSakslenke oppgave={oppgave} />
            {formatertNavn.length > 19 && <Tooltip id={tooltipId('søker', oppgave)} />}
        </CellContainer>
    );
});
