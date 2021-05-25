import { useEffect } from 'react';
import { atom, useRecoilState, useSetRecoilState } from 'recoil';

import { Filtrering } from '@navikt/helse-frontend-tabell/lib/src/filtrering';
import { Sortering } from '@navikt/helse-frontend-tabell/lib/src/sortering';

export const sorteringState = atom<Sortering | undefined>({
    key: 'oversiktstabellState',
    default: undefined,
});

export const filtreringState = atom<Filtrering | undefined>({
    key: 'filtreringState',
    default: undefined,
});

export const useOppdaterDefaultSortering = (sortering: Sortering) => {
    const setDefaultSortering = useSetRecoilState(sorteringState);
    useEffect(() => {
        setDefaultSortering(sortering);
    }, [sortering]);
};

export const useOppdaterDefaultFiltrering = (filtrering: Filtrering) => {
    const [defaultFiltrering, setDefaultFiltrering] = useRecoilState(filtreringState);
    useEffect(() => {
        if (defaultFiltrering?.filtere !== filtrering.filtere) {
            setDefaultFiltrering(filtrering);
        }
    }, [filtrering]);
};
