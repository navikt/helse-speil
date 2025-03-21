import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

import { DokumenthendelseObject } from '@typer/historikk';
import { NORSK_DATOFORMAT, NORSK_DATOFORMAT_MED_KLOKKESLETT, somNorskDato } from '@utils/date';

import { DokumentFragment } from './DokumentFragment';
import { DokumentLoader } from './DokumentLoader';
import { Spørsmål } from './Spørsmål';
import { useQuerySoknad } from './queries';

import styles from './Søknadsinnhold.module.css';

type SøknadsinnholdProps = {
    dokumentId: DokumenthendelseObject['dokumentId'];
    fødselsnummer: string;
};

export const Søknadsinnhold = ({ dokumentId, fødselsnummer }: SøknadsinnholdProps): ReactElement => {
    const søknadsrespons = useQuerySoknad(fødselsnummer, dokumentId ?? '');
    const søknad = søknadsrespons.data;

    return (
        <div>
            {søknad && (
                <div className={styles.dokument}>
                    {søknad.type && (
                        <DokumentFragment overskrift="Type">{søknad.type.replace('_', ' ')}</DokumentFragment>
                    )}
                    {søknad.soknadsperioder &&
                        søknad.soknadsperioder.length > 0 &&
                        søknad.soknadsperioder.map((søknadsperiode) => (
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
                    {søknad.arbeidGjenopptatt && (
                        <DokumentFragment overskrift="Arbeid gjenopptatt">
                            {somNorskDato(søknad.arbeidGjenopptatt)}
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
                                ?.map((it) => somNorskDato(it))
                                .sort((a, b) =>
                                    dayjs(a, NORSK_DATOFORMAT).isAfter(dayjs(b, NORSK_DATOFORMAT)) ? 1 : -1,
                                )
                                .join(', ')
                                .replace(/,(?=[^,]*$)/, ' og')}
                        </DokumentFragment>
                    )}
                    {søknad.sporsmal && <Spørsmål spørsmål={søknad.sporsmal} />}
                </div>
            )}
            {søknadsrespons.loading && <DokumentLoader />}
            {søknadsrespons.error && <div>Noe gikk galt, vennligst prøv igjen.</div>}
        </div>
    );
};
