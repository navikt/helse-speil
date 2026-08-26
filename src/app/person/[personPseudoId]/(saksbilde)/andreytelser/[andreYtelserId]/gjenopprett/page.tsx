'use client';

import React, { ReactElement, use } from 'react';

import { GjenopprettAndreYtelserView } from '@saksbilde/andreYtelser/GjenopprettAndreYtelserView';

export default function Page({ params }: { params: Promise<{ andreYtelserId: string }> }): ReactElement {
    const { andreYtelserId } = use(params);

    return <GjenopprettAndreYtelserView andreYtelserId={andreYtelserId} />;
}
