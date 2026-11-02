import { useAtom } from 'jotai';

import { atomWithSessionStorage } from '@state/jotai';

export const dialogmeldingLimit = 14;

const dialogmeldingPage = atomWithSessionStorage<number>('dialogmeldingPage', 1);

export const useDialogmeldingPageState: () => [number, (page: number) => void] = () => {
    const [value, setValue] = useAtom(dialogmeldingPage);
    return [value, setValue];
};
