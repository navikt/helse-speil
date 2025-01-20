import React, { PropsWithChildren, ReactElement } from 'react';

import { Link } from '@navikt/ds-react';

type LovdataLenkeProps = {
    paragraf: string;
};

export const LovdataLenke = ({ paragraf, children }: PropsWithChildren<LovdataLenkeProps>): ReactElement => (
    <Link target="_blank" href={`https://lovdata.no/pro/#document/NL/lov/1997-02-28-19/§${paragraf}`}>
        {children}
    </Link>
);
