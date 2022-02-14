import { copyString } from '@components/clipboard/util';
import { Key, useKeyboard } from '@hooks/useKeyboard';
import { useNavigation } from '@hooks/useNavigation';
import { ToastObject, useAddToast } from '@state/toasts';

const kopiertFødelsnummerToast = ({
    message = 'Fødselsnummer er kopiert',
    timeToLiveMs = 3000,
}: Partial<ToastObject>): ToastObject => ({
    key: 'kopierFødselsnummerToastKey',
    message,
    timeToLiveMs,
});

export const useKeyboardShortcuts = (person?: Person) => {
    const { navigateToNext, navigateToPrevious } = useNavigation();
    const clickPrevious = () => navigateToPrevious?.();
    const clickNext = () => navigateToNext?.();
    const addToast = useAddToast();
    const copyFødselsnummer = () => {
        copyString(person?.fødselsnummer ?? '', false);
        addToast(kopiertFødelsnummerToast({}));
    };

    useKeyboard({
        [Key.Left]: { action: clickPrevious, ignoreIfModifiers: true },
        [Key.Right]: { action: clickNext, ignoreIfModifiers: true },
        [Key.C]: { action: copyFødselsnummer, ignoreIfModifiers: false },
    });
};
