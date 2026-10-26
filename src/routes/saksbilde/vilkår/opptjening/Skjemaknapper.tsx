import React, { ReactElement } from 'react';

import { Alert, Button, HStack } from '@navikt/ds-react';

interface SkjemaknapperProps {
    visLagre?: boolean;
    lagrer: boolean;
    lagringFeilet: boolean;
    onAvbryt: () => void;
}

export function Skjemaknapper({ visLagre = true, lagrer, lagringFeilet, onAvbryt }: SkjemaknapperProps): ReactElement {
    return (
        <>
            <HStack gap="space-8">
                {visLagre && (
                    <Button type="submit" variant="primary" size="small" loading={lagrer}>
                        Lagre
                    </Button>
                )}
                <Button type="button" variant="tertiary" size="small" onClick={onAvbryt}>
                    Avbryt
                </Button>
            </HStack>
            {lagringFeilet && (
                <Alert variant="error" size="small" inline>
                    Kunne ikke lagre vurderingen
                </Alert>
            )}
        </>
    );
}
