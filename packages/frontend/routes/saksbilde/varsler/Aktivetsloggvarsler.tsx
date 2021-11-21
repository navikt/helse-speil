import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { EkspanderbartVarsel } from '../../../components/EkspanderbartVarsel';

import utdatert_wiki from '../../../utdatert_wiki.json';
import wiki from '../../../wiki.json';
import { Varselseksjon } from './Varselseksjon';
import { Varsel } from '../../../components/Varsel';
import styled from '@emotion/styled';

type WikiEntry = {
    varsel: string;
    betydning: string;
    løsning: string;
    viktighet: string;
    type?: 'error' | 'warning' | 'info' | 'success';
};

const Aktivitetsloggvarsel = styled(Varsel)`
    border-top: none;
    border-left: none;
    border-right: none;
`;

export const Aktivitetsloggvarsler = React.memo(({ varsler }: { varsler: string[] }) => (
    <>
        {varsler.map((aktivitet, index) => {
            const wikis = [...wiki, ...utdatert_wiki];
            const wikiAktivitet: WikiEntry | undefined = wikis.find((it) => it.varsel === aktivitet);
            if (wikiAktivitet && (wikiAktivitet.betydning.length > 0 || wikiAktivitet.løsning.length > 0)) {
                return (
                    <EkspanderbartVarsel key={index} label={aktivitet} type={wikiAktivitet.type}>
                        <Varselseksjon tittel="Hva betyr det?">{wikiAktivitet.betydning}</Varselseksjon>
                        <Varselseksjon tittel="Hva gjør du?">{wikiAktivitet.løsning}</Varselseksjon>
                    </EkspanderbartVarsel>
                );
            } else {
                return (
                    <Aktivitetsloggvarsel key={index} variant="advarsel">
                        <BodyShort as="p">{aktivitet}</BodyShort>
                    </Aktivitetsloggvarsel>
                );
            }
        })}
    </>
));
