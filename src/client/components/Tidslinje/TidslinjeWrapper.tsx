import React, { useContext } from 'react';
import Tidslinje, { EnkelTidslinje, Vedtaksperiode } from '@navikt/helse-frontend-tidslinje';
import styled from '@emotion/styled';
import { PersonContext } from '../../context/PersonContext';
import { Vedtaksperiodetilstand } from '../../context/types';

const Container = styled.div`
    padding: 1rem 2rem 0;
    border-bottom: 1px solid #c6c2bf;
`;

interface Intervall {
    id: string;
    fom: string;
    tom: string;
    status: Vedtaksperiodetilstand;
}

const TidslinjeWrapper = () => {
    const { personTilBehandling, aktiverVedtaksperiode } = useContext(PersonContext);

    const tidslinjer: EnkelTidslinje[] | undefined = personTilBehandling?.arbeidsgivere.map(arbeidsgiver => ({
        id: arbeidsgiver.id,
        inntektsnavn: arbeidsgiver.organisasjonsnummer,
        inntektstype: 'arbeidsgiver',
        vedtaksperioder: arbeidsgiver.vedtaksperioder.map(periode => ({
            id: periode.id,
            fom: periode.fom.format('YYYY-MM-DD'),
            tom: periode.tom.format('YYYY-MM-DD'),
            status: periode.tilstand,
            disabled: !periode.kanVelges
        }))
    }));

    const vedtaksperiodeForIntervall = (intervall: Intervall) => {
        return tidslinjer
            ?.reduce((perioder: Vedtaksperiode[], tidslinje) => perioder.concat(tidslinje.vedtaksperioder), [])
            .find(periode => periode.fom === intervall.fom);
    };

    const onSelect = (intervall: Intervall): void => {
        const periode = vedtaksperiodeForIntervall(intervall);
        aktiverVedtaksperiode(periode!.id);
    };

    if (!tidslinjer) return null;

    return (
        <Container>
            <Tidslinje tidslinjer={tidslinjer as EnkelTidslinje[]} onSelect={onSelect} />
        </Container>
    );
};

export default TidslinjeWrapper;
