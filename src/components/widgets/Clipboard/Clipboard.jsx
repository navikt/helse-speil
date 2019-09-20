import React, { useEffect, useRef, useState } from 'react';
import Icon from 'nav-frontend-ikoner-assets';
import PropTypes from 'prop-types';
import { Undertekst } from 'nav-frontend-typografi';
import { motion, AnimatePresence } from 'framer-motion';
import './Clipboard.less';

const copyContentsToClipboard = node => {
    node.contentEditable = true;
    const range = document.createRange();
    range.selectNodeContents(node);

    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    const didCopy = document.execCommand('copy');
    document.getSelection().removeAllRanges();
    node.contentEditable = false;
    return didCopy;
};

const animation = {
    initial: { y: -10, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 10, opacity: 0 },
    transition: {
        duration: 0.2
    }
};

const Clipboard = ({ children }) => {
    const [minWidth, setMinWidth] = useState(0);
    const [didCopy, setDidCopy] = useState(false);
    const ref = useRef();

    const copy = () => {
        if (!didCopy) {
            setDidCopy(copyContentsToClipboard(ref.current.firstChild));
        }
    };

    useEffect(() => {
        if (didCopy) {
            setTimeout(() => setDidCopy(false), 2000);
        }
    }, [didCopy]);

    useEffect(() => {
        setMinWidth(ref.current?.offsetWidth ?? 0);
    }, [ref.current]);

    return (
        <div className="Clipboard">
            <AnimatePresence initial={false}>
                {didCopy ? (
                    <motion.div key="Clipboard__copytext" {...animation}>
                        <Undertekst
                            className="Clipboard__copytext"
                            style={{ minWidth: `${minWidth}px` }}
                        >
                            Kopiert
                            <Icon kind="ok-sirkel-fyll" size={14} />
                        </Undertekst>
                    </motion.div>
                ) : (
                    <motion.div
                        ref={ref}
                        key="Clipboard__children"
                        className="Clipboard__children"
                        {...animation}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
            <button onClick={copy} style={{ marginLeft: `${minWidth + 8}px` }}>
                KOPIÉR
            </button>
        </div>
    );
};

Clipboard.propTypes = {
    children: PropTypes.node.isRequired
};

export default Clipboard;
