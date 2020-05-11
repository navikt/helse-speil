import React, { useContext, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { PersonContext } from '../../context/PersonContext';
import { Person, Vedtaksperiodetilstand } from '../../context/types';
import { Sykepengetidslinje } from '@navikt/helse-frontend-tidslinje';
import Vinduvelger from './Vinduvelger';
import dayjs, { Dayjs } from 'dayjs';
import { Tidslinjevindu } from './Tidslinje.types';
import { EnkelSykepengetidslinje } from '@navikt/helse-frontend-tidslinje/dist/components/sykepengetidslinje/Sykepengetidslinje';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1rem 2rem;
    border-bottom: 1px solid #c6c2bf;
`;

interface Intervall {
    id: string;
    fom: string;
    tom: string;
    status: Vedtaksperiodetilstand;
}

const useTidslinjerader = (person?: Person): EnkelSykepengetidslinje[] =>
    useMemo(
        () =>
            person?.arbeidsgivere.map(arbeidsgiver => ({
                perioder: arbeidsgiver.vedtaksperioder.map(periode => ({
                    id: periode.id,
                    fom: periode.fom.toDate(),
                    tom: periode.tom.toDate(),
                    status: periode.tilstand,
                    disabled: !periode.kanVelges
                }))
            })) ?? [],
        [person]
    );

const useSenesteTidslinjedato = (person?: Person): Dayjs =>
    useMemo(
        () =>
            person?.arbeidsgivere
                .flatMap(arbeidsgiver => arbeidsgiver.vedtaksperioder)
                .reduce(
                    (senesteDato, periode) => (periode.tom.isAfter(senesteDato) ? periode.tom : senesteDato),
                    dayjs(0)
                )
                .endOf('day') ?? dayjs().endOf('day'),
        [person]
    );

export const Tidslinje = () => {
    const { personTilBehandling, aktiverVedtaksperiode } = useContext(PersonContext);

    const tidslinjerader = useTidslinjerader(personTilBehandling);
    const senesteTidslinjedato = useSenesteTidslinjedato(personTilBehandling);

    const vinduer: Tidslinjevindu[] = [
        {
            fom: senesteTidslinjedato.subtract(6, 'month'),
            tom: senesteTidslinjedato,
            label: '6 mnd'
        },
        {
            fom: senesteTidslinjedato.subtract(1, 'year'),
            tom: senesteTidslinjedato,
            label: '1 år'
        },
        {
            fom: senesteTidslinjedato.subtract(3, 'year'),
            tom: senesteTidslinjedato,
            label: '3 år'
        }
    ];

    const [aktivtVindu, setAktivtVindu] = useState<number>(0);

    const onSelect = (periode: { id?: string }) => {
        console.log(periode);
        aktiverVedtaksperiode(periode.id!);
    };

    if (tidslinjerader.length === 0) return null;

    return (
        <Container>
            <Sykepengetidslinje
                rader={tidslinjerader}
                startDato={vinduer[aktivtVindu].fom.toDate()}
                sluttDato={vinduer[aktivtVindu].tom.toDate()}
                onSelectPeriode={onSelect}
            />
            <Vinduvelger vinduer={vinduer} aktivtVindu={aktivtVindu} setAktivtVindu={setAktivtVindu} />
        </Container>
    );
};
