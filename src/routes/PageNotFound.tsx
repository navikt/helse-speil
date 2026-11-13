'use client';

import Image from 'next/image';
import { ReactElement, useEffect } from 'react';

import { BodyShort, HStack, Heading, Link, VStack } from '@navikt/ds-react';

import { getFaro } from '@observability/faro';

import nissemyra from '../assets/nissemyra.svg';

export const PageNotFound = (): ReactElement => {
    useEffect(() => {
        getFaro()?.api.pushError(new Error('404 - Page not found (vår egen)'));
    }, []);

    return (
        <HStack as="main" align="center" gap="space-48" wrap={false} className="mx-20 my-18">
            <VStack as="section" gap="space-24" className="*:w-max">
                <BodyShort className="leading-6 font-semibold">Feilkode: 404</BodyShort>
                <Heading className="text-[2.5rem] leading-11" level="2" size="medium">
                    Oooops!
                    <br />
                    Nå havna vi langt ut i nissemyra
                </Heading>
                <Link href="/">Til oppgavelista</Link>
            </VStack>
            <Image
                alt="Agurk med armer og bein ikledd en lue som leser et kart"
                priority={true}
                src={nissemyra}
                unoptimized
            />
        </HStack>
    );
};
