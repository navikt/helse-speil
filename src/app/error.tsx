'use client';

import { useEffect } from 'react';

import { GlobalFeilside } from '@/routes/GlobalFeilside';

export default function Error({ error }: { error: Error }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return <GlobalFeilside error={error} />;
}
