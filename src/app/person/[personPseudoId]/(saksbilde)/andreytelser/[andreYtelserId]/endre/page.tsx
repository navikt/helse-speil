'use client';

import React, { ReactElement, use } from 'react';

import { EndreAndreYtelserView } from '@saksbilde/andreYtelser/EndreAndreYtelserView';

export default function Page({ params }: { params: Promise<{ andreYtelserId: string }> }): ReactElement {
    const { andreYtelserId } = use(params);

    return <EndreAndreYtelserView andreYtelserId={andreYtelserId} />;
}
