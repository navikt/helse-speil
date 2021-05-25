import React from 'react';

import Lenke from 'nav-frontend-lenker';

interface LovdataLenkeProps {
    paragraf: string;
    harParagraf?: boolean;
}
export const LovdataLenke: React.FC<LovdataLenkeProps> = ({ paragraf, children, harParagraf = true }) => {
    const [kapittel] = paragraf.split('-');
    return (
        <Lenke
            target="_blank"
            href={`https://lovdata.no/nav/folketrygdloven/kap${kapittel}${harParagraf ? `/§${paragraf}` : ''}`}
        >
            {children}
        </Lenke>
    );
};
