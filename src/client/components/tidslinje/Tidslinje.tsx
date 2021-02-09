import React from 'react';
import styled from '@emotion/styled';
import { LasterUtsnittsvelger } from './Utsnittsvelger';
import { useTidslinjerader } from './useTidslinjerader';
import { useInfotrygdrader } from './useInfotrygdrader';
import { Flex, FlexColumn } from '../Flex';
import '@navikt/helse-frontend-tidslinje/lib/main.css';
import { Person, Vedtaksperiode } from 'internal-types';
import { useSetAktivVedtaksperiode } from '../../state/vedtaksperiode';
import { Row } from '@navikt/helse-frontend-timeline/lib';
import '@navikt/helse-frontend-timeline/lib/main.css';
import dayjs from 'dayjs';
import { TekstMedEllipsis } from '../TekstMedEllipsis';
import { Tidslinjeperiode } from './Tidslinjeperiode';
import { Arbeidsgiverikon } from '../ikoner/Arbeidsgiverikon';
import { Infotrygdikon } from '../ikoner/Infotrygdikon';
import { TidslinjeTooltip } from './TidslinjeTooltip';

const Container = styled(FlexColumn)`
    position: relative;
    padding: 14px 32px 16px 32px;
    border-bottom: 1px solid var(--navds-color-border);

    > div:last-of-type {
        right: 48px;
        bottom: 16px;
    }
`;

interface Props {
    person: Person;
    aktivVedtaksperiode?: Vedtaksperiode;
}

export const LasterTidslinje = () => {
    return (
        <Container>
            <LasterUtsnittsvelger />
        </Container>
    );
};

const RadContainer = styled(Flex)`
    &:not(:last-of-type) {
        margin-bottom: 24px;
    }
`;

const Arbeidsgivernavn = styled(Flex)`
    align-items: center;
    font-size: 14px;
    color: var(--navds-color-text-primary);
    line-height: 1rem;
    width: 250px;
    margin-right: 1rem;

    > svg:first-of-type {
        margin-right: 1rem;
    }
`;

const Tidslinjerad = styled(Row)`
    flex: 1;
`;

export const Tidslinje = ({ person, aktivVedtaksperiode }: Props) => {
    const setAktivVedtaksperiode = useSetAktivVedtaksperiode();

    const tomInfotrygd = person.infotrygdutbetalinger.flatMap((it) => it.tom);
    const tomSpeil = person.arbeidsgivere.flatMap((it) => it.vedtaksperioder);

    const tom = [...tomInfotrygd, ...tomSpeil.flatMap((it) => it.tom)].reduce(
        (tom, it) => (it.isAfter(tom) ? it : tom),
        dayjs(0)
    );

    const fom = tom.subtract(6, 'month');

    const tidslinjerader = useTidslinjerader(person, fom, tom, aktivVedtaksperiode);
    const infotrygdrader = useInfotrygdrader(person, fom, tom);

    return (
        <Container>
            <FlexColumn>
                {tidslinjerader.map(({ id, perioder, arbeidsgiver }) => (
                    <RadContainer key={id}>
                        <Arbeidsgivernavn>
                            <Arbeidsgiverikon />
                            <TekstMedEllipsis data-tip={arbeidsgiver}>{arbeidsgiver}</TekstMedEllipsis>
                        </Arbeidsgivernavn>
                        <Tidslinjerad>
                            {perioder.map((it) => (
                                <Tidslinjeperiode
                                    key={it.id}
                                    id={it.id}
                                    style={it.style}
                                    className={it.tilstand}
                                    hoverLabel={<TidslinjeTooltip>{it.hoverLabel}</TidslinjeTooltip>}
                                    skalVisePin={it.skalVisePin}
                                    onClick={setAktivVedtaksperiode}
                                    erAktiv={it.id === aktivVedtaksperiode?.id}
                                />
                            ))}
                        </Tidslinjerad>
                    </RadContainer>
                ))}
                {infotrygdrader.map(([arbeidsgiver, perioder]) => (
                    <RadContainer key={arbeidsgiver}>
                        <Arbeidsgivernavn>
                            <Infotrygdikon />
                            <TekstMedEllipsis data-tip={arbeidsgiver}>{arbeidsgiver}</TekstMedEllipsis>
                        </Arbeidsgivernavn>
                        <Tidslinjerad>
                            {perioder.map((it) => (
                                <Tidslinjeperiode
                                    key={it.id}
                                    id={it.id}
                                    style={it.style}
                                    skalVisePin={it.skalVisePin}
                                    className={it.tilstand}
                                    hoverLabel={<TidslinjeTooltip>{it.hoverLabel}</TidslinjeTooltip>}
                                />
                            ))}
                        </Tidslinjerad>
                    </RadContainer>
                ))}
            </FlexColumn>
        </Container>
    );
};

// export const _Tidslinje = React.memo(({ person, aktivVedtaksperiode }: Props) => {
//     const setAktivVedtaksperiode = useSetAktivVedtaksperiode();
//
//     const { utsnitt, aktivtUtsnitt, setAktivtUtsnitt } = useTidslinjeutsnitt(person);
//     const infotrygdrader = useInfotrygdrader(person);
//     const arbeidsgiverrader = useTidslinjerader(person).map((it) =>
//         it.map((periode) => ({ ...periode, active: periode.id === aktivVedtaksperiode?.id }))
//     );
//
//     const tidslinjerader = [...arbeidsgiverrader, ...Object.values(infotrygdrader)];
//
//     const aktivRad =
//         aktivVedtaksperiode &&
//         arbeidsgiverrader.reduce(
//             (radIndex: number, rad: Sykepengeperiode[], i: number) =>
//                 rad.find(({ id }) => id === aktivVedtaksperiode?.id) ? i : radIndex,
//             undefined
//         );
//
//     const onSelectPeriode = (periode: Periode) => {
//         setAktivVedtaksperiode(periode.id!);
//     };
//
//     const startDato = utsnitt[aktivtUtsnitt].fom;
//     const sluttDato = utsnitt[aktivtUtsnitt].tom;
//
//     const maksdato = () => {
//         const sistePeriode = sisteValgbarePeriode(person);
//         const dato = sistePeriode && maksdatoForPeriode(sistePeriode);
//         return dato && dato.isBefore(sluttDato) && dato.isAfter(startDato)
//             ? {
//                   date: dato.toDate(),
//                   render: <Undertekst>Maksdato: {dato.format(NORSK_DATOFORMAT)}</Undertekst>,
//               }
//             : undefined;
//     };
//
//     return useMemo(() => {
//         if (tidslinjerader.length === 0) return null;
//         return (
//             <Container className="tidslinjecontainer">
//                 <Flex>
//                     <FlexColumn>
//                         <Radnavn infotrygdrader={infotrygdrader} />
//                     </FlexColumn>
//                     <Sykepengetidslinje
//                         rader={tidslinjerader}
//                         startDato={startDato.toDate()}
//                         sluttDato={sluttDato.toDate()}
//                         onSelectPeriode={onSelectPeriode}
//                         aktivRad={aktivRad}
//                         maksdato={maksdato()}
//                     />
//                 </Flex>
//                 <Utsnittsvelger utsnitt={utsnitt} aktivtUtsnitt={aktivtUtsnitt} setAktivtUtsnitt={setAktivtUtsnitt} />
//             </Container>
//         );
//     }, [tidslinjerader, aktivtUtsnitt]);
// });
