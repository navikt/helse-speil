import { useEffect, useRef, useState } from 'react';

export const useDebounce = (triggerCondition: boolean, delayMs: number = 250) => {
    const [currentCondition, setCurrentCondition] = useState(false);
    const conditionRef = useRef(false);

    useEffect(() => {
        if (triggerCondition) {
            const id = setTimeout(() => {
                if (conditionRef.current) {
                    setCurrentCondition(true);
                }
            }, delayMs);
            return () => clearTimeout(id);
        } else {
            setCurrentCondition(false);
        }
        return () => null;
    }, [triggerCondition]);

    useEffect(() => {
        conditionRef.current = triggerCondition;
    }, [triggerCondition]);

    return currentCondition;
};
