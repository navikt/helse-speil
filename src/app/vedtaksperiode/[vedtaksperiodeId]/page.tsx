import { notFound } from 'next/navigation';
import { ReactElement } from 'react';
import { validate as validateUuid } from 'uuid';

import { Dyplenke } from '@routes/Dyplenke';

export default async function Page({
    params,
}: {
    params: Promise<{ vedtaksperiodeId: string }>;
}): Promise<ReactElement> {
    const { vedtaksperiodeId } = await params;
    if (!validateUuid(vedtaksperiodeId)) notFound();
    return <Dyplenke id={vedtaksperiodeId} />;
}
