import React from 'react';

import { BodyShort } from '@navikt/ds-react';
import { Varseltype } from '@navikt/helse-frontend-varsel';

import { EkspanderbartVarsel } from '../../../components/EkspanderbartVarsel';

import utdatert_wiki from '../../../utdatert_wiki.json';
import wiki from '../../../wiki.json';
import { Saksbildevarsel } from './Saksbildevarsel';
import { Varselseksjon } from './Varselseksjon';

type WikiEntry = {
    varsel: string;
    betydning: string;
    løsning: string;
    viktighet: string;
};

export const Aktivitetsloggvarsler = React.memo(({ varsler }: { varsler: string[] }) => {
    return (
        <>
            {varsler.map((aktivitet, index) => {
                const wikis = [...wiki, ...utdatert_wiki];
                const wikiAktivitet: WikiEntry | undefined = wikis.find((it) => it.varsel === aktivitet);
                if (wikiAktivitet && (wikiAktivitet.betydning.length > 0 || wikiAktivitet.løsning.length > 0)) {
                    return (
                        <EkspanderbartVarsel key={index} label={aktivitet}>
                            <Varselseksjon tittel="Hva betyr det?">{wikiAktivitet.betydning}</Varselseksjon>
                            <Varselseksjon tittel="Hva gjør du?">{wikiAktivitet.løsning}</Varselseksjon>
                        </EkspanderbartVarsel>
                    );
                } else {
                    return (
                        <Saksbildevarsel key={index} type={Varseltype.Advarsel}>
                            <BodyShort as="p">{aktivitet}</BodyShort>
                        </Saksbildevarsel>
                    );
                }
            })}
        </>
    );
});
