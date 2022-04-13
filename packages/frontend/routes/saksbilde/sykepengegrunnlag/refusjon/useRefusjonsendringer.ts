import { useMemo } from 'react';
import dayjs from 'dayjs';

import { ISO_DATOFORMAT } from '@utils/date';

import type { Endring, Refusjon, Refusjonsperiode } from '@io/graphql';

const descendingEndring = (a: Endring, b: Endring): number => new Date(b.dato).getTime() - new Date(a.dato).getTime();

const getDatoUtenOverlapp = (dateString: DateString, arbeidsgiverperioder: Array<Refusjonsperiode>): DateString => {
    let dato = dayjs(dateString);

    for (const periode of arbeidsgiverperioder) {
        const fom = dayjs(periode.fom);
        const tom = dayjs(periode.tom);
        const overlapper = fom.isSameOrBefore(dato) && tom.isSameOrAfter(dato);
        if (overlapper) {
            return tom.add(1, 'day').format(ISO_DATOFORMAT);
        }
    }

    return dato.format(ISO_DATOFORMAT);
};

export const useRefusjonsendringer = (refusjon: Refusjon): Array<Endring> =>
    useMemo(() => {
        const record: Record<DateString, Endring> = {};

        if (typeof refusjon.forsteFravaersdag === 'string' && typeof refusjon.belop === 'number') {
            const dato = getDatoUtenOverlapp(refusjon.forsteFravaersdag, refusjon.arbeidsgiverperioder);
            record[dato] = {
                dato: dato,
                belop: refusjon.belop,
            };
        }

        for (const endring of refusjon.endringer) {
            const dato = getDatoUtenOverlapp(endring.dato, refusjon.arbeidsgiverperioder);
            record[dato] = { ...endring, dato };
        }

        return Object.values(record).sort(descendingEndring);
    }, [refusjon.endringer]);
