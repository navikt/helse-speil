import { Personinfo } from 'internal-types';
import React from 'react';

import { TekstMedEllipsis } from '../../../../components/TekstMedEllipsis';
import { Tooltip } from '../../../../components/Tooltip';
import { usePersondataSkalAnonymiseres } from '../../../../state/person';
import { capitalizeName } from '../../../../utils/locale';

import { anonymisertPersoninfo } from '../../../../agurkdata';
import { CellContent } from './CellContent';

const getFormattedName = (personinfo: Personinfo): string => {
    const { fornavn, mellomnavn, etternavn } = personinfo;
    return capitalizeName(`${etternavn}, ${fornavn} ${mellomnavn ? `${mellomnavn} ` : ''}`);
};

interface SøkerProps {
    personinfo: Personinfo;
    oppgavereferanse: string;
}

export const Søker = React.memo(({ personinfo, oppgavereferanse }: SøkerProps) => {
    const anonymiseringEnabled = usePersondataSkalAnonymiseres();
    const formatertNavn = getFormattedName(anonymiseringEnabled ? anonymisertPersoninfo : personinfo);
    const id = `søker-${oppgavereferanse}`;

    return (
        <CellContent width={128} data-for={id} data-tip={formatertNavn}>
            <TekstMedEllipsis>{formatertNavn}</TekstMedEllipsis>
            {formatertNavn.length > 19 && <Tooltip id={id} />}
        </CellContent>
    );
});
