import moment from 'moment';

/* Konverterer datoer i periodedata til momentjs-objekter
 */
export const toMoments = periods => {
    return periods.map(data => ({
        ...data,
        periods: data.periods.map(period => ({
            startDate: moment(period.startDate),
            endDate: moment(period.endDate)
        }))
    }));
};

/* Henter ut alle datoobjekter fra periodedata og returnerer de i en array
 */
export const extractDates = periods => {
    return periods.reduce((acc, data) => acc.concat(data.periods), []);
};

export const earliestDate = periods => {
    return periods.reduce((acc, period) => {
        return period.startDate < acc ? period.startDate : acc;
    }, moment());
};

export const latestDate = periods => {
    return periods.reduce((acc, period) => {
        return period.endDate > acc ? period.endDate : acc;
    }, moment('1900-01-01'));
};

/* Returnerer antall dager mellom to datoer
 */
export const daysBetween = (earliestDate, latestDate) => {
    return Math.abs(earliestDate.diff(latestDate, 'days'));
};

/* Returnerer en array med alle år hentet fra periodedata, med unntak av det første året.
 * Gitt datoene '2019-05-01', '2017-04-12' og '2013-12-12' returnerer denne
 * [2014, 2015, 2016, 2017, 2018, 2019]
 */
export const yearsBetween = periods => {
    const earliest = earliestDate(periods).year();
    const latest = latestDate(periods).year();

    return new Array(latest - earliest)
        .fill(earliest)
        .map((year, i) => year + i + 1);
};

/* Finds the horizontal position and width of a period based on the earliest and latest
 * dates as well as the total width of the containing element.
 */
export const calculatePlacement = (
    period,
    startDate,
    endDate,
    width = 1000
) => {
    const totalDays = daysBetween(startDate, endDate);
    const ratio = width / totalDays;

    return {
        x: daysBetween(period.startDate, startDate) * ratio,
        width: daysBetween(period.startDate, period.endDate) * ratio
    };
};

/* Finds the horizontal position and width of a year pin/label based on the earliest and latest
 * dates as well as the total width of the containing element.
 */
export const calculateYearPinPlacement = (
    year,
    startDate,
    endDate,
    width = 1000
) => {
    const totalDays = daysBetween(startDate, endDate);
    const ratio = width / totalDays;

    return daysBetween(year, startDate) * ratio;
};
