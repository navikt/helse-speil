import dayjs from 'dayjs';
import React from 'react';

import { NORSK_DATOFORMAT, NORSK_DATOFORMAT_MED_KLOKKESLETT } from '@utils/date';

import { DokumentFragment } from './DokumentFragment';
import { DokumentLoader } from './DokumentLoader';
import { Spørsmål } from './Spørsmål';
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
                    {søknad.soknadsperioder &&
                        søknad.soknadsperioder.length > 0 &&
                        søknad.soknadsperioder.map((søknadsperiode) => (
                            <DokumentFragment
                                overskrift={`${dayjs(søknadsperiode.fom).format(NORSK_DATOFORMAT)} – ${dayjs(
                                    søknadsperiode.tom,
                                ).format(NORSK_DATOFORMAT)}`}
                                key={`søknadsperiode${søknadsperiode.fom}`}
                            >
                                {søknadsperiode.grad || søknadsperiode.sykmeldingsgrad ? (
                                    <>{søknadsperiode.grad || søknadsperiode.sykmeldingsgrad} % sykmeldt</>
                                ) : (
                                    'Sykmeldingsgrad ikke oppgitt'
                                )}
                                {søknadsperiode.faktiskGrad && (
                                    <>
                                        <br />
                                        Oppgitt faktisk arbeidsgrad {søknadsperiode.faktiskGrad} %
                                    </>
                                )}
                            </DokumentFragment>
                        ))}
                    {søknad.arbeidGjenopptatt && (
                        <DokumentFragment overskrift="Arbeid gjenopptatt">
                            {dayjs(søknad.arbeidGjenopptatt).format(NORSK_DATOFORMAT)}
                        </DokumentFragment>
                    )}
                    {søknad.sykmeldingSkrevet && (
                        <DokumentFragment overskrift="Sykmelding skrevet">
                            {dayjs(søknad.sykmeldingSkrevet).format(NORSK_DATOFORMAT_MED_KLOKKESLETT)}
                        </DokumentFragment>
                    )}
                    {(søknad.egenmeldingsdagerFraSykmelding?.length ?? 0) > 0 && (
                        <DokumentFragment overskrift="Egenmeldingsdager fra sykmelding">
                            {søknad.egenmeldingsdagerFraSykmelding
                                ?.map((it) => dayjs(it).format(NORSK_DATOFORMAT))
                                .join(', ')
                                .replace(/,(?=[^,]*$)/, ' og')}
                        </DokumentFragment>
                    )}
                    {søknad.sporsmal && <Spørsmål spørsmål={søknad.sporsmal} />}
                </div>
            )}
            {søknadsrespons.loading && <DokumentLoader />}
            {søknadsrespons.error && <div>Noe gikk feil, vennligst prøv igjen.</div>}
        </div>
    );
};
