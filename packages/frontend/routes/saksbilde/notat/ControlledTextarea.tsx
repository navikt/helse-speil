import React from 'react';
import { Control, useController } from 'react-hook-form';
import { useRecoilState } from 'recoil';

import { Textarea } from '@navikt/ds-react';

import { LagretNotat, lokaleNotaterState } from '@state/notater';

interface ControlledTextareaProps {
    vedtaksperiodeId: string;
    control: Control;
}

export const ControlledTextarea = ({ control, vedtaksperiodeId }: ControlledTextareaProps) => {
    const [notater, setNotat] = useRecoilState(lokaleNotaterState);
    const lagretNotat = notater.find((notat) => notat.vedtaksperiodeId === vedtaksperiodeId)?.tekst || '';
    const { field, fieldState } = useController({
        control: control,
        name: 'tekst',
        rules: {
            required: 'Notat må fylles ut',
            maxLength: {
                value: 1000,
                message: `Det er kun tillatt med 1000 tegn`,
            },
        },
        defaultValue: lagretNotat,
    });

    return (
        <Textarea
            {...field}
            error={fieldState.error?.message}
            // value={notater[vedtaksperiodeId]}
            onChange={(e) => {
                field.onChange(e);
                setNotat((currentState: LagretNotat[]) => [
                    ...currentState.filter((notat) => notat.vedtaksperiodeId !== vedtaksperiodeId),
                    {
                        vedtaksperiodeId: vedtaksperiodeId,
                        tekst: e.target.value,
                    },
                ]);
            }}
            label="hei"
            hideLabel
            description="Blir ikke forevist den sykmeldte, med mindre den sykmeldte ber om innsyn."
            maxLength={1000}
            autoFocus
            value={lagretNotat}
        />
    );
};
