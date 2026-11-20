import { ReactElement } from 'react';

import { Alert, BodyShort } from '@navikt/ds-react';

import { SaksbildeBeskjed } from './saksbildeBeskjeder';

const beskjedklasser = 'border-x-0 border-t-0 py-2';

export function Beslutterkontroll({ kontrollpunkter }: { kontrollpunkter: string[] }): ReactElement {
    return (
        <Alert className={beskjedklasser} variant="info" fullWidth>
            <BodyShort weight="semibold">Kontroller:</BodyShort>
            <ul>
                {kontrollpunkter.map((kontrollpunkt) => (
                    <li key={kontrollpunkt}>{kontrollpunkt}</li>
                ))}
            </ul>
        </Alert>
    );
}

export function Beskjed({ grad, tekst }: SaksbildeBeskjed): ReactElement {
    return (
        <Alert className={beskjedklasser} variant={grad} fullWidth>
            <BodyShort className="text-ax-text-neutral">{tekst}</BodyShort>
        </Alert>
    );
}
