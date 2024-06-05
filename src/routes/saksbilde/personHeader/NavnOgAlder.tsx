import dayjs from 'dayjs';
import React from 'react';

import { AnonymizableBold } from '@components/anonymizable/AnonymizableBold';
import { Personinfo } from '@io/graphql';
import { capitalizeName } from '@utils/locale';

const getFormattedName = ({ etternavn, mellomnavn, fornavn }: Personinfo) => {
    return `${etternavn}, ${fornavn}${mellomnavn ? ` ${mellomnavn}` : ''}`;
};

interface NavnOgAlderProps {
    personinfo: Personinfo;
}

export const NavnOgAlder: React.FC<NavnOgAlderProps> = ({ personinfo }) => {
    const formattedName = capitalizeName(getFormattedName(personinfo));
    const formattedAge = personinfo.fodselsdato !== null && ` (${dayjs().diff(personinfo.fodselsdato, 'year')} år)`;
    return (
        <AnonymizableBold>
            {formattedName}
            {formattedAge}
        </AnonymizableBold>
    );
};
