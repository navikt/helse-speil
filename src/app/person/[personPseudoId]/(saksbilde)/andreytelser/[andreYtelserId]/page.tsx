'use client';

import React, { ReactElement, use } from 'react';

import { GraderteAndreYtelserView } from '@saksbilde/andreYtelser/GraderteAndreYtelserView';

type AndreYtelserPageProps = {
    params: Promise<{ andreYtelserId: string }>;
};

export default function Page({ params }: AndreYtelserPageProps): ReactElement | null {
    const { andreYtelserId } = use(params);

    return <GraderteAndreYtelserView andreYtelserId={andreYtelserId} />;
}
