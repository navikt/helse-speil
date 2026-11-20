import { ReactElement, useState } from 'react';

import { ApiSaksbildeVarselstatus, ApiVarselDTO } from '@io/rest/generated/spesialist.schemas';
import { cn } from '@utils/tw';

import { Beskjed, Beslutterkontroll } from '../Beskjeder';
import { EkspanderbartVarsel } from '../EkspanderbartVarsel';
import { SaksbildeBeskjed } from '../saksbildeBeskjeder';
import { Varsler } from './Varsler';

interface GammeltVarseldesignProps {
    kontrollpunkter: string[];
    statusbeskjeder: SaksbildeBeskjed[];
    feilbeskjeder: SaksbildeBeskjed[];
    varsler?: ApiVarselDTO[];
}

export function GammeltVarseldesign({
    kontrollpunkter,
    statusbeskjeder,
    feilbeskjeder,
    varsler,
}: GammeltVarseldesignProps): ReactElement | null {
    const [open, setOpen] = useState(true);

    const antallVarsler = varsler?.length ?? 0;
    const skalViseVarsler =
        antallVarsler > 0 || kontrollpunkter.length > 0 || statusbeskjeder.length > 0 || feilbeskjeder.length > 0;
    if (!skalViseVarsler) return null;

    const skjulVarslerHeader = statusbeskjeder.length === 0 && varsler?.length === 0 && feilbeskjeder.length === 0;
    const antallSjekket = varsler?.filter(erSjekket).length ?? 0;
    const headertekst = open
        ? 'Skjul varsler'
        : antallVarsler > 0
          ? `Vis varsler (${antallSjekket} av ${antallVarsler} varsler er sjekket)`
          : 'Vis varsler';

    return (
        <EkspanderbartVarsel aria-label={headertekst} open={open} onToggle={setOpen}>
            <EkspanderbartVarsel.Header
                flexDirection="row-reverse"
                justify="start"
                className={cn('border-b border-ax-border-neutral-subtle', skjulVarslerHeader && 'invisible')}
            >
                {headertekst}
            </EkspanderbartVarsel.Header>
            <EkspanderbartVarsel.Content>
                {kontrollpunkter.length > 0 && <Beslutterkontroll kontrollpunkter={kontrollpunkter} />}
                {statusbeskjeder.map((beskjed) => (
                    <Beskjed key={beskjed.tekst} {...beskjed} />
                ))}
                {varsler && <Varsler varsler={varsler} />}
                {feilbeskjeder.map((beskjed) => (
                    <Beskjed key={beskjed.tekst} {...beskjed} />
                ))}
            </EkspanderbartVarsel.Content>
        </EkspanderbartVarsel>
    );
}

function erSjekket(varsel: ApiVarselDTO): boolean {
    return (
        varsel.vurdering?.status === ApiSaksbildeVarselstatus.VURDERT ||
        varsel.vurdering?.status === ApiSaksbildeVarselstatus.GODKJENT
    );
}
