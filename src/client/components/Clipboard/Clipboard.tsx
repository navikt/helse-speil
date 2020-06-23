import React, { ReactChild, useEffect, useRef, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import ClipboardIcon from './ClipboardIcon';
import { AnimatePresence, motion } from 'framer-motion';
import { copyContentsToClipboard } from './util';
import './Clipboard.less';

interface Props {
    children: ReactChild;
    source?: React.RefObject<HTMLElement>;
}

const animation = {
    initial: { y: 5, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 5, opacity: 0 },
    transition: {
        duration: 0.1,
    },
};

const removeSpaces = (s: string) => s.replace(' ', '');

const Clipboard = ({ children, source }: Props) => {
    const [didCopy, setDidCopy] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const copy = () => {
        if (!didCopy) {
            setDidCopy(
                source?.current
                    ? copyContentsToClipboard(source.current, (s) => s)
                    : copyContentsToClipboard(ref?.current?.firstChild as HTMLElement, removeSpaces)
            );
        }
    };

    useEffect(() => {
        didCopy && setTimeout(() => setDidCopy(false), 2000);
    }, [didCopy]);

    return (
        <div className="Clipboard">
            <div className="Clipboard__children" ref={ref}>
                {children}
            </div>
            <ReactTooltip place="bottom" disable={!didCopy} />
            <button data-tip="Kopiert!" data-tip-disable={!didCopy} onClick={copy} data-class="typo-undertekst">
                <AnimatePresence initial={false} exitBeforeEnter>
                    <motion.div {...animation} key={didCopy ? 'check' : 'copy'}>
                        <ClipboardIcon type={didCopy ? 'check' : 'copy'} />
                    </motion.div>
                </AnimatePresence>
            </button>
        </div>
    );
};

export default Clipboard;
