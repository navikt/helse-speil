import { useEffect, useRef } from 'react';

export const useFocusRef = predicate => {
    const ref = useRef();

    useEffect(() => {
        if (predicate) {
            ref.current?.focus();
        }
    }, [predicate]);

    return ref;
};
