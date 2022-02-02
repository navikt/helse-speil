import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import React from 'react';
import { selector, useRecoilValueLoadable } from 'recoil';

import { BodyShort } from '@navikt/ds-react';

import { CloseButton } from '../../../components/CloseButton';
import { Flex } from '../../../components/Flex';
import { Oppgaveetikett } from '../../../components/Oppgaveetikett';
import { Tooltip } from '../../../components/Tooltip';
import { getBehandlingsstatistikk } from '../../../io/http';
import { tilPeriodetype } from '../../../mapping/periodetype';

import { Statistikkboks } from './Statistikkboks';
import { useShowStatistikkState } from './state';

const Container = styled.div`
    min-width: max-content;
    padding: 2rem 1.25rem;
    border-left: 1px solid var(--navds-color-border);
    height: 100%;
`;

const Header = styled(BodyShort)`
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

const AutomatiskUtbetaltePerioderIkon = () => {
    const imageData =
        "data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6.46483 7.57188L5.99592 9.20286H9.40061L8.9317 7.57188C8.71424 6.86511 8.50357 6.13796 8.29969 5.39043C8.10941 4.64289 7.91913 3.90215 7.72885 3.16821H7.6473C7.45702 3.91574 7.26673 4.66328 7.07645 5.41082C6.88617 6.14476 6.6823 6.86511 6.46483 7.57188ZM2 14.6667L6.34251 1.33334H9.11519L13.4577 14.6667H10.9704L9.93068 11.0581H5.44546L4.40571 14.6667H2Z' fill='%233E3832'/%3E%3C/svg%3E%0A";
    return (
        <>
            <img
                src={imageData}
                aria-label="Perioder som er automatisk utbetalt"
                alt="Perioder som er automatisk utbetalt"
                data-for="automatisk-utbetalt"
                data-tip="Perioder som er automatisk utbetalt"
            />
            <Tooltip id="automatisk-utbetalt" />
        </>
    );
};

const UtbetaltePerioderIkon = () => {
    const imageData =
        "data:image/svg+xml,%3Csvg width='16px' height='15px' viewBox='0 0 16 15' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3C!-- Generator: Sketch 63.1 (92452) - https://sketch.com --%3E%3Ctitle%3EUtbetalt%3C/title%3E%3Cdesc%3ECreated with Sketch.%3C/desc%3E%3Cg id='Utbetalt' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cg id='Fill/24-business-finance/coin-receive' transform='translate(1.000000, 0.000000)' fill='%233E3832'%3E%3Cpath d='M4.19999999,8.43528001 C5.48351999,8.43528001 6.26472,9.21648001 6.52176,9.47352001 C6.5744,9.52560001 6.64552,9.55528001 6.72,9.55528001 L6.72,9.55528001 L8.40000001,9.55528001 C9.00760001,9.55528001 9.17000001,10.0828 9.17000001,10.39528 C9.17000001,10.61984 9.09776001,10.83488 8.97176001,10.98608 C8.83400001,11.15128 8.64192001,11.23528 8.40000001,11.23528 L8.40000001,11.23528 L5.59999999,11.23528 C5.44543999,11.23528 5.31999999,11.36072 5.31999999,11.51528 C5.31999999,11.66984 5.44543999,11.79528 5.59999999,11.79528 L5.59999999,11.79528 L8.40000001,11.79528 C8.80992001,11.79528 9.15712001,11.63904 9.40240001,11.34448 C9.61352001,11.0908 9.73000001,10.75368 9.73000001,10.39528 C9.73000001,10.30568 9.72160001,10.21664 9.70704001,10.12872 L9.70704001,10.12872 L11.39152,9.56928001 C12.13352,9.35704001 12.7008,9.54016001 13.35824,10.19704 C13.42152,10.26088 13.45064,10.3516 13.4372,10.44064 C13.42264,10.53024 13.36664,10.6064 13.286,10.64672 C11.73872,11.42008 10.6988,12.01424 9.93944001,12.44824 C8.79200001,13.104 8.24264001,13.40528 7.60032,13.40528 C7.0616,13.40528 6.45736,13.19304 5.37767999,12.80048 C4.82887999,12.60056 4.14567999,12.35248 3.27151998,12.06072 C3.15727998,12.02264 3.07999998,11.91568 3.07999998,11.79528 L3.07999998,11.79528 L3.07999998,8.71528001 C3.07999998,8.56072001 3.20543998,8.43528001 3.35999998,8.43528001 L3.35999998,8.43528001 Z M2.51999998,7.87528 C2.67399998,7.87528 2.79999998,8.00072 2.79999998,8.15528 L2.79999998,8.15528 L2.79999998,12.35528 C2.79999998,12.50984 2.67399998,12.63528 2.51999998,12.63528 L2.51999998,12.63528 L0.279999972,12.63528 C0.125439971,12.63528 -2.91666759e-08,12.50984 -2.91666759e-08,12.35528 L-2.91666759e-08,12.35528 L-2.91666759e-08,8.15528 C-2.91666759e-08,8.00072 0.125439971,7.87528 0.279999972,7.87528 L0.279999972,7.87528 Z M7,4.51527999 C8.0808,4.51527999 8.96000001,5.39391999 8.96000001,6.47528 C8.96000001,7.55608 8.0808,8.43528001 7,8.43528001 C5.9192,8.43528001 5.03999999,7.55608 5.03999999,6.47528 C5.03999999,5.39391999 5.9192,4.51527999 7,4.51527999 Z M7,5.63527999 C6.84544,5.63527999 6.72,5.76071999 6.72,5.91528 L6.72,5.91528 L6.72,7.03528 C6.72,7.18984 6.84544,7.31528 7,7.31528 C7.154,7.31528 7.28,7.18984 7.28,7.03528 L7.28,7.03528 L7.28,5.91528 C7.28,5.76071999 7.154,5.63527999 7,5.63527999 Z M9.52000001,0.595279973 C10.6008,0.595279973 11.48,1.47391998 11.48,2.55527998 C11.48,3.63607999 10.6008,4.51527999 9.52000001,4.51527999 C8.43920001,4.51527999 7.56,3.63607999 7.56,2.55527998 C7.56,1.47391998 8.43920001,0.595279973 9.52000001,0.595279973 Z M9.52000001,1.71527998 C9.36544001,1.71527998 9.24000001,1.84071998 9.24000001,1.99527998 L9.24000001,1.99527998 L9.24000001,3.11527998 C9.24000001,3.26983998 9.36544001,3.39527998 9.52000001,3.39527998 C9.67400001,3.39527998 9.80000001,3.26983998 9.80000001,3.11527998 L9.80000001,3.11527998 L9.80000001,1.99527998 C9.80000001,1.84071998 9.67400001,1.71527998 9.52000001,1.71527998 Z' id='Combined-Shape'%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/svg%3E";
    return (
        <>
            <img
                src={imageData}
                aria-label="Perioder som er manuelt utbetalt"
                alt="Perioder som er manuelt utbetalt"
                data-for="manuelt-utbetalt"
                data-tip="Perioder som er manuelt utbetalt"
            />
            <Tooltip id="manuelt-utbetalt" />
        </>
    );
};

const AnnullertePerioderIkon = () => {
    const imageData =
        "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg fill='none' width='15px' height='15px' viewBox='0 0 16 15' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m0.33332 8.7875h2.6666c0.18333 0 0.33333 0.14932 0.33333 0.33332v4.9998c0 0.184-0.15 0.3334-0.33333 0.3334h-2.6666c-0.18399 0-0.33332-0.1494-0.33332-0.3334v-4.9998c0-0.184 0.14933-0.33332 0.33332-0.33332zm13.228 2.0171c0.8833-0.2527 1.5587-0.0347 2.3413 0.7473 0.0753 0.076 0.11 0.184 0.094 0.29-0.0173 0.1066-0.084 0.1973-0.18 0.2453-1.8419 0.9206-3.0799 1.628-3.9839 2.1446-1.3659 0.7806-2.0199 1.1393-2.7846 1.1393-0.64132 0-1.3606-0.2527-2.6459-0.72-0.65331-0.238-1.4666-0.5333-2.5072-0.8806-0.136-0.0453-0.22799-0.1727-0.22799-0.316v-3.6666c0-0.18399 0.14933-0.33332 0.33332-0.33332h0.99997c1.528 0 2.4579 0.92997 2.7639 1.236 0.06266 0.062 0.14733 0.0973 0.23599 0.0973h1.9999c0.72328 0 0.91668 0.628 0.91668 1 0 0.2673-0.086 0.5233-0.236 0.7033-0.164 0.1967-0.3927 0.2967-0.68068 0.2967h-3.3332c-0.18399 0-0.33332 0.1493-0.33332 0.3333s0.14933 0.3333 0.33332 0.3333h3.3332c0.48798 0 0.90128-0.186 1.1933-0.5366 0.2513-0.302 0.39-0.7034 0.39-1.13 0-0.1067-0.01-0.2127-0.0273-0.3173l2.0052-0.666z' clip-rule='evenodd' fill='%233E3832' fill-rule='evenodd'/%3E%3Cpath d='M6.85706 6.8549L12.712 1M12.712 6.8549L6.85706 1' stroke='%233E3832' stroke-width='1.52'/%3E%3C/svg%3E%0A";
    return (
        <>
            <img
                src={imageData}
                aria-label="Perioder med fagsystem-id som er annullert"
                alt="Perioder med fagsystem-id som er annullert"
                data-for="annulert"
                data-tip="Perioder med fagsystem-id som er annullert"
            />
            <Tooltip id="annulert" />
        </>
    );
};

const toStatistikk = (eksternStatistikk: ExternalBehandlingstatistikk): Behandlingsstatistikk => ({
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

const behandlingsstatistikkState = selector<Behandlingsstatistikk>({
    key: 'behandlingsstatistikkState',
    get: async () => {
        return await getBehandlingsstatistikk()
            .then((res) => toStatistikk(res))
            .catch(() => {
                throw Error('Kunne ikke hente behandlingsstatistikk');
            });
    },
});

const EtikettContainer = styled.div``;

const getDataTipForPeriodetype = (periodetype: Periodetype) => {
    switch (periodetype) {
        case 'forlengelse':
            return 'Forlengelser';
        case 'førstegangsbehandling':
            return 'Førstegangsbehandlinger';
        case 'infotrygdforlengelse':
            return 'Forlengelse fra Infotrygd';
        case 'overgangFraIt':
            return 'Overgang fra Infotrygd';
        case 'stikkprøve':
            return 'Stikkprøver';
        case 'riskQa':
            return 'RiskQaer';
        case 'utbetalingTilSykmeldt':
            return 'Utbetaling Til sykmeldt';
        default:
            return '';
    }
};

export const Behandlingsstatistikk = () => {
    const loadableStatistikk = useRecoilValueLoadable(behandlingsstatistikkState);
    const statistikk =
        loadableStatistikk.state === 'hasValue' ? (loadableStatistikk.contents as Behandlingsstatistikk) : undefined;

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
                    <Header as="p">Totalt behandlede saker i dag</Header>
                    <CloseButton onClick={() => setShow(false)} />
                </HeaderContainer>
                {statistikk ? (
                    <>
                        <Statistikkboks
                            tittel="TILGJENGELIGE SAKER"
                            tilgjengeligeSaker={statistikk.antallOppgaverTilGodkjenning.totalt}
                            elementer={statistikk.antallOppgaverTilGodkjenning.perPeriodetype.map(
                                ({ periodetype, antall }) => ({
                                    etikett: (
                                        <EtikettContainer
                                            data-for={periodetype}
                                            data-tip={getDataTipForPeriodetype(periodetype)}
                                            title={getDataTipForPeriodetype(periodetype)}
                                        >
                                            <Tooltip id={periodetype} />
                                            <Oppgaveetikett type={periodetype} størrelse="s" />
                                        </EtikettContainer>
                                    ),
                                    antall: antall,
                                })
                            )}
                            visesByDefault
                        />
                        <Statistikkboks
                            tittel="TILDELTE SAKER"
                            tilgjengeligeSaker={statistikk.antallTildelteOppgaver.totalt}
                            elementer={statistikk.antallTildelteOppgaver.perPeriodetype.map(
                                ({ periodetype, antall }) => ({
                                    etikett: <Oppgaveetikett type={periodetype} størrelse="s" />,
                                    antall: antall,
                                })
                            )}
                        />
                        <Statistikkboks
                            tittel="FULLFØRTE BEHANDLINGER I DAG"
                            tilgjengeligeSaker={statistikk.fullførteBehandlinger.totalt}
                            elementer={[
                                {
                                    etikett: <AutomatiskUtbetaltePerioderIkon />,
                                    antall: statistikk.fullførteBehandlinger.automatisk,
                                },
                                {
                                    etikett: <UtbetaltePerioderIkon />,
                                    antall: statistikk.fullførteBehandlinger.manuelt,
                                },
                                {
                                    etikett: <AnnullertePerioderIkon />,
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
