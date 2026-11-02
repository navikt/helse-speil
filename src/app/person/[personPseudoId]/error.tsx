'use client';

import { useEffect } from 'react';

import { Alert } from '@navikt/ds-react';

import { getFaro } from '@observability/faro';

export default function Error({ error }: { error: Error & { digest?: string } }) {
    useEffect(() => {
        // eslint-disable-next-line no-console
        console.error(error);
        getFaro()?.api.pushError(error);
    }, [error]);

    return (
        <Alert variant="error" size="small" className="col-start-[venstremeny] col-end-[høyremeny] h-max rounded-none">
            {error.message}
        </Alert>
    );
}
