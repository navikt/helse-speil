import { AnimatePresence, motion } from 'motion/react';
import React, { PropsWithChildren, ReactElement } from 'react';

interface AnimatedExpandableDivProps extends PropsWithChildren {
    expanded: boolean;
}

export const AnimatedExpandableDiv = ({ expanded, children }: AnimatedExpandableDivProps): ReactElement => (
    <AnimatePresence mode="wait">
        {expanded && (
            <motion.div
                key="div"
                style={{ overflow: 'hidden' }}
                initial={{ height: 0 }}
                exit={{ height: 0 }}
                animate={{ height: 'auto' }}
                transition={{
                    type: 'tween',
                    duration: 0.2,
                    ease: 'easeInOut',
                }}
            >
                {children}
            </motion.div>
        )}
    </AnimatePresence>
);
