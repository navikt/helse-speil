import styled from '@emotion/styled';
import { Oppgave } from 'internal-types';
import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';

import { Tabell, useTabell, UseTabellPaginering } from '@navikt/helse-frontend-tabell';

import { flereArbeidsgivere, stikkprøve } from '../../featureToggles';
import { Paginering } from './Paginering';
import {
    enArbeidsgiverFilter,
    flereArbeidsgivereFilter,
    forlengelsesfilter,
    førstegangsfilter,
    overgangFraInfotrygdFilter,
    revurderingFilter,
    riskQaFilter,
    stikkprøveFilter,
    tildelteOppgaverFilter,
    ufordelteOppgaverFilter,
} from './filtrering';
import { renderer, tilOversiktsrad } from './rader/rader';
import { sorterDateString, sorterTall, sorterTekstAlfabetisk } from './sortering';
import {
    filtreringState,
    sorteringState,
    useOppdaterDefaultFiltrering,
    useOppdaterDefaultSortering,
    useOppdatertFiltreringVedFanebytte,
} from './state';
import { tabState, useAktivTab } from './tabs';

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
            background-color: var(--speil-background-secondary);
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

const useHeadere = () => {
    const aktivTab = useAktivTab();

    return [
        aktivTab === 'alle'
            ? { render: 'Tildelt', filtere: [ufordelteOppgaverFilter(), tildelteOppgaverFilter()] }
            : 'Tildelt',
        {
            render: 'Sakstype',
            filtere: [
                førstegangsfilter(),
                forlengelsesfilter(),
                overgangFraInfotrygdFilter(),
                ...(stikkprøve ? [stikkprøveFilter()] : []),
                riskQaFilter(),
                revurderingFilter(),
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
};

export const OppgaverTabell = ({ oppgaver }: { oppgaver: Oppgave[] }) => {
    const aktivTab = useRecoilValue(tabState);
    const aktiveFiltere = useRecoilValue(filtreringState);

    const headere = useHeadere();
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
    useOppdatertFiltreringVedFanebytte(tabell.filtrering);

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
