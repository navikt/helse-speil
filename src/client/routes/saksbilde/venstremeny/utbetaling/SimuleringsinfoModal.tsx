import styled from '@emotion/styled';
import dayjs from 'dayjs';
import { Utbetaling, Utbetalingsdetalj } from 'external-types';
import { Simulering } from 'internal-types';
import React from 'react';

import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';

import { Grid } from '../../../../components/Grid';
import { Modal } from '../../../../components/Modal';
import { NORSK_DATOFORMAT } from '../../../../utils/date';
import { somPenger } from '../../../../utils/locale';

import { getAnonymArbeidsgiverForOrgnr } from '../../../../agurkdata';

const Modalinnhold = styled.article`
    padding: 0 4rem 2rem 4rem;
`;

const Underliste = styled(Grid)`
    &:not(:last-child) {
        margin-bottom: 4rem;
    }
`;

const NegativtBeløp = styled(Normaltekst)`
    color: var(--navds-color-text-error);
    font-style: italic;
`;

const Luft = styled.div`
    grid-column-start: 1;
    grid-column-end: span 2;
    margin-bottom: 1rem;
`;

const formaterDato = (forfall: string) => dayjs(forfall).format(NORSK_DATOFORMAT);

interface UtbetalingsvisningProps {
    utbetaling: Utbetaling;
    index: number;
    anonymiseringEnabled: boolean;
}

const Utbetalingsvisning = ({ utbetaling, index, anonymiseringEnabled }: UtbetalingsvisningProps) => (
    <React.Fragment>
        {index > 0 && <Luft />}
        <Normaltekst>Utbetales til ID</Normaltekst>
        <Normaltekst>
            {anonymiseringEnabled
                ? getAnonymArbeidsgiverForOrgnr(utbetaling.utbetalesTilId).orgnr
                : utbetaling.utbetalesTilId}
        </Normaltekst>
        <Normaltekst>Utbetales til navn</Normaltekst>
        <Normaltekst>
            {anonymiseringEnabled
                ? getAnonymArbeidsgiverForOrgnr(utbetaling.utbetalesTilId).navn
                : utbetaling.utbetalesTilNavn}
        </Normaltekst>
        <Normaltekst>Forfall</Normaltekst>
        <Normaltekst>{formaterDato(utbetaling.forfall)}</Normaltekst>
        <Normaltekst>Feilkonto</Normaltekst>
        <Normaltekst>{utbetaling.feilkonto ? 'Ja' : 'Nei'}</Normaltekst>
        {utbetaling.detaljer.map((detalj: Utbetalingsdetalj, index: number) => (
            <Utbetalingsdetaljvisning
                detalj={detalj}
                index={index}
                key={`detalj-${index}`}
                anonymiseringEnabled={anonymiseringEnabled}
            />
        ))}
    </React.Fragment>
);

interface UtbetalingsdetaljvisningProps {
    detalj: Utbetalingsdetalj;
    index: number;
    anonymiseringEnabled: boolean;
}

const Utbetalingsdetaljvisning = ({ detalj, index, anonymiseringEnabled }: UtbetalingsdetaljvisningProps) => (
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
        <Normaltekst>{anonymiseringEnabled ? 'Agurkifisert konto' : detalj.konto}</Normaltekst>
        <Normaltekst>Klassekode</Normaltekst>
        <Normaltekst>{detalj.klassekode}</Normaltekst>
        <Normaltekst>Klassekodebeskrivelse</Normaltekst>
        <Normaltekst>{detalj.klassekodeBeskrivelse}</Normaltekst>
        <Normaltekst>Uføregrad</Normaltekst>
        <Normaltekst>{detalj.uforegrad}</Normaltekst>
        <Normaltekst>Utbetalingstype</Normaltekst>
        <Normaltekst>{detalj.utbetalingsType}</Normaltekst>
        <Normaltekst>Refunderes orgnummer</Normaltekst>
        <Normaltekst>
            {anonymiseringEnabled
                ? getAnonymArbeidsgiverForOrgnr(detalj.refunderesOrgNr).orgnr
                : detalj.refunderesOrgNr}
        </Normaltekst>
        <Normaltekst>Tilbakeføring</Normaltekst>
        <Normaltekst>{detalj.tilbakeforing ? 'Ja' : 'Nei'}</Normaltekst>
    </React.Fragment>
);

interface SimuleringsmodalProps {
    simulering: Simulering;
    åpenModal: boolean;
    lukkModal: () => void;
    anonymiseringEnabled: boolean;
}

export const SimuleringsinfoModal = ({
    simulering,
    åpenModal,
    lukkModal,
    anonymiseringEnabled,
}: SimuleringsmodalProps) => (
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
                        <Utbetalingsvisning
                            utbetaling={utbetaling}
                            index={index}
                            key={`utbetaling-${index}`}
                            anonymiseringEnabled={anonymiseringEnabled}
                        />
                    ))}
                </Underliste>
            ))}
        </Modalinnhold>
    </Modal>
);
