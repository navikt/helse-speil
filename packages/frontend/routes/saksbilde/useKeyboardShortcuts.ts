import { copyString } from '@components/clipboard/util';
import { Key, useKeyboard } from '@hooks/useKeyboard';
import { useNavigation } from '@hooks/useNavigation';
import { useAddToast } from '@state/toasts';
import { usePersonLoadable } from '@state/person';
import { isPerson } from '@utils/typeguards';

const useCurrentFødselsnummer = (): string | null => {
    const person = usePersonLoadable();

    return person.state === 'hasValue' && isPerson(person.contents) ? person.contents.fodselsnummer : null;
};

const useCopyFødselsnummer = (): (() => void) => {
    const fødselsnummer = useCurrentFødselsnummer();
    const addToast = useAddToast();

    return () => {
        if (fødselsnummer) {
            copyString(fødselsnummer, false);
            addToast({
                key: 'kopierFødselsnummerToastKey',
                message: 'Fødselsnummer er kopiert',
                timeToLiveMs: 3000,
            });
        } else {
            addToast({
                key: 'fødselsnummerIkkeKopiert',
                message: 'Fødselsnummer ble ikke kopiert',
                timeToLiveMs: 3000,
            });
        }
    };
};

export const useKeyboardShortcuts = () => {
    const { navigateToNext, navigateToPrevious } = useNavigation();
    const clickPrevious = () => navigateToPrevious?.();
    const clickNext = () => navigateToNext?.();
    const copyFødselsnummer = useCopyFødselsnummer();

    useKeyboard({
        [Key.Left]: { action: clickPrevious, ignoreIfModifiers: true },
        [Key.Right]: { action: clickNext, ignoreIfModifiers: true },
        [Key.C]: { action: copyFødselsnummer, ignoreIfModifiers: false },
    });
};
