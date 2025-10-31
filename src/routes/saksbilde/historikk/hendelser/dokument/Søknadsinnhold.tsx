import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

import { BodyShort, VStack } from '@navikt/ds-react';

import { useGetSoknad } from '@io/rest/generated/dokumenter/dokumenter';
import { NORSK_DATOFORMAT, NORSK_DATOFORMAT_MED_KLOKKESLETT, somNorskDato } from '@utils/date';
import { somPenger } from '@utils/locale';

import { DokumentFragment } from './DokumentFragment';
import { DokumentLoader } from './DokumentLoader';
import { Spørsmål } from './Spørsmål';

import styles from './Søknadsinnhold.module.css';

type SøknadsinnholdProps = {
    dokumentId: string;
    aktørId: string;
};

export const Søknadsinnhold = ({ dokumentId, aktørId }: SøknadsinnholdProps): ReactElement => {
    const { data: response, isLoading, error } = useGetSoknad(aktørId, dokumentId);
    const data = response?.data;

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
                    {data.selvstendigNaringsdrivende && (
                        <>
                            <DokumentFragment overskrift="Inntekt selvstendig næring">
                                <VStack as="ul" className={styles.inntektsliste}>
                                    {data.selvstendigNaringsdrivende.inntekt?.map((it) => (
                                        <BodyShort as="li" key={it.ar}>
                                            {it.ar}: {somPenger(it.pensjonsgivendeInntektAvNaringsinntekt)}
                                        </BodyShort>
                                    ))}
                                </VStack>
                            </DokumentFragment>
                            {data.selvstendigNaringsdrivende.ventetid && (
                                <DokumentFragment overskrift="Ventetid selvstendig næring">
                                    {somNorskDato(data.selvstendigNaringsdrivende.ventetid.fom)} –{' '}
                                    {somNorskDato(data.selvstendigNaringsdrivende.ventetid.tom)}
                                </DokumentFragment>
                            )}
                        </>
                    )}
                    {data.sporsmal && <Spørsmål spørsmål={data.sporsmal} />}
                </div>
            )}
            {isLoading && <DokumentLoader />}
            {error && <div>Noe gikk galt, vennligst prøv igjen.</div>}
        </div>
    );
};
