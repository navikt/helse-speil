import { Dayjs } from 'dayjs';
import { ReactNode } from 'react';

export enum Hendelsetype {
    Dokument,
    Historikk,
}

export type Hendelse = {
    id: string;
    title: ReactNode;
    type: Hendelsetype;
    timestamp?: Dayjs;
    body?: ReactNode;
    icon?: ReactNode;
};

export type Filter = (hendelse: Hendelse) => boolean;
