import React from 'react';
import classNames from 'classnames';
import { createRoot } from 'react-dom/client';
import { BodyShort, Heading } from '@navikt/ds-react';

import { somPenger } from '@utils/locale';
import { getFormatertNavn } from '@utils/string';
import { getFormattedDateString } from '@utils/date';
import { Personinfo, Simulering, Simuleringsdetaljer, Simuleringsutbetaling, Utbetaling } from '@io/graphql';
import { AnonymizableContainer } from '@components/anonymizable/AnonymizableContainer';
import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { LinkButton } from '@components/LinkButton';

import styles from './SimuleringsinfoPopupInnhold.module.css';

interface UtbetalingsvisningProps {
    utbetaling: Simuleringsutbetaling;
    index: number;
}

const Utbetalingsvisning: React.VFC<UtbetalingsvisningProps> = ({ utbetaling, index }) => (
    <React.Fragment>
        {index > 0 && <div className={styles.TomLinje} />}
        <BodyShort>Utbetales til ID</BodyShort>
        <AnonymizableText>{utbetaling.mottakerId}</AnonymizableText>
        <BodyShort>Utbetales til navn</BodyShort>
        <AnonymizableText>{utbetaling.mottakerNavn}</AnonymizableText>
        <BodyShort>Forfall</BodyShort>
        <BodyShort>{getFormattedDateString(utbetaling.forfall)}</BodyShort>
        <BodyShort>Feilkonto</BodyShort>
        <BodyShort>{utbetaling.feilkonto ? 'Ja' : 'Nei'}</BodyShort>
        {utbetaling.detaljer.map((detalj: Simuleringsdetaljer, index: number) => (
            <Utbetalingsdetaljvisning detalj={detalj} index={index} key={`detalj-${index}`} />
        ))}
    </React.Fragment>
);

interface UtbetalingsdetaljvisningProps {
    detalj: Simuleringsdetaljer;
    index: number;
}

