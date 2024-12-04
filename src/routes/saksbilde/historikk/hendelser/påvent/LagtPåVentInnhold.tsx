import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Maybe } from '@io/graphql';
import { UtvidbartInnhold } from '@saksbilde/historikk/hendelser/Historikkhendelse';
import notatStyles from '@saksbilde/historikk/hendelser/notat/Notathendelse.module.css';
import { NORSK_DATOFORMAT } from '@utils/date';

interface LagtPåventinnholdProps {
    expanded: boolean;
    tekst: Maybe<string>;
    årsaker?: string[];
    frist?: string | null;
    erNyesteHistorikkhendelseMedType?: boolean;
}

export const LagtPåventinnhold = ({
    expanded,
    tekst,
    årsaker,
    frist,
    erNyesteHistorikkhendelseMedType,
}: LagtPåventinnholdProps): ReactElement => (
    <>
        <UtvidbartInnhold expanded={expanded}>
            {expanded ? (
                <>
                    <pre className={notatStyles.Notat}>{årsaker?.map((årsak) => årsak + '\n')}</pre>
                    {tekst && årsaker && årsaker.length > 0 && (
                        <>
                            <span className={notatStyles.bold}>Notat</span>
                        </>
                    )}
                    <pre className={notatStyles.Notat}>{tekst}</pre>
                </>
            ) : årsaker && årsaker.length > 0 ? (
                årsaker.map((årsak) => årsak + '\n')
            ) : (
                tekst
            )}
        </UtvidbartInnhold>
        {erNyesteHistorikkhendelseMedType && frist && (
            <BodyShort className={notatStyles.tidsfrist} size="medium">
                Frist: <span className={notatStyles.bold}>{dayjs(frist).format(NORSK_DATOFORMAT)}</span>
            </BodyShort>
        )}
    </>
);
