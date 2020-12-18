import styled from '@emotion/styled';
import React, { useContext, useState } from 'react';
import Element from 'nav-frontend-typografi/lib/element';
import { useHistory } from 'react-router';
import { Personlinje } from '../../components/Personlinje';
import { PersonContext } from '../../context/PersonContext';
import { useRefetchPersonOnUrlChange } from '../../hooks/useRefetchPersonOnUrlChange';
import { Tabell } from '@navikt/helse-frontend-tabell';
import { UtbetalingshistorikkUtbetaling } from 'internal-types';
import { Annulleringsmodal } from './AnnulleringsModal';
import { NORSK_DATOFORMAT_KORT } from '../../utils/date';
import { Normaltekst } from 'nav-frontend-typografi';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: auto;
`;

const UtbetalingshistorikkTabell = styled(Tabell)`
    margin-top: 2rem;
`;

const Lukknapp = styled.button`
    position: relative;
    cursor: pointer;
    height: 2rem;
    width: 15rem;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: none;
    font-size: 0.8em;
    text-decoration: underline;

    &:before,
    &:after {
        color: #0067c5;
        content: '';
        position: absolute;
        width: 1.25rem;
        height: 3px;
        top: 50%;
        left: 2em;
        background-color: currentColor;
    }

    &:before {
        transform: translate(-50%, -50%) rotate(-45deg);
    }

    &:after {
        transform: translate(-50%, -50%) rotate(45deg);
    }

    &:hover,
    &:focus {
        background: #0067c5;
    }

    &:active {
        background: #254b6d;
    }

    &:hover:before,
    &:focus:before,
    &:hover:after,
    &:focus:after,
    &:active:before,
    &:active:after {
        background: #fff;
    }
`;

export const Utbetalingshistorikk = () => {
    let { personTilBehandling } = useContext(PersonContext);
    const [showModal, setShowModal] = useState<UtbetalingshistorikkUtbetaling | undefined>(undefined);
    const [annulleringerInFlight, setAnnulleringerInFlight] = useState<string[]>([]);
    useRefetchPersonOnUrlChange();
    let history = useHistory();
    const goBack = () => {
        history.push(`/person/${personTilBehandling?.aktørId}/utbetaling`);
    };

    function annullering(utbetaling: UtbetalingshistorikkUtbetaling) {
        if (annulleringerInFlight.includes(utbetaling.arbeidsgiverOppdrag.fagsystemId)) {
            return <Normaltekst>Utbetalingen er forespurt annullert</Normaltekst>;
        }
        if (utbetaling.status === 'UTBETALT' && utbetaling.type === 'UTBETALING') {
            return (
                <button
                    onClick={() => {
                        setShowModal(utbetaling);
                    }}
                >
                    Annuller
                </button>
            );
        }
        return undefined;
    }

    const rader =
        personTilBehandling?.utbetalinger.map((utbetaling, i) => {
            let utbetalingslinjer = utbetaling.arbeidsgiverOppdrag.utbetalingslinjer;
            return {
                celler: [
                    <Element>{utbetalingslinjer[0].fom.format(NORSK_DATOFORMAT_KORT)}</Element>,
                    <Element>
                        {utbetalingslinjer[utbetalingslinjer.length - 1].tom.format(NORSK_DATOFORMAT_KORT)}
                    </Element>,
                    <Element>{utbetaling.arbeidsgiverOppdrag.fagsystemId}</Element>,
                    <Element>{utbetaling.status}</Element>,
                    <Element>{utbetaling.type}</Element>,
                    annullering(utbetaling),
                ],
                className: '',
            };
        }) ?? [];
    const headere = ['Fra', 'Til', 'Fagsystem-ID', 'Status', 'Type', 'Annuller'];

    return (
        <Container className="utbetalingshistorikk">
            <Personlinje person={personTilBehandling} />
            <Lukknapp onClick={goBack}>Lukk utbetalingshistorikk</Lukknapp>
            <UtbetalingshistorikkTabell beskrivelse="En beskrivelse" headere={headere} rader={rader} />
            {showModal && (
                <Annulleringsmodal
                    person={personTilBehandling!!}
                    utbetaling={showModal}
                    onClose={() => {
                        setShowModal(undefined);
                    }}
                    onSuccess={() => {
                        setAnnulleringerInFlight(
                            annulleringerInFlight.concat([showModal?.arbeidsgiverOppdrag.fagsystemId])
                        );
                    }}
                />
            )}
        </Container>
    );
};
