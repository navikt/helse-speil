'use client';

import React, { ReactElement, use } from 'react';

import { EndreTilkommenInntektView } from '@saksbilde/tilkommenInntekt/saksbilde/EndreTilkommenInntektView';

export default function Page({ params }: { params: Promise<{ tilkommenInntektId: string }> }): ReactElement {
    const { tilkommenInntektId } = use(params);

    return <EndreTilkommenInntektView tilkommenInntektId={tilkommenInntektId} />;
}
