'use client';

import React, { ReactElement, use } from 'react';

import { GjenopprettTilkommenInntektView } from '@saksbilde/tilkommenInntekt/saksbilde/GjenopprettTilkommenInntektView';

export default function Page({ params }: { params: Promise<{ tilkommenInntektId: string }> }): ReactElement {
    const { tilkommenInntektId } = use(params);

    return <GjenopprettTilkommenInntektView tilkommenInntektId={tilkommenInntektId} />;
}
