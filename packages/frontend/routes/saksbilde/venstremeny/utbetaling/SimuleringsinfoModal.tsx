import styled from '@emotion/styled';
import dayjs from 'dayjs';
import React from 'react';

import { BodyShort, Heading } from '@navikt/ds-react';

import { Grid } from '../../../../components/Grid';
import { Modal } from '../../../../components/Modal';
import { usePersondataSkalAnonymiseres } from '../../../../state/person';
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

const Bold = styled(BodyShort)`
    font-weight: 600;
`;

const NegativtBeløp = styled(BodyShort)`
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
    utbetaling: Simuleringsutbetaling;
    index: number;
    anonymiseringEnabled: boolean;
}

const Utbetalingsvisning = ({ utbetaling, index, anonymiseringEnabled }: UtbetalingsvisningProps) => (
    <React.Fragment>
        {index > 0 && <Luft />}
        <BodyShort>Utbetales til ID</BodyShort>
        <BodyShort>
            {anonymiseringEnabled
                ? getAnonymArbeidsgiverForOrgnr(utbetaling.utbetalesTilId).orgnr
                : utbetaling.utbetalesTilId}
        </BodyShort>
        <BodyShort>Utbetales til navn</BodyShort>
        <BodyShort>
            {anonymiseringEnabled
                ? getAnonymArbeidsgiverForOrgnr(utbetaling.utbetalesTilId).navn
                : utbetaling.utbetalesTilNavn}
        </BodyShort>
        <BodyShort>Forfall</BodyShort>
        <BodyShort>{formaterDato(utbetaling.forfall)}</BodyShort>
        <BodyShort>Feilkonto</BodyShort>
        <BodyShort>{utbetaling.feilkonto ? 'Ja' : 'Nei'}</BodyShort>
        {utbetaling.detaljer.map((detalj: Simuleringsutbetalingdetalj, index: number) => (
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
    detalj: Simuleringsutbetalingdetalj;
    index: number;
    anonymiseringEnabled: boolean;
}

const Utbetalingsdetaljvisning = ({ detalj, index, anonymiseringEnabled }: UtbetalingsdetaljvisningProps) => (
    <React.Fragment>
        {index > 0 && <Luft />}
        <BodyShort>Faktisk fom</BodyShort>
        <BodyShort>{formaterDato(detalj.faktiskFom)}</BodyShort>
        <BodyShort>Faktisk tom</BodyShort>
        <BodyShort>{formaterDato(detalj.faktiskTom)}</BodyShort>
        <BodyShort>Sats</BodyShort>
        {detalj.sats < 0 ? (
            <NegativtBeløp as="p">{somPenger(detalj.sats)}</NegativtBeløp>
        ) : (
            <BodyShort>{somPenger(detalj.sats)}</BodyShort>
        )}
        <BodyShort>Antall sats</BodyShort>
        <BodyShort>{detalj.antallSats}</BodyShort>
        <BodyShort>Type sats</BodyShort>
        <BodyShort>{detalj.typeSats}</BodyShort>
        <BodyShort>Beløp</BodyShort>
        {detalj.belop < 0 ? (
            <NegativtBeløp as="p">{somPenger(detalj.belop)}</NegativtBeløp>
        ) : (
            <BodyShort>{somPenger(detalj.belop)}</BodyShort>
        )}
        <BodyShort>Konto</BodyShort>
        <BodyShort>{anonymiseringEnabled ? 'Agurkifisert konto' : detalj.konto}</BodyShort>
        <BodyShort>Klassekode</BodyShort>
        <BodyShort>{detalj.klassekode}</BodyShort>
        <BodyShort>Klassekodebeskrivelse</BodyShort>
        <BodyShort>{detalj.klassekodeBeskrivelse}</BodyShort>
        <BodyShort>Uføregrad</BodyShort>
        <BodyShort>{detalj.uforegrad}</BodyShort>
        <BodyShort>Utbetalingstype</BodyShort>
        <BodyShort>{detalj.utbetalingsType}</BodyShort>
        <BodyShort>Refunderes orgnummer</BodyShort>
        <BodyShort>
            {anonymiseringEnabled
                ? getAnonymArbeidsgiverForOrgnr(detalj.refunderesOrgNr).orgnr
                : detalj.refunderesOrgNr}
        </BodyShort>
        <BodyShort>Tilbakeføring</BodyShort>
        <BodyShort>{detalj.tilbakeforing ? 'Ja' : 'Nei'}</BodyShort>
    </React.Fragment>
);

interface SimuleringsmodalProps {
    simulering: Simulering;
    lukkModal: () => void;
}

export const SimuleringsinfoModal = ({ simulering, lukkModal }: SimuleringsmodalProps) => {
    const anonymiseringEnabled = usePersondataSkalAnonymiseres();
    return (
        <Modal isOpen contentLabel="Simuleringsinfo" onRequestClose={lukkModal}>
            <Modalinnhold>
                <Grid gridTemplateColumns="1fr 1fr">
                    <Heading as="h2" size="medium">
                        Simulering
                    </Heading>
                </Grid>
                {simulering.perioder.map((periode, index) => (
                    <Underliste gridTemplateColumns="1fr 1fr" key={`periode-${index}`}>
                        <Luft />
                        <BodyShort as="p">Periode</BodyShort>
                        <BodyShort as="p">{`${formaterDato(periode.fom)} - ${formaterDato(periode.tom)}`}</BodyShort>
                        <Luft />
                        <BodyShort>Totalbeløp simulering</BodyShort>
                        {simulering.totalbeløp < 0 ? (
                            <NegativtBeløp as="p">{somPenger(simulering.totalbeløp)}</NegativtBeløp>
                        ) : (
                            <BodyShort>{somPenger(simulering.totalbeløp)}</BodyShort>
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
};
