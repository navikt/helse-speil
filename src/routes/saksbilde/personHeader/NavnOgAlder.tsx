import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

import { CopyButton, HStack, Tooltip } from '@navikt/ds-react';

import { AnonymizableBold } from '@components/anonymizable/AnonymizableBold';
import { Personinfo } from '@io/graphql';
import { capitalizeName } from '@utils/locale';

const getFormattedName = ({ etternavn, mellomnavn, fornavn }: Personinfo) => {
    return `${fornavn}${mellomnavn ? ` ${mellomnavn}` : ''} ${etternavn}`;
};

const getFormattedAge = (fodselsdato: string, dodsdato: string | null) => {
    const sluttidspunkt = dodsdato ? dayjs(dodsdato, 'YYYY-MM-DD') : dayjs();
    const alder = sluttidspunkt.diff(fodselsdato, 'year');
    return ` (${alder} år)`;
};

interface NavnOgAlderProps {
    personinfo: Personinfo;
    dodsdato: string | null;
}

export const NavnOgAlder = ({ personinfo, dodsdato }: NavnOgAlderProps): ReactElement => {
    const formattedName = capitalizeName(getFormattedName(personinfo));
    const formattedAge = personinfo.fodselsdato ? getFormattedAge(personinfo.fodselsdato, dodsdato) : null;

    return (
        <HStack gap="1">
            <AnonymizableBold>
                {formattedName} {formattedAge}
            </AnonymizableBold>
            <Tooltip content="Kopier navn">
                <CopyButton copyText={formattedName} size="xsmall" />
            </Tooltip>
        </HStack>
    );
};
