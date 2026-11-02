import { notFound } from 'next/navigation';
import { ReactElement } from 'react';

import { Dyplenke } from '@routes/Dyplenke';
import { isUuid } from '@utils/uuid';

export default async function Page({
    params,
}: {
    params: Promise<{ vedtaksperiodeId: string }>;
}): Promise<ReactElement> {
    const { vedtaksperiodeId } = await params;
    if (!isUuid(vedtaksperiodeId)) notFound();
    return <Dyplenke id={vedtaksperiodeId} />;
}
