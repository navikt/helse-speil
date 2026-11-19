import { useSkalViseUnder20SykdomsgradsvarselSomFeil } from '@saksbilde/varsler/useSkalViseUnder20Sykdomsgradsvarsel';

import { useSkalViseAvviksvarselSomFeil } from './useSkalViseAvviksvarselSomFeil';
import { useSkalViseMedlemskapsvarselSomFeil } from './useSkalViseMedlemskapsvarselSomFeil';
import { VisSomFeilRegler } from './varselstatus';

export function useVisSomFeilRegler(): { visSomFeil: VisSomFeilRegler; henterMedlemskapsstatus: boolean } {
    const avviksvarsel = useSkalViseAvviksvarselSomFeil();
    const under20Sykdomsgradsvarsel = useSkalViseUnder20SykdomsgradsvarselSomFeil();
    const medlemskapsvarselvisning = useSkalViseMedlemskapsvarselSomFeil();

    return {
        visSomFeil: {
            avviksvarsel,
            under20Sykdomsgradsvarsel,
            medlemskapsvarsel: medlemskapsvarselvisning.skalViseSomFeil,
        },
        henterMedlemskapsstatus: medlemskapsvarselvisning.henterStatus,
    };
}
