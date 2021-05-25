import { Instrumentation } from '../instrumentation';
import logger from '../logging';
import { PersonClient } from '../person/personClient';

export const devPersonClient = (_: Instrumentation): PersonClient => ({
    oppdaterPersoninfo: async (oppdatering, _): Promise<any> => {
        logger.info(`Mottok oppdatering ${JSON.stringify(oppdatering)}`);
        return Math.random() < 0.2 ? Promise.reject('Dev feil!') : Promise.resolve();
    },
});
