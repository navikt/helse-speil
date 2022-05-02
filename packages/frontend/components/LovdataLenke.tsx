import React from 'react';

import { Link } from '@navikt/ds-react';

interface LovdataLenkeProps extends ChildrenProps {
    paragraf: string;
    harParagraf?: boolean;
}

export const LovdataLenke: React.FC<LovdataLenkeProps> = ({ paragraf, children, harParagraf = true }) => {
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
