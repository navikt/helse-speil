import { randomUUID } from 'crypto';

import { antallTilfeldigeBehandledeOppgaver, antallTilfeldigeOppgaver } from '../../devHelpers';
import {
    AntallArbeidsforhold,
    BehandletOppgave,
    Egenskap,
    Kategori,
    Mottaker,
    OppgaveTilBehandling,
    Oppgaveegenskap,
    Oppgavetype,
    Periodetype,
} from '../schemaTypes';

const genererTilfeldigeOppgaver = (antall: number) => {
    const oppgaver: OppgaveTilBehandling[] = [];
    let n = 0;
    let startId = 6000;
    while (n < antall) {
        oppgaver.push(tilfeldigOppgave(startId++));
        n++;
    }
    return oppgaver;
};

const genererTilfeldigeBehandledeOppgaver = (antall: number) => {
    const oppgaver: BehandletOppgave[] = [];
    let n = 0;
    let startId = 8000;
    while (n < antall) {
        oppgaver.push(tilfeldigBehandletOppgave(startId++));
        n++;
    }
    return oppgaver;
};

const tilfeldigOppgave = (oppgaveId: number): OppgaveTilBehandling => {
    const tildelingMellomnavn = tilfeldigMellomnavn();

    const dato = tilfeldigDato();
    const opprettetDato = dato.toISOString();
    dato.setDate(dato.getDate() - Math.floor(1 + Math.random() * 31));
    const søknadsDato = dato.toISOString();

    const oppgavetype = Math.random() > 0.2 ? Oppgavetype.Soknad : Oppgavetype.Revurdering;
    const periodetype = tilfeldigElementFraEnum(Periodetype);
    const antallArbeidsforhold = tilfeldigElementFraEnum(AntallArbeidsforhold);
    const mottaker = tilfeldigElementFraEnum(Mottaker);

    return {
        id: oppgaveId.toString(),
        vedtaksperiodeId: randomUUID().toString(),
        aktorId: Math.floor(1000000000000 + Math.random() * 9000000000000).toString(),
        opprettet: opprettetDato,
        opprinneligSoknadsdato: søknadsDato,
        navn: {
            fornavn: tilfeldigFornavn(),
            mellomnavn: tilfeldigMellomnavn(),
            etternavn: tilfeldigEtternavn(),
        },
        oppgavetype: oppgavetype,
        periodetype: periodetype,
        antallArbeidsforhold: antallArbeidsforhold,
        mottaker: mottaker,
        tildeling: {
            epost: 'tildeling@epost.no',
            navn:
                tilfeldigEtternavn() +
                ', ' +
                tilfeldigFornavn() +
                (tildelingMellomnavn ? ' ' + tildelingMellomnavn : ''),
            oid: randomUUID().toString(),
        },
        egenskaper: [
            egenskapFraOppgavetype(oppgavetype),
            egenskapFraPeriodetype(periodetype),
            egenskapFraMottaker(mottaker),
            egenskapFraAntallArbeidsforhold(antallArbeidsforhold),
            ...tilfeldigeUkategoriserteEgenskaper(),
        ],
    } as OppgaveTilBehandling;
};

const tilfeldigBehandletOppgave = (oppgaveId: number): BehandletOppgave =>
    ({
        id: oppgaveId.toString(),
        aktorId: Math.floor(1000000000000 + Math.random() * 9000000000000).toString(),
        oppgavetype: Math.random() > 0.2 ? Oppgavetype.Soknad : Oppgavetype.Revurdering,
        periodetype: tilfeldigElementFraEnum(Periodetype),
        antallArbeidsforhold: tilfeldigElementFraEnum(AntallArbeidsforhold),
        ferdigstiltAv: Math.random() > 0.2 ? 'Utvikler, Lokal' : 'Saksbehandler, Annen',
        ferdigstiltTidspunkt: new Date(Date.now() - Math.random() * 10000000).toISOString(),
        personnavn: {
            fornavn: tilfeldigFornavn(),
            mellomnavn: tilfeldigMellomnavn(),
            etternavn: tilfeldigEtternavn(),
        },
    }) as BehandletOppgave;

const tilfeldigeUkategoriserteEgenskaper = () => {
    let egenskaper: Oppgaveegenskap[] = [];

    if (Math.random() > 0.9)
        egenskaper.push(
            Math.random() > 0.2
                ? { kategori: Kategori.Ukategorisert, egenskap: Egenskap.Beslutter }
                : { kategori: Kategori.Ukategorisert, egenskap: Egenskap.Retur },
        );
    if (Math.random() > 0.85)
        egenskaper.push(
            Math.random() > 0.1
                ? { kategori: Kategori.Ukategorisert, egenskap: Egenskap.RiskQa }
                : { kategori: Kategori.Ukategorisert, egenskap: Egenskap.Stikkprove },
        );
    if (Math.random() > 0.95) egenskaper.push({ kategori: Kategori.Ukategorisert, egenskap: Egenskap.Vergemal });
    if (Math.random() > 0.95) egenskaper.push({ kategori: Kategori.Ukategorisert, egenskap: Egenskap.EgenAnsatt });
    if (Math.random() > 0.95)
        egenskaper.push({ kategori: Kategori.Ukategorisert, egenskap: Egenskap.FortroligAdresse });
    if (Math.random() > 0.8) egenskaper.push({ kategori: Kategori.Ukategorisert, egenskap: Egenskap.Haster });
    if (Math.random() > 0.9) egenskaper.push({ kategori: Kategori.Ukategorisert, egenskap: Egenskap.Utland });
    if (Math.random() > 0.97) egenskaper.push({ kategori: Kategori.Ukategorisert, egenskap: Egenskap.Spesialsak });
    if (Math.random() > 0.95)
        egenskaper.push({ kategori: Kategori.Ukategorisert, egenskap: Egenskap.Skjonnsfastsettelse });

    return egenskaper;
};

