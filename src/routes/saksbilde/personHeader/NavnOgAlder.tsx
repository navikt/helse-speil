import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

import { AnonymizableBold } from '@components/anonymizable/AnonymizableBold';
import { Maybe, Personinfo } from '@io/graphql';
import { capitalizeName } from '@utils/locale';

const getFormattedName = ({ etternavn, mellomnavn, fornavn }: Personinfo) => {
    return `${etternavn}, ${fornavn}${mellomnavn ? ` ${mellomnavn}` : ''}`;
};

const getFormattedAge = (fodselsdato: string, dodsdato: Maybe<string>) => {
    const sluttidspunkt = dodsdato ? dayjs(dodsdato, 'YYYY-MM-DD') : dayjs();
    const alder = sluttidspunkt.diff(fodselsdato, 'year');
    return ` (${alder} år)`;
};

interface NavnOgAlderProps {
    personinfo: Personinfo;
    dodsdato: Maybe<string>;
}

export const NavnOgAlder = ({ personinfo, dodsdato }: NavnOgAlderProps): ReactElement => {
    const formattedName = capitalizeName(getFormattedName(personinfo));
    const formattedAge = personinfo.fodselsdato ? getFormattedAge(personinfo.fodselsdato, dodsdato) : null;
    return (
        <AnonymizableBold>
            {formattedName}
            {formattedAge}
        </AnonymizableBold>
    );
};
