import React from 'react';

import { Normaltekst } from 'nav-frontend-typografi';

import { Varsel, Varseltype } from '@navikt/helse-frontend-varsel';

import { EkspanderbartVarsel } from '../../../components/EkspanderbartVarsel';

import wiki from '../../../../../wiki.json';
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
                const wikiAktivitet: WikiEntry | undefined = wiki.find((it) => it.varsel === aktivitet);
                if (wikiAktivitet && (wikiAktivitet.betydning.length > 0 || wikiAktivitet.løsning.length > 0)) {
                    return (
                        <EkspanderbartVarsel key={index} type={Varseltype.Advarsel} label={aktivitet}>
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
