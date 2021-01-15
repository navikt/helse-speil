import { pollEtterNyOppgave } from './polling';

declare global {
    namespace NodeJS {
        // noinspection JSUnusedGlobalSymbols
        interface Global {
            fetch: jest.MockedFunction<any>;
        }
    }
}

afterEach(() => {
    global.fetch = undefined;
});

const mockNotFound = () => {
    global.fetch = jest.fn().mockImplementation(() => {
        return Promise.resolve({
            status: 404,
        });
    });
};

const mockSuccess = (response: object) => {
    global.fetch = jest.fn().mockImplementation(() => {
        return Promise.resolve({
            status: 200,
            json: () => Promise.resolve(response),
        });
    });
};

describe('pollEtterNyOppgave', () => {
    test('resolver om ny oppgavereferanse er annerledes fra den gamle', async () => {
        const response = { oppgavereferanse: 'ny-oppgavereferanse' };
        mockSuccess(response);
        let bleRejected = false;
        await pollEtterNyOppgave('12345678910', 'gammel-oppgavereferanse', 0).catch((_) => (bleRejected = true));
        expect(bleRejected).toBeFalsy();
        expect(global.fetch).toHaveBeenCalledTimes(1);
    });
    test('rejecter om den ikke mottar svar etter 10 fetch requests', async () => {
        mockNotFound();
        let bleRejected = false;
        await pollEtterNyOppgave('12345678910', 'oppgavereferanse', 0).catch((_) => (bleRejected = true));
        expect(bleRejected).toBeTruthy();
        expect(global.fetch).toHaveBeenCalledTimes(10);
    });
    test('rejecter om ny oppgavereferanse er samme som den gamle', async () => {
        const response = { oppgavereferanse: 'ny-oppgavereferanse' };
        mockSuccess(response);
        let bleRejected = false;
        await pollEtterNyOppgave('12345678910', response.oppgavereferanse, 0).catch((_) => (bleRejected = true));
        expect(bleRejected).toBeTruthy();
        expect(global.fetch).toHaveBeenCalledTimes(10);
    });
});
