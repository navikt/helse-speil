import styled from '@emotion/styled';
import { Dayjs } from 'dayjs';
import { Person } from 'internal-types';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';
import { Pins } from '@navikt/helse-frontend-timeline/lib';
import { Pin } from '@navikt/helse-frontend-timeline/lib/components/types';

import { maksdatoForPerson } from '../../../mapping/selectors';
import { NORSK_DATOFORMAT } from '../../../utils/date';

import { PinsTooltip } from './TidslinjeTooltip';

const Text = styled(BodyShort)`
    font-size: 14px;
`;

const maksdatoForPeriode = (person: Person, fom: Dayjs, tom: Dayjs): Dayjs | undefined => {
    const maksdato = maksdatoForPerson(person);

    return maksdato?.isBefore(tom) && maksdato?.isAfter(fom) ? maksdato : undefined;
};

const maksdatoPin = (person: Person, fom: Dayjs, tom: Dayjs): Pin | undefined => {
    const maksdato = maksdatoForPeriode(person, fom, tom);

    return (
        maksdato && {
            date: maksdato.endOf('day').toDate(),
            render: (
                <PinsTooltip>
                    <Text component="p">Maksdato: {maksdato.format(NORSK_DATOFORMAT)}</Text>
                </PinsTooltip>
            ),
        }
    );
};

interface MarkeringerProps {
    person: Person;
    fom: Dayjs;
    tom: Dayjs;
}

export const Markeringer = ({ person, fom, tom }: MarkeringerProps) => {
    const pins = [maksdatoPin(person, fom, tom)].filter((it) => it) as Pin[];
    return <Pins start={fom.toDate()} slutt={tom.toDate()} direction="right" pins={pins} />;
};
