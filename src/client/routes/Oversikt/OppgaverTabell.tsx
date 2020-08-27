import React, { useEffect, useMemo } from 'react';
import { useRecoilState } from 'recoil';
import { filtreringState, sorteringState } from './state';
import { oversiktsradRenderer, tilOversiktsrad } from './rader';
import { Tabell, useTabell } from '@navikt/helse-frontend-tabell';
import styled from '@emotion/styled';
import { Oppgave } from '../../../types';
import { forlengelsesfilter, førstegangsfilter, overgangFraInfotrygdFilter } from './filtrering';
import { sorterDateString, sorterTall, sorterTekstAlfabetisk, sorterTildeltTil } from './sortering';
import { Paginering as PagineringObject } from '@navikt/helse-frontend-tabell/lib/paginering';
import { Paginering } from './Paginering';
import { UseTabellPaginering } from '@navikt/helse-frontend-tabell/lib/useTabell';

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

const erDev = () => location.hostname === 'speil.nais.preprod.local' || location.hostname === 'localhost';

const defaultPaginering: PagineringObject | undefined = erDev()
    ? {
          sidenummer: 1,
          antallRaderPerSide: 10,
      }
    : undefined;

interface Props {
    oppgaver: Oppgave[];
}

export const OppgaverTabell: React.FunctionComponent<Props> = ({ oppgaver }) => {
    const [defaultFiltrering, setDefaultFiltrering] = useRecoilState(filtreringState);
    const [defaultSortering, setDefaultSortering] = useRecoilState(sorteringState);

    const headere = [
        {
            render: 'Sakstype',
            filtere: [førstegangsfilter(), forlengelsesfilter(), overgangFraInfotrygdFilter()],
        },
        'Søker',
        { render: 'Opprettet', sortFunction: sorterDateString },
        { render: 'Bosted', sortFunction: sorterTekstAlfabetisk },
        { render: 'Status', sortFunction: sorterTall },
        { render: 'Tildelt', sortFunction: sorterTildeltTil },
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

    return (
        <>
            <Oversiktstabell beskrivelse="Saker som er klare for behandling" {...tabell} />
            {erDev() && <Paginering antallOppgaver={oppgaver.length} {...(tabell.paginering as UseTabellPaginering)} />}
        </>
    );
};
