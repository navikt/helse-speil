import { notFound } from 'next/navigation';
import { ReactElement } from 'react';
import { validate as validateUuid } from 'uuid';

import { Dyplenke } from '@routes/Dyplenke';

export default async function Page({ params }: { params: Promise<{ behandlingId: string }> }): Promise<ReactElement> {
    const { behandlingId } = await params;
    if (!validateUuid(behandlingId)) notFound();
    return <Dyplenke id={behandlingId} />;
}
