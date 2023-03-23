import styled from '@emotion/styled';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { NORSK_DATOFORMAT_MED_KLOKKESLETT } from '@utils/date';

const NotatTekst = styled(BodyShort)`
    font-size: 14px;
    color: var(--a-gray-800);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

interface SisteNotatProps {
    notat: Notat;
}

export const SisteNotat: React.FC<SisteNotatProps> = ({ notat }) => (
    <NotatTekst as="p">
        {notat.opprettet.format(NORSK_DATOFORMAT_MED_KLOKKESLETT)} : {notat.tekst}
    </NotatTekst>
);
