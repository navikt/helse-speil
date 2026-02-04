import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

export const useMounted = () =>
    useSyncExternalStore(
        emptySubscribe,
        () => true, // client value
        () => false, // server value
    );
