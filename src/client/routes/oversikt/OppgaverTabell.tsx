import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { filtreringState, sorteringState, useOppdaterDefaultFiltrering, useOppdaterDefaultSortering } from './state';
import { renderer, tilOversiktsrad } from './rader';
import { Tabell, useTabell, UseTabellPaginering } from '@navikt/helse-frontend-tabell';
import styled from '@emotion/styled';
import {
    enArbeidsgiverFilter,
    flereArbeidsgivereFilter,
    forlengelsesfilter,
    førstegangsfilter,
    overgangFraInfotrygdFilter,
    riskQaFilter,
    stikkprøveFilter,
    tildelteOppgaverFilter,
    ufordelteOppgaverFilter,
} from './filtrering';
import { sorterDateString, sorterTall, sorterTekstAlfabetisk } from './sortering';
import { Paginering } from './Paginering';
import { tabState } from './tabs';
import { UseTabellFiltrering } from '@navikt/helse-frontend-tabell/lib/src/useTabell';
import { Filtrering } from '@navikt/helse-frontend-tabell/lib/src/filtrering';
import { flereArbeidsgivere, stikkprøve } from '../../featureToggles';
import { Oppgave } from 'internal-types';

const Container = styled.div`
    min-height: 300px;
`;

const Oversiktstabell = styled(Tabell)`
    table-layout: fixed;
    border-collapse: collapse;

    thead tr th {
        border-color: var(--navds-color-border);
        padding: 1rem 1rem 1.5rem 1rem;

        &,
        button {
            font-size: 1rem;
            font-weight: normal;
        }
    }
    tbody tr {
        :nth-of-type(2n + 1) {
            background-color: #f8f8f8;
        }
        td {
            white-space: nowrap;
            padding: 0 1.5rem 0 1rem;
        }
    }
    tbody tr:last-of-type td {
        border-bottom: 1px solid #c6c2bf;
    }

    tbody tr:hover td {
        background: var(--speil-light-hover-tabell);
        &:not(:last-of-type) {
            cursor: pointer;
        }
    }

    thead tr th > ul {
        z-index: 1000;
    }
`;

const ScrollableX = styled.div`
    overflow: auto hidden;
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
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
        { render: 'Tildelt', filtere: [ufordelteOppgaverFilter(), tildelteOppgaverFilter()] },
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
        { render: 'Bosted', sortFunction: sorterTekstAlfabetisk },
        {
            render: 'Inntektskilde',
            filtere: flereArbeidsgivere ? [enArbeidsgiverFilter(), flereArbeidsgivereFilter()] : undefined,
        },
        { render: 'Status', sortFunction: sorterTall },
        'Søker',
        { render: 'Opprettet', sortFunction: sorterDateString },
        { render: '' },
    ];

    const rader = oppgaver.map(tilOversiktsrad);

    const tabell = useTabell({
        rader,
        headere,
        renderer: (rad) => renderer(rad),
        defaultSortering: useRecoilValue(sorteringState),
        defaultFiltrering: aktiveFiltere,
        defaultPaginering: {
            sidenummer: 1,
            antallRaderPerSide: 20,
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
            <ScrollableX>
                <Oversiktstabell beskrivelse="Saker som er klare for behandling" {...tabell} />
            </ScrollableX>
            <Paginering antallOppgaver={tabell.rader.length} {...(tabell.paginering as UseTabellPaginering)} />
        </Container>
    );
};
