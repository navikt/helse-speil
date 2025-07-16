import React, { Dispatch, SetStateAction } from 'react';

import { Textarea } from '@navikt/ds-react';

interface BegrunnelseInputProps {
    vedtakBegrunnelseTekst: string;
    setVedtakBegrunnelseTekst: Dispatch<SetStateAction<string>>;
    minRows: number;
}

export const BegrunnelseInput = ({
    vedtakBegrunnelseTekst,
    setVedtakBegrunnelseTekst,
    minRows,
}: BegrunnelseInputProps) => (
    <Textarea
        label=""
        id="begrunnelse"
        value={vedtakBegrunnelseTekst}
        onChange={(event) => {
            setVedtakBegrunnelseTekst(event.target.value);
        }}
        description="Teksten vises til den sykmeldte i «Svar på søknad om sykepenger»."
        aria-labelledby="begrunnelse-label begrunnelse-feil"
        style={{ whiteSpace: 'pre-line' }}
        minRows={minRows}
    />
);
