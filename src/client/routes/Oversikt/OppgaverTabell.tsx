import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { filtreringState, sorteringState } from './state';
import { oversiktsradRenderer, tilOversiktsrad } from './rader';
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
import { Paginering as PagineringObject } from '@navikt/helse-frontend-tabell/lib/src/paginering';
import { Paginering } from './Paginering';
import { pagineringEnabled } from '../../featureToggles';
import { tabState } from './tabs';

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

const defaultPaginering: PagineringObject | undefined = pagineringEnabled
    ? {
          sidenummer: 1,
          antallRaderPerSide: 15,
      }
    : undefined;

interface Props {
    oppgaver: Oppgave[];
}

export const OppgaverTabell: React.FunctionComponent<Props> = ({ oppgaver }) => {
    const [defaultFiltrering, setDefaultFiltrering] = useRecoilState(filtreringState);
    const [defaultSortering, setDefaultSortering] = useRecoilState(sorteringState);
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

    const rader = oppgaver.map(tilOversiktsrad);
    const renderer = oversiktsradRenderer;
    const tabell = useTabell({ rader, headere, renderer, defaultSortering, defaultFiltrering, defaultPaginering });

    useEffect(() => {
        setDefaultSortering(tabell.sortering);
    }, [tabell.sortering]);

    useEffect(() => {
        setDefaultFiltrering(tabell.filtrering);
    }, [tabell.filtrering]);

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
