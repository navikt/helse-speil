import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { somDato } from '../../../../mapping/vedtaksperiode';
import { NORSK_DATOFORMAT } from '../../../../utils/date';

import { CellContent } from './CellContent';

interface OpprettetProps {
    date: string;
}

export const Opprettet = React.memo(({ date }: OpprettetProps) => (
    <CellContent width={100}>
        <BodyShort>{`${somDato(date).format(NORSK_DATOFORMAT)}`}</BodyShort>
    </CellContent>
));
