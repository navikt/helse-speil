import styled from '@emotion/styled';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Radio, RadioGroup } from '@navikt/ds-react';

import { BegrunnelseForOverstyring } from '../overstyring/overstyring.types';

const BegrunnelseFieldset = styled(RadioGroup)`
    > .navds-radio {
        padding: 0;
    }

    margin-bottom: 2rem;
`;

const formatterBegrunnelse = (begrunnelse: BegrunnelseForOverstyring): string =>
    `
    ${begrunnelse?.subsumsjon?.paragraf ? `§ ${begrunnelse?.subsumsjon.paragraf}` : ''} 
    ${begrunnelse?.subsumsjon?.ledd ? `(${begrunnelse?.subsumsjon.ledd}) ` : ''}
    ${begrunnelse?.subsumsjon?.bokstav ? `${begrunnelse?.subsumsjon.bokstav} ` : ''} 
    ${begrunnelse?.subsumsjon?.paragraf ? '- ' : ''}
    ${begrunnelse.forklaring}
  `;

interface BegrunnelserProps {
    begrunnelser: BegrunnelseForOverstyring[];
}

export const Begrunnelser = ({ begrunnelser }: BegrunnelserProps) => {
    const form = useFormContext();
    const { ref, ...begrunnelseValidation } = form.register('begrunnelseId', { required: 'Velg en begrunnelse' });
    return (
        <BegrunnelseFieldset
            legend="Begrunnelse"
            id="begrunnelseId"
            name="begrunnelseId"
            error={form.formState.errors.begrunnelse ? (form.formState.errors.begrunnelse.message as string) : null}
        >
            {begrunnelser.map((begrunnelse, index) => (
                <Radio ref={ref} value={begrunnelse.id} key={index} {...begrunnelseValidation}>
                    {formatterBegrunnelse(begrunnelse)}
                </Radio>
            ))}
        </BegrunnelseFieldset>
    );
};
