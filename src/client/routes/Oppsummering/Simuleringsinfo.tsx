import React from 'react';
import styled from '@emotion/styled';
import List from '../../components/List';
import dayjs from 'dayjs';
import { Simulering } from '../../context/SimuleringContext';
import ListItem from '../../components/ListItem';
import { toKronerOgØre } from '../../utils/locale';
import { Normaltekst } from 'nav-frontend-typografi';
import { NORSK_DATOFORMAT } from '../../utils/date';
import { Utbetalingsdetalj } from '../../context/mapping/external.types';

const Underliste = styled(List)`
    &:not(:last-child) {
        margin-bottom: 4rem;
    }
`;

const formaterDato = (forfall: string) => dayjs(forfall).format(NORSK_DATOFORMAT);

interface SimuleringProps {
    simulering: Simulering;
}

const Simuleringsinfo = ({ simulering }: SimuleringProps) => (
    <>
        <List>
            <ListItem label="Totalbeløp simulering">{toKronerOgØre(simulering.totalBelop)} kr</ListItem>
        </List>
        <>
            {simulering.periodeList.map((periode, index) => (
                <Underliste key={`periode-${index}`}>
                    <ListItem label="~~~~~~~~~~~~">~~~~~~~~~~~~</ListItem>
                    <Normaltekst>Periode</Normaltekst>
                    <Normaltekst>{`${formaterDato(periode.fom)} - ${formaterDato(periode.tom)}`}</Normaltekst>
                    <>
                        {periode.utbetaling.map((utbetaling, index) => (
                            <React.Fragment key={`utbetaling-${index}`}>
                                {index > 0 && <ListItem label="-------------------">-------------------</ListItem>}
                                <ListItem label="Fagsystem-ID">{utbetaling.fagSystemId}</ListItem>
                                <ListItem label="Utbetales til ID">{utbetaling.utbetalesTilId}</ListItem>
                                <ListItem label="Utbetales til navn">{utbetaling.utbetalesTilNavn}</ListItem>
                                <ListItem label="Forfall">{formaterDato(utbetaling.forfall)}</ListItem>
                                <ListItem label="Feilkonto">{utbetaling.feilkonto ? 'Ja' : 'Nei'}</ListItem>
                                {utbetaling.detaljer.map((detalj: Utbetalingsdetalj, index: number) => (
                                    <React.Fragment key={`detalj-${index}`}>
                                        {index > 0 && (
                                            <ListItem label="-------------------">-------------------</ListItem>
                                        )}
                                        <ListItem label="Faktisk fom">{formaterDato(detalj.faktiskFom)}</ListItem>
                                        <ListItem label="Faktisk tom">{formaterDato(detalj.faktiskTom)}</ListItem>
                                        <ListItem label="Sats">{toKronerOgØre(detalj.sats)} kr</ListItem>
                                        <ListItem label="Antall sats">{detalj.antallSats}</ListItem>
                                        <ListItem label="Type sats">{detalj.typeSats}</ListItem>
                                        <ListItem label="Beløp">{toKronerOgØre(detalj.belop)} kr</ListItem>
                                        <ListItem label="Konto">{detalj.konto}</ListItem>
                                        <ListItem label="Klassekode">{detalj.klassekode}</ListItem>
                                        <ListItem label="Klassekode beskrivelse">
                                            {detalj.klassekodeBeskrivelse}
                                        </ListItem>
                                        <ListItem label="Uføregrad">{detalj.uforegrad}</ListItem>
                                        <ListItem label="Utbetalingstype">{detalj.utbetalingsType}</ListItem>
                                        <ListItem label="Refunderes orgnummer">{detalj.refunderesOrgNr}</ListItem>
                                        <ListItem label="Tilbakeføring">{detalj.tilbakeforing ? 'Ja' : 'Nei'}</ListItem>
                                    </React.Fragment>
                                ))}
                            </React.Fragment>
                        ))}
                    </>
                </Underliste>
            ))}
        </>
    </>
);

export default Simuleringsinfo;
