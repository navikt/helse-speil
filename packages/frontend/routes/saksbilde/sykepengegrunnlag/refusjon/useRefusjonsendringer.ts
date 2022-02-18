import { useMemo } from 'react';
import dayjs from 'dayjs';

import { Endring, Refusjon } from '@io/graphql';
import { ISO_DATOFORMAT } from '@utils/date';

const finnFørsteDagEtterAG = (arbeidsgiverperioder: ExternalRefusjon['arbeidsgiverperioder']): Dayjs | null => {
    const førsteAG = [...arbeidsgiverperioder]
        .sort((a, b) => new Date(a.tom).getTime() - new Date(b.tom).getTime())
        .pop();
    return førsteAG ? dayjs(førsteAG.tom).add(1, 'day') : null;
};

export const useRefusjonsendringer = (refusjon: Refusjon): Array<Endring> =>
    useMemo(() => {
        const endringer = [...refusjon.endringer];
        const førsteDagEtterAG = finnFørsteDagEtterAG(refusjon.arbeidsgiverperioder);
        if (førsteDagEtterAG && typeof refusjon.belop === 'number') {
            endringer.push({ dato: førsteDagEtterAG.format(ISO_DATOFORMAT), belop: refusjon.belop });
        }
        return endringer.sort((a, b) => new Date(b.dato).getTime() - new Date(a.dato).getTime());
    }, [refusjon.endringer]);
