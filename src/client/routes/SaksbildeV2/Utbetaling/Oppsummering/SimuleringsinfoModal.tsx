import React from 'react';
import dayjs from 'dayjs';
import styled from '@emotion/styled';
import { Simulering } from 'internal-types';
import { Normaltekst } from 'nav-frontend-typografi';
import { Utbetalingsdetalj } from 'external-types';
import { NORSK_DATOFORMAT } from '../../../../utils/date';
import { Grid } from '../../../../components/Grid';
import { toKronerOgØre } from '../../../../utils/locale';
import { Modal } from '../../../../components/Modal';

const Underliste = styled(Grid)`
    &:not(:last-child) {
        margin-bottom: 4rem;
    }
`;

const formaterDato = (forfall: string) => dayjs(forfall).format(NORSK_DATOFORMAT);

interface SimuleringsmodalProps {
    simulering: Simulering;
    åpenModal: boolean;
    lukkModal: () => void;
}

export const SimuleringsinfoModal = ({ simulering, åpenModal, lukkModal }: SimuleringsmodalProps) => {
    return (
        <Modal isOpen={åpenModal} contentLabel="Simuleringsinfo" onRequestClose={lukkModal}>
            <Grid gridTemplateColumns="1fr 1fr">
                <Normaltekst>Totalbeløp simulering</Normaltekst>
                <Normaltekst>{toKronerOgØre(simulering.totalbeløp)} kr</Normaltekst>
            </Grid>
            <>
                {simulering.perioder.map((periode, index) => (
                    <Underliste gridTemplateColumns="1fr 1fr" key={`periode-${index}`}>
                        <Normaltekst>~~~~~~~~~~~~</Normaltekst>
                        <Normaltekst>~~~~~~~~~~~~</Normaltekst>
                        <Normaltekst>Periode</Normaltekst>
                        <Normaltekst>{`${formaterDato(periode.fom)} - ${formaterDato(periode.tom)}`}</Normaltekst>
                        <>
                            {periode.utbetalinger.map((utbetaling, index) => (
                                <React.Fragment key={`utbetaling-${index}`}>
                                    {index > 0 && (
                                        <>
                                            <Normaltekst>-------------------</Normaltekst>
                                            <Normaltekst>-------------------</Normaltekst>
                                        </>
                                    )}
                                    <Normaltekst>Utbetales til ID</Normaltekst>
                                    <Normaltekst>{utbetaling.utbetalesTilId}</Normaltekst>
                                    <Normaltekst>Utbetales til navn</Normaltekst>
                                    <Normaltekst>{utbetaling.utbetalesTilNavn}</Normaltekst>
                                    <Normaltekst>Forfall</Normaltekst>
                                    <Normaltekst>{formaterDato(utbetaling.forfall)}</Normaltekst>
                                    <Normaltekst>Feilkonto</Normaltekst>
                                    <Normaltekst>{utbetaling.feilkonto ? 'Ja' : 'Nei'}</Normaltekst>
                                    {utbetaling.detaljer.map((detalj: Utbetalingsdetalj, index: number) => (
                                        <React.Fragment key={`detalj-${index}`}>
                                            {index > 0 && (
                                                <>
                                                    <Normaltekst>-------------------</Normaltekst>
                                                    <Normaltekst>-------------------</Normaltekst>
                                                </>
                                            )}
                                            <Normaltekst>Faktisk fom</Normaltekst>
                                            <Normaltekst>{formaterDato(detalj.faktiskFom)}</Normaltekst>
                                            <Normaltekst>Faktisk tom</Normaltekst>
                                            <Normaltekst>{formaterDato(detalj.faktiskTom)}</Normaltekst>
                                            <Normaltekst>Sats</Normaltekst>
                                            <Normaltekst>{toKronerOgØre(detalj.sats)} kr</Normaltekst>
                                            <Normaltekst>Antall sats</Normaltekst>
                                            <Normaltekst>{detalj.antallSats}</Normaltekst>
                                            <Normaltekst>Type sats</Normaltekst>
                                            <Normaltekst>{detalj.typeSats}</Normaltekst>
                                            <Normaltekst>Beløp</Normaltekst>
                                            <Normaltekst>{toKronerOgØre(detalj.belop)} kr</Normaltekst>
                                            <Normaltekst>Konto</Normaltekst>
                                            <Normaltekst>{detalj.konto}</Normaltekst>
                                            <Normaltekst>Klassekode</Normaltekst>
                                            <Normaltekst>{detalj.klassekode}</Normaltekst>
                                            <Normaltekst>Klassekodebeskrivelse</Normaltekst>
                                            <Normaltekst>{detalj.klassekodeBeskrivelse}</Normaltekst>
                                            <Normaltekst>Uføregrad</Normaltekst>
                                            <Normaltekst>{detalj.uforegrad}</Normaltekst>
                                            <Normaltekst>Utbetalingstype</Normaltekst>
                                            <Normaltekst>{detalj.utbetalingsType}</Normaltekst>
                                            <Normaltekst>Refunderes orgnummer</Normaltekst>
                                            <Normaltekst>{detalj.refunderesOrgNr}</Normaltekst>
                                            <Normaltekst>Tilbakeføring</Normaltekst>
                                            <Normaltekst>{detalj.tilbakeforing ? 'Ja' : 'Nei'}</Normaltekst>
                                        </React.Fragment>
                                    ))}
                                </React.Fragment>
                            ))}
                        </>
                    </Underliste>
                ))}
            </>
        </Modal>
    );
};
