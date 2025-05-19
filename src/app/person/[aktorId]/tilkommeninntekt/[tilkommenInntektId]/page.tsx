'use client';

import React, { ReactElement, use } from 'react';

import { Maybe } from '@io/graphql';
import { TilkommenInntektView } from '@saksbilde/tilkommenInntekt/saksbilde/TilkommenInntektView';

type TilkommenInntektPageProps = {
    params: Promise<{ tilkommenInntektId: string }>;
};

export default function Page({ params }: TilkommenInntektPageProps): Maybe<ReactElement> {
    const { tilkommenInntektId } = use(params);

    return <TilkommenInntektView tilkommenInntektId={tilkommenInntektId} />;
}
