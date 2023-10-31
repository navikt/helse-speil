import dayjs from 'dayjs';
import React from 'react';

import { NORSK_DATOFORMAT, NORSK_DATOFORMAT_MED_KLOKKESLETT } from '@utils/date';

import { DokumentLoader } from './DokumentLoader';
import { Spørsmål } from './Spørsmål';
import { SøknadFragment } from './SøknadFragment';
import { useQuerySoknad } from './queries';

import styles from './Søknadsinnhold.module.css';

type SøknadsinnholdProps = {
    dokumentId: DokumenthendelseObject['dokumentId'];
    fødselsnummer: string;
};

export const Søknadsinnhold: React.FC<SøknadsinnholdProps> = ({ dokumentId, fødselsnummer }) => {
    const søknadsrespons = useQuerySoknad(fødselsnummer, dokumentId);
    const søknad = søknadsrespons.data;

    return (
        <div>
            {søknad && (
                <div className={styles.dokument}>
                    {søknad.soknadsperioder && søknad.soknadsperioder.length > 0 && (
                        <>
                            <SøknadFragment overskrift="Søknadsperiode">
                                {`${dayjs(søknad.soknadsperioder[0].fom).format(NORSK_DATOFORMAT)} – ${dayjs(
                                    søknad.soknadsperioder[0].tom,
                                ).format(NORSK_DATOFORMAT)}`}
                            </SøknadFragment>
                            <SøknadFragment overskrift="Grad">{søknad.soknadsperioder[0].grad} %</SøknadFragment>
                            {søknad.soknadsperioder[0].faktiskGrad && (
                                <SøknadFragment overskrift="Oppgitt faktisk arbeidsgrad">
                                    {søknad.soknadsperioder[0].faktiskGrad} %
                                </SøknadFragment>
                            )}
                        </>
                    )}
                    {søknad.arbeidGjenopptatt && (
                        <SøknadFragment overskrift="Arbeid gjenopptatt">
                            {dayjs(søknad.arbeidGjenopptatt).format(NORSK_DATOFORMAT)}
                        </SøknadFragment>
                    )}
                    {søknad.sykmeldingSkrevet && (
                        <SøknadFragment overskrift="Sykmelding skrevet">
                            {dayjs(søknad.sykmeldingSkrevet).format(NORSK_DATOFORMAT_MED_KLOKKESLETT)}
                        </SøknadFragment>
                    )}
                    {(søknad.egenmeldingsdagerFraSykmelding?.length ?? 0) > 0 && (
                        <SøknadFragment overskrift="Egenmeldingsdager fra sykmelding">
                            {søknad.egenmeldingsdagerFraSykmelding
                                ?.map((it) => dayjs(it).format(NORSK_DATOFORMAT))
                                .join(', ')
                                .replace(/,(?=[^,]*$)/, ' og')}
                        </SøknadFragment>
                    )}
                    {søknad.sporsmal && <Spørsmål spørsmål={søknad.sporsmal} />}
                </div>
            )}
            {søknadsrespons.loading && <DokumentLoader />}
            {søknadsrespons.error && <div>Noe gikk feil, vennligst prøv igjen.</div>}
        </div>
    );
};
