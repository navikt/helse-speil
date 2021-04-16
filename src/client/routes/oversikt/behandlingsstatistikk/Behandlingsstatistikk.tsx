import React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import styled from '@emotion/styled';
import { getBehandlingsstatistikk } from '../../../io/http';
import { Behandlingsstatistikk as Statistikk } from 'internal-types';
import { EksternBehandlingstatistikk } from 'external-types';
import { selector, useRecoilValueLoadable } from 'recoil';
import { tilPeriodetype } from '../../../mapping/periodetype';
import { Statistikkboks } from './Statistikkboks';
import { Behandlingstypeetikett } from './Behandlingstypeetikett';
import { Oppgaveetikett } from '../Oppgaveetikett';

const behandlingsstatistikkState = selector<Statistikk>({
    key: 'behandlingsstatistikkState',
    get: async () => {
        return await getBehandlingsstatistikk()
            .then((res) => toStatistikk(res))
            .catch((error) => {
                throw Error('Kunne ikke hente behandlingsstatistikk');
            });
    },
});

export const Behandlingsstatistikk = () => {
    const loadableStatistikk = useRecoilValueLoadable(behandlingsstatistikkState);
    const statistikk =
        loadableStatistikk.state === 'hasValue' ? (loadableStatistikk.contents as Statistikk) : undefined;

    const Container = styled.div`
        padding: 1.5rem;
    `;

    const Header = styled(Normaltekst)`
        width: 100%;
        font-family: inherit;
        font-weight: 600;
        font-size: 1rem;
    `;

    const Separator = styled.div`
        width: 285px;
        height: 1px;
        margin: 1rem 0 2rem 0;
        background-color: var(--navds-color-border);
    `;

    return (
        <Container>
            <Header>Behandlingsoversikt</Header>
            <Separator />
            {statistikk ? (
                <>
                    <Statistikkboks
                        tittel={'TILGJENGELIGE SAKER'}
                        upperBound={statistikk.antallOppgaverTilGodkjenning.totalt}
                        elementer={statistikk.antallOppgaverTilGodkjenning.perPeriodetype.map(
                            ({ periodetype, antall }) => ({
                                etikett: (
                                    <Oppgaveetikett
                                        type={periodetype}
                                        størrelse={'s'}
                                        style={{ marginRight: '1.25rem' }}
                                    />
                                ),
                                antall: antall,
                            })
                        )}
                        visesByDefault
                    />
                    <Statistikkboks
                        tittel={'TILDELTE SAKER'}
                        upperBound={statistikk.antallTildelteOppgaver.totalt}
                        elementer={statistikk.antallTildelteOppgaver.perPeriodetype.map(({ periodetype, antall }) => ({
                            etikett: (
                                <Oppgaveetikett type={periodetype} størrelse={'s'} style={{ marginRight: '1.25rem' }} />
                            ),
                            antall: antall,
                        }))}
                    />
                    <Statistikkboks
                        tittel={'FULLFØRTE BEHANDLINGER'}
                        upperBound={statistikk.fullførteBehandlinger.totalt}
                        elementer={[
                            {
                                etikett: <Behandlingstypeetikett type={'AUTOMATISK'} />,
                                antall: statistikk.fullførteBehandlinger.automatisk,
                            },
                            {
                                etikett: <Behandlingstypeetikett type={'MANUELT'} />,
                                antall: statistikk.fullførteBehandlinger.manuelt,
                            },
                            {
                                etikett: <Behandlingstypeetikett type={'ANNULLERING'} />,
                                antall: statistikk.fullførteBehandlinger.annulleringer,
                            },
                        ]}
                    />
                </>
            ) : (
                <LoadingText />
            )}
        </Container>
    );
};

const toStatistikk = (eksternStatistikk: EksternBehandlingstatistikk): Statistikk => ({
    ...eksternStatistikk,
    antallOppgaverTilGodkjenning: {
        ...eksternStatistikk.antallOppgaverTilGodkjenning,
        perPeriodetype: eksternStatistikk.antallOppgaverTilGodkjenning.perPeriodetype.map(
            ({ antall, periodetypeForSpeil }) => ({
                periodetype: tilPeriodetype(periodetypeForSpeil),
                antall: antall,
            })
        ),
    },
    antallTildelteOppgaver: {
        ...eksternStatistikk.antallTildelteOppgaver,
        perPeriodetype: eksternStatistikk.antallTildelteOppgaver.perPeriodetype.map(
            ({ antall, periodetypeForSpeil }) => ({
                periodetype: tilPeriodetype(periodetypeForSpeil),
                antall: antall,
            })
        ),
    },
});

export const LoadingText = styled.div`
    @keyframes placeHolderShimmer {
        0% {
            background-position: -468px 0;
        }
        100% {
            background-position: 468px 0;
        }
    }

    animation-duration: 1.25s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-name: placeHolderShimmer;
    animation-timing-function: linear;
    background: transparent;
    background: linear-gradient(to right, transparent 0%, #eaeaea 16%, transparent 33%);
    background-size: 800px 104px;
    border-radius: 4px;
    height: 22px;
    width: 100%;
    margin: 4px 0;
`;
