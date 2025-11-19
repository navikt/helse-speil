'use client';

import React, { ReactElement, use } from 'react';

import { TilkommenInntektView } from '@saksbilde/tilkommenInntekt/saksbilde/TilkommenInntektView';

type TilkommenInntektPageProps = {
    params: Promise<{ tilkommenInntektId: string }>;
};

export default function Page({ params }: TilkommenInntektPageProps): ReactElement | null {
    const { tilkommenInntektId } = use(params);

    return <TilkommenInntektView tilkommenInntektId={tilkommenInntektId} />;
}
