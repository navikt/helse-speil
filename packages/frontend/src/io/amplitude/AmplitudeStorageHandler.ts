import dayjs, { Dayjs } from 'dayjs';

export class AmplitudeStorageHandler {
    private static getKey = (oppgaveId: string): string => `oppgave.${oppgaveId}.åpnet`;

    static setÅpnetOppgavetidspunkt = (oppgaveId: string): void => {
        window.sessionStorage.setItem(AmplitudeStorageHandler.getKey(oppgaveId), dayjs().toISOString());
    };

    static getÅpnetOppgaveTidspunkt = (oppgaveId: string): Dayjs | undefined => {
        const åpnet = window.sessionStorage.getItem(AmplitudeStorageHandler.getKey(oppgaveId));
        return åpnet ? dayjs(åpnet) : undefined;
    };

    static removeÅpnetOppgaveTidspunkt = (oppgaveId: string): void => {
        window.sessionStorage.removeItem(AmplitudeStorageHandler.getKey(oppgaveId));
    };
}
