import dayjs from 'dayjs';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

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

    const søknadsperiode = (søknad?.soknadsperioder?.length ?? 0) > 0 ? søknad?.soknadsperioder?.shift() : null;

    return (
        <div>
            {søknad && (
                <div className={styles.dokument}>
                    {søknadsperiode && (
                        <>
                            <SøknadFragment overskrift="Søknadsperiode">
                                <BodyShort size="small">
                                    {søknadsperiode.fom} - {søknadsperiode.tom}
                                </BodyShort>
                            </SøknadFragment>
                            <SøknadFragment overskrift="Grad">
                                <BodyShort size="small">{søknadsperiode.grad}</BodyShort>
                            </SøknadFragment>
                            {søknadsperiode.faktiskGrad && (
                                <SøknadFragment overskrift="Faktisk grad">
                                    <BodyShort size="small">{søknadsperiode.faktiskGrad}</BodyShort>
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
                            {søknad.egenmeldingsdagerFraSykmelding?.map((it) => dayjs(it).format(NORSK_DATOFORMAT))}
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
