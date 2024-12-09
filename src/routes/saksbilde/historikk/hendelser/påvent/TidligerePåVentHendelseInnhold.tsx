import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { UtvidbartInnhold } from '@saksbilde/historikk/hendelser/Historikkhendelse';
import notatStyles from '@saksbilde/historikk/hendelser/notat/Notathendelse.module.css';
import { NORSK_DATOFORMAT } from '@utils/date';

interface TidligerePåVentHendelseInnholdProps {
    expanded: boolean;
    tekst: string | null;
    årsaker?: string[];
    frist?: string | null;
}

export const TidligerePåVentHendelseInnhold = ({
    expanded,
    tekst,
    årsaker,
    frist,
}: TidligerePåVentHendelseInnholdProps): ReactElement => (
    <>
        <UtvidbartInnhold expanded={expanded}>
            {expanded && (
                <>
                    <pre className={notatStyles.Notat}>{årsaker?.map((årsak) => årsak + '\n')}</pre>
                    {tekst && årsaker && årsaker.length > 0 && (
                        <>
                            <span className={notatStyles.bold}>Notat</span>
                        </>
                    )}
                    <pre className={notatStyles.Notat}>{tekst}</pre>
                    {frist && (
                        <BodyShort className={notatStyles.tidsfrist} size="medium">
                            Frist: <span className={notatStyles.bold}>{dayjs(frist).format(NORSK_DATOFORMAT)}</span>
                        </BodyShort>
                    )}
                </>
            )}
        </UtvidbartInnhold>
    </>
);
