import React, { PropsWithChildren, useRef } from 'react';

import { LinkText } from '@saksbilde/historikk/komponenter/LinkText';

import styles from './InteractableLinkText.module.css';

interface InteractableLinkTextProps extends PropsWithChildren {
    onInteract: () => void;
}

export const InteractableLinkText = ({ onInteract, children }: InteractableLinkTextProps) => {
    const ref = useRef(null);

    return (
        <span
            role="button"
            tabIndex={0}
            onClick={(event: React.MouseEvent) => {
                // Ikke minimer når man markerer tekst
                if (window.getSelection()?.type !== 'Range') {
                    onInteract();
                    event.stopPropagation();
                }
            }}
            onKeyDown={(event: React.KeyboardEvent) => {
                // Reager kun hvis akkurat dette elementet er markert med tab
                if (event.target === ref.current) {
                    if (event.key === 'Enter' || event.key === ' ') {
                        onInteract();
                        event.stopPropagation();
                        event.preventDefault(); // Forhindre urelatert scrolling
                    }
                }
            }}
            className={styles.interactable}
            ref={ref}
        >
            <LinkText>{children}</LinkText>
        </span>
    );
};
