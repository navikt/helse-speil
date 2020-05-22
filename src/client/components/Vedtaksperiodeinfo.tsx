import React from 'react';
import { Person, Vedtaksperiode } from '../context/types.internal';
import styled from '@emotion/styled';
import Sakslinje, { Arbeidsgiver } from '@navikt/helse-frontend-sakslinje';
import { NORSK_DATOFORMAT } from '../utils/date';

interface VedtaksperiodeinfoProps {
    periode?: Vedtaksperiode;
    person?: Person;
}

const Container = styled(Sakslinje)`
    border-top: none;
    border-left: none;
    border-right: none;
`;

const Vedtaksperiodeinfo = ({ periode, person }: VedtaksperiodeinfoProps) => {
    const arbeidsgiver = person?.arbeidsgivere.find((arbeidsgiveren) =>
        arbeidsgiveren.vedtaksperioder.find((perioden) => perioden.id === periode?.id)
    );

    const tekster = [
        arbeidsgiver?.organisasjonsnummer ?? 'Ukjent arbeidsgiver',
        `${periode?.sykdomstidslinje[0].gradering ?? 100}%`,
        `${periode?.fom.format(NORSK_DATOFORMAT)} - ${periode?.tom.format(NORSK_DATOFORMAT)}`,
    ];

    return <Container venstre={arbeidsgiver && <Arbeidsgiver tekst={tekster} />} />;
};

export default Vedtaksperiodeinfo;
