import { useEffect } from 'react';

export const useInterval = ({ callback = () => {}, interval = 0 }) => {
    useEffect(() => {
        callback();
        const id = window.setInterval(callback, interval);
        return () => window.clearInterval(id);
    }, [callback]);
};
