import '@testing-library/jest-dom/extend-expect';
import {
    calculateYearPinPosition,
    incomeToHeight,
    lastTwelveMonths
} from './calc';
import moment from 'moment';

const Months = {
    JANUARY: 0,
    FEBRUARY: 1,
    MARCH: 2,
    APRIL: 3,
    MAY: 4,
    JUNE: 5,
    JULY: 6,
    AUGUST: 7,
    SEPTEMBER: 8,
    OCTOBER: 9,
    NOVEMBER: 10,
    DECEMBER: 11
};

const setMomentMonth = month => {
    moment.now = function() {
        const date = new Date();
        date.setDate(1);
        date.setMonth(month);
        return date;
    };
};

describe('Søylediagram calc', () => {
    describe('lastTwelveMonths', () => {
        describe('calculates the last twelve months correctly', () => {
            it('when the current month is January', () => {
                setMomentMonth(Months.JANUARY);
                expect(lastTwelveMonths()).toEqual([
                    'F',
                    'M',
                    'A',
                    'M',
                    'J',
                    'J',
                    'A',
                    'S',
                    'O',
                    'N',
                    'D',
                    'J'
                ]);
            });
            it('when the current month is February', () => {
                setMomentMonth(Months.FEBRUARY);
                expect(lastTwelveMonths()).toEqual([
                    'M',
                    'A',
                    'M',
                    'J',
                    'J',
                    'A',
                    'S',
                    'O',
                    'N',
                    'D',
                    'J',
                    'F'
                ]);
            });
            it('when the current month is March', () => {
                setMomentMonth(Months.MARCH);
                expect(lastTwelveMonths()).toEqual([
                    'A',
                    'M',
                    'J',
                    'J',
                    'A',
                    'S',
                    'O',
                    'N',
                    'D',
                    'J',
                    'F',
                    'M'
                ]);
            });
            it('when the current month is April', () => {
                setMomentMonth(Months.APRIL);
                expect(lastTwelveMonths()).toEqual([
                    'M',
                    'J',
                    'J',
                    'A',
                    'S',
                    'O',
                    'N',
                    'D',
                    'J',
                    'F',
                    'M',
                    'A'
                ]);
            });
            it('when the current month is May', () => {
                setMomentMonth(Months.MAY);
                expect(lastTwelveMonths()).toEqual([
                    'J',
                    'J',
                    'A',
                    'S',
                    'O',
                    'N',
                    'D',
                    'J',
                    'F',
                    'M',
                    'A',
                    'M'
                ]);
            });
            it('when the current month is June', () => {
                setMomentMonth(Months.JUNE);
                expect(lastTwelveMonths()).toEqual([
                    'J',
                    'A',
                    'S',
                    'O',
                    'N',
                    'D',
                    'J',
                    'F',
                    'M',
                    'A',
                    'M',
                    'J'
                ]);
            });
            it('when the current month is July', () => {
                setMomentMonth(Months.JULY);
                expect(lastTwelveMonths()).toEqual([
                    'A',
                    'S',
                    'O',
                    'N',
                    'D',
                    'J',
                    'F',
                    'M',
                    'A',
                    'M',
                    'J',
                    'J'
                ]);
            });
            it('when the current month is August', () => {
                setMomentMonth(Months.AUGUST);
                expect(lastTwelveMonths()).toEqual([
                    'S',
                    'O',
                    'N',
                    'D',
                    'J',
                    'F',
                    'M',
                    'A',
                    'M',
                    'J',
                    'J',
                    'A'
                ]);
            });
            it('when the current month is September', () => {
                setMomentMonth(Months.SEPTEMBER);
                expect(lastTwelveMonths()).toEqual([
                    'O',
                    'N',
                    'D',
                    'J',
                    'F',
                    'M',
                    'A',
                    'M',
                    'J',
                    'J',
                    'A',
                    'S'
                ]);
            });
            it('when the current month is October', () => {
                setMomentMonth(Months.OCTOBER);
                expect(lastTwelveMonths()).toEqual([
                    'N',
                    'D',
                    'J',
                    'F',
                    'M',
                    'A',
                    'M',
                    'J',
                    'J',
                    'A',
                    'S',
                    'O'
                ]);
            });
            it('when the current month is November', () => {
                setMomentMonth(Months.NOVEMBER);
                expect(lastTwelveMonths()).toEqual([
                    'D',
                    'J',
                    'F',
                    'M',
                    'A',
                    'M',
                    'J',
                    'J',
                    'A',
                    'S',
                    'O',
                    'N'
                ]);
            });
            it('when the current month is December', () => {
                setMomentMonth(Months.DECEMBER);
                expect(lastTwelveMonths()).toEqual([
                    'J',
                    'F',
                    'M',
                    'A',
                    'M',
                    'J',
                    'J',
                    'A',
                    'S',
                    'O',
                    'N',
                    'D'
                ]);
            });
        });
    });

    describe('calculateYearPinPosition', () => {
        describe('calculates the correct horizontal placement', () => {
            it('when the current month is January and the container width is 240px', () => {
                setMomentMonth(Months.JANUARY);
                expect(Math.floor(calculateYearPinPosition(240))).toEqual(220);
            });
            it('when the current month is December and the container width is 240px', () => {
                setMomentMonth(Months.DECEMBER);
                expect(Math.floor(calculateYearPinPosition(240))).toEqual(0);
            });
            it('when the current month is December and the container width is 0px', () => {
                setMomentMonth(Months.DECEMBER);
                expect(Math.floor(calculateYearPinPosition(0))).toEqual(0);
            });
            it('when the current month is July and the container width is 1200px', () => {
                setMomentMonth(Months.JULY);
                expect(Math.floor(calculateYearPinPosition(1200))).toEqual(500);
            });
            it('when the current month is September and the container width is 1000000px', () => {
                setMomentMonth(Months.JULY);
                expect(Math.floor(calculateYearPinPosition(1000000))).toEqual(
                    416666
                );
            });
        });
    });

    describe('incomeToHeight', () => {
        describe('calculates the correct bar height', () => {
            it('when income is 20000, max income is 20000 and height is 200px', () => {
                expect(Math.floor(incomeToHeight(20000, 20000, 200))).toEqual(
                    200
                );
            });
            it('when income is 10000, max income is 20000 and height is 200px', () => {
                expect(Math.floor(incomeToHeight(10000, 20000, 200))).toEqual(
                    100
                );
            });
            it('when income is 0, max income is 20000 and height is 200px', () => {
                expect(Math.floor(incomeToHeight(0, 20000, 200))).toEqual(0);
            });
            it('when income is 7, max income is 10 and height is 10px', () => {
                expect(Math.floor(incomeToHeight(7, 10, 10))).toEqual(7);
            });
            it('when income is 1337, max income is 12345 and height is 256px', () => {
                expect(Math.floor(incomeToHeight(1337, 12345, 265))).toEqual(
                    28
                );
            });
        });
    });
});
