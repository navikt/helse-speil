import { createContext } from 'react';

interface AmplitudeContextValue {
    logOppgaveGodkjent: (erBeslutteroppgave: boolean) => void;
    logOppgaveForkastet: (begrunnelser: string[]) => void;
    logTotrinnsoppgaveReturnert: () => void;
    logTotrinnsoppgaveTilGodkjenning: () => void;
    logAnnullert: (begrunnelser: string[]) => void;
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
