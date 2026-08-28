import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

import { CopyButton, HStack, Tooltip } from '@navikt/ds-react';

import { AnonymizableBold } from '@components/anonymizable/AnonymizableBold';
import { ApiPerson } from '@io/rest/generated/spesialist.schemas';
import { capitalizeName } from '@utils/locale';

type Navn = Pick<ApiPerson, 'fornavn' | 'mellomnavn' | 'etternavn'>;

const getFormattedName = ({ etternavn, mellomnavn, fornavn }: Navn) => {
    return `${fornavn}${mellomnavn ? ` ${mellomnavn}` : ''} ${etternavn}`;
};

const getFormattedAge = (fødselsdato: string, dødsdato: string | null | undefined) => {
    const sluttidspunkt = dødsdato ? dayjs(dødsdato, 'YYYY-MM-DD') : dayjs();
    const alder = sluttidspunkt.diff(fødselsdato, 'year');
    return ` (${alder} år)`;
};

interface NavnOgAlderProps extends Navn {
    fødselsdato: string;
    dødsdato?: string | null;
}

export const NavnOgAlder = ({
    fornavn,
    mellomnavn,
    etternavn,
    fødselsdato,
    dødsdato,
}: NavnOgAlderProps): ReactElement => {
    const formattedName = capitalizeName(getFormattedName({ fornavn, mellomnavn, etternavn }));
    const formattedAge = fødselsdato ? getFormattedAge(fødselsdato, dødsdato) : null;

    return (
        <HStack gap="space-4">
            <AnonymizableBold>
                {formattedName} {formattedAge}
            </AnonymizableBold>
            <Tooltip content="Kopier navn">
                <CopyButton copyText={formattedName} size="xsmall" />
            </Tooltip>
        </HStack>
    );
};
