import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { NORSK_DATOFORMAT } from '@utils/date';
import { somPenger } from '@utils/locale';
import dayjs from 'dayjs';
import React, { CSSProperties } from 'react';

import { BodyShort, Heading } from '@navikt/ds-react';
import ReactDOM from 'react-dom';
import { useAktivPeriode, useVedtaksperiode } from '@state/tidslinje';
import { getFormatertNavn, usePerson } from '@state/person';
import styled from '@emotion/styled';
import { LinkButton } from '@components/LinkButton';

import styles from './SimuleringsinfoPopupInnhold.module.css';

const formaterDato = (forfall: string) => dayjs(forfall).format(NORSK_DATOFORMAT);

const SimuleringButton = styled(LinkButton)`
    margin-top: -0.25rem;
    margin-bottom: 0.25rem;
    width: max-content;
`;

interface UtbetalingsvisningProps {
    utbetaling: Simuleringsutbetaling;
    index: number;
}

const Utbetalingsvisning = ({ utbetaling, index }: UtbetalingsvisningProps) => (
    <React.Fragment>
        {index > 0 && <div className={styles.TomLinje} />}
        <BodyShort>Utbetales til ID</BodyShort>
        <AnonymizableText>{utbetaling.utbetalesTilId}</AnonymizableText>
        <BodyShort>Utbetales til navn</BodyShort>
        <AnonymizableText>{utbetaling.utbetalesTilNavn}</AnonymizableText>
        <BodyShort>Forfall</BodyShort>
        <BodyShort>{formaterDato(utbetaling.forfall)}</BodyShort>
        <BodyShort>Feilkonto</BodyShort>
        <BodyShort>{utbetaling.feilkonto ? 'Ja' : 'Nei'}</BodyShort>
        {utbetaling.detaljer.map((detalj: Simuleringsutbetalingdetalj, index: number) => (
            <Utbetalingsdetaljvisning detalj={detalj} index={index} key={`detalj-${index}`} />
        ))}
    </React.Fragment>
);

interface UtbetalingsdetaljvisningProps {
    detalj: Simuleringsutbetalingdetalj;
    index: number;
}

const Utbetalingsdetaljvisning = ({ detalj, index }: UtbetalingsdetaljvisningProps) => (
    <React.Fragment>
        {index > 0 && <div className={styles.TomLinje} />}
        <BodyShort>Faktisk fom</BodyShort>
        <BodyShort>{formaterDato(detalj.faktiskFom)}</BodyShort>
        <BodyShort>Faktisk tom</BodyShort>
        <BodyShort>{formaterDato(detalj.faktiskTom)}</BodyShort>
        <BodyShort>Sats</BodyShort>
        {detalj.sats < 0 ? (
            <BodyShort className={styles.NegativtBeløp} as="p">
                {somPenger(detalj.sats)}
            </BodyShort>
        ) : (
            <BodyShort>{somPenger(detalj.sats)}</BodyShort>
        )}
        <BodyShort>Antall sats</BodyShort>
        <BodyShort>{detalj.antallSats}</BodyShort>
        <BodyShort>Type sats</BodyShort>
        <BodyShort>{detalj.typeSats}</BodyShort>
        <BodyShort>Beløp</BodyShort>
        {detalj.belop < 0 ? (
            <BodyShort className={styles.NegativtBeløp} as="p">
                {somPenger(detalj.belop)}
            </BodyShort>
        ) : (
            <BodyShort>{somPenger(detalj.belop)}</BodyShort>
        )}
        <BodyShort>Konto</BodyShort>
        <AnonymizableText>{detalj.konto}</AnonymizableText>
        <BodyShort>Klassekode</BodyShort>
        <BodyShort>{detalj.klassekode}</BodyShort>
        <BodyShort>Klassekodebeskrivelse</BodyShort>
        <BodyShort>{detalj.klassekodeBeskrivelse}</BodyShort>
        <BodyShort>Uføregrad</BodyShort>
        <BodyShort>{detalj.uforegrad}</BodyShort>
        <BodyShort>Utbetalingstype</BodyShort>
        <BodyShort>{detalj.utbetalingsType}</BodyShort>
        <BodyShort>Refunderes orgnummer</BodyShort>
        <AnonymizableText>{detalj.refunderesOrgNr}</AnonymizableText>
        <BodyShort>Tilbakeføring</BodyShort>
        <BodyShort>{detalj.tilbakeforing ? 'Ja' : 'Nei'}</BodyShort>
    </React.Fragment>
);

