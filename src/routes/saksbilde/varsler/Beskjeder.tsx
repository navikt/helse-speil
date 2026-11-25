import { ReactElement, ReactNode, useId } from 'react';

import { Box, InlineMessage } from '@navikt/ds-react';

import { SaksbildeBeskjed } from './saksbildeBeskjeder';

export function Beslutterkontroll({ kontrollpunkter }: { kontrollpunkter: string[] }): ReactElement {
    const overskriftId = useId();
    return (
        <Beskjedboks grad="info">
            <span id={overskriftId} className="block font-semibold">
                Kontroller:
            </span>
            <ul aria-labelledby={overskriftId}>
                {kontrollpunkter.map((kontrollpunkt) => (
                    <li key={kontrollpunkt}>{kontrollpunkt}</li>
                ))}
            </ul>
        </Beskjedboks>
    );
}

export function Beskjed({ grad, tekst }: SaksbildeBeskjed): ReactElement {
    return <Beskjedboks grad={grad}>{tekst}</Beskjedboks>;
}

interface BeskjedboksProps {
    grad: SaksbildeBeskjed['grad'];
    children: ReactNode;
}

export function Beskjedboks({ grad, children }: BeskjedboksProps): ReactElement {
    const farge = grad === 'error' ? 'danger' : grad;
    return (
        <Box
            margin="space-12"
            padding="space-8"
            background={`${farge}-soft`}
            borderColor={`${farge}-subtle`}
            borderWidth="1"
            borderRadius="8"
        >
            <InlineMessage status={grad}>{children}</InlineMessage>
        </Box>
    );
}
