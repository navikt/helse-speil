const lookup = require('./personlookup');

describe('calling mocked spade', () => {
    test('behandlinger for person', async () => {
        lookup.behandlingerForPerson('xxx', 'yyy').then(response => {
            expect(JSON.stringify(response.body)).toMatch('bbbb-cccc-dddd-eeee-ffff');
        });
    });

    test('behandlinger summary for time period', async () => {
        lookup.behandlingerForPeriod(111, 222, 'aaa').then(response => {
            expect(JSON.stringify(response.body.behandlinger)).toMatch(
                '81846f2c-968a-4d88-ac76-c6cec5142bff'
            );
        });
    });
});
