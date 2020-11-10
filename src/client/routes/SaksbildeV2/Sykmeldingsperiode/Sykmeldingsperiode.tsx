import React, { useContext, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import '@navikt/helse-frontend-tabell/lib/main.css';
import { Sykmeldingsperiodetabell } from './Sykmeldingsperiodetabell';
import { OverstyrbarSykmeldingsperiodetabell } from './OverstyrbarSykmeldingsperiodetabell';
import { OverstyringTimeoutModal } from './OverstyringTimeoutModal';
import { AgurkErrorBoundary } from '../../../components/AgurkErrorBoundary';
import { Undertittel } from 'nav-frontend-typografi';
import { PersonContext } from '../../../context/PersonContext';
import { Dayjs } from 'dayjs';
import { NORSK_DATOFORMAT } from '../../../utils/date';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 2rem;
`;

const formaterPeriodeString = (fom: Dayjs, tom: Dayjs) => {
    const fomString = fom.year() === tom.year() ? fom.format('DD.MM') : fom.format('DD.MM.YYYY');
    return `${fomString}-${tom.format('DD.MM.YYYY')}`;
};

const Header = styled(Undertittel)`
    display: flex;
    color: #3e3832;
    font-size: 18px;
    margin-bottom: 2rem;
    > *:not(:last-child) {
        margin-right: 1rem;
    }
`;

export const Sykmeldingsperiode = () => {
    const [overstyrer, setOverstyrer] = useState(false);
    const [kalkulerer, setKalkulerer] = useState(false);
    const [overstyringTimedOut, setOverstyringTimedOut] = useState(false);
    const { aktivVedtaksperiode } = useContext(PersonContext);

    useEffect(() => {
        let timeoutId: any;
        if (kalkulerer) {
            timeoutId = setTimeout(() => setOverstyringTimedOut(true), 10000);
        }
        return () => {
            !!timeoutId && clearTimeout(timeoutId);
        };
    }, [kalkulerer]);

    const fom = aktivVedtaksperiode?.fom;
    const tom = aktivVedtaksperiode?.tom;
    const periode = fom && tom ? formaterPeriodeString(fom, tom) : 'Ukjent periode';
    const skjæringstidspunkt =
        aktivVedtaksperiode?.vilkår?.dagerIgjen.skjæringstidspunkt.format(NORSK_DATOFORMAT) ?? 'ukjent';

    return (
        <Container className="Sykmeldingsperiode">
            <AgurkErrorBoundary>
                <Header>
                    <span>Sykmeldingsperiode</span>
                    <span>/</span>
                    <span>{periode}</span>
                    <span>/</span>
                    <span>Skjæringstidspunkt {skjæringstidspunkt}</span>
                </Header>
                {overstyrer ? (
                    <OverstyrbarSykmeldingsperiodetabell
                        onOverstyr={() => {
                            setOverstyrer(false);
                            setKalkulerer(true);
                        }}
                        onToggleOverstyring={() => setOverstyrer((o) => !o)}
                    />
                ) : (
                    <Sykmeldingsperiodetabell toggleOverstyring={() => setOverstyrer((o) => !o)} />
                )}
            </AgurkErrorBoundary>
            {overstyringTimedOut && <OverstyringTimeoutModal onRequestClose={() => setOverstyringTimedOut(false)} />}
        </Container>
    );
};
