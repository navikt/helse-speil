import { RefObject, useLayoutEffect, useState } from 'react';

import { Maybe } from '@io/graphql';

export const useIsWiderThan = (container: RefObject<Maybe<HTMLElement>>, targetWidth: 32) => {
    const [isWider, setIsWider] = useState(false);

    useLayoutEffect(() => {
        const currentContainer = container.current;

        if (currentContainer) {
            const resizeObserver = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    const contentBoxSize = Array.isArray(entry.contentBoxSize)
                        ? entry.contentBoxSize[0]
                        : entry.contentBoxSize;

                    if (contentBoxSize.inlineSize < targetWidth) {
                        setIsWider(false);
                    } else {
                        setIsWider(true);
                    }
                }
            });
            resizeObserver.observe(currentContainer);
            return () => {
                resizeObserver.unobserve(currentContainer);
            };
        }
        return () => {
            // do nothing
        };
    }, [container, targetWidth]);

    return isWider;
};
