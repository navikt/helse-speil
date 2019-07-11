import { useEffect, useState } from 'react';

export const useElementSize = ref => {
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (ref.current) {
            setHeight(ref.current.offsetHeight);
            setWidth(ref.current.offsetWidth);
        }
    }, [ref.current]);

    return [height, width];
};
