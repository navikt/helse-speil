import React from 'react';
import { Person, Vedtaksperiode } from '../context/types';
import { arbeidsgiverForVedtaksperiode } from '../hooks/arbeidsgiverForVedtaksperiode';
import styled from '@emotion/styled';
import Sakslinje, { Arbeidsgiver } from '@navikt/helse-frontend-sakslinje';
import dayjs from 'dayjs';

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
    const arbeidsgiver = arbeidsgiverForVedtaksperiode(periode, person);

    const tekster = [
        arbeidsgiver?.organisasjonsnummer ?? 'Ukjent arbeidsgiver',
        `${periode?.sykdomstidslinje[0].grad ?? 100}%`,
        `${dayjs(periode?.fom).format('DD.MM.YYYY')} - ${dayjs(periode?.tom).format('DD.MM.YYYY')}`
    ];

    return <Container venstre={arbeidsgiver && <Arbeidsgiver tekst={tekster} />} />;
};

export default Vedtaksperiodeinfo;
