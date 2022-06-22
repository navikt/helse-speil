import { createContext } from 'react';

interface AmplitudeContextValue {
    logOppgaveGodkjent: (erBeslutteroppgave: boolean) => void;
    logOppgaveForkastet: (begrunnelser: string[]) => void;
    logTotrinnsoppgaveReturnert: () => void;
    logTotrinnsoppgaveTilGodkjenning: () => void;
}

export const AmplitudeContext = createContext<AmplitudeContextValue>({
    logOppgaveGodkjent(): void {},
    logOppgaveForkastet(): void {},
    logTotrinnsoppgaveReturnert(): void {},
    logTotrinnsoppgaveTilGodkjenning(): void {},
});
