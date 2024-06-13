import styles from './Clipboard.module.scss';
import { AnimatePresence, motion } from 'framer-motion';
import React, { PropsWithChildren, ReactElement, useEffect, useRef, useState } from 'react';

import { Copy } from '@navikt/ds-icons';
import { BodyShort, Tooltip, TooltipProps } from '@navikt/ds-react';

import { Maybe } from '@io/graphql';

import { copyContentsToClipboard } from './util';

interface TooltipWrapperProps {
    props?: Omit<TooltipProps, 'children'>;
    children: React.ReactElement;
}

const TooltipWrapper = ({ props, children }: TooltipWrapperProps): ReactElement => {
    if (!props) {
        return <>{children}</>;
    }

    return <Tooltip {...props}>{children}</Tooltip>;
};

interface Props extends PropsWithChildren {
    copySource?: React.RefObject<HTMLElement>;
    preserveWhitespace?: boolean;
    copyMessage?: string;
    tooltip?: Omit<TooltipProps, 'children'>;
}

export const Clipboard = ({ children, copySource, preserveWhitespace = true, copyMessage, tooltip }: Props) => {
    const [didCopy, setDidCopy] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const copy = async () => {
        if (!didCopy) {
            setDidCopy(
                copySource?.current
                    ? await copyContentsToClipboard(copySource.current, preserveWhitespace)
                    : await copyContentsToClipboard(contentRef?.current?.firstChild as HTMLElement, preserveWhitespace),
            );
        }
    };

    useEffect(() => {
        let timeout: Maybe<NodeJS.Timeout | number> = null;
        if (didCopy) {
            timeout = setTimeout(() => setDidCopy(false), 3000);
        }
        return () => {
            timeout && clearTimeout(timeout as NodeJS.Timeout);
        };
    }, [didCopy]);

    return (
        <div className={styles.container}>
            <div ref={contentRef}>{children}</div>
            <TooltipWrapper props={tooltip}>
                <button className={styles.button} onClick={copy}>
                    <Copy aria-label={tooltip?.content} />
                    <AnimatePresence>
                        {didCopy && (
                            <motion.span
                                key="popover"
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ type: 'tween', duration: 0.15 }}
                                style={{
                                    position: 'absolute',
                                    bottom: -10,
                                    left: -2,
                                }}
                            >
                                <BodyShort className={styles.popover} as="p">
                                    {copyMessage ?? 'Kopiert!'}
                                </BodyShort>
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>
            </TooltipWrapper>
        </div>
    );
};
