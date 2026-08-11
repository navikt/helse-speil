import React, { PropsWithChildren } from 'react';

import { Box, HStack, Tabs, VStack } from '@navikt/ds-react';

import { VisHvisSkrivetilgang } from '@components/VisHvisSkrivetilgang';
import { SaksbildeDropdownMenu } from '@saksbilde/saksbildeMenu/dropdown/SaksbildeDropdownMenu';
import { useFetchPersonQuery } from '@state/person';

export const TilkommenInntektSaksbilde = ({ children }: PropsWithChildren) => {
    const { data: personData } = useFetchPersonQuery();

    return (
        <VStack className="h-full min-w-0 flex-1 [grid-area:content]">
            <Tabs defaultValue="tilkommen-inntekt" size="medium">
                <HStack
                    wrap={false}
                    className="w-full inset-shadow-[0px_-1px] inset-shadow-ax-border-neutral-subtleA [&>*:first-child]:w-fit [&>*:first-child]:inset-shadow-none"
                >
                    <Tabs.List>
                        <Tabs.Tab value="tilkommen-inntekt" label="Tilkommen inntekt" />
                    </Tabs.List>
                    <VisHvisSkrivetilgang>
                        <SaksbildeDropdownMenu person={personData?.person} />
                    </VisHvisSkrivetilgang>
                </HStack>
                <Box overflowX="auto">
                    <Tabs.Panel value="tilkommen-inntekt">{children}</Tabs.Panel>
                </Box>
            </Tabs>
        </VStack>
    );
};
