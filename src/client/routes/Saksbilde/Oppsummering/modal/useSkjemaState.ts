import { useState } from 'react';

export enum Årsak {
    Feil = 'Feil vurdering og/eller beregning',
    InfotrygdRiktig = 'Allerede behandlet i infotrygd - riktig vurdering',
    InfotrygdFeil = 'Allerede behandlet i infotrygd - feil vurdering og/eller beregning',
    Ingen = 'INGEN',
}

export interface Begrunnelse {
    verdi: string;
    kreverKommentar: boolean;
}

export interface Avvisningskjema {
    årsak: SkjemaÅrsak;
    begrunnelser: SkjemaBegrunnelser;
    kommentar: SkjemaKommentar;
}

export interface Avvisningverdier {
    årsak: Årsak;
    begrunnelser: string[];
    kommentar?: string;
}

export interface SkjemaÅrsak {
    verdi: Årsak;
    harFeil: boolean;
    obligatorisk: boolean;
}

export interface SkjemaBegrunnelser {
    verdi: Begrunnelse[];
    harFeil: boolean;
    obligatorisk: boolean;
}

export interface SkjemaKommentar {
    verdi: string;
    harFeil: boolean;
    obligatorisk: boolean;
}

const defaulSkjemaState = (): Avvisningskjema => ({
    årsak: {
        verdi: Årsak.Ingen,
        harFeil: false,
        obligatorisk: true,
    },
    begrunnelser: {
        verdi: [],
        harFeil: false,
        obligatorisk: true,
    },
    kommentar: {
        verdi: '',
        harFeil: false,
        obligatorisk: false,
    },
});

interface UseSkjemaState {
    clear: () => void;
    verdier: Avvisningverdier;
    skjema: Avvisningskjema;
    årsak: SkjemaÅrsak;
    begrunnelse: SkjemaBegrunnelser;
    kommentar: SkjemaKommentar;
    leggTilBegrunnelse: (begrunnelse: Begrunnelse) => void;
    fjernBegrunnelse: (begrunnelse: Begrunnelse) => void;
    setValgtÅrsak: (radio: Årsak) => void;
    setKommentar: (kommentar: string) => void;
    årsakHarFeil: () => boolean;
    begrunnelseHarFeil: () => boolean;
    kommentarfeiltHarFeil: () => boolean;
    setFeil: () => void;
}

export const useSkjemaState = (): UseSkjemaState => {
    const [skjemaState, setSkjemaState] = useState<Avvisningskjema>(defaulSkjemaState());
    const setValgtRadio = (årsak: Årsak) => {
        setSkjemaState({
            årsak: {
                verdi: årsak,
                harFeil: false,
                obligatorisk: true,
            },
            begrunnelser: skjemaState.begrunnelser,
            kommentar: {
                ...skjemaState.kommentar,
                obligatorisk: kreverKommentar(),
            },
        });
    };

    const leggTilBegrunnelse = (_begrunnelse: Begrunnelse) => {
        const begrunnelser = [...skjemaState.begrunnelser.verdi, _begrunnelse];
        setSkjemaState({
            årsak: skjemaState.årsak,
            begrunnelser: {
                verdi: begrunnelser,
                harFeil: false,
                obligatorisk: true,
            },
            kommentar: {
                ...skjemaState.kommentar,
                obligatorisk: kreverKommentar(begrunnelser),
            },
        });
    };
    const fjernBegrunnelse = (_begrunnelse: Begrunnelse) => {
        const begrunnelser = skjemaState.begrunnelser.verdi.filter((_verdi) => _verdi.verdi !== _begrunnelse.verdi);
        setSkjemaState({
            årsak: skjemaState.årsak,
            begrunnelser: {
                verdi: begrunnelser,
                harFeil: false,
                obligatorisk: true,
            },
            kommentar: {
                ...skjemaState.kommentar,
                obligatorisk: kreverKommentar(begrunnelser),
            },
        });
    };

    const setKommentar = (_kommentar: string) => {
        setSkjemaState({
            årsak: skjemaState.årsak,
            begrunnelser: skjemaState.begrunnelser,
            kommentar: {
                verdi: _kommentar,
                harFeil: false,
                obligatorisk: kreverKommentar(),
            },
        });
    };

    const årsakHarFeil = () => skjemaState.årsak.verdi === Årsak.Ingen;
    const begrunnelseHarFeil = () =>
        skjemaState.årsak.verdi !== Årsak.InfotrygdRiktig && skjemaState.begrunnelser.verdi.length < 1;
    const kommentarfeiltHarFeil = () => kreverKommentar() && skjemaState.kommentar.verdi.trim().length < 1;

    const setFeil = () => {
        setSkjemaState({
            årsak: {
                ...skjemaState.årsak,
                harFeil: årsakHarFeil(),
            },
            begrunnelser: {
                ...skjemaState.begrunnelser,
                harFeil: begrunnelseHarFeil(),
            },
            kommentar: {
                ...skjemaState.kommentar,
                harFeil: kommentarfeiltHarFeil(),
            },
        });
    };

    const kreverKommentar = (begrunnelser?: Begrunnelse[]) =>
        (begrunnelser ?? skjemaState.begrunnelser.verdi).some((value) => value.kreverKommentar);

    const clear = () => {
        setSkjemaState(defaulSkjemaState());
    };
    return {
        clear: clear,
        verdier: {
            årsak: skjemaState.årsak.verdi,
            begrunnelser: skjemaState.begrunnelser.verdi.map((v) => v.verdi),
            kommentar: skjemaState.kommentar.verdi.trim().length >= 1 ? skjemaState.kommentar.verdi : undefined,
        },
        skjema: skjemaState,
        årsak: skjemaState.årsak,
        begrunnelse: skjemaState.begrunnelser,
        kommentar: skjemaState.kommentar,
        leggTilBegrunnelse: leggTilBegrunnelse,
        fjernBegrunnelse: fjernBegrunnelse,
        setValgtÅrsak: setValgtRadio,
        setKommentar: setKommentar,
        årsakHarFeil: årsakHarFeil,
        begrunnelseHarFeil: begrunnelseHarFeil,
        kommentarfeiltHarFeil: kommentarfeiltHarFeil,
        setFeil: setFeil,
    };
};