const Utbetalingsdetaljvisning: React.VFC<UtbetalingsdetaljvisningProps> = ({ detalj, index }) => (
    <React.Fragment>
        {index > 0 && <div className={styles.TomLinje} />}
        <BodyShort>Faktisk fom</BodyShort>
        <BodyShort>{getFormattedDateString(detalj.fom)}</BodyShort>
        <BodyShort>Faktisk tom</BodyShort>
        <BodyShort>{getFormattedDateString(detalj.tom)}</BodyShort>
        <BodyShort>Sats</BodyShort>
        <BodyShort className={detalj.sats < 0 ? styles.NegativtBeløp : ''}>{somPenger(detalj.sats)}</BodyShort>
        <BodyShort>Antall sats</BodyShort>
        <BodyShort>{detalj.antallSats}</BodyShort>
        <BodyShort>Type sats</BodyShort>
        <BodyShort>{detalj.typeSats}</BodyShort>
        <BodyShort>Beløp</BodyShort>
        <BodyShort className={detalj.belop < 0 ? styles.NegativtBeløp : ''}>{somPenger(detalj.belop)}</BodyShort>
        <BodyShort>Konto</BodyShort>
        <AnonymizableText>{detalj.konto}</AnonymizableText>
        <BodyShort>Klassekode</BodyShort>
        <BodyShort>{detalj.klassekode}</BodyShort>
        <BodyShort>Klassekodebeskrivelse</BodyShort>
        <BodyShort>{detalj.klassekodebeskrivelse}</BodyShort>
        <BodyShort>Uføregrad</BodyShort>
        <BodyShort>{detalj.uforegrad}</BodyShort>
        <BodyShort>Utbetalingstype</BodyShort>
        <BodyShort>{detalj.utbetalingstype}</BodyShort>
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

const SimuleringsinfoPopupInnhold: React.VFC<SimuleringsPopupProps> = ({ simulering, utbetalingId, fnr, navn }) => (
    <div className={styles.Ramme}>
        <Heading as="h1" size="medium">
            Simulering
        </Heading>
        <AnonymizableContainer>
            <Heading as="h2" size="small">
                {navn} ({fnr})
            </Heading>
        </AnonymizableContainer>
        {simulering.perioder?.map((periode, index) => (
            <div className={styles.Grid} key={`periode-${index}`}>
                <div className={styles.TomLinje} />
                <BodyShort>Periode</BodyShort>
                <BodyShort>{`${getFormattedDateString(periode.fom)} - ${getFormattedDateString(
                    periode.tom,
                )}`}</BodyShort>
                <div className={styles.TomLinje} />
                <BodyShort>Totalbeløp simulering</BodyShort>
                <BodyShort className={(simulering.totalbelop ?? 0) < 0 ? styles.NegativtBeløp : ''}>
                    {somPenger(simulering.totalbelop)}
                </BodyShort>
                <div className={styles.TomLinje} />
                {periode.utbetalinger.map((utbetaling, index) => (
                    <Utbetalingsvisning utbetaling={utbetaling} index={index} key={`utbetaling-${index}`} />
                ))}
            </div>
        ))}

        <div className={styles.Grid}>
            <div className={styles.TomLinje} />
            <BodyShort>UtbetalingId</BodyShort>
            <BodyShort>{utbetalingId}</BodyShort>
        </div>
    </div>
);

type CopyStyleAttributeOptions = {
    selector: string;
    from: WindowProxy;
    to: WindowProxy;
};

const copyStyleAttribute = ({ selector, from, to }: CopyStyleAttributeOptions): void => {
    const sourceStyle = from.document.querySelector(selector)?.getAttribute('style');

    if (sourceStyle) {
        to.document.querySelector(selector)?.setAttribute('style', sourceStyle);
    }
};

type CopyStylesheetsOptions = {
    from: WindowProxy;
    to: WindowProxy;
};

const isStylesheetLink = (node: Node): node is HTMLLinkElement => {
    return (node as HTMLLinkElement).rel === 'stylesheet';
};

// Dette funker ikke med vanlig dev-bygg fordi stilene ikke blir hentet som ressurser.
// Hvis man vil teste lokalt kan man bygge frontend med 'vite build' og åpne speil på port 3000.
const copyStylesheets = ({ from, to }: CopyStylesheetsOptions) => {
    const linkNodes = from.document.head.querySelectorAll('head link');

    for (const node of linkNodes) {
        if (isStylesheetLink(node)) {
            const copy = node.cloneNode() as HTMLLinkElement;
            const href = copy.getAttribute('href');

            if (!href?.startsWith('http')) {
                copy.setAttribute('href', from.document.location.origin + href);
            }

            to.document.head.appendChild(copy);
        }
    }
};

const visSimuleringINyttVindu = (data: Simulering, utbetalingId: string, fnr: string, navn: string) => {
    const popup: WindowProxy = window.open('', '_blank', 'width=600, height=900') as WindowProxy;

    popup.document.title = 'Simulering';

    copyStyleAttribute({ from: window, to: popup, selector: 'html' });
    copyStylesheets({ from: window, to: popup });

    const root = createRoot(popup.document.body);

    root.render(<SimuleringsinfoPopupInnhold simulering={data} utbetalingId={utbetalingId} fnr={fnr} navn={navn} />);
};

interface ShowSimuleringButtonProps extends Omit<React.HTMLAttributes<HTMLAnchorElement>, 'children'> {
    data: Simulering;
    personinfo: Personinfo;
    utbetaling: Utbetaling;
    fødselsnummer: string;
}

export const ShowSimuleringButton: React.VFC<ShowSimuleringButtonProps> = ({
    data,
    personinfo,
    utbetaling,
    fødselsnummer,
    className,
    ...anchorProps
}) => {
    return (
        <LinkButton
            onClick={() => visSimuleringINyttVindu(data, utbetaling.id, fødselsnummer, getFormatertNavn(personinfo))}
            className={classNames(styles.SimuleringButton, className)}
            {...anchorProps}
        >
            Simulering
        </LinkButton>
    );
};
