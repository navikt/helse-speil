import { ReactElement } from 'react';

import { ApiVarselDTO } from '@io/rest/generated/spesialist.schemas';

import { Varsler } from './Varsler';

interface VarselkortProps {
    varsler: ApiVarselDTO[];
}

export function Varselkort({ varsler }: VarselkortProps): ReactElement {
    return (
        <section aria-label="Varsler">
            <Varsler varsler={varsler} />
        </section>
    );
}
