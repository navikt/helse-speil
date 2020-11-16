import React, { useContext, useMemo } from 'react';
import styled from '@emotion/styled';
import { Radnavn } from './Radnavn';
import { Utsnittsvelger } from './Utsnittsvelger';
import { useTidslinjerader } from './useTidslinjerader';
import { useInfotrygdrader } from './useInfotrygdrader';
import { useTidslinjeutsnitt } from './useTidslinjeutsnitt';
import { Periode, Sykepengeperiode, Sykepengetidslinje } from '@navikt/helse-frontend-tidslinje';
import { Flex, FlexColumn } from '../Flex';
import { PersonContext } from '../../context/PersonContext';
import '@navikt/helse-frontend-tidslinje/lib/main.css';
import { Person, Vedtaksperiode } from 'internal-types';

const Container = styled(FlexColumn)`
    padding: 1rem 2rem;
    border-bottom: 1px solid #c6c2bf;
`;

interface Props {
    person: Person;
    aktivVedtaksperiode?: Vedtaksperiode;
}

export const Tidslinje = React.memo(({ person, aktivVedtaksperiode }: Props) => {
    const { aktiverVedtaksperiode } = useContext(PersonContext);
    const { utsnitt, aktivtUtsnitt, setAktivtUtsnitt } = useTidslinjeutsnitt(person);

    const arbeidsgiverrader = useTidslinjerader(person).map((rad) =>
        rad.map((periode) => ({ ...periode, active: periode.id === aktivVedtaksperiode?.id }))
    );
    const infotrygdrader = useInfotrygdrader(person);
    const tidslinjerader = [...arbeidsgiverrader, ...Object.values(infotrygdrader)];

    const aktivRad =
        aktivVedtaksperiode &&
        arbeidsgiverrader.reduce(
            (radIndex: number, rad: Sykepengeperiode[], i: number) =>
                rad.find(({ id }) => id === aktivVedtaksperiode?.id) ? i : radIndex,
            undefined
        );

    const onSelectPeriode = (periode: Periode) => {
        aktiverVedtaksperiode(periode.id!);
    };

    return useMemo(() => {
        if (tidslinjerader.length === 0) return null;
        return (
            <Container>
                <Utsnittsvelger utsnitt={utsnitt} aktivtUtsnitt={aktivtUtsnitt} setAktivtUtsnitt={setAktivtUtsnitt} />
                <Flex>
                    <FlexColumn>
                        <Radnavn infotrygdrader={infotrygdrader} />
                    </FlexColumn>
                    <Sykepengetidslinje
                        rader={tidslinjerader}
                        startDato={utsnitt[aktivtUtsnitt].fom.toDate()}
                        sluttDato={utsnitt[aktivtUtsnitt].tom.toDate()}
                        onSelectPeriode={onSelectPeriode}
                        aktivRad={aktivRad}
                    />
                </Flex>
            </Container>
        );
    }, [tidslinjerader, aktivtUtsnitt]);
});
