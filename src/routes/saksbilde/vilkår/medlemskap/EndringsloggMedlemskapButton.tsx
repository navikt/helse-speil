import { ReactElement } from 'react';

import { ClockDashedIcon } from '@navikt/aksel-icons';

import { EndringsloggKildeButton } from '@components/endringslogg/EndringsloggKildeButton';
import { EndringsloggMedlemskap } from '@components/endringslogg/EndringsloggMedlemskap';

import { Medlemskapsendring } from './useMedlemskapshistorikk';

interface EndringsloggMedlemskapButtonProps {
    endringer: Medlemskapsendring[];
}

export function EndringsloggMedlemskapButton({ endringer }: EndringsloggMedlemskapButtonProps): ReactElement | null {
    if (endringer.length === 0) {
        return null;
    }

    return (
        <EndringsloggKildeButton
            aria-label="Vis endringslogg for lovvalg og medlemskap"
            ikon={<ClockDashedIcon aria-hidden />}
            kildetype="Endringslogg"
            renderEndringslogg={(onOpenChange) => (
                <EndringsloggMedlemskap endringer={endringer} onOpenChange={onOpenChange} />
            )}
        />
    );
}
