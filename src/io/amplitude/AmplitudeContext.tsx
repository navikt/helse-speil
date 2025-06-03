import { createContext } from 'react';

interface AmplitudeContextValue {
    logOppgaveGodkjent: (erBeslutteroppgave: boolean) => void;
    logOppgaveForkastet: (årsaker: string[]) => void;
    logTotrinnsoppgaveReturnert: () => void;
    logTotrinnsoppgaveTilGodkjenning: () => void;
    logAnnullert: (årsaker: string[]) => void;
}

export const AmplitudeContext = createContext<AmplitudeContextValue>({
    logOppgaveGodkjent(): void {
        //do nothing
    },
    logOppgaveForkastet(): void {
        // do nothing
    },
    logTotrinnsoppgaveReturnert(): void {
        // do nothing
    },
    logTotrinnsoppgaveTilGodkjenning(): void {
        // do nothing
    },
    logAnnullert(): void {
        // do nothing
    },
});
