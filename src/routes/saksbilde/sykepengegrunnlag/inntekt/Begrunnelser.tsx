import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Radio, RadioGroup } from '@navikt/ds-react';

import { BegrunnelseForOverstyring } from '@typer/overstyring';

export const formatterBegrunnelse = (begrunnelse: BegrunnelseForOverstyring): string =>
    `
    ${begrunnelse?.lovhjemmel?.paragraf ? `§ ${begrunnelse?.lovhjemmel.paragraf}` : ''} 
    ${begrunnelse?.lovhjemmel?.ledd ? `(${begrunnelse?.lovhjemmel.ledd}) ` : ''}
    ${begrunnelse?.lovhjemmel?.bokstav ? `${begrunnelse?.lovhjemmel.bokstav} ` : ''} 
    ${begrunnelse?.lovhjemmel?.paragraf ? '- ' : ''}
    ${begrunnelse.forklaring}
  `;

interface BegrunnelserProps {
    begrunnelser: BegrunnelseForOverstyring[];
}

export const Begrunnelser = ({ begrunnelser }: BegrunnelserProps) => {
    const { register, formState } = useFormContext();
    const { ref, ...begrunnelseValidation } = register('begrunnelseId', { required: 'Velg en begrunnelse' });
    return (
        <RadioGroup
            legend="Begrunnelse"
            id="begrunnelseId"
            name="begrunnelseId"
            size="small"
            error={formState.errors.begrunnelseId ? (formState.errors.begrunnelseId.message as string) : null}
        >
            {begrunnelser.map((begrunnelse, index) => (
                <Radio ref={ref} value={begrunnelse.id} key={index} {...begrunnelseValidation}>
                    {formatterBegrunnelse(begrunnelse)}
                </Radio>
            ))}
        </RadioGroup>
    );
};
