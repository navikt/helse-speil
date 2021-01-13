import React, { ReactChild, useEffect, useRef, useState } from 'react';
import ClipboardIcon from './icons/ClipboardIcon';
import { AnimatePresence, motion } from 'framer-motion';
import { copyContentsToClipboard } from './util';
import { Flex } from '../Flex';
import styled from '@emotion/styled';

const copyAnimation = {
    initial: { y: 5, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 5, opacity: 0 },
    transition: {
        duration: 0.1,
    },
};

const Container = styled(Flex)`
    &:hover > div:first-of-type {
        border-bottom: 1px dotted #000;
    }
`;

const Button = styled.button`
    border: none;
    border-radius: 0.625rem;
    background: none;
    cursor: pointer;
    padding: 0.125rem;
    margin-left: 0.25rem;

    &:focus,
    &:active,
    &:hover {
        outline: none;
    }
`;

interface Props {
    children: ReactChild;
    copySource?: React.RefObject<HTMLElement>;
    preserveWhitespace?: boolean;
}

export const Clipboard = ({ children, copySource, preserveWhitespace = true }: Props) => {
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
            timeout = setTimeout(() => setDidCopy(false), 2000);
        }
        return () => {
            timeout && clearTimeout(timeout as NodeJS.Timeout);
        };
    }, [didCopy]);

    return (
        <Container as="span" alignItems="center">
            <div ref={contentRef}>{children}</div>
            <Button onClick={copy}>
                <AnimatePresence initial={false} exitBeforeEnter>
                    <motion.div {...copyAnimation} key={didCopy ? 'check' : 'copy'}>
                        <ClipboardIcon type={didCopy ? 'check' : 'copy'} />
                    </motion.div>
                </AnimatePresence>
            </Button>
        </Container>
    );
};
