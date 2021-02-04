import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import { Radnavn } from './Radnavn';
import { LasterUtsnittsvelger, Utsnittsvelger } from './Utsnittsvelger';
import { useTidslinjerader } from './useTidslinjerader';
import { useInfotrygdrader } from './useInfotrygdrader';
import { useTidslinjeutsnitt } from './useTidslinjeutsnitt';
import { Periode, Sykepengeperiode, Sykepengetidslinje } from '@navikt/helse-frontend-tidslinje';
import { Flex, FlexColumn } from '../Flex';
import '@navikt/helse-frontend-tidslinje/lib/main.css';
import { Person, Vedtaksperiode } from 'internal-types';
import { useSetAktivVedtaksperiode } from '../../state/vedtaksperiode';
import { maksdatoForPeriode, sisteValgbarePeriode } from '../../mapping/selectors';
import { Undertekst } from 'nav-frontend-typografi';
import { NORSK_DATOFORMAT } from '../../utils/date';

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

export const Tidslinje = React.memo(({ person, aktivVedtaksperiode }: Props) => {
    const setAktivVedtaksperiode = useSetAktivVedtaksperiode();

    const { utsnitt, aktivtUtsnitt, setAktivtUtsnitt } = useTidslinjeutsnitt(person);
    const infotrygdrader = useInfotrygdrader(person);
    const arbeidsgiverrader = useTidslinjerader(person).map((it) =>
        it.map((periode) => ({ ...periode, active: periode.id === aktivVedtaksperiode?.id }))
    );

    const tidslinjerader = [...arbeidsgiverrader, ...Object.values(infotrygdrader)];

    const aktivRad =
        aktivVedtaksperiode &&
        arbeidsgiverrader.reduce(
            (radIndex: number, rad: Sykepengeperiode[], i: number) =>
                rad.find(({ id }) => id === aktivVedtaksperiode?.id) ? i : radIndex,
            undefined
        );

    const onSelectPeriode = (periode: Periode) => {
        setAktivVedtaksperiode(periode.id!);
    };

    const startDato = utsnitt[aktivtUtsnitt].fom;
    const sluttDato = utsnitt[aktivtUtsnitt].tom;

    const maksdato = () => {
        const sistePeriode = sisteValgbarePeriode(person);
        const dato = sistePeriode && maksdatoForPeriode(sistePeriode);
        return dato && dato.isBefore(sluttDato) && dato.isAfter(startDato)
            ? {
                  date: dato.toDate(),
                  render: <Undertekst>Maksdato: {dato.format(NORSK_DATOFORMAT)}</Undertekst>,
              }
            : undefined;
    };

    return useMemo(() => {
        if (tidslinjerader.length === 0) return null;
        return (
            <Container className="tidslinjecontainer">
                <Flex>
                    <FlexColumn>
                        <Radnavn infotrygdrader={infotrygdrader} />
                    </FlexColumn>
                    <Sykepengetidslinje
                        rader={tidslinjerader}
                        startDato={startDato.toDate()}
                        sluttDato={sluttDato.toDate()}
                        onSelectPeriode={onSelectPeriode}
                        aktivRad={aktivRad}
                        maksdato={maksdato()}
                    />
                </Flex>
                <Utsnittsvelger utsnitt={utsnitt} aktivtUtsnitt={aktivtUtsnitt} setAktivtUtsnitt={setAktivtUtsnitt} />
            </Container>
        );
    }, [tidslinjerader, aktivtUtsnitt]);
});
