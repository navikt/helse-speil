import dayjs from 'dayjs';
import { atom, selector, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';

import { Varseltype } from '@navikt/helse-frontend-varsel';

import { deletePåVent, getPerson, postLeggPåVent } from '../io/http';
import { mapPerson } from '../mapping/person';
import { useArbeidsgiver as useArbeidsgiverUtenParametre } from '../modell/arbeidsgiver';
import { useUtbetaling } from '../modell/utbetalingshistorikkelement';

import { anonymisertBoenhet, anonymisertPersoninfo, getAnonymArbeidsgiverForOrgnr } from '../agurkdata';
import { useInnloggetSaksbehandler } from './authentication';
import { aktivPeriodeState, useAktivPeriode, useMaybeAktivPeriode } from './tidslinje';

interface PersonState {
    problems?: Error[];
    person?: Person & SpeilApiV2;
}

const hentPerson = (id: string): Promise<PersonState> =>
    getPerson(id)
        .then(async ({ data }) => {
            const { person, problems } = mapPerson(data.person);
            return {
                person: {
                    ...person,
                    vilkårsgrunnlagHistorikk: data.person.vilkårsgrunnlagHistorikk,
                    arbeidsgivereV2: data.person.arbeidsgivere,
                    arbeidsforhold: data.person.arbeidsforhold,
                },
                problems: problems,
            };
        })
        .catch((error) => {
            switch (error.statusCode) {
                case 404:
                    return Promise.reject({
                        message: 'Personen har ingen perioder til godkjenning eller tidligere utbetalinger i Speil',
                        type: Varseltype.Info,
                    });
                case 401:
                    return Promise.reject({ message: 'Du må logge inn for å utføre søk', type: Varseltype.Feil });
                default:
                    console.error(error);
                    return Promise.reject({
                        message: 'Kunne ikke utføre søket. Prøv igjen senere',
                        type: Varseltype.Feil,
                    });
            }
        });

export const personState = atom<PersonState | undefined>({
    key: 'personState',
    default: undefined,
});

const personinfo = selector<Personinfo | undefined>({
    key: 'personinfo',
    get: ({ get }) => get(personState)?.person?.personinfo,
});

const tildelingState = atom<Tildeling | undefined>({
    key: 'tildelingState',
    default: undefined,
});

// Avgjør om tilstand i frontend skal overstyre tilstand as of backend
const frontendOverstyrerTildelingState = atom<boolean>({
    key: 'frontendOverstyrerTildeling',
    default: false,
});

const loadingPersonState = atom<boolean>({
    key: 'loadingPersonState',
    default: false,
});

const anonymiserPersonStateToggle = atom<boolean>({
    key: 'anonymiserPersonStateToggle',
    default: localStorage.getItem('agurkmodus') === 'true',
});

export const persondataSkalAnonymiseres = selector<boolean>({
    key: 'persondataSkalAnonymiseres',
    get: ({ get }) => get(anonymiserPersonStateToggle),
    set: ({ set }, newValue: boolean) => {
        localStorage.setItem('agurkmodus', `${newValue}`);
        set(anonymiserPersonStateToggle, newValue);
    },
});

export const useToggleAnonymiserPersondata = () => {
    const setAnonymiserPerson = useSetRecoilState(persondataSkalAnonymiseres);
    return () => {
        setAnonymiserPerson((erAnonymisert) => !erAnonymisert);
    };
};

export const usePersondataSkalAnonymiseres = () => useRecoilValue(persondataSkalAnonymiseres);

export const useTildelPerson = () => {
    const setTildeling = useSetRecoilState(tildelingState);
    const setFrontendOverstyrerTildeling = useSetRecoilState(frontendOverstyrerTildelingState);
    const saksbehandler = useInnloggetSaksbehandler();
    return {
        tildelPerson: (påVent?: boolean) => {
            setFrontendOverstyrerTildeling(true);
            setTildeling({ saksbehandler: { ...saksbehandler }, påVent: påVent ?? false });
        },
        fjernTildeling: () => {
            setFrontendOverstyrerTildeling(true);
            setTildeling(undefined);
        },
    };
};

export const usePersonPåVent = () => {
    const { tildelPerson } = useTildelPerson();
    return (påVent: boolean) => tildelPerson(påVent);
};

export const usePerson = (): (Person & SpeilApiV2) | undefined => {
    const person = useRecoilValue(personState)?.person;
    const tildeling = useRecoilValue(tildelingState);
    const frontendOverstyrerTildeling = useRecoilValue(frontendOverstyrerTildelingState);
    return (
        person && {
            ...person,
            tildeling: frontendOverstyrerTildeling ? tildeling : person.tildeling,
        }
    );
};

export const useMaybePersoninfo = (): Personinfo | undefined => useRecoilValue(personinfo);

export const usePersoninfo = (): Personinfo => {
    const personinfo = useMaybePersoninfo();

    if (!personinfo) {
        throw Error('Forventet personinfo men fant ikke personen');
    }

    return personinfo;
};

export const usePersoninfoRender = (): Personinfo => {
    const anonymiseringIsEnabled = usePersondataSkalAnonymiseres();
    const personinfo = usePersoninfo();

    return anonymiseringIsEnabled ? anonymisertPersoninfo : personinfo;
};

export const useEnhetRender = (): Boenhet => {
    const anonymiseringIsEnabled = usePersondataSkalAnonymiseres();
    const person = usePerson();

    if (!person) {
        throw Error('Forventet boenhet men fant ikke personen');
    }

    return anonymiseringIsEnabled ? anonymisertBoenhet : person.enhet;
};

export const useAktørIdRender = (): string => {
    const anonymiseringIsEnabled = usePersondataSkalAnonymiseres();
    const person = usePerson();

    if (!person) {
        throw Error('Forventet boenhet men fant ikke personen');
    }

    return anonymiseringIsEnabled ? '1000000000000' : person.aktørId;
};

export const useAlderVedSkjæringstidspunkt = (): number => {
    const fødselsdato = usePersoninfo().fødselsdato;
    const skjæringstidspunkt = useAktivPeriode().skjæringstidspunkt;
    return dayjs(skjæringstidspunkt).diff(fødselsdato, 'year');
};

const usePersonnavn = (): { fornavn: string | null; mellomnavn: string | null; etternavn: string | null } =>
    useMaybePersoninfo() ?? {
        fornavn: null,
        mellomnavn: null,
        etternavn: null,
    };

type NameFormat = ('E' | 'F' | 'M' | ',')[];

export const usePersonnavnRender = (format: NameFormat = ['F', 'M', 'E']): string => {
    const anonymiseringIsEnabled = usePersondataSkalAnonymiseres();
    const personnavn = usePersonnavn();

    return anonymiseringIsEnabled
        ? `${anonymisertPersoninfo.fornavn} ${anonymisertPersoninfo.etternavn}`
        : personnavn
        ? getFormatertNavn(personnavn as Personinfo, format)
        : 'Ukjent navn';
};

export const getFormatertNavn = (personinfo: Personinfo, format: NameFormat = ['F', 'M', 'E']): string => {
    return format
        .map((code) => {
            switch (code) {
                case 'E':
                    return personinfo.etternavn;
                case 'F':
                    return personinfo.fornavn;
                case 'M':
                    return personinfo.mellomnavn;
                case ',':
                    return ',';
            }
        })
        .filter((it) => it)
        .map((it, i) => (i === 0 || it === ',' ? it : ` ${it}`))
        .join('');
};

export const useRefreshPerson = () => {
    const setPerson = useSetRecoilState(personState);
    const person = useRecoilValue(personState)?.person;

    return () => {
        if (person?.aktørId) {
            hentPerson(person.aktørId).then((res) => setPerson(res));
        }
    };
};

export const useHentPerson = () => {
    const setPerson = useSetRecoilState(personState);
    const setLoadingPerson = useSetRecoilState(loadingPersonState);
    const resetAktivPeriode = useResetRecoilState(aktivPeriodeState);
    const resetTildeling = useResetRecoilState(tildelingState);
    const resetFrontendOverstyrerTildeling = useResetRecoilState(frontendOverstyrerTildelingState);

    return (id: string) => {
        resetTildeling();
        resetFrontendOverstyrerTildeling();
        resetAktivPeriode();
        setPerson(undefined);
        setLoadingPerson(true);
        return hentPerson(id)
            .then((res) => {
                setPerson(res);
                return res;
            })
            .finally(() => setLoadingPerson(false));
    };
};

export const useLeggPåVent = () => {
    const settLokalPåVentState = usePersonPåVent();

    return ({ oppgavereferanse }: Pick<Oppgave, 'oppgavereferanse'>) => {
        return postLeggPåVent(oppgavereferanse)
            .then((response) => {
                settLokalPåVentState(true);
                return Promise.resolve(response);
            })
            .catch(() => {
                return Promise.reject();
            });
    };
};

export const useFjernPåVent = () => {
    const settLokalPåVentState = usePersonPåVent();

    return ({ oppgavereferanse }: Pick<Oppgave, 'oppgavereferanse'>) => {
        return deletePåVent(oppgavereferanse)
            .then((response) => {
                settLokalPåVentState(false);
                return Promise.resolve(response);
            })
            .catch(() => {
                return Promise.reject();
            });
    };
};

const sorterAscending = (a: Tidslinjeperiode, b: Tidslinjeperiode) => a.fom.diff(b.fom);

export const useVurderingForSkjæringstidspunkt = (
    uniqueId: string,
    skjæringstidspunkt: string
): Vurdering | undefined => {
    return useUtbetalingForSkjæringstidspunkt(uniqueId, skjæringstidspunkt)?.vurdering;
};

export const useUtbetalingForSkjæringstidspunkt = (
    uniqueId: string,
    skjæringstidspunkt: string
): UtbetalingshistorikkElement | undefined => {
    const perioder = useArbeidsgiverUtenParametre()!.tidslinjeperioder.find(
        (it) => it.find((it) => it.unique === uniqueId)!
    )!;

    const førstePeriodeForSkjæringstidspunkt = [...perioder]
        .sort(sorterAscending)
        .filter((it) => it.skjæringstidspunkt === skjæringstidspunkt)
        .shift()!;

    return useUtbetaling(førstePeriodeForSkjæringstidspunkt.beregningId);
};

export const useVilkårsgrunnlaghistorikk = (
    skjæringstidspunkt: string,
    vilkårsgrunnlaghistorikkId: string
): ExternalVilkårsgrunnlag | null => {
    const person = useRecoilValue(personState)?.person;

    if (!person) throw Error('Finner ikke vilkårsgrunnlaghistorikk fordi person mangler');

    return person.vilkårsgrunnlagHistorikk[vilkårsgrunnlaghistorikkId]?.[skjæringstidspunkt] ?? null;
};

export const useOrganisasjonsnummer = (): string => {
    const periode = useMaybeAktivPeriode();

    if (!periode) throw Error('Finner ikke organisasjonsnummer fordi aktiv periode mangler');

    return periode.organisasjonsnummer;
};

export const useOrganisasjonsnummerRender = (organisasjonsnummer: string): Agurkifiserbar<string> => {
    const anonymiseringIsEnabled = usePersondataSkalAnonymiseres();

    return anonymiseringIsEnabled ? getAnonymArbeidsgiverForOrgnr(organisasjonsnummer).orgnr : organisasjonsnummer;
};

const useArbeidsgiver = (organisasjonsnummer: string): ExternalArbeidsgiver => {
    const person = usePerson();

    if (!person) throw Error('Finner ikke arbeidsgiver fordi person mangler');

    return person.arbeidsgivereV2.find((it) => it.organisasjonsnummer === organisasjonsnummer) as ExternalArbeidsgiver;
};

const useEndringer = (organisasjonsnummer: string): ExternalOverstyring[] => {
    const arbeidsgiver = useArbeidsgiver(organisasjonsnummer);
    return arbeidsgiver.overstyringer;
};

export const useEndringerForPeriode = (organisasjonsnummer: string): ExternalOverstyring[] => {
    const endringer = useEndringer(organisasjonsnummer);
    const periode = useAktivPeriode();

    return endringer.filter((it) => dayjs(it.timestamp).isSameOrBefore(periode.opprettet));
};

export const useArbeidsgivernavnRender = (organisasjonsnummer: string): string => {
    const anonymiseringIsEnabled = usePersondataSkalAnonymiseres();
    const arbeidsgivernavn = useArbeidsgiver(organisasjonsnummer).navn;

    return anonymiseringIsEnabled ? getAnonymArbeidsgiverForOrgnr(organisasjonsnummer).navn : arbeidsgivernavn;
};

export const useArbeidsgiverbransjerRender = (organisasjonsnummer: string): Agurkifiserbar<string[]> => {
    const anonymiseringIsEnabled = usePersondataSkalAnonymiseres();
    const bransjer = useArbeidsgiver(organisasjonsnummer).bransjer;

    return anonymiseringIsEnabled ? bransjer.map((it) => 'Agurkifisert bransje') : bransjer;
};

export const useArbeidsforholdRender = (organisasjonsnummer: string): Agurkifiserbar<ExternalArbeidsforhold[]> => {
    const anonymiseringIsEnabled = usePersondataSkalAnonymiseres();
    const arbeidsforhold =
        usePerson()?.arbeidsforhold.filter((it) => it.organisasjonsnummer === organisasjonsnummer) ?? [];

    return anonymiseringIsEnabled
        ? arbeidsforhold.map((it) => ({ ...it, stillingstittel: 'Agurkifisert stillingstittel' }))
        : arbeidsforhold;
};

export const useIsLoadingPerson = () => useRecoilValue(loadingPersonState);
