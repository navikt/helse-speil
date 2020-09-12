import React, { useContext, useMemo } from 'react';
import styled from '@emotion/styled';
import Vinduvelger from './Vinduvelger';
import { Radnavn } from './Radnavn';
import { PersonContext } from '../../context/PersonContext';
import { useTidslinjerader } from './useTidslinjerader';
import { useInfotrygdrader } from './useInfotrygdrader';
import { useTidslinjevinduer } from './useTidslinjevinduer';
import { Sykepengetidslinje } from '@navikt/helse-frontend-tidslinje/lib';
import { Flex, FlexColumn } from '../Flex';
import '@navikt/helse-frontend-tidslinje/lib/main.css';

const Container = styled(FlexColumn)`
    padding: 1rem 2rem;
    border-bottom: 1px solid #c6c2bf;
`;

export const Tidslinje = React.memo(() => {
    const { personTilBehandling, aktiverVedtaksperiode, aktivVedtaksperiode } = useContext(PersonContext);
    const { vinduer, aktivtVindu, setAktivtVindu } = useTidslinjevinduer(personTilBehandling);

    const arbeidsgiverrader = useTidslinjerader(personTilBehandling);
    const infotrygdrader = useInfotrygdrader(personTilBehandling);
    const tidslinjerader = [...arbeidsgiverrader, ...Object.values(infotrygdrader)];

    const aktivPeriode = aktivVedtaksperiode && {
        fom: aktivVedtaksperiode.fom.startOf('day').toDate(),
        tom: aktivVedtaksperiode.tom.endOf('day').toDate(),
    };

    const onSelectPeriode = (periode: { id?: string }) => {
        aktiverVedtaksperiode(periode.id!);
    };

    return useMemo(() => {
        if (tidslinjerader.length === 0) return null;
        return (
            <Container>
                <Flex>
                    <FlexColumn>
                        <Radnavn infotrygdrader={infotrygdrader} />
                    </FlexColumn>
                    <Sykepengetidslinje
                        rader={tidslinjerader}
                        startDato={vinduer[aktivtVindu].fom.toDate()}
                        sluttDato={vinduer[aktivtVindu].tom.toDate()}
                        onSelectPeriode={onSelectPeriode}
                        aktivPeriode={aktivPeriode}
                    />
                </Flex>
                <Vinduvelger vinduer={vinduer} aktivtVindu={aktivtVindu} setAktivtVindu={setAktivtVindu} />
            </Container>
        );
    }, [tidslinjerader, aktivtVindu]);
});
