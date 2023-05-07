import styled from '@emotion/styled';
// @ts-ignore
import { AnimatePresence, motion } from 'framer-motion';
import React, { ReactChild, useEffect, useRef, useState } from 'react';

import { Copy } from '@navikt/ds-icons';
import { BodyShort, Tooltip, TooltipProps } from '@navikt/ds-react';

import { Flex } from '../Flex';
import { copyContentsToClipboard } from './util';

const Button = styled.button`
    position: relative;
    background: none;
    cursor: pointer;
    padding: 2px 4px 0;
    margin-left: 0.25rem;
    border: none;
    border-radius: 1px;

    &:hover {
        background: var(--a-surface-action-subtle-hover);
    }

    &:focus,
    &:active {
        outline: solid var(--a-blue-800);
    }
`;

const Popover = styled(BodyShort)`
    position: absolute;
    padding: 6px 8px;
    border: 1px solid var(--a-border-strong);
    background: white;
    border-radius: 2px;
    white-space: nowrap;
    z-index: 1000;

    &:before {
        position: absolute;
        content: '';
        background: white;
        border-top: 1px solid var(--a-border-strong);
        border-left: 1px solid var(--a-border-strong);
        transform: rotate(45deg);
        height: 10px;
        width: 10px;
        top: -6px;
        left: 8px;
    }
`;

const Container = styled(Flex)`
    position: relative;
`;

interface TooltipWrapperProps {
    props?: Omit<TooltipProps, 'children'>;
    children: React.ReactElement;
}

const TooltipWrapper: React.FC<TooltipWrapperProps> = ({ props, children }) => {
    if (!props) {
        return <>{children}</>;
    }

    return <Tooltip {...props}>{children}</Tooltip>;
};

interface Props {
    children: ReactChild;
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
                    : await copyContentsToClipboard(contentRef?.current?.firstChild as HTMLElement, preserveWhitespace)
            );
        }
    };

    useEffect(() => {
        let timeout: NodeJS.Timeout | null | number = null;
        if (didCopy) {
            timeout = setTimeout(() => setDidCopy(false), 3000);
        }
        return () => {
            timeout && clearTimeout(timeout as NodeJS.Timeout);
        };
    }, [didCopy]);

    return (
        <Container as="span" alignItems="center">
            <div ref={contentRef}>{children}</div>
            <TooltipWrapper props={tooltip}>
                <Button onClick={copy}>
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
                                <Popover as="p">{copyMessage ?? 'Kopiert!'}</Popover>
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Button>
            </TooltipWrapper>
        </Container>
    );
};
