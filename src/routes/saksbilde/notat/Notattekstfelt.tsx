import React from 'react';
import { Control, useController } from 'react-hook-form';

import { Textarea } from '@navikt/ds-react';

import { NotatFormFields } from '@/form-schemas/notatSkjema';
import { KladdNotatType } from '@io/rest/generated/spesialist.schemas';
import { useNotatkladd } from '@state/notater';

export function Notattekstfelt({
    control,
    vedtaksperiodeId,
    notatType = KladdNotatType.Generelt,
}: {
    control: Control<NotatFormFields>;
    vedtaksperiodeId: string;
    notatType?: KladdNotatType;
}) {
    const { field, fieldState } = useController({ name: 'tekst', control });

    const notatkladd = useNotatkladd();
    const lagretNotat = notatkladd.finnNotatForVedtaksperiode(vedtaksperiodeId, notatType);
    return (
        <Textarea
            {...field}
            label="tekst"
            hideLabel
            error={fieldState.error?.message}
            onChange={(e) => {
                field.onChange(e);
                notatkladd.upsertNotat(e.target.value, vedtaksperiodeId, notatType);
            }}
            value={lagretNotat}
            description="Teksten vises ikke til den sykmeldte, med mindre hen ber om innsyn."
            maxLength={2000}
        />
    );
}
