import { useEffect, useState } from 'react';

export const useElementWidth = ref => {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (ref.current) {
            setWidth(ref.current.offsetWidth);
            window.addEventListener('resize', () => {
                setWidth(ref.current.offsetWidth);
            });
        }
        return () => window.removeEventListener('resize', () => {});
    }, [ref.current]);

    return width;
};
