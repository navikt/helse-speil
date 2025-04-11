import React, { ReactElement } from 'react';

import { CopyButton } from '@navikt/ds-react';

export const KopierAgNavn = ({ navn }: { navn: string }): ReactElement => (
    <CopyButton
        copyText={navn}
        size="xsmall"
        title={'Kopier arbeidsgivernavn'}
        onClick={(event) => event.stopPropagation()}
    />
);
