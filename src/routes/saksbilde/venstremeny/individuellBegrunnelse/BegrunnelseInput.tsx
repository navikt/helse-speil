import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';

import { Textarea } from '@navikt/ds-react';

import { AvslagInput, Avslagshandling, Avslagstype, Maybe } from '@io/graphql';

interface BegrunnelseInputProps {
    begrunnelsestype: Avslagstype.Avslag | Avslagstype.DelvisAvslag;
    vedtakBegrunnelseTekst: string;
    setVedtakBegrunnelseTekst: Dispatch<SetStateAction<string>>;
    minRows: number;
    setAvslag: Dispatch<SetStateAction<Maybe<AvslagInput>>>;
    focus: boolean;
}

export const BegrunnelseInput = ({
    begrunnelsestype,
    vedtakBegrunnelseTekst,
    setVedtakBegrunnelseTekst,
    minRows,
    setAvslag,
    focus,
}: BegrunnelseInputProps) => {
    const ref = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        ref.current?.focus();
    }, [focus]);
    return (
        <Textarea
            label=""
            id="begrunnelse"
            value={vedtakBegrunnelseTekst}
            onChange={(event) => {
                setVedtakBegrunnelseTekst(event.target.value);
                if (event.target.value === '') return setAvslag(null);

                setAvslag({
                    handling: Avslagshandling.Opprett,
                    data: {
                        type: begrunnelsestype,
                        begrunnelse: event.target.value,
                    },
                });
            }}
            description="Teksten vises til den sykmeldte i «Svar på søknad om sykepenger»."
            aria-labelledby="begrunnelse-label begrunnelse-feil"
            style={{ whiteSpace: 'pre-line' }}
            minRows={minRows}
            ref={ref}
            autoFocus
        />
    );
};
