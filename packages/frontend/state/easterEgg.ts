import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

type ActiveEasterEggs = {
    Agurk: boolean;
};

const defaultActiveEasterEggs: ActiveEasterEggs = {
    Agurk: false,
};

const activeEasterEggsState = atom<ActiveEasterEggs>({
    key: 'showEasterEgg',
    default: defaultActiveEasterEggs,
});

export const useToggleEasterEgg = () => {
    const setActiveEasterEggs = useSetRecoilState(activeEasterEggsState);
    return (key: keyof ActiveEasterEggs): void => {
        setActiveEasterEggs((eggs) => ({
            ...eggs,
            [key]: !eggs[key],
        }));
    };
};
1;
export const useEasterEggIsActive = () => {
    const activeEasterEggs = useRecoilValue(activeEasterEggsState);
    return (key: keyof ActiveEasterEggs): boolean => activeEasterEggs[key];
};
