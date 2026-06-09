import { createContext, useContext } from 'react';

interface JusterbarSidemenyContextValue {
    /** True mens brukeren drar i justeringshåndtaket for å endre bredden. */
    isDragging: boolean;
}

export const JusterbarSidemenyContext = createContext<JusterbarSidemenyContextValue>({ isDragging: false });

/**
 * Leser om sidemenyen akkurat nå justeres i bredden. Må brukes av en komponent
 * som rendres som `children` av {@link JusterbarSidemeny}.
 *
 * Nyttig for f.eks. å sette `pointer-events: none` på en `<iframe>` under draging,
 * slik at musen ikke «fanges» av iframen og resizingen stopper opp.
 */
export const useErJusterbarSidemenyDragging = (): boolean => useContext(JusterbarSidemenyContext).isDragging;