interface SimuleringsPopupProps {
    simulering: Simulering;
    utbetalingId: string;
    fnr: string;
    navn: string;
}

const SimuleringsinfoPopupInnhold = ({ simulering, utbetalingId, fnr, navn }: SimuleringsPopupProps) => (
    <div className={styles.Ramme}>
        <Heading as="h1" size="medium">
            Simulering
        </Heading>
        <Heading as="h2" size="small">
            {navn} ({fnr})
        </Heading>
        {simulering.perioder.map((periode, index) => (
            <div className={styles.Grid} key={`periode-${index}`}>
                <div className={styles.TomLinje} />
                <BodyShort as="p">Periode</BodyShort>
                <BodyShort as="p">{`${formaterDato(periode.fom)} - ${formaterDato(periode.tom)}`}</BodyShort>
                <div className={styles.TomLinje} />
                <BodyShort>Totalbeløp simulering</BodyShort>
                {simulering.totalbeløp < 0 ? (
                    <BodyShort className={styles.NegativtBeløp} as="p">
                        {somPenger(simulering.totalbeløp)}
                    </BodyShort>
                ) : (
                    <BodyShort>{somPenger(simulering.totalbeløp)}</BodyShort>
                )}
                <div className={styles.TomLinje} />
                {periode.utbetalinger.map((utbetaling, index) => (
                    <Utbetalingsvisning utbetaling={utbetaling} index={index} key={`utbetaling-${index}`} />
                ))}
            </div>
        ))}

        <div className={styles.Grid}>
            <div className={styles.TomLinje} />
            <BodyShort as="p">UtbetalingId</BodyShort>
            <BodyShort as="p">{utbetalingId}</BodyShort>
        </div>
    </div>
);

const visSimuleringINyttVindu = (data: Simulering, utbetalingId: string, fnr: string, navn: string) => {
    const container = document.createElement('div');

    ReactDOM.render(
        React.createElement(SimuleringsinfoPopupInnhold, { simulering: data, utbetalingId, fnr, navn }, null),
        container
    );

    const popup = window.open(
        '',
        '_blank',
        'scrollbars=no, resizable=no, status=no, location=no, toolbar=no, menubar=no, width=600, height=900'
    );

    const html = document.getElementsByTagName('html')[0];
    const anonymymiseringsstiler = html.getAttribute('style');
    popup!.document.getElementsByTagName('html')[0].setAttribute('style', anonymymiseringsstiler ?? '');
    const head = document.getElementsByTagName('head')[0];
    // Dette funker ikke med vanlig dev-bygg fordi stilene ikke blir hentet som ressurser. Hvis man vil teste lokalt kan man bygge frontend med 'vite build', og åpne speil på port 3000.
    const stiler = Array.from(head.getElementsByTagName('link')).filter((link) => link.rel === 'stylesheet');
    stiler.forEach((stil) => {
        const href = stil.getAttribute('href')!;
        if (!href.startsWith('http')) {
            stil.setAttribute('href', document.location.origin + href);
        }
        popup!.document.head.appendChild(stil.cloneNode());
    });

    popup!.document.body.innerHTML = container.innerHTML;
    popup!.document.title = 'Simulering';
};

export const NyttVinduSimuleringKnapp = ({ data, style }: { data: Simulering; style: CSSProperties }) => {
    const aktivPeriode = useAktivPeriode();
    const utbetalingId = useVedtaksperiode(aktivPeriode.id)?.utbetaling?.utbetalingId ?? 'Ukjent';
    const person = usePerson();
    if (!person) return null;
    const fnr = person.fødselsnummer;
    const navn = getFormatertNavn(person.personinfo);
    return (
        <SimuleringButton style={style} onClick={() => visSimuleringINyttVindu(data, utbetalingId, fnr, navn)}>
            Simulering
        </SimuleringButton>
    );
};
