'use client';

import dayjs from 'dayjs';
import { useTheme } from 'next-themes';
import React, { PropsWithChildren, ReactElement, useRef, useState } from 'react';

import { BellFillIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack, Heading, InternalHeader, Popover, Theme } from '@navikt/ds-react';

import { Nyhet } from '@components/header/nyheter/Nyhet';
import { BjelleDottIkon } from '@components/ikoner/BjelleDottIkon';
import { useNyheter } from '@external/sanity';
import { useMounted } from '@hooks/useMounted';

const SISTE_NYHET_OPPRETTET_KEY = 'sisteNyhetOpprettet';

export function Nyheter(): ReactElement {
    const { nyheter, loading } = useNyheter();
    const { resolvedTheme } = useTheme();
    const mounted = useMounted();
    const sisteNyhet = nyheter[0];
    const harBlittÅpnet = useRef(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [open, setOpen] = useState(false);

    const skalViseIkonMedPrikk = !loading && !harBlittÅpnet.current && harNyNyhet(sisteNyhet?._createdAt);

    const handleToggle = () => {
        const nextOpen = !open;
        setOpen(nextOpen);
        if (nextOpen) {
            harBlittÅpnet.current = true;
            localStorage.setItem(SISTE_NYHET_OPPRETTET_KEY, JSON.stringify(sisteNyhet?._createdAt));
        }
    };

    return (
        <>
            <InternalHeader.Button ref={buttonRef} aria-label="Nyheter i Speil" onClick={handleToggle}>
                {skalViseIkonMedPrikk ? <BjelleDottIkon /> : <BellFillIcon title="nyheter i speil" fontSize="26px" />}
            </InternalHeader.Button>
            {mounted && (
                <Theme theme={resolvedTheme as 'light' | 'dark'}>
                    <Popover
                        anchorEl={buttonRef.current}
                        open={open}
                        onClose={() => setOpen(false)}
                        placement="bottom-end"
                    >
                        <Popover.Content className="max-h-184 w-100 overflow-y-hidden p-0">
                            <Heading
                                level="2"
                                size="xsmall"
                                className="rounded-tl-xl rounded-tr-xl bg-ax-bg-accent-strong px-4 py-3 text-ax-text-neutral-contrast"
                            >
                                Nytt i Speil
                            </Heading>
                            {nyheter.length > 0 ? (
                                <ScrollableContainer>
                                    {nyheter.map((nyhet) => (
                                        <Nyhet key={nyhet._id} nyhet={nyhet} />
                                    ))}
                                </ScrollableContainer>
                            ) : (
                                <HStack justify="center" align="center" paddingBlock="space-16 space-16">
                                    <BodyShort>Ingen nyheter</BodyShort>
                                </HStack>
                            )}
                        </Popover.Content>
                    </Popover>
                </Theme>
            )}
        </>
    );
}

const ScrollableContainer = ({ children }: PropsWithChildren) => {
    return (
        <ul className="m-0 max-h-[566px] w-full list-none divide-y divide-ax-border-neutral overflow-y-auto px-4">
            {children}
        </ul>
    );
};

const harNyNyhet = (sisteNyhetOpprettet: string | undefined): boolean => {
    if (typeof window === 'undefined') return false;
    if (!sisteNyhetOpprettet) return false;
    const lagretSisteNyhetOpprettet = localStorage.getItem(SISTE_NYHET_OPPRETTET_KEY);

    if (lagretSisteNyhetOpprettet === null) return true;

    return dayjs(sisteNyhetOpprettet).isAfter(JSON.parse(lagretSisteNyhetOpprettet));
};
