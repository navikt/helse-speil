import { useRef } from 'react';
import { useFieldArray } from 'react-hook-form';

import { Kildetype } from '@io/graphql';
import { Refusjonsopplysning } from '@typer/overstyring';
import { avrundetToDesimaler } from '@utils/tall';

export interface RefusjonFormFields {
    fom: string;
    tom?: string | null;
    beløp: number;
    kilde: string;
}

export interface RefusjonFormValues {
    name: string;
    refusjonsopplysninger: RefusjonFormFields[];
}

const sortAndMapRefusjonsopplysninger = (refusjonsopplysninger: Refusjonsopplysning[]): RefusjonFormFields[] => {
    return refusjonsopplysninger
        .sort((a: Refusjonsopplysning, b: Refusjonsopplysning) => new Date(b.fom).getTime() - new Date(a.fom).getTime())
        .map((refusjonsopplysning) => ({
            ...refusjonsopplysning,
            beløp: avrundetToDesimaler(refusjonsopplysning.beløp),
        }));
};

export function useRefusjonFormField(initialRefusjonsopplysninger: Refusjonsopplysning[]) {
    const hasInitialized = useRef(false);
    const { fields, append, remove, replace, update } = useFieldArray<RefusjonFormValues>({
        name: 'refusjonsopplysninger',
    });

    if (!hasInitialized.current) {
        hasInitialized.current = true;
        replace(sortAndMapRefusjonsopplysninger(initialRefusjonsopplysninger));
    }

    const addRefusjonsopplysning = () => {
        append({
            fom: '',
            tom: null,
            beløp: 0,
            kilde: Kildetype.Saksbehandler,
        });
    };

    const removeRefusjonsopplysning = (index: number) => () => {
        remove(index);
    };

    const updateRefusjonsopplysninger = (
        fom: string,
        tom: string | null,
        beløp: number,
        index: number,
        kilde = Kildetype.Saksbehandler,
    ) => {
        update(index, { fom, tom, beløp, kilde });
    };

    return {
        fields,
        addRefusjonsopplysning,
        removeRefusjonsopplysning,
        updateRefusjonsopplysninger,
    };
}
