'use client';

import React, { ReactElement, use } from 'react';

import { Maybe } from '@io/graphql';
import { TilkommenInntektVisning } from '@saksbilde/tilkommenInntekt/visning/TilkommenInntektVisning';

type TilkommenInntektPageProps = {
    params: Promise<{ tilkommenInntektId: string }>;
};

export default function Page({ params }: TilkommenInntektPageProps): Maybe<ReactElement> {
    const { tilkommenInntektId } = use(params);

    return <TilkommenInntektVisning tilkommenInntektId={tilkommenInntektId} />;
}
