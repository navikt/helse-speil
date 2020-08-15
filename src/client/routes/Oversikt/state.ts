import { atom } from 'recoil';
import { Sortering } from '@navikt/helse-frontend-tabell/lib/sortering';
import { Filtrering } from '@navikt/helse-frontend-tabell/lib/filtrering';

export const sorteringState = atom<Sortering | undefined>({
    key: 'oversiktstabellState',
    default: undefined,
});

export const filtreringState = atom<Filtrering | undefined>({
    key: 'filtreringState',
    default: undefined,
});
