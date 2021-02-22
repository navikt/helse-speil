import React from 'react';
import { EkspanderbartVarsel } from '../../../components/EkspanderbartVarsel';
import { Varsel, Varseltype } from '@navikt/helse-frontend-varsel';
import { Normaltekst } from 'nav-frontend-typografi';
import { Varselseksjon } from './Varselseksjon';
import wiki from '../../../../../wiki.json';

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
