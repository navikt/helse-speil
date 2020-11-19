import React from 'react';
import dayjs from 'dayjs';
import styled from '@emotion/styled';
import { Simulering } from 'internal-types';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { Utbetaling, Utbetalingsdetalj } from 'external-types';
import { NORSK_DATOFORMAT } from '../../../../utils/date';
import { Grid } from '../../../../components/Grid';
import { somPenger, toKronerOgØre } from '../../../../utils/locale';
import { Modal } from '../../../../components/Modal';

const Modalinnhold = styled.article`
    padding: 0 4rem 2rem 4rem;
`;

const Underliste = styled(Grid)`
    &:not(:last-child) {
        margin-bottom: 4rem;
    }
`;

const NegativtBeløp = styled(Normaltekst)`
    color: #a13a28;
    font-style: italic;
`;

const Luft = styled.div`
    grid-column-start: 1;
    grid-column-end: span 2;
    margin-bottom: 1rem;
`;

const formaterDato = (forfall: string) => dayjs(forfall).format(NORSK_DATOFORMAT);

type SimuleringsmodalProps = {
    simulering: Simulering;
    åpenModal: boolean;
    lukkModal: () => void;
};

export const SimuleringsinfoModal = ({ simulering, åpenModal, lukkModal }: SimuleringsmodalProps) => (
    <Modal isOpen={åpenModal} contentLabel="Simuleringsinfo" onRequestClose={lukkModal}>
        <Modalinnhold>
            <Grid gridTemplateColumns="1fr 1fr">
                <Undertittel>Simulering</Undertittel>
            </Grid>
            {simulering.perioder.map((periode, index) => (
                <Underliste gridTemplateColumns="1fr 1fr" key={`periode-${index}`}>
                    <Luft />
                    <Element>Periode</Element>
                    <Element>{`${formaterDato(periode.fom)} - ${formaterDato(periode.tom)}`}</Element>
                    <Luft />
                    <Normaltekst>Totalbeløp simulering</Normaltekst>
                    {simulering.totalbeløp < 0 ? (
                        <NegativtBeløp>{somPenger(simulering.totalbeløp)}</NegativtBeløp>
                    ) : (
                        <Normaltekst>{somPenger(simulering.totalbeløp)}</Normaltekst>
                    )}
                    <Luft />
                    {periode.utbetalinger.map((utbetaling, index) => (
                        <Utbetalingsvisning utbetaling={utbetaling} index={index} key={`utbetaling-${index}`} />
                    ))}
                </Underliste>
            ))}
        </Modalinnhold>
    </Modal>
);

type UtbetalingsvisningProps = { utbetaling: Utbetaling; index: number };
const Utbetalingsvisning = ({ utbetaling, index }: UtbetalingsvisningProps) => (
    <React.Fragment>
        {index > 0 && <Luft />}
        <Normaltekst>Utbetales til ID</Normaltekst>
        <Normaltekst>{utbetaling.utbetalesTilId}</Normaltekst>
        <Normaltekst>Utbetales til navn</Normaltekst>
        <Normaltekst>{utbetaling.utbetalesTilNavn}</Normaltekst>
        <Normaltekst>Forfall</Normaltekst>
        <Normaltekst>{formaterDato(utbetaling.forfall)}</Normaltekst>
        <Normaltekst>Feilkonto</Normaltekst>
        <Normaltekst>{utbetaling.feilkonto ? 'Ja' : 'Nei'}</Normaltekst>
        {utbetaling.detaljer.map((detalj: Utbetalingsdetalj, index: number) => (
            <Utbetalingsdetaljvisning detalj={detalj} index={index} key={`detalj-${index}`} />
        ))}
    </React.Fragment>
);

type UtbetalingsdetaljvisningProps = { detalj: Utbetalingsdetalj; index: number };
const Utbetalingsdetaljvisning = ({ detalj, index }: UtbetalingsdetaljvisningProps) => (
    <React.Fragment>
        {index > 0 && <Luft />}
        <Normaltekst>Faktisk fom</Normaltekst>
        <Normaltekst>{formaterDato(detalj.faktiskFom)}</Normaltekst>
        <Normaltekst>Faktisk tom</Normaltekst>
        <Normaltekst>{formaterDato(detalj.faktiskTom)}</Normaltekst>
        <Normaltekst>Sats</Normaltekst>
        {detalj.sats < 0 ? (
            <NegativtBeløp>{somPenger(detalj.sats)}</NegativtBeløp>
        ) : (
            <Normaltekst>{somPenger(detalj.sats)}</Normaltekst>
        )}
        <Normaltekst>Antall sats</Normaltekst>
        <Normaltekst>{detalj.antallSats}</Normaltekst>
        <Normaltekst>Type sats</Normaltekst>
        <Normaltekst>{detalj.typeSats}</Normaltekst>
        <Normaltekst>Beløp</Normaltekst>
        {detalj.belop < 0 ? (
            <NegativtBeløp>{somPenger(detalj.belop)}</NegativtBeløp>
        ) : (
            <Normaltekst>{somPenger(detalj.belop)}</Normaltekst>
        )}
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
);
