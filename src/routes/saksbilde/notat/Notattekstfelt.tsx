import React, { ReactElement, ReactNode } from 'react';
import { Control, useController } from 'react-hook-form';

import { Textarea } from '@navikt/ds-react';

import { NotatFormFields } from '@/form-schemas/notatSkjema';
import { useNotatkladd } from '@state/notater';
import { KladdNotatType } from '@typer/notat';

interface NotattekstfeltProps {
    control: Control<NotatFormFields>;
    vedtaksperiodeId: string;
    notatType?: KladdNotatType;
    label?: ReactNode;
    description?: ReactNode;
    hideLabel?: boolean;
}

export function Notattekstfelt({
    control,
    vedtaksperiodeId,
    description,
    label,
    notatType = KladdNotatType.Generelt,
    hideLabel = false,
}: NotattekstfeltProps): ReactElement {
    const { field, fieldState } = useController({ name: 'tekst', control });

    const notatkladd = useNotatkladd();
    const lagretNotat = notatkladd.finnNotatForVedtaksperiode(vedtaksperiodeId, notatType);
    return (
        <Textarea
            {...field}
            label={label}
            hideLabel={hideLabel}
            error={fieldState.error?.message}
            onChange={(e) => {
                field.onChange(e);
                notatkladd.upsertNotat(e.target.value, vedtaksperiodeId, notatType);
            }}
            value={lagretNotat}
            description={description}
            maxLength={2000}
        />
    );
}
