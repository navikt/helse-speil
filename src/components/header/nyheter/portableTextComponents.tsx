import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { PortableTextComponents } from '@portabletext/react';

export const portableTextComponents: PortableTextComponents = {
    block: {
        normal: ({ children }) => <BodyShort>{children}</BodyShort>,
    },
    list: {
        bullet: ({ children }) => <ul className="list-disc pl-6">{children}</ul>,
        number: ({ children }) => <ol className="pl-6">{children}</ol>,
    },
    marks: {
        link: ({ value, children }) => (
            <a href={value?.href} target="_blank" rel="noopener noreferrer">
                {children}
            </a>
        ),
    },
};
