import { useAtom } from 'jotai';

import { atomWithSessionStorage } from '@state/jotai';
import { DateString } from '@typer/shared';

export type TilkommenInntektFormDraft = {
    organisasjonsnummer: string;
    fom: string;
    tom: string;
    periodebeløp: number;
    notat: string;
    ekskluderteUkedager: DateString[];
};

const tilkommenInntektFormDraftAtom = atomWithSessionStorage<Record<string, TilkommenInntektFormDraft>>(
    'tilkommen-inntekt-form-draft',
    {},
);

export const useTilkommenInntektFormDraft = (key: string) => {
    const [drafts, setDrafts] = useAtom(tilkommenInntektFormDraftAtom);

    const draft: TilkommenInntektFormDraft | undefined = drafts[key];

    const setDraft = (values: TilkommenInntektFormDraft) => setDrafts((prev) => ({ ...prev, [key]: values }));

    const clearDraft = () =>
        setDrafts((prev) => {
            const next = { ...prev };
            delete next[key];
            return next;
        });

    return { draft, setDraft, clearDraft };
};
