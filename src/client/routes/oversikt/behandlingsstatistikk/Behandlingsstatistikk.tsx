import styled from '@emotion/styled';
import { EksternBehandlingstatistikk } from 'external-types';
import { motion } from 'framer-motion';
import { Behandlingsstatistikk as Statistikk } from 'internal-types';
import React from 'react';
import { selector, useRecoilValueLoadable } from 'recoil';

import { Normaltekst } from 'nav-frontend-typografi';

import { Flex } from '../../../components/Flex';
import { Oppgaveetikett } from '../../../components/Oppgaveetikett';
import { AnnullertIkon, UtbetaltAutomatiskIkon, UtbetaltIkon } from '../../../components/ikoner/Tidslinjeperiodeikoner';
import { getBehandlingsstatistikk } from '../../../io/http';
import { tilPeriodetype } from '../../../mapping/periodetype';

import { CloseButton } from './CloseButton';
import { Statistikkboks } from './Statistikkboks';
import { useShowStatistikkState } from './state';

const Container = styled.div`
    min-width: max-content;
    padding: 2rem 1.25rem;
    border-left: 1px solid var(--navds-color-border);
    height: 100%;
`;

const Header = styled(Normaltekst)`
    width: 100%;
    font-family: inherit;
    font-weight: 600;
    font-size: 1rem;
`;

const HeaderContainer = styled(Flex)`
    align-items: center;
    margin-bottom: 2rem;
`;

const LoadingText = styled.div`
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

const behandlingsstatistikkState = selector<Statistikk>({
    key: 'behandlingsstatistikkState',
    get: async () => {
        return await getBehandlingsstatistikk()
            .then((res) => toStatistikk(res))
            .catch(() => {
                throw Error('Kunne ikke hente behandlingsstatistikk');
            });
    },
});

export const Behandlingsstatistikk = () => {
    const loadableStatistikk = useRecoilValueLoadable(behandlingsstatistikkState);
    const statistikk =
        loadableStatistikk.state === 'hasValue' ? (loadableStatistikk.contents as Statistikk) : undefined;

    const [show, setShow] = useShowStatistikkState();

    return (
        <motion.div
            key="behandlingsstatistikk"
            initial={{ width: show ? 'max-content' : 0 }}
            animate={{ width: show ? 'max-content' : 0 }}
            transition={{
                type: 'tween',
                duration: 0.2,
                ease: 'easeInOut',
            }}
            style={{ overflow: 'visible' }}
        >
            <Container>
                <HeaderContainer>
                    <Header>Totalt behandlede saker i dag</Header>
                    <CloseButton onClick={() => setShow(false)} />
                </HeaderContainer>
                {statistikk ? (
                    <>
                        <Statistikkboks
                            tittel={'TILGJENGELIGE SAKER'}
                            upperBound={statistikk.antallOppgaverTilGodkjenning.totalt}
                            elementer={statistikk.antallOppgaverTilGodkjenning.perPeriodetype.map(
                                ({ periodetype, antall }) => ({
                                    etikett: <Oppgaveetikett type={periodetype} størrelse="s" />,
                                    antall: antall,
                                })
                            )}
                            visesByDefault
                        />
                        <Statistikkboks
                            tittel={'TILDELTE SAKER'}
                            upperBound={statistikk.antallTildelteOppgaver.totalt}
                            elementer={statistikk.antallTildelteOppgaver.perPeriodetype.map(
                                ({ periodetype, antall }) => ({
                                    etikett: <Oppgaveetikett type={periodetype} størrelse="s" />,
                                    antall: antall,
                                })
                            )}
                        />
                        <Statistikkboks
                            tittel={'FULLFØRTE BEHANDLINGER I DAG'}
                            upperBound={statistikk.fullførteBehandlinger.totalt}
                            elementer={[
                                {
                                    etikett: <UtbetaltAutomatiskIkon />,
                                    antall: statistikk.fullførteBehandlinger.automatisk,
                                },
                                {
                                    etikett: <UtbetaltIkon />,
                                    antall: statistikk.fullførteBehandlinger.manuelt,
                                },
                                {
                                    etikett: <AnnullertIkon />,
                                    antall: statistikk.fullførteBehandlinger.annulleringer,
                                },
                            ]}
                            visesByDefault
                        />
                    </>
                ) : (
                    <LoadingText />
                )}
            </Container>
        </motion.div>
    );
};
