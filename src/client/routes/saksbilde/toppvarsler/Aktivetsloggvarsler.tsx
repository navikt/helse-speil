import React, { useEffect, useState } from 'react';
import { EkspanderbartVarsel } from '../../../components/EkspanderbartVarsel';
import { Varsel, Varseltype } from '@navikt/helse-frontend-varsel';
import { Normaltekst } from 'nav-frontend-typografi';
import { Varselseksjon } from './Varselseksjon';
import { erLocal, erPreprod } from '../../../featureToggles';

type WikiEntry = {
    varsel: string;
    betydning: string;
    årsak: string;
    løsning: string;
    viktighet: string;
};

const loadWiki = (): Promise<{ default: WikiEntry[] }> =>
    erLocal() ? import('../../../../../wiki.json') : Promise.resolve({ default: [] });

export const Aktivitetsloggvarsler = React.memo(({ varsler }: { varsler: string[] }) => {
    const [wiki, setWiki] = useState<WikiEntry[] | null>(null);

    useEffect(() => {
        (erPreprod() || erLocal()) && loadWiki().then((res) => setWiki(res.default));
    }, []);

    return (
        <>
            {varsler.map((aktivitet, index) => {
                const wikiAktivitet = wiki?.find((it) => it.varsel === aktivitet);
                if (wikiAktivitet) {
                    return (
                        <EkspanderbartVarsel
                            key={index}
                            type={Varseltype.Advarsel}
                            label={<Normaltekst>{aktivitet}</Normaltekst>}
                        >
                            <Varselseksjon tittel="Hva betyr det?">{wikiAktivitet.betydning}</Varselseksjon>
                            <Varselseksjon tittel="Hva gjør du?">{wikiAktivitet.løsning}</Varselseksjon>
                        </EkspanderbartVarsel>
                    );
                } else {
                    return (
                        <Varsel key={index} type={Varseltype.Advarsel}>
                            <Normaltekst>{aktivitet}</Normaltekst>
                        </Varsel>
                    );
                }
            })}
        </>
    );
});
