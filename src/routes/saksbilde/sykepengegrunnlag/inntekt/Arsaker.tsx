import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Radio, RadioGroup } from '@navikt/ds-react';

import { ÅrsakForOverstyring } from '@typer/overstyring';

const formatterÅrsak = (årsak: ÅrsakForOverstyring): string =>
    `
    ${årsak?.lovhjemmel?.paragraf ? `§ ${årsak?.lovhjemmel.paragraf}` : ''} 
    ${årsak?.lovhjemmel?.ledd ? `(${årsak?.lovhjemmel.ledd}) ` : ''}
    ${årsak?.lovhjemmel?.bokstav ? `${årsak?.lovhjemmel.bokstav} ` : ''} 
    ${årsak?.lovhjemmel?.paragraf ? '- ' : ''}
    ${årsak.forklaring}
  `;

interface ArsakProps {
    årsaker: ÅrsakForOverstyring[];
}

export const Arsaker = ({ årsaker }: ArsakProps) => {
    const { register, formState } = useFormContext();
    const { ref, ...årsakValidation } = register('årsakId', { required: 'Velg en årsak' });
    return (
        <RadioGroup
            legend="Årsak"
            id="årsakId"
            name="årsakId"
            size="small"
            error={formState.errors.årsakId ? (formState.errors.årsakId.message as string) : null}
        >
            {årsaker.map((årsak, index) => (
                <Radio ref={ref} value={årsak.id} key={index} {...årsakValidation}>
                    {formatterÅrsak(årsak)}
                </Radio>
            ))}
        </RadioGroup>
    );
};
