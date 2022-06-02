import styled from '@emotion/styled';
import React from 'react';

import { Detail } from '@navikt/ds-react';

import { somPengerUtenDesimaler } from '@utils/locale';
import { Sykepengegrunnlagsgrense } from '@io/graphql';
import { somDato } from '@utils/date';
import { LovdataLenke } from '@components/LovdataLenke';

interface Props {
    sykepengegrunnlagsgrense: Sykepengegrunnlagsgrense;
    omregnetÅrsinntekt: number;
}

const Space = styled.div`
    margin-left: 10px;
    display: inline;
`;

export const SykepengegrunnlagsgrenseView = ({ sykepengegrunnlagsgrense, omregnetÅrsinntekt }: Props) => {
    return (
        <>
            {omregnetÅrsinntekt > sykepengegrunnlagsgrense.grense && (
                <>
                    <Detail style={{ fontSize: '11.5px', color: '#59514B' }} size="small">
                        {`Sykepengegrunnlaget er begrenset til 6G: ${somPengerUtenDesimaler(
                            sykepengegrunnlagsgrense.grense,
                        )}`}
                        <Space>
                            <LovdataLenke paragraf="8-10">§ 8-10</LovdataLenke>
                        </Space>
                    </Detail>
                </>
            )}
            <Detail style={{ fontSize: '11.5px', color: '#59514B' }} size="small">
                {`Grunnbeløp (G) ved skjæringstidspunkt: ${somPengerUtenDesimaler(
                    sykepengegrunnlagsgrense.grunnbelop,
                )} (${virkningstidspunktFormat(sykepengegrunnlagsgrense.virkningstidspunkt)})`}
            </Detail>
        </>
    );
};

const upperCase = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
const virkningstidspunktFormat = (dato: string) => upperCase(somDato(dato).locale('no').format('DD. MMM YYYY'));
