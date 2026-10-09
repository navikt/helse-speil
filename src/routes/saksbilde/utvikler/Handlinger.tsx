import React, { useState } from 'react';

import { Select, VStack } from '@navikt/ds-react';

import { SpleisVedtaksperiode } from '@io/rest/spleis';
import { ForkastVedtaksperiode } from '@saksbilde/utvikler/ForkastVedtaksperiode';
import { PåminnVedtaksperiode } from '@saksbilde/utvikler/PåminnVedtaksperiode';

const handlinger = {
    påminnelse: { label: 'Påminn vedtaksperiode', Komponent: PåminnVedtaksperiode },
    anmodning_om_forkasting: { label: 'Forkast vedtaksperiode', Komponent: ForkastVedtaksperiode },
} as const;

type Handling = keyof typeof handlinger;

interface HandlingerProps {
    vedtaksperiode: SpleisVedtaksperiode;
    fødselsnummer: string;
}

export const Handlinger = ({ vedtaksperiode, fødselsnummer }: HandlingerProps) => {
    const [handling, setHandling] = useState<Handling>('påminnelse');
    const { Komponent } = handlinger[handling];

    return (
        <VStack gap="space-24">
            <Select
                label="Handling"
                size="small"
                className="max-w-[40rem]"
                value={handling}
                onChange={(event) => setHandling(event.target.value as Handling)}
            >
                {Object.entries(handlinger).map(([verdi, { label }]) => (
                    <option key={verdi} value={verdi}>
                        {label}
                    </option>
                ))}
            </Select>
            <Komponent
                key={`${handling}-${vedtaksperiode.id}`}
                vedtaksperiode={vedtaksperiode}
                fødselsnummer={fødselsnummer}
            />
        </VStack>
    );
};
