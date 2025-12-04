import { Dayjs } from 'dayjs';
import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { capitalize } from '@utils/locale';

import { getPosition } from './hooks/usePeriodStyling';

import styles from './Labels.module.css';

type Label = {
    style: {
        width: number;
        right: number;
    };
    text: string;
    date: Dayjs;
};

const getDayLabels = (start: Dayjs, end: Dayjs, numberOfDays: number): Label[] => {
    const increment = Math.ceil(numberOfDays / 10);
    const lastDay = end.startOf('day');
    return new Array(numberOfDays)
        .fill(lastDay)
        .map((it, i) => {
            if (i % increment !== 0) {
                return null;
            }
            const day = it.subtract(i, 'day');
            const right = getPosition(day, start, end);
            const width = getPosition(day.add(1, 'day'), start, end) - right;
            return {
                style: { right, width },
                text: day.format('DD.MM'),
                date: day,
            };
        })
        .filter((it): it is Label => it !== null);
};

const getMonthLabels = (start: Dayjs, end: Dayjs): Label[] => {
    const startMonth = start.startOf('month');
    const endMonth = end.endOf('month');
    const numberOfMonths = endMonth.diff(startMonth, 'month') + 1;
    return new Array(numberOfMonths).fill(startMonth).map((it, i) => {
        const month = it.add(i, 'month');
        const right = getPosition(month, start, end);
        const width = getPosition(month.add(1, 'month'), start, end) - right;
        return {
            style: { right, width },
            text: `${capitalize(month.format('MMM')).slice(0, 3)} ${month.format('YY')}`,
            date: month,
        };
    });
};

const getYearLabels = (start: Dayjs, end: Dayjs): Label[] => {
    const startYear = start.startOf('year');
    const endYear = end.endOf('year');
    const numberOfYears = endYear.diff(start, 'year') + 1;
    return new Array(numberOfYears).fill(startYear).map((it, i) => {
        const year = it.add(i, 'year');
        const right = getPosition(year, start, end);
        const width = getPosition(year.add(1, 'year'), start, end) - right;
        return {
            style: { right, width },
            text: year.format('YYYY'),
            date: year,
        };
    });
};

function useLabels(start: Dayjs, end: Dayjs): Label[] {
    const numberOfDays = end.diff(start, 'day');
    let labels: Label[];

    if (numberOfDays < 40) {
        labels = getDayLabels(start, end, numberOfDays);
    } else if (numberOfDays < 370) {
        labels = getMonthLabels(start, end);
    } else {
        labels = getYearLabels(start, end);
    }

    return labels.filter((it) => it.style.right <= 100 && it.style.right > 0);
}

interface LabelsProps {
    start: Dayjs;
    end: Dayjs;
}

export const Labels = ({ start, end }: LabelsProps): ReactElement => {
    const labels = useLabels(start, end);

    return (
        <div className={styles.Labels}>
            {labels.map((it, i) => (
                <BodyShort
                    key={i}
                    size="small"
                    className={styles.Label}
                    style={{
                        right: `${it.style.right}%`,
                        width: `${it.style.width}%`,
                    }}
                >
                    {it.text}
                </BodyShort>
            ))}
        </div>
    );
};

export const LabelsSkeleton = (): ReactElement => {
    return <div className={styles.Labels}></div>;
};
