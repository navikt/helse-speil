import { PersoninfoFraSparkel } from '../../types';
import { somDato } from './vedtaksperiode';
import { Arbeidsgiver, Kjønn, Person } from 'internal-types';
import { SpesialistInfotrygdtypetekst, SpesialistPerson, SpesialistUtbetaling } from 'external-types';
import { mapInfotrygdutbetaling } from './infotrygd';
import { ArbeidsgiverBuilder } from './arbeidsgiver';
import dayjs from 'dayjs';
import { utbetalingsoversikt } from '../featureToggles';

// Optional personinfo fra Sparkel kan fjernes når vi ikke lenger
// kan komme til å hente person fra Spesialist som mangler kjønn
// (og fødselsdato, som vi ikke bruker ennå)
export const mapPerson = (
    personFraSpesialist: SpesialistPerson,
    personinfoFraSparkel?: PersoninfoFraSparkel
): { person: Person; problems: Error[] } => {
    const { person, problems } = new PersonBuilder()
        .addPerson(personFraSpesialist)
        .addPersoninfo(personinfoFraSparkel)
        .build();
    return { person: person as Person, problems };
};

export class PersonBuilder {
    private unmapped: SpesialistPerson;
    private personinfo?: PersoninfoFraSparkel;
    private person: Partial<Person> = {};
    private problems: Error[] = [];

    addPerson(person: SpesialistPerson): PersonBuilder {
        this.unmapped = person;
        return this;
    }

    addPersoninfo(personinfo?: PersoninfoFraSparkel): PersonBuilder {
        this.personinfo = personinfo;
        return this;
    }

    build(): { person?: Person; problems: Error[] } {
        if (!this.unmapped) {
            this.problems.push(Error('Mangler persondata å mappe'));
            return { problems: this.problems };
        }
        this.mapEnkleProperties();
        this.mapPersoninfo();
        this.mapUtbetalinger();
        this.mapArbeidsgivere();
        this.mapInfotrygdutbetalinger();
        return { person: this.person as Person, problems: this.problems };
    }

    private mapEnkleProperties = () => {
        this.person.enhet = this.unmapped.enhet;
        this.person.aktørId = this.unmapped.aktørId;
        this.person.tildeltTil = this.unmapped.tildeltTil ?? undefined;
        this.person.fødselsnummer = this.unmapped.fødselsnummer;
    };

    private mapPersoninfo = () => {
        this.person.personinfo = {
            fornavn: this.unmapped.personinfo.fornavn,
            mellomnavn: this.unmapped.personinfo.mellomnavn,
            etternavn: this.unmapped.personinfo.etternavn,
            fødselsdato: somDato(this.personinfo?.fødselsdato ?? this.unmapped.personinfo.fødselsdato!),
            kjønn: (this.personinfo?.kjønn ?? this.unmapped.personinfo.kjønn) as Kjønn,
            fnr: this.personinfo?.fnr ?? this.unmapped.fødselsnummer,
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
                ?.filter((utbetaling) => utbetaling.typetekst !== SpesialistInfotrygdtypetekst.TILBAKEFØRT)
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
                  };
              })
            : [];
    };
}
