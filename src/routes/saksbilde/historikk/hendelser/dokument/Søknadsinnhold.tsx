import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

import { useHentSøknadDokumentQuery } from '@state/dokument';
import { NORSK_DATOFORMAT, NORSK_DATOFORMAT_MED_KLOKKESLETT, somNorskDato } from '@utils/date';

import { DokumentFragment } from './DokumentFragment';
import { DokumentLoader } from './DokumentLoader';
import { Spørsmål } from './Spørsmål';

import styles from './Søknadsinnhold.module.css';

type SøknadsinnholdProps = {
    dokumentId: string;
    aktørId: string;
};

export const Søknadsinnhold = ({ dokumentId, aktørId }: SøknadsinnholdProps): ReactElement => {
    const { data, isLoading, error } = useHentSøknadDokumentQuery(aktørId, dokumentId);

    return (
        <div>
            {data && (
                <div className={styles.dokument}>
                    {data.type && (
                        <DokumentFragment overskrift="Type">{data.type.replaceAll('_', ' ')}</DokumentFragment>
                    )}

                    {data.soknadsperioder &&
                        data.soknadsperioder.length > 0 &&
                        data.soknadsperioder.map((søknadsperiode) => (
                            <DokumentFragment
                                overskrift={`${somNorskDato(søknadsperiode.fom)} – ${somNorskDato(søknadsperiode.tom)}`}
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
                    {data.arbeidGjenopptatt && (
                        <DokumentFragment overskrift="Arbeid gjenopptatt">
                            {somNorskDato(data.arbeidGjenopptatt)}
                        </DokumentFragment>
                    )}
                    {data.sykmeldingSkrevet && (
                        <DokumentFragment overskrift="Sykmelding skrevet">
                            {dayjs(data.sykmeldingSkrevet).format(NORSK_DATOFORMAT_MED_KLOKKESLETT)}
                        </DokumentFragment>
                    )}
                    {(data.egenmeldingsdagerFraSykmelding?.length ?? 0) > 0 && (
                        <DokumentFragment overskrift="Egenmeldingsdager fra sykmelding">
                            {data.egenmeldingsdagerFraSykmelding
                                ?.map((it) => somNorskDato(it))
                                .sort((a, b) =>
                                    dayjs(a, NORSK_DATOFORMAT).isAfter(dayjs(b, NORSK_DATOFORMAT)) ? 1 : -1,
                                )
                                .join(', ')
                                .replace(/,(?=[^,]*$)/, ' og')}
                        </DokumentFragment>
                    )}
                    {data.sporsmal && <Spørsmål spørsmål={data.sporsmal} />}
                </div>
            )}
            {isLoading && <DokumentLoader />}
            {error && <div>Noe gikk galt, vennligst prøv igjen.</div>}
        </div>
    );
};
