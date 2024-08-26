import { useFieldArray, useFormContext } from 'react-hook-form';

import { Kildetype, Maybe } from '@io/graphql';
import { Refusjonsopplysning } from '@typer/overstyring';
import { avrundetToDesimaler } from '@utils/tall';

export interface RefusjonFormFields {
    fom: string;
    tom?: Maybe<string>;
    beløp: number;
    kilde: string;
}

export interface RefusjonFormValues {
    name: string;
    refusjonsopplysninger: RefusjonFormFields[];
}

export function useRefusjonFormField() {
    const { formState, clearErrors } = useFormContext<RefusjonFormValues>();

    const { fields, append, remove, replace, update } = useFieldArray<RefusjonFormValues>({
        name: 'refusjonsopplysninger',
    });

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

    const replaceRefusjonsopplysninger = (refusjonsopplysninger: Refusjonsopplysning[]) => {
        replace(
            refusjonsopplysninger
                .sort(
                    (a: Refusjonsopplysning, b: Refusjonsopplysning) =>
                        new Date(b.fom).getTime() - new Date(a.fom).getTime(),
                )
                .map((refusjonsopplysning) => {
                    return {
                        ...refusjonsopplysning,
                        beløp: avrundetToDesimaler(refusjonsopplysning.beløp),
                    };
                }),
        );
    };

    const updateRefusjonsopplysninger = (
        fom: string,
        tom: Maybe<string>,
        beløp: number,
        index: number,
        kilde = Kildetype.Saksbehandler,
    ) => {
        update(index, { fom, tom, beløp, kilde });
    };

    return {
        fields,
        clearErrors,
        formState,
        addRefusjonsopplysning,
        removeRefusjonsopplysning,
        replaceRefusjonsopplysninger,
        updateRefusjonsopplysninger,
    };
}
