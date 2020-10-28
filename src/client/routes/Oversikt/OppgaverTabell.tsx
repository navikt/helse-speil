import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { filtreringState, sorteringState, useOppdaterDefaultFiltrering, useOppdaterDefaultSortering } from './state';
import { alleOppgaver, mineOppgaver, tilOversiktsrad } from './rader';
import { Tabell, useTabell, UseTabellPaginering } from '@navikt/helse-frontend-tabell';
import styled from '@emotion/styled';
import { Oppgave } from '../../../types';
import {
    forlengelsesfilter,
    førstegangsfilter,
    overgangFraInfotrygdFilter,
    ufordelteOppgaverFilter,
} from './filtrering';
import { sorterDateString, sorterTall, sorterTekstAlfabetisk } from './sortering';
import { Paginering } from './Paginering';
import { pagineringEnabled } from '../../featureToggles';
import { tabState } from './tabs';
import { UseTabellFiltrering } from '@navikt/helse-frontend-tabell/lib/src/useTabell';
import { Filtrering } from '@navikt/helse-frontend-tabell/lib/src/filtrering';

const Oversiktstabell = styled(Tabell)`
    table-layout: fixed;
    border-collapse: collapse;

    thead tr th {
        border-color: #c6c2bf;
    }
    tbody tr td {
        white-space: nowrap;
        height: 48px;
    }
    tbody tr:last-of-type td {
        border: none;
    }

    tbody tr:hover td {
        background: #e9e7e7;
        &:not(:last-of-type) {
            cursor: pointer;
        }
    }

    thead tr th > ul {
        z-index: 1000;
    }
`;

const useOppdaterTildelingsfilterVedFanebytte = (filtrering: UseTabellFiltrering) => {
    const aktivTab = useRecoilValue(tabState);
    const [cachedFilter, setCachedFilter] = useState<Filtrering | undefined>();

    const deaktiverFiltere = () =>
        filtrering?.set((f) => ({
            ...f,
            filtere: f.filtere.map((filter) => ({ ...filter, active: false })),
        }));

    const gjenopprettCachedFilter = () => {
        if (!cachedFilter) return;
        filtrering?.set((f) => ({ ...f, filtere: cachedFilter.filtere }));
    };

    useLayoutEffect(() => {
        if (aktivTab === 'mine' && !cachedFilter) {
            setCachedFilter(filtrering);
            deaktiverFiltere();
        } else if (aktivTab === 'alle' && cachedFilter) {
            gjenopprettCachedFilter();
            setCachedFilter(undefined);
        }
    }, [aktivTab, cachedFilter]);
};

const useTabellheadere = () => {
    const aktivTab = useRecoilValue(tabState);
    const headere = [
        {
            render: 'Sakstype',
            filtere: [førstegangsfilter(), forlengelsesfilter(), overgangFraInfotrygdFilter()],
        },
        'Søker',
        { render: 'Opprettet', sortFunction: sorterDateString },
        { render: 'Bosted', sortFunction: sorterTekstAlfabetisk },
        { render: 'Status', sortFunction: sorterTall },
        { render: 'Tildelt', filtere: [ufordelteOppgaverFilter()] },
    ];
    return aktivTab === 'alle' ? headere : headere.slice(0, -1);
};

const useTabellrader = (oppgaver: Oppgave[]) => {
    const aktivTab = useRecoilValue(tabState);
    const rader = oppgaver.map(tilOversiktsrad);
    return aktivTab === 'alle' ? rader : rader.map((rad) => ({ ...rad, celler: rad.celler.slice(0, -1) }));
};

interface Props {
    oppgaver: Oppgave[];
}

export const OppgaverTabell: React.FunctionComponent<Props> = ({ oppgaver }) => {
    const aktivTab = useRecoilValue(tabState);

    const tabell = useTabell({
        rader: useTabellrader(oppgaver),
        headere: useTabellheadere(),
        renderer: aktivTab === 'alle' ? alleOppgaver : mineOppgaver,
        defaultSortering: useRecoilValue(sorteringState),
        defaultFiltrering: useRecoilValue(filtreringState),
        defaultPaginering: {
            sidenummer: 1,
            antallRaderPerSide: 15,
        },
    });

    useOppdaterDefaultFiltrering(tabell.filtrering);
    useOppdaterDefaultSortering(tabell.sortering);
    useOppdaterTildelingsfilterVedFanebytte(tabell.filtrering);

    useEffect(() => {
        tabell.paginering?.set((p) => ({ ...p, sidenummer: 1 }));
    }, [aktivTab]);

    return (
        <>
            <Oversiktstabell beskrivelse="Saker som er klare for behandling" {...tabell} />
            {pagineringEnabled && (
                <Paginering antallOppgaver={tabell.rader.length} {...(tabell.paginering as UseTabellPaginering)} />
            )}
        </>
    );
};
