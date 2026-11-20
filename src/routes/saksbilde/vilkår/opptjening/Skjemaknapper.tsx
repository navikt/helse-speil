import { ReactElement } from 'react';

import { Alert, Button, HStack } from '@navikt/ds-react';

import { ButtonKreverSkrivetilgang } from '@components/skrivetilgang/ButtonKreverSkrivetilgang';

interface SkjemaknapperProps {
    visLagre?: boolean;
    lagrer: boolean;
    lagringFeilet: boolean;
    lagringsfeilmelding?: string;
    onAvbryt: () => void;
}

export function Skjemaknapper({
    visLagre = true,
    lagrer,
    lagringFeilet,
    lagringsfeilmelding = 'Kunne ikke lagre vurderingen',
    onAvbryt,
}: SkjemaknapperProps): ReactElement {
    return (
        <>
            <HStack gap="space-8">
                {visLagre && (
                    <ButtonKreverSkrivetilgang type="submit" variant="primary" size="small" loading={lagrer}>
                        Lagre
                    </ButtonKreverSkrivetilgang>
                )}
                <Button type="button" variant="tertiary" size="small" onClick={onAvbryt}>
                    Avbryt
                </Button>
            </HStack>
            {lagringFeilet && (
                <Alert variant="error" size="small" inline>
                    {lagringsfeilmelding}
                </Alert>
            )}
        </>
    );
}
