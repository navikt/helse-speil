import React, { useContext } from 'react';
import List from '../../components/List';
import ListItem from '../../components/ListItem';
import Utbetaling from './Utbetaling';
import Navigasjonsknapper from '../../components/NavigationButtons';
import { Panel } from 'nav-frontend-paneler';
import { pages } from '../../hooks/useLinks';
import { toKronerOgØre } from '../../utils/locale';
import { PersonContext } from '../../context/PersonContext';
import { Simulering, SimuleringContext } from '../../context/SimuleringContext';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import dayjs from 'dayjs';
import { Utbetaling as UtbetalingType, Utbetalingsdetalj } from '../../context/types';

const Innhold = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
`;

const Divider = styled.hr`
    border: none;
    border-bottom: 1px solid #3e3832;
    grid-column-start: 1;
    grid-column-end: 4;
    margin: 1rem 0;
`;

const StyledPanel = styled(Panel)`
    flex: 1;
    overflow-x: hidden;
    margin-right: 0;
    min-width: 24rem;
    max-width: max-content;
`;

const Oppsummeringstittel = styled(Undertittel)`
    margin-bottom: 1rem;
`;

const Oppsummering = () => {
    const { aktivVedtaksperiode } = useContext(PersonContext);
    const { error, simulering, arbeidsgiver } = useContext(SimuleringContext);
    const { t } = useTranslation();
    if (!aktivVedtaksperiode) return null;

    const { oppsummering, sykepengegrunnlag, inntektskilder } = aktivVedtaksperiode;

    return (
        <Innhold>
            <StyledPanel>
                <Oppsummeringstittel>{t('oppsummering.tittel')}</Oppsummeringstittel>
                <List>
                    <ListItem label={t('oppsummering.sykepengegrunnlag')}>
                        {`${toKronerOgØre(sykepengegrunnlag.årsinntektFraInntektsmelding!)} kr`}
                    </ListItem>
                    <ListItem label={t('oppsummering.dagsats')}>
                        {`${toKronerOgØre(sykepengegrunnlag.dagsats!)} kr`}
                    </ListItem>
                    <ListItem label={t('oppsummering.antall_utbetalingsdager')}>
                        {oppsummering.antallUtbetalingsdager}
                    </ListItem>
                    <ListItem label={t('oppsummering.beløp')}>
                        {`${toKronerOgØre(oppsummering.totaltTilUtbetaling)} kr`}
                    </ListItem>
                    <ListItem label={t('oppsummering.utbetaling_til')}>
                        {`Organisasjonsnummer: ${inntektskilder[0].organisasjonsnummer}`}
                    </ListItem>
                </List>
                <Divider />
                {simulering && arbeidsgiver && <Simuleringsinfo simulering={simulering} />}
                {error && <Normaltekst>{error}</Normaltekst>}
                <Navigasjonsknapper previous={pages.UTBETALINGSOVERSIKT} />
            </StyledPanel>
            <Utbetaling />
        </Innhold>
    );
};
const Underliste = styled(List)`
    &:not(:last-child) {
        margin-bottom: 4rem;
    }
`;

const formaterDato = (forfall: string) => dayjs(forfall).format('DD.MM.YYYY');

interface DetaljerProps {
    detalj: Utbetalingsdetalj;
}

const Detaljer = ({ detalj }: DetaljerProps) => (
    <>
        <ListItem label="Faktisk fom">{formaterDato(detalj.faktiskFom)}</ListItem>
        <ListItem label="Faktisk tom">{formaterDato(detalj.faktiskTom)}</ListItem>
        <ListItem label="Sats">{toKronerOgØre(detalj.sats)} kr</ListItem>
        <ListItem label="Antall sats">{detalj.antallSats}</ListItem>
        <ListItem label="Type sats">{detalj.typeSats}</ListItem>
        <ListItem label="Beløp">{toKronerOgØre(detalj.belop)} kr</ListItem>
        <ListItem label="Konto">{detalj.konto}</ListItem>
        <ListItem label="Klassekode">{detalj.klassekode}</ListItem>
        <ListItem label="Klassekode beskrivelse">{detalj.klassekodeBeskrivelse}</ListItem>
        <ListItem label="Uføregrad">{detalj.uforegrad}</ListItem>
        <ListItem label="Utbetalingstype">{detalj.utbetalingsType}</ListItem>
        <ListItem label="Refunderes orgnummer">{detalj.refunderesOrgNr}</ListItem>
        <ListItem label="Tilbakeføring">{detalj.tilbakeforing ? 'Ja' : 'Nei'}</ListItem>
    </>
);

interface UtbetalinginformasjonProps {
    utbetaling: UtbetalingType;
}

const Utbetalingsinformasjon = ({ utbetaling }: UtbetalinginformasjonProps) => (
    <>
        <ListItem label="Fagsystem-ID">{utbetaling.fagSystemId}</ListItem>
        <ListItem label="Utbetales til ID">{utbetaling.utbetalesTilId}</ListItem>
        <ListItem label="Utbetales til navn">{utbetaling.utbetalesTilNavn}</ListItem>
        <ListItem label="Forfall">{formaterDato(utbetaling.forfall)}</ListItem>
        <ListItem label="Feilkonto">{utbetaling.feilkonto ? 'Ja' : 'Nei'}</ListItem>
        {utbetaling.detaljer.map((detalj: Utbetalingsdetalj, index: number) => (
            <>
                {index > 0 && <ListItem label="-------------------">-------------------</ListItem>}
                <Detaljer detalj={detalj} />
            </>
        ))}
    </>
);

interface SimuleringsinfoProps {
    simulering: Simulering;
}

const Simuleringsinfo = ({ simulering }: SimuleringsinfoProps) => (
    <>
        <List>
            <ListItem label="Totalbeløp simulering">
                {toKronerOgØre(simulering.totalBelop)} kr
            </ListItem>
        </List>
        <>
            {simulering.periodeList.map((periode, index) => (
                <Underliste>
                    <ListItem label="~~~~~~~~~~~~">~~~~~~~~~~~~</ListItem>
                    <Normaltekst>Periode</Normaltekst>
                    <Normaltekst>{`${formaterDato(periode.fom)} - ${formaterDato(
                        periode.tom
                    )}`}</Normaltekst>
                    <>
                        {periode.utbetaling.map((utbetaling, index) => (
                            <>
                                {index > 0 && (
                                    <ListItem label="-------------------">
                                        -------------------
                                    </ListItem>
                                )}
                                <Utbetalingsinformasjon utbetaling={utbetaling} />
                            </>
                        ))}
                    </>
                </Underliste>
            ))}
        </>
    </>
);

export default Oppsummering;
