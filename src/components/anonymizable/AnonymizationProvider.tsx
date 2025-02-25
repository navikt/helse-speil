import { CSSProperties, PropsWithChildren, useEffect } from 'react';

import { useIsAnonymous, useSetAnonymity } from '@state/anonymization';

const anomizedStyle = {
    '--anonymizable-background': 'var(--anonymous-background)',
    '--anonymizable-color': 'var(--anonymous-color)',
    '--anonymizable-border-radius': 'var(--anonymous-border-radius)',
    '--anonymizable-opacity': 'var(--anonymous-opacity)',
    '--anonymizable-user-select': 'var(--anonymous-user-select)',
} as CSSProperties;

const visibleStyle = {
    '--anonymizable-background': 'var(--visible-background)',
    '--anonymizable-color': 'var(--visible-color)',
    '--anonymizable-border-radius': 'var(--visible-border-radius)',
    '--anonymizable-opacity': 'var(--visible-opacity)',
    '--anonymizable-user-select': 'var(--visible-user-select)',
} as CSSProperties;

export const AnonymiseringProvider = ({ children }: PropsWithChildren) => {
    const anonymiser = useIsAnonymous();
    const setAnonymity = useSetAnonymity();

    useEffect(() => {
        // Hydrer localStorage-verdi for anonymisering, fordi serveren vet ikke hva som er i localStorage (SSR)
        const anonymisering = localStorage.getItem('anonymisering');
        if (anonymisering !== null) {
            const anonymiseringBool = anonymisering === 'true';
            setAnonymity(anonymiseringBool);
        }
    }, [setAnonymity]);

    return (
        <body style={anonymiser ? anomizedStyle : visibleStyle}>
            <div id="root">{children}</div>
        </body>
    );
};
