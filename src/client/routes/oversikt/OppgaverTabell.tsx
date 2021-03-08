import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { filtreringState, sorteringState, useOppdaterDefaultFiltrering, useOppdaterDefaultSortering } from './state';
import { renderer, tilOversiktsrad } from './rader';
import { Tabell, useTabell, UseTabellPaginering } from '@navikt/helse-frontend-tabell';
import styled from '@emotion/styled';
import { Oppgave } from '../../../types';
import {
    enArbeidsgiverFilter,
    flereArbeidsgivereFilter,
    forlengelsesfilter,
    førstegangsfilter,
    overgangFraInfotrygdFilter,
    riskQaFilter,
    stikkprøveFilter,
    ufordelteOppgaverFilter,
} from './filtrering';
import { sorterDateString, sorterTall, sorterTekstAlfabetisk } from './sortering';
import { Paginering } from './Paginering';
import { tabState } from './tabs';
import { UseTabellFiltrering } from '@navikt/helse-frontend-tabell/lib/src/useTabell';
import { Filtrering } from '@navikt/helse-frontend-tabell/lib/src/filtrering';
import { flereArbeidsgivere, stikkprøve } from '../../featureToggles';

const Container = styled.div`
    min-height: 300px;
`;

const Oversiktstabell = styled(Tabell)`
    table-layout: fixed;
    border-collapse: collapse;

    thead tr th {
        border-color: var(--navds-color-border);
    }
    tbody tr td {
        white-space: nowrap;
        height: 48px;
    }
    tbody tr:last-of-type td {
        border: none;
    }

    tbody tr:hover td {
        background: var(--speil-light-hover);
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
    const [stashedFilter, setStashedFilter] = useState<Filtrering | undefined>();

    const deaktiverFiltere = () =>
        filtrering?.set((f) => ({
            ...f,
            filtere: f.filtere.map((filter) => ({ ...filter, active: false })),
        }));

    const gjennopprettStashedFilter = () => {
        if (!stashedFilter) return;
        filtrering?.set((f) => ({ ...f, filtere: stashedFilter.filtere }));
    };

    useLayoutEffect(() => {
        if (aktivTab !== 'alle' && !stashedFilter) {
            setStashedFilter(filtrering);
            deaktiverFiltere();
        } else if (aktivTab === 'alle' && stashedFilter) {
            gjennopprettStashedFilter();
            setStashedFilter(undefined);
        }
    }, [aktivTab, stashedFilter]);
};

const useVisDefaultUfordelteOppgaverFiltering = (filtrering: UseTabellFiltrering) => {
    useLayoutEffect(() => {
        filtrering?.set((f) => ({
            ...f,
            filtere: f.filtere.map((filter) =>
                filter.filter.label === 'Ufordelte saker' ? { ...filter, active: true } : { ...filter, active: false }
            ),
        }));
    }, []);
};

export const OppgaverTabell = ({ oppgaver }: { oppgaver: Oppgave[] }) => {
    const aktivTab = useRecoilValue(tabState);
    const aktiveFiltere = useRecoilValue(filtreringState);

    const headere = [
        {
            render: 'Sakstype',
            filtere: [
                førstegangsfilter(),
                forlengelsesfilter(),
                overgangFraInfotrygdFilter(),
                ...(stikkprøve ? [stikkprøveFilter()] : []),
                riskQaFilter(),
            ],
        },
        'Søker',
        {
            render: 'Inntektskilde',
            filtere: flereArbeidsgivere ? [enArbeidsgiverFilter(), flereArbeidsgivereFilter()] : undefined,
        },
        { render: 'Opprettet', sortFunction: sorterDateString },
        { render: 'Bosted', sortFunction: sorterTekstAlfabetisk },
        { render: 'Status', sortFunction: sorterTall },
        { render: 'Tildelt', filtere: [ufordelteOppgaverFilter()] },
        { render: '' },
    ];

    const rader = oppgaver.map(tilOversiktsrad);

    const tabell = useTabell({
        rader: rader,
        headere: headere,
        renderer: renderer,
        defaultSortering: useRecoilValue(sorteringState),
        defaultFiltrering: aktiveFiltere,
        defaultPaginering: {
            sidenummer: 1,
            antallRaderPerSide: 15,
        },
    });

    useOppdaterDefaultFiltrering(tabell.filtrering);
    useOppdaterDefaultSortering(tabell.sortering);
    useVisDefaultUfordelteOppgaverFiltering(tabell.filtrering);
    useOppdaterTildelingsfilterVedFanebytte(tabell.filtrering);

    useEffect(() => {
        tabell.paginering?.set((p) => ({ ...p, sidenummer: 1 }));
    }, [aktivTab, aktiveFiltere]);

    return (
        <Container>
            <Oversiktstabell beskrivelse="Saker som er klare for behandling" {...tabell} />
            <Paginering antallOppgaver={tabell.rader.length} {...(tabell.paginering as UseTabellPaginering)} />
        </Container>
    );
};
