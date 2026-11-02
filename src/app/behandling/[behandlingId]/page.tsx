import { notFound } from 'next/navigation';
import { ReactElement } from 'react';

import { Dyplenke } from '@routes/Dyplenke';
import { isUuid } from '@utils/uuid';

export default async function Page({ params }: { params: Promise<{ behandlingId: string }> }): Promise<ReactElement> {
    const { behandlingId } = await params;
    if (!isUuid(behandlingId)) notFound();
    return <Dyplenke id={behandlingId} />;
}
