import { randomUUID } from 'crypto';
import dayjs from 'dayjs';

import { antallTilfeldigeBehandledeOppgaver, antallTilfeldigeOppgaver } from '../constants';
import {
    AntallArbeidsforhold,
    BehandletOppgave,
    Egenskap,
    OppgaveProjeksjon,
    Oppgavetype,
    Periodetype,
} from '../schemaTypes';

const genererTilfeldigeOppgaver = (antall: number): OppgaveProjeksjon[] => {
    const oppgaver: OppgaveProjeksjon[] = [];
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
    oppgaver.sort((a, b) => dayjs(a.ferdigstiltTidspunkt).diff(dayjs(b.ferdigstiltTidspunkt)));
    return oppgaver;
};

const tilfeldigOppgave = (oppgaveId: number): OppgaveProjeksjon => {
    const tildelingMellomnavn = tilfeldigMellomnavn();

    const dato = tilfeldigDato();
    const opprettetDato = dato.toISOString();
    dato.setDate(dato.getDate() - Math.floor(1 + Math.random() * 31));
    const søknadsDato = dato.toISOString();

    return {
        aktorId: Math.floor(1000000000000 + Math.random() * 9000000000000).toString(),
        egenskaper: [
            Math.random() > 0.2 ? Egenskap.Soknad : Egenskap.Revurdering,
            tilfeldigElementFra([
                Egenskap.Forlengelse,
                Egenskap.Forstegangsbehandling,
                Egenskap.Infotrygdforlengelse,
                Egenskap.OvergangFraIt,
            ]),
            tilfeldigElementFra([
                Egenskap.UtbetalingTilArbeidsgiver,
                Egenskap.DelvisRefusjon,
                Egenskap.IngenUtbetaling,
                Egenskap.UtbetalingTilSykmeldt,
            ]),
            tilfeldigElementFra([Egenskap.EnArbeidsgiver, Egenskap.FlereArbeidsgivere]),
            ...tilfeldigeUkategoriserteEgenskaper(),
        ],
        id: oppgaveId.toString(),
        navn: {
            fornavn: tilfeldigFornavn(),
            mellomnavn: tilfeldigMellomnavn(),
            etternavn: tilfeldigEtternavn(),
        },
        opprettetTidspunkt: opprettetDato,
        opprinneligSoeknadstidspunkt: søknadsDato,
        tildeling: {
            epost: 'tildeling@epost.no',
            navn:
                tilfeldigEtternavn() +
                ', ' +
                tilfeldigFornavn() +
                (tildelingMellomnavn ? ' ' + tildelingMellomnavn : ''),
            oid: randomUUID().toString(),
        },
    } as OppgaveProjeksjon;
};

const tilfeldigBehandletOppgave = (oppgaveId: number): BehandletOppgave =>
    ({
        id: oppgaveId.toString(),
        aktorId: Math.floor(1000000000000 + Math.random() * 9000000000000).toString(),
        oppgavetype: Math.random() > 0.2 ? Oppgavetype.Soknad : Oppgavetype.Revurdering,
        periodetype: tilfeldigElementFra(Object.values(Periodetype)),
        antallArbeidsforhold: tilfeldigElementFra(Object.values(AntallArbeidsforhold)),
        ferdigstiltAv: Math.random() > 0.2 ? 'Utvikler, Lokal' : 'Saksbehandler, Annen',
        ferdigstiltTidspunkt: dayjs()
            .subtract(Math.random() * 3, 'day')
            .set('hour', 6 + Math.random() * 9)
            .set('minute', Math.random() * 59)
            .toISOString(),
        personnavn: {
            fornavn: tilfeldigFornavn(),
            mellomnavn: tilfeldigMellomnavn(),
            etternavn: tilfeldigEtternavn(),
        },
    }) as BehandletOppgave;

const tilfeldigeUkategoriserteEgenskaper = (): Egenskap[] => {
    const egenskaper: Egenskap[] = [];

    if (Math.random() > 0.9) egenskaper.push(Math.random() > 0.2 ? Egenskap.Beslutter : Egenskap.Retur);
    if (Math.random() > 0.85) egenskaper.push(Math.random() > 0.1 ? Egenskap.RiskQa : Egenskap.Stikkprove);
    if (Math.random() > 0.95) egenskaper.push(Egenskap.Vergemal);
    if (Math.random() > 0.95) egenskaper.push(Egenskap.EgenAnsatt);
    if (Math.random() > 0.95) egenskaper.push(Egenskap.FortroligAdresse);
    if (Math.random() > 0.8) egenskaper.push(Egenskap.Haster);
    if (Math.random() > 0.9) egenskaper.push(Egenskap.Utland);
    if (Math.random() > 0.95) egenskaper.push(Egenskap.Skjonnsfastsettelse);

    return egenskaper;
};

const tilfeldigDato = () => {
    const start = new Date(2022, 0, 1);
    return new Date(start.getTime() + Math.random() * (new Date().getTime() - start.getTime()));
};

const tilfeldigElementFra = <T>(elementer: Array<T>): T => {
    return elementer[Math.floor(Math.random() * elementer.length)]!;
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

export const tilfeldigeOppgaver = genererTilfeldigeOppgaver(antallTilfeldigeOppgaver);
export const tilfeldigeBehandledeOppgaver = genererTilfeldigeBehandledeOppgaver(antallTilfeldigeBehandledeOppgaver);
