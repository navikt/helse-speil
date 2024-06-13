import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Radio, RadioGroup } from '@navikt/ds-react';

import { BegrunnelseForOverstyring } from '@typer/overstyring';

import styles from './Begrunnelser.module.css';

const formatterBegrunnelse = (begrunnelse: BegrunnelseForOverstyring): string =>
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
    const form = useFormContext();
    const { ref, ...begrunnelseValidation } = form.register('begrunnelseId', { required: 'Velg en begrunnelse' });
    return (
        <RadioGroup
            legend="Begrunnelse"
            id="begrunnelseId"
            name="begrunnelseId"
            className={styles.begrunnelser}
            error={form.formState.errors.begrunnelse ? (form.formState.errors.begrunnelse.message as string) : null}
        >
            {begrunnelser.map((begrunnelse, index) => (
                <Radio ref={ref} value={begrunnelse.id} key={index} {...begrunnelseValidation}>
                    {formatterBegrunnelse(begrunnelse)}
                </Radio>
            ))}
        </RadioGroup>
    );
};
