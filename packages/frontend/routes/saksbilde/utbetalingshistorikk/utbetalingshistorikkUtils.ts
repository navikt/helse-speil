import dayjs from 'dayjs';

import { Spennoppdrag } from '@io/graphql';

export const getTom = (oppdrag: Spennoppdrag): Dayjs | undefined =>
    oppdrag.linjer.length > 0
        ? oppdrag.linjer.reduce((last, { tom }) => (last.isBefore(dayjs(tom)) ? dayjs(tom) : last), dayjs(0))
        : undefined;