const tilfeldigDato = () => {
    const start = new Date(2022, 0, 1);
    return new Date(start.getTime() + Math.random() * (new Date().getTime() - start.getTime()));
};

const tilfeldigElementFraEnum = <T extends { [key: number]: string | number }>(e: T): T[keyof T] => {
    const keys = Object.keys(e);

    const randomKeyIndex = Math.floor(Math.random() * keys.length);
    const randomKey = keys[randomKeyIndex];

    const randomKeyNumber = Number(randomKey);
    return isNaN(randomKeyNumber) ? e[randomKey as keyof T] : (randomKeyNumber as unknown as T[keyof T]);
};

const tilfeldigFornavn = () => {
    const fornavnListe = ['Røff', 'Kul', 'Snill', 'Lat', 'Perfekt', 'Enorm', 'Ekkel'];
    return tilfeldigNavn(fornavnListe);
};

const tilfeldigMellomnavn = () => {
    const mellomnavnListe = ['Rar', 'Teit', 'Spesiell', 'Fantastisk', 'Tullete', 'Fabelaktig', null, null, null];
    return tilfeldigNavn(mellomnavnListe);
};

const tilfeldigEtternavn = () => {
    const etternavnListe = ['Paraply', 'Frosk', 'Øgle', 'Flaske', 'Dør', 'Pensjonist', 'Sykkel'];
    return tilfeldigNavn(etternavnListe);
};

const tilfeldigNavn = (navneliste: (string | null)[]) => {
    return navneliste[Math.floor(Math.random() * navneliste.length)];
};

const egenskapFraOppgavetype = (oppgavetype: Oppgavetype): Oppgaveegenskap => {
    switch (oppgavetype) {
        case Oppgavetype.Revurdering:
            return { kategori: Kategori.Oppgavetype, egenskap: Egenskap.Revurdering };
        case Oppgavetype.Soknad:
        default:
            return { kategori: Kategori.Oppgavetype, egenskap: Egenskap.Soknad };
    }
};

const egenskapFraPeriodetype = (periodetype: Periodetype): Oppgaveegenskap => {
    switch (periodetype) {
        case Periodetype.Forlengelse:
            return { kategori: Kategori.Periodetype, egenskap: Egenskap.Forlengelse };
        case Periodetype.Forstegangsbehandling:
            return { kategori: Kategori.Periodetype, egenskap: Egenskap.Forstegangsbehandling };
        case Periodetype.Infotrygdforlengelse:
            return { kategori: Kategori.Periodetype, egenskap: Egenskap.Infotrygdforlengelse };
        case Periodetype.OvergangFraIt:
            return { kategori: Kategori.Periodetype, egenskap: Egenskap.OvergangFraIt };
    }
};

const egenskapFraMottaker = (mottaker: Mottaker): Oppgaveegenskap => {
    switch (mottaker) {
        case Mottaker.Arbeidsgiver:
            return { kategori: Kategori.Mottaker, egenskap: Egenskap.UtbetalingTilArbeidsgiver };
        case Mottaker.Begge:
            return { kategori: Kategori.Mottaker, egenskap: Egenskap.DelvisRefusjon };
        case Mottaker.Ingen:
            return { kategori: Kategori.Mottaker, egenskap: Egenskap.IngenUtbetaling };
        case Mottaker.Sykmeldt:
            return { kategori: Kategori.Mottaker, egenskap: Egenskap.UtbetalingTilSykmeldt };
    }
};

const egenskapFraAntallArbeidsforhold = (antallArbeidsforhold: AntallArbeidsforhold): Oppgaveegenskap => {
    switch (antallArbeidsforhold) {
        case AntallArbeidsforhold.EtArbeidsforhold:
            return { kategori: Kategori.Inntektskilde, egenskap: Egenskap.EnArbeidsgiver };
        case AntallArbeidsforhold.FlereArbeidsforhold:
            return { kategori: Kategori.Inntektskilde, egenskap: Egenskap.FlereArbeidsgivere };
    }
};

export const tilfeldigeOppgaver = genererTilfeldigeOppgaver(antallTilfeldigeOppgaver);
export const tilfeldigeBehandledeOppgaver = genererTilfeldigeBehandledeOppgaver(antallTilfeldigeBehandledeOppgaver);
