import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import ClipboardIcon from './ClipboardIcon';
import { motion, AnimatePresence } from 'framer-motion';
import { copyContentsToClipboard } from './util';
import './Clipboard.less';

const animation = {
    initial: { y: 5, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 5, opacity: 0 },
    transition: {
        duration: 0.1
    }
};

const Clipboard = ({ children }) => {
    const [didCopy, setDidCopy] = useState(false);
    const ref = useRef();

    const copy = () => {
        if (!didCopy) {
            setDidCopy(copyContentsToClipboard(ref.current.firstChild));
        }
    };

    useEffect(() => {
        didCopy && setTimeout(() => setDidCopy(false), 2000);
    }, [didCopy]);

    return (
        <div className="Clipboard">
            <div ref={ref}>
                <div className="Clipboard__children">{children}</div>
            </div>
            <ReactTooltip place="bottom" disable={!didCopy} />
            <button data-tip="Kopiert!" onClick={copy} data-class="typo-undertekst">
                <AnimatePresence initial={false} exitBeforeEnter>
                    <motion.div {...animation} key={didCopy ? 'check' : 'copy'}>
                        <ClipboardIcon type={didCopy ? 'check' : 'copy'} />
                    </motion.div>
                </AnimatePresence>
            </button>
        </div>
    );
};

Clipboard.propTypes = {
    children: PropTypes.node.isRequired
};

export default Clipboard;
