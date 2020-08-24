import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { filtreringState, sorteringState } from './state';
import { oversiktsradRenderer, tilOversiktsrad } from './rader';
import { Tabell, useTabell } from '@navikt/helse-frontend-tabell';
import { Oppgave } from '../../../types';
import styled from '@emotion/styled';
import { forlengelsesfilter, førstegangsfilter, overgangFraInfotrygdFilter } from './filtrering';
import { sorterDateString, sorterTall, sorterTekstAlfabetisk, sorterTildeltTil } from './sortering';

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

    tbody tr:hover td > div {
        background: #e9e7e7;
        cursor: pointer;
    }
`;

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
    const tabell = useTabell({ rader, headere, renderer, defaultSortering, defaultFiltrering });

    useEffect(() => {
        setDefaultSortering(tabell.sortering);
    }, [tabell.sortering]);

    useEffect(() => {
        setDefaultFiltrering(tabell.filtrering);
    }, [tabell.filtrering]);

    return <Oversiktstabell beskrivelse="Saker som er klare for behandling" {...tabell} />;
};
