import React, { PropsWithChildren, ReactElement } from 'react';

import { Link } from '@navikt/ds-react';

type LovdataLenkeProps = {
    paragraf: string;
    harParagraf?: boolean;
};

export const LovdataLenke = ({
    paragraf,
    children,
    harParagraf = true,
}: PropsWithChildren<LovdataLenkeProps>): ReactElement => {
    const [kapittel] = paragraf.split('-');
    return (
        <Link
            target="_blank"
            href={`https://lovdata.no/nav/folketrygdloven/kap${kapittel}${harParagraf ? `/§${paragraf}` : ''}`}
        >
            {children}
        </Link>
    );
};
