import React, { ReactElement } from 'react';

import { EndringsloggGraderteAndreYtelser } from '@components/endringslogg/EndringsloggGraderteAndreYtelser';
import { EndringsloggKildeButton } from '@components/endringslogg/EndringsloggKildeButton';
import { ApiGraderteAndreYtelser } from '@io/rest/generated/spesialist.schemas';

export function EndringsloggAndreYtelserButton({ ytelse }: { ytelse: ApiGraderteAndreYtelser }): ReactElement {
    return (
        <EndringsloggKildeButton
            className="ml-2"
            renderEndringslogg={(onOpenChange) => (
                <EndringsloggGraderteAndreYtelser ytelse={ytelse} onOpenChange={onOpenChange} />
            )}
        />
    );
}
