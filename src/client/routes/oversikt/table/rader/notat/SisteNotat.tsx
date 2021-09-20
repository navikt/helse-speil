import styled from '@emotion/styled';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { NORSK_DATOFORMAT, NORSK_KLOKKESLETT } from '../../../../../utils/date';

const NotatContainer = styled.li`
    margin: 0;
    padding: 0 0;
    &:not(:last-of-type) {
        border-bottom: 1px solid var(--navds-color-border);
    }
`;

const NotatTekst = styled(BodyShort)`
    font-size: 14px;
    align-items: center;
    color: var(--navds-color-text-disabled);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-height: 1.5rem;
    padding-left: 0;
`;

export const SisteNotat = ({ notater, multiline = false }: { notater: Notat[]; multiline: boolean }) => {
    if (!notater || notater.length < 1) return null;
    const notat = notater.sort((a, b) => (b.opprettet.isBefore(a.opprettet) ? 1 : -1))[notater.length - 1];

    const tekst1 = `${notat.opprettet.format(NORSK_DATOFORMAT)} kl ${notat.opprettet.format(NORSK_KLOKKESLETT)}`;

    const tekst2 = `${notat.tekst}`;
    return (
        <ul>
            <NotatContainer key={notat.id}>
                {multiline ? (
                    <>
                        <NotatTekst component="p">{tekst1}</NotatTekst>
                        <NotatTekst component="p">{tekst2}</NotatTekst>
                    </>
                ) : (
                    <NotatTekst component="p">
                        {tekst1}
                        {': '} {tekst2}
                    </NotatTekst>
                )}
            </NotatContainer>
        </ul>
    );
};
