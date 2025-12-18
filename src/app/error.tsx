'use client';

import { useEffect } from 'react';

import { getFaro } from '@observability/faro';
import { GlobalFeilside } from '@routes/GlobalFeilside';

export default function Error({ error }: { error: Error }) {
    useEffect(() => {
        // eslint-disable-next-line no-console
        console.error(error);
        getFaro()?.api.pushError(error);
    }, [error]);

    return <GlobalFeilside error={error} />;
}
