import dayjs from 'dayjs';

import { utbetalingsoversikt } from '../featureToggles';
import { ArbeidsgiverBuilder } from './arbeidsgiver';
import { mapInfotrygdutbetaling } from './infotrygd';
import { somDato } from './vedtaksperiode';

export const mapPerson = (personFraSpesialist: ExternalPerson): { person: Person; problems: Error[] } => {
    const { person, problems } = new PersonBuilder().addPerson(personFraSpesialist).build();
    return { person: person as Person, problems };
};

export class PersonBuilder {
    private unmapped: ExternalPerson;
    private person: Partial<Person> = {};
    private problems: Error[] = [];

    addPerson(person: ExternalPerson): PersonBuilder {
        this.unmapped = person;
        return this;
    }

    build(): { person?: Person; problems: Error[] } {
        if (!this.unmapped) {
            this.problems.push(Error('Mangler persondata å mappe'));
            return { problems: this.problems };
        }
        this.mapEnkleProperties();
        this.mapTildeling();
        this.mapPersoninfo();
        this.mapUtbetalinger();
        this.mapArbeidsgivere();
        this.mapInfotrygdutbetalinger();
        return { person: this.person as Person, problems: this.problems };
    }

    private mapEnkleProperties = () => {
        this.person.enhet = this.unmapped.enhet;
        this.person.aktørId = this.unmapped.aktørId;
        this.person.fødselsnummer = this.unmapped.fødselsnummer;
        this.person.dødsdato = this.unmapped.dødsdato ? somDato(this.unmapped.dødsdato) : undefined;
    };

    private mapTildeling = () => {
        this.person.tildeling = this.unmapped.tildeling
            ? {
                  saksbehandler: {
                      oid: this.unmapped.tildeling.oid,
                      epost: this.unmapped.tildeling.epost,
                      navn: this.unmapped.tildeling.navn,
                  },
                  påVent: this.unmapped.tildeling.påVent,
              }
            : undefined;
    };

    private mapPersoninfo = () => {
        this.person.personinfo = {
            fornavn: this.unmapped.personinfo.fornavn,
            mellomnavn: this.unmapped.personinfo.mellomnavn,
            etternavn: this.unmapped.personinfo.etternavn,
            fødselsdato: this.unmapped.personinfo.fødselsdato ? somDato(this.unmapped.personinfo.fødselsdato) : null,
            kjønn: (this.unmapped.personinfo.kjønn ?? 'ukjent') as Personinfo['kjønn'],
            fnr: this.unmapped.fødselsnummer,
        };
    };

    private mapArbeidsgivere = () => {
        this.person.arbeidsgivere = this.unmapped.arbeidsgivere
            .map((unmappedArbeidsgiver) => {
                const { arbeidsgiver, problems } = new ArbeidsgiverBuilder()
                    .addPerson(this.unmapped)
                    .addArbeidsgiver(unmappedArbeidsgiver)
                    .addInntektsgrunnlag(this.unmapped.inntektsgrunnlag ?? [])
                    .build();
                this.problems.push(...problems);
                return arbeidsgiver;
            })
            .filter((arbeidsgiver) => arbeidsgiver) as Arbeidsgiver[];
    };

    private mapInfotrygdutbetalinger = () => {
        this.person.infotrygdutbetalinger =
            this.unmapped.infotrygdutbetalinger
                ?.filter((utbetaling) => utbetaling.typetekst !== 'Tilbakeført')
                .map(mapInfotrygdutbetaling) ?? [];
    };

    private mapUtbetalinger = () => {
        this.person.utbetalinger = utbetalingsoversikt
            ? this.unmapped.utbetalinger.map((utbetaling) => {
                  return {
                      type: utbetaling.type,
                      status: utbetaling.status,
                      arbeidsgiverOppdrag: {
                          orgnummer: utbetaling.arbeidsgiverOppdrag.organisasjonsnummer,
                          fagsystemId: utbetaling.arbeidsgiverOppdrag.fagsystemId,
                          utbetalingslinjer: utbetaling.arbeidsgiverOppdrag.utbetalingslinjer.map((linje) => {
                              return {
                                  fom: dayjs(linje.fom),
                                  tom: dayjs(linje.tom),
                              };
                          }),
                      },
                      annullering: utbetaling.annullertAvSaksbehandler
                          ? {
                                annullertTidspunkt: dayjs(utbetaling.annullertAvSaksbehandler.annullertTidspunkt),
                                saksbehandlerNavn: utbetaling.annullertAvSaksbehandler.saksbehandlerNavn,
                            }
                          : undefined,
                      totalbeløp: utbetaling.totalbeløp,
                  };
              })
            : [];
    };
}
