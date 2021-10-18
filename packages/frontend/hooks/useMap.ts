import { Dispatch, SetStateAction, useState } from 'react';

type UseMapResult<K, V> = [value: Map<K, V>, setter: Dispatch<SetStateAction<Map<K, V>>>];

export const useMap = <K extends unknown, V extends unknown>(defaultMap?: Map<K, V>): UseMapResult<K, V> => {
    const [map, setMap] = useState<Map<K, V>>(defaultMap ?? new Map());

    const setter: Dispatch<SetStateAction<Map<K, V>>> = (valueOrUpdater) => {
        if (typeof valueOrUpdater === 'function') {
            setMap(new Map(valueOrUpdater(map)));
        } else {
            setMap(new Map(valueOrUpdater));
        }
    };

    return [map, setter];
};
