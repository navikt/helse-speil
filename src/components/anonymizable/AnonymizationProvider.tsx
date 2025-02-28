import { CSSProperties, PropsWithChildren, ReactElement } from 'react';

import { useIsAnonymous } from '@state/anonymization';

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

export const AnonymiseringProvider = ({ children }: PropsWithChildren): ReactElement => {
    const anonymiser = useIsAnonymous();
    return (
        <body style={anonymiser ? anomizedStyle : visibleStyle}>
            <div id="root">{children}</div>
        </body>
    );
};
