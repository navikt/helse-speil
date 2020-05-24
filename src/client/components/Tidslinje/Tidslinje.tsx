import React, { useContext, useMemo } from 'react';
import styled from '@emotion/styled';
import Vinduvelger from './Vinduvelger';
import Periodevelger from './Periodevelger';
import { Radnavn } from './Radnavn';
import { PersonContext } from '../../context/PersonContext';
import { useTidslinjerader } from './useTidslinjerader';
import { useInfotrygdrader } from './useInfotrygdrader';
import { Sykepengetidslinje } from '@navikt/helse-frontend-tidslinje';
import { useTidslinjevinduer } from './useTidslinjevinduer';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1rem 2rem;
    border-bottom: 1px solid #c6c2bf;
`;

const FlexRow = styled.div`
    display: flex;
`;

const FlexColumn = styled.div`
    display: flex;
    flex-direction: column;
`;

export const Tidslinje = () => {
    const { personTilBehandling, aktiverVedtaksperiode, aktivVedtaksperiode } = useContext(PersonContext);
    const { vinduer, aktivtVindu, setAktivtVindu } = useTidslinjevinduer(personTilBehandling);

    const arbeidsgiverrader = useTidslinjerader(personTilBehandling);
    const infotrygdrader = useInfotrygdrader(personTilBehandling);
    const tidslinjerader = [...arbeidsgiverrader, ...infotrygdrader];

    const aktivPeriode = aktivVedtaksperiode && {
        fom: aktivVedtaksperiode.fom.startOf('day').toDate(),
        tom: aktivVedtaksperiode.tom.endOf('day').toDate()
    };

    const onSelectPeriode = (periode: { id?: string }) => {
        aktiverVedtaksperiode(periode.id!);
    };

    return useMemo(() => {
        if (tidslinjerader.length === 0) return null;
        return (
            <Container>
                <FlexRow>
                    <FlexColumn>
                        <Periodevelger tidslinjerader={arbeidsgiverrader} />
                        <Radnavn infotrygdrader={infotrygdrader} />
                    </FlexColumn>
                    <Sykepengetidslinje
                        rader={tidslinjerader}
                        startDato={vinduer[aktivtVindu].fom.toDate()}
                        sluttDato={vinduer[aktivtVindu].tom.toDate()}
                        onSelectPeriode={onSelectPeriode}
                        aktivPeriode={aktivPeriode}
                    />
                </FlexRow>
                <Vinduvelger vinduer={vinduer} aktivtVindu={aktivtVindu} setAktivtVindu={setAktivtVindu} />
            </Container>
        );
    }, [tidslinjerader, aktivtVindu]);
};
