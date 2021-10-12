import { atom, selector, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';

import { Varseltype } from '@navikt/helse-frontend-varsel';

import { deletePåVent, getPerson, postLeggPåVent } from '../io/http';
import { mapPerson } from '../mapping/person';

import { getAnonymArbeidsgiverForOrgnr } from '../agurkdata';
import { useInnloggetSaksbehandler } from './authentication';
import { aktivPeriodeState, useAktivPeriode } from './tidslinje';

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

export const usePersonnavn = (): string => {
    const { fornavn, mellomnavn, etternavn } = usePerson()?.personinfo ?? {};
    return [fornavn, mellomnavn, etternavn].filter(Boolean).join(' ');
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

export const useSykepengegrunnlag = (beregningId: string) => {
    return (
        usePerson()
            ?.arbeidsgivere.flatMap((a) => a.vedtaksperioder)
            .find((v) => v.beregningIder?.find((id) => id === beregningId)) as Vedtaksperiode
    )?.vilkår?.sykepengegrunnlag;
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

export const useVilkårsgrunnlaghistorikk = (
    skjæringstidspunkt: string,
    vilkårsgrunnlaghistorikkId: string
): ExternalVilkårsgrunnlag | null => {
    const person = useRecoilValue(personState)?.person;

    if (!person) throw Error('Finner ikke vilkårsgrunnlaghistorikk fordi person mangler');

    return person.vilkårsgrunnlagHistorikk[vilkårsgrunnlaghistorikkId]?.[skjæringstidspunkt] ?? null;
};

export const useOrganisasjonsnummer = (): string => {
    const periode = useAktivPeriode();

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
