import React, { ReactElement } from 'react';

import { BodyShort, VStack } from '@navikt/ds-react';

import { BodyShortWithPreWrap } from '@components/BodyShortWithPreWrap';
import { OverstyrtDag } from '@io/graphql';
import { HistorikkKildeSaksbehandlerIkon } from '@saksbilde/historikk/komponenter/HendelseIkon';
import { HistorikkSection } from '@saksbilde/historikk/komponenter/HistorikkSection';
import { Historikkhendelse } from '@saksbilde/historikk/komponenter/Historikkhendelse';
import { DagoverstyringhendelseObject } from '@typer/historikk';
import { DateString } from '@typer/shared';
import { getFormattedDateString } from '@utils/date';

import styles from './Dagoverstyringhendelse.module.css';

type Endring = Pick<OverstyrtDag, 'grad' | 'type' | 'fraGrad' | 'fraType'>;

type GroupedDays = {
    start: DateString;
    end: DateString;
} & Endring;

const areSimilar = (a: Endring, b: Endring): boolean => {
    return a.grad === b.grad && a.type === b.type && a.fraType === b.fraType && a.fraGrad === b.fraGrad;
};

const byDate = (a: OverstyrtDag, b: OverstyrtDag): number => {
    return new Date(a.dato).getTime() - new Date(b.dato).getTime();
};

const groupSimilarDays = (days: OverstyrtDag[]): GroupedDays[] => {
    return [...days].sort(byDate).reduce((groups: GroupedDays[], day: OverstyrtDag) => {
        const group = groups[groups.length - 1];
        if (!group || !areSimilar(group, day)) {
            return [
                ...groups,
                {
                    start: day.dato,
                    end: day.dato,
                    grad: day.grad,
                    type: day.type,
                    fraGrad: day.fraGrad,
                    fraType: day.fraType,
                },
            ];
        }
        group.end = day.dato;
        return groups;
    }, []);
};

type DagoverstyringhendelseProps = Omit<DagoverstyringhendelseObject, 'type' | 'id'>;

export const Dagoverstyringhendelse = ({
    erRevurdering,
    saksbehandler,
    timestamp,
    begrunnelse,
    dager,
}: DagoverstyringhendelseProps): ReactElement => (
    <Historikkhendelse
        icon={<HistorikkKildeSaksbehandlerIkon />}
        title={erRevurdering ? 'Dager revurdert' : 'Dager endret'}
        timestamp={timestamp}
        saksbehandler={saksbehandler}
        aktiv={false}
    >
        <HistorikkSection tittel="Notat til beslutter">
            <BodyShortWithPreWrap>{begrunnelse}</BodyShortWithPreWrap>
        </HistorikkSection>
        <VStack marginBlock="space-8 space-8">
            {groupSimilarDays(dager).map((group, i) => (
                <div key={i} className={styles.grid}>
                    <BodyShort>Dato:</BodyShort>
                    <BodyShort>
                        {getFormattedDateString(group.start)}
                        {group.start !== group.end && ` - ${getFormattedDateString(group.end)}`}
                    </BodyShort>
                    <BodyShort>Grad:</BodyShort>
                    <BodyShort>
                        {group.fraGrad !== null && group.fraGrad !== undefined && group.grad !== group.fraGrad && (
                            <span className={styles.fromvalue}>{group.fraGrad} %</span>
                        )}
                        {group.grad} {group.grad !== null && group.grad !== undefined && '%'}
                    </BodyShort>
                    <BodyShort>Type:</BodyShort>
                    <BodyShort>
                        {group.fraType && group.fraType !== group.type && (
                            <span className={styles.fromvalue}>{group.fraType}</span>
                        )}
                        {group.type}
                    </BodyShort>
                </div>
            ))}
        </VStack>
    </Historikkhendelse>
);
