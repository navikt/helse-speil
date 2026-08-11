import React from 'react';

import { HStack, VStack } from '@navikt/ds-react';

import { erUtvikling } from '@/env';
import { VisHvisSkrivetilgang } from '@components/VisHvisSkrivetilgang';
import { SaksbildeDropdownMenu } from '@saksbilde/saksbildeMenu/dropdown/SaksbildeDropdownMenu';
import { LeggTilTilkommenInntektView } from '@saksbilde/tilkommenInntekt/saksbilde/LeggTilTilkommenInntektView';
import { LeggTilTilkommenInntektEllerAndreYtelserView } from '@saksbilde/tilkommenInntekt/saksbilde/LeggTilTilkommenInntektEllerAndreYtelserView';
import { useFetchPersonQuery } from '@state/person';

export const TilkommenInntektSaksbilde = () => {
    const { data: personData } = useFetchPersonQuery();

    return (
        <VStack className="h-full min-w-0 flex-1 [grid-area:content]">
            <HStack wrap={false} className="w-full inset-shadow-[0px_-1px] inset-shadow-ax-border-neutral-subtleA">
                <VisHvisSkrivetilgang>
                    <SaksbildeDropdownMenu person={personData?.person} />
                </VisHvisSkrivetilgang>
            </HStack>
            {!erUtvikling && <LeggTilTilkommenInntektEllerAndreYtelserView />}
            {erUtvikling && <LeggTilTilkommenInntektView />}
        </VStack>
    );
};
