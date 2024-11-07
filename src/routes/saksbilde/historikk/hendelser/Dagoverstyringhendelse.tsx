import React, { ReactElement } from 'react';

import { PersonPencilFillIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

import { Kilde } from '@components/Kilde';
import { Inntektskilde, OverstyrtDag } from '@io/graphql';
import { DagoverstyringhendelseObject } from '@typer/historikk';
import { DateString } from '@typer/shared';
import { getFormattedDateString } from '@utils/date';

import { ExpandableHistorikkContent } from './ExpandableHistorikkContent';
import { Hendelse } from './Hendelse';
import { HendelseDate } from './HendelseDate';

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

const groupSimilarDays = (days: Array<OverstyrtDag>): Array<GroupedDays> => {
    return [...days].sort(byDate).reduce((groups: Array<GroupedDays>, day: OverstyrtDag) => {
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
    <Hendelse
        title={erRevurdering ? 'Dager revurdert' : 'Dager endret'}
        icon={
            <Kilde type={Inntektskilde.Saksbehandler}>
                <PersonPencilFillIcon title="Saksbehandler ikon" height={20} width={20} />
            </Kilde>
        }
    >
        <ExpandableHistorikkContent>
            <BodyShort weight="semibold">Begrunnelse</BodyShort>
            <BodyShort>{begrunnelse}</BodyShort>
            <div className={styles.Content}>
                {groupSimilarDays(dager).map((group, i) => (
                    <div key={i} className={styles.Grid}>
                        <BodyShort>Dato:</BodyShort>
                        <BodyShort>
                            {getFormattedDateString(group.start)}
                            {group.start !== group.end && ` - ${getFormattedDateString(group.end)}`}
                        </BodyShort>
                        <BodyShort>Grad:</BodyShort>
                        <BodyShort>
                            {group.fraGrad !== null && group.fraGrad !== undefined && group.grad !== group.fraGrad && (
                                <span className={styles.FromValue}>{group.fraGrad} %</span>
                            )}
                            {group.grad} %
                        </BodyShort>
                        <BodyShort>Type:</BodyShort>
                        <BodyShort>
                            {group.fraType && group.fraType !== group.type && (
                                <span className={styles.FromValue}>{group.fraType}</span>
                            )}
                            {group.type}
                        </BodyShort>
                    </div>
                ))}
            </div>
        </ExpandableHistorikkContent>
        <HendelseDate timestamp={timestamp} ident={saksbehandler} />
    </Hendelse>
);
