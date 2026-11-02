import { ReactElement } from 'react';

import { Alert, BodyShort, VStack } from '@navikt/ds-react';

interface GlobalFeilsideProps {
    error: Error;
}

export const GlobalFeilside = ({ error }: GlobalFeilsideProps): ReactElement => {
    return (
        <>
            <Alert size="small" variant="error" className="rounded-none">
                Det har skjedd en feil. Siden kan dessverre ikke vises
            </Alert>
            <VStack as="main" gap="space-32" margin="space-32" className="leading-(--ax-font-line-height-large)">
                <p>
                    Du kan forsøke å laste siden på nytt, eller lukke nettleservinduet og logge inn på nytt.
                    <br />
                    Ta kontakt med en utvikler hvis feilen fortsetter.
                </p>
                <VStack
                    as="pre"
                    gap="space-16"
                    padding="space-32"
                    className="w-max border border-ax-border-danger bg-ax-bg-default leading-(--ax-font-line-height-medium)"
                >
                    <BodyShort weight="semibold">Teknisk feilmelding for utviklere:</BodyShort>
                    {error.stack}
                </VStack>
            </VStack>
        </>
    );
};
