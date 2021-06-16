import { Dayjs } from 'dayjs';
import React, { ReactNode } from 'react';

export enum Hendelsetype {
    Dokument,
    Historikk,
}

export type Hendelse = {
    id: string;
    title: string;
    type: Hendelsetype;
    timestamp?: Dayjs;
    body?: ReactNode;
};

export type Filter = (hendelse: Hendelse) => boolean;

type HistorikkContextType = {
    hendelser: Hendelse[];
    setFilter: (filter: Filter) => void;
};

export const HistorikkContext = React.createContext<HistorikkContextType>({
    hendelser: [],
    setFilter: () => null,
});
