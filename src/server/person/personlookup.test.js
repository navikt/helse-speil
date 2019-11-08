const lookup = require('./personlookup');
const spadeClient = require('../adapters/spadeClient');

describe('calling mocked spade', () => {
    beforeAll(() => {
        lookup.setup({ spadeClient });
    });

    test('behandlinger for person', async () => {
        await lookup._personSøk('xxx', 'yyy').then(response => {
            expect(JSON.stringify(response.body)).toMatch('bbbb-cccc-dddd-eeee-ffff');
        });
    });

    test('behandlinger summary for time period', async () => {
        await lookup._behovForPeriode(111, 222, 'aaa').then(response => {
            expect(JSON.stringify(response.body.behandlinger)).toMatch(
                '81846f2c-968a-4d88-ac76-c6cec5142bff'
            );
        });
    });
});
