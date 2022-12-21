import React from 'react';

import { Alert, BodyShort } from '@navikt/ds-react';

import { EkspanderbartAktivitetsloggvarsel } from '@components/EkspanderbartAktivitetsloggvarsel';

import utdatert_wiki from '../../../utdatert_wiki.json';
import wiki from '../../../wiki.json';
import { Varselseksjon } from './Varselseksjon';

import styles from './Saksbildevarsler.module.css';

type WikiEntry = {
    varsel: string;
    betydning: string;
    løsning: string;
    viktighet: string;
    type?: 'error' | 'warning' | 'info' | 'success';
};

interface AktivitetsloggvarslerProps {
    varsler: Array<string>;
}

export const Aktivitetsloggvarsler: React.FC<AktivitetsloggvarslerProps> = React.memo(({ varsler }) => {
    const reservasjonsvarsel =
        'Ikke registrert eller mangler samtykke i Kontakt- og reservasjonsregisteret, eventuell kommunikasjon må skje i brevform';

    const varslerSomIkkeSkalVises = [reservasjonsvarsel];

    return (
        <>
            {varsler
                .filter((it) => !varslerSomIkkeSkalVises.includes(it))
                .map((aktivitet, index) => {
                    const wikis = [...wiki, ...utdatert_wiki];
                    const wikiAktivitet: WikiEntry | undefined = wikis.find((it) => it.varsel === aktivitet);
                    if (wikiAktivitet && (wikiAktivitet.betydning.length > 0 || wikiAktivitet.løsning.length > 0)) {
                        return (
                            <EkspanderbartAktivitetsloggvarsel key={index} label={aktivitet} type={wikiAktivitet.type}>
                                <Varselseksjon tittel="Hva betyr det?">{wikiAktivitet.betydning}</Varselseksjon>
                                <Varselseksjon tittel="Hva gjør du?">{wikiAktivitet.løsning}</Varselseksjon>
                            </EkspanderbartAktivitetsloggvarsel>
                        );
                    } else {
                        return (
                            <Alert className={styles.Varsel} key={index} variant="warning">
                                <BodyShort as="p">{aktivitet}</BodyShort>
                            </Alert>
                        );
                    }
                })}
        </>
    );
});
