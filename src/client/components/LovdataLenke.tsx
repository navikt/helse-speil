import React from 'react';
import Lenke from 'nav-frontend-lenker';

interface LovdataLenkeProps {
    paragraf: string;
}

export const LovdataLenke: React.FC<LovdataLenkeProps> = ({ paragraf, children }) => {
    const [kapittel] = paragraf.split('-');
    return (
        <Lenke target="_blank" href={`https://lovdata.no/nav/folketrygdloven/kap${kapittel}/§${paragraf}`}>
            {children}
        </Lenke>
    );
};
