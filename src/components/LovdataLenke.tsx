import React, { PropsWithChildren, ReactElement } from 'react';

import { Link, LinkProps } from '@navikt/ds-react';

type LovdataLenkeProps = Omit<LinkProps, 'href' | 'target'> & {
    paragraf: string;
};

export const LovdataLenke = ({ paragraf, children, ...rest }: PropsWithChildren<LovdataLenkeProps>): ReactElement => (
    <Link {...rest} target="_blank" href={`https://lovdata.no/pro/#document/NL/lov/1997-02-28-19/§${paragraf}`}>
        {children}
    </Link>
);
