import { Dayjs } from 'dayjs';

export interface Tidslinjeutsnitt {
    fom: Dayjs;
    tom: Dayjs;
    label: string;
}
