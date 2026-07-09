import { AnimatePresence, motion } from 'motion/react';
import React, { PropsWithChildren, ReactElement, useRef } from 'react';

interface AnimatedExpandableDivProps extends PropsWithChildren {
    expanded: boolean;
}

export const AnimatedExpandableDiv = ({ expanded, children }: AnimatedExpandableDivProps): ReactElement => {
    // `overflow: hidden` is only needed while the height is animating (to avoid content
    // flashing outside the collapsed box). At rest, `overflow: visible` lets focus rings
    // and other content that extends slightly outside the box (e.g. a focused Textarea)
    // render without being clipped.
    // The overflow is toggled imperatively (not via React state) so we don't trigger a
    // re-render on every animation start/complete, which was fighting with Framer Motion's
    // own render loop and made the expand/collapse animation sluggish.
    const ref = useRef<HTMLDivElement>(null);

    return (
        <AnimatePresence mode="wait">
            {expanded && (
                <motion.div
                    key="div"
                    ref={ref}
                    style={{ overflow: 'visible' }}
                    initial={{ height: 0 }}
                    exit={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    onAnimationStart={() => {
                        if (ref.current) {
                            ref.current.style.overflow = 'hidden';
                        }
                    }}
                    onAnimationComplete={() => {
                        if (ref.current) {
                            ref.current.style.overflow = 'visible';
                        }
                    }}
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
};
