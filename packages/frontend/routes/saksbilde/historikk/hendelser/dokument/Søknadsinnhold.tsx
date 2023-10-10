import dayjs from 'dayjs';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { NORSK_DATOFORMAT_MED_KLOKKESLETT } from '@utils/date';

import { DokumentLoader } from './DokumentLoader';
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
                    {søknad.sendtNav && (
                        <>
                            <Bold size="small">Søknad sendt</Bold>
                            <BodyShort size="small">
                                {dayjs(søknad.sendtNav).format(NORSK_DATOFORMAT_MED_KLOKKESLETT)}
                            </BodyShort>
                        </>
                    )}
                </div>
            )}
            {søknadsrespons.loading && <DokumentLoader />}
            {søknadsrespons.error && <div>Noe gikk feil, vennligst prøv igjen.</div>}
        </div>
    );
};
