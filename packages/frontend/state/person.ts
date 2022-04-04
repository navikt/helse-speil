import dayjs from 'dayjs';
import { atom, selector, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';

import { mapPerson } from '../mapping/person';

import { deletePåVent, getPerson, postLeggPåVent } from '@io/http';

import { useInnloggetSaksbehandler } from './authentication';
import { aktivPeriodeState, useAktivPeriode, useMaybeAktivPeriode } from './tidslinje';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiverState';
import { isBeregnetPeriode } from '@utils/typeguards';
import { useActivePeriod } from '@state/periodState';

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
                        type: 'info',
                    });
                case 401:
                    return Promise.reject({ message: 'Du må logge inn for å utføre søk', type: 'feil' });
                case 403:
                    return Promise.reject({
                        message: 'Du har ikke tilgang til å søke opp denne personen',
                        type: 'info',
                    });
                default:
                    console.error(error);
                    return Promise.reject({
                        message: 'Kunne ikke utføre søket. Prøv igjen senere',
                        type: 'feil',
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

export const useAlderVedSkjæringstidspunkt = (): number => {
    const fødselsdato = usePersoninfo().fødselsdato;
    const skjæringstidspunkt = useAktivPeriode().skjæringstidspunkt;
    return dayjs(skjæringstidspunkt).diff(fødselsdato, 'year');
};

type NameFormat = ('E' | 'F' | 'M' | ',')[];

export const usePersonnavn = (format: NameFormat = ['F', 'M', 'E']): string => {
    const personnavn = useMaybePersoninfo() ?? {
        fornavn: null,
        mellomnavn: null,
        etternavn: null,
    };

    return personnavn ? getFormatertNavn(personnavn as Personinfo, format) : 'Ukjent navn';
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

const sorterAscending = (a: TidslinjeperiodeMedSykefravær, b: TidslinjeperiodeMedSykefravær) => a.fom.diff(b.fom);

export const useUtbetalingstidsstempelFørsteGenForPeriode = (): string => {
    const activePeriod = useActivePeriod();
    const currentArbeidsgiver = useCurrentArbeidsgiver();

    if (!currentArbeidsgiver || !isBeregnetPeriode(activePeriod)) {
        return '';
    }

    const periode = currentArbeidsgiver.generasjoner[currentArbeidsgiver.generasjoner.length - 1].perioder.filter(
        (periode) =>
            periode.vedtaksperiodeId === activePeriod.vedtaksperiodeId &&
            isBeregnetPeriode(periode) &&
            periode.utbetaling.vurdering?.godkjent,
    )[0];

    return isBeregnetPeriode(periode) ? periode.utbetaling.vurdering?.tidsstempel ?? '' : '';
};

export const useFørsteUtbetalingstidsstempelFørsteGenISkjæringstidspunkt = (): string => {
    const activePeriod = useActivePeriod();
    const currentArbeidsgiver = useCurrentArbeidsgiver();

    if (!isBeregnetPeriode(activePeriod) || !currentArbeidsgiver) {
        return '';
    }

    const firstGeneration = currentArbeidsgiver.generasjoner[currentArbeidsgiver.generasjoner.length - 1];

    const førsteUtbetaltePeriodeForSkjæringstidspunkt = firstGeneration.perioder
        .filter(
            (periode) => isBeregnetPeriode(periode) && periode.skjaeringstidspunkt === activePeriod.skjaeringstidspunkt,
        )
        ?.pop();

    if (
        isBeregnetPeriode(førsteUtbetaltePeriodeForSkjæringstidspunkt) &&
        førsteUtbetaltePeriodeForSkjæringstidspunkt.utbetaling.vurdering?.godkjent
    ) {
        return førsteUtbetaltePeriodeForSkjæringstidspunkt.utbetaling.vurdering.tidsstempel;
    } else {
        return '';
    }
};

export const useVilkårsgrunnlaghistorikk = (
    skjæringstidspunkt: string | null,
    vilkårsgrunnlaghistorikkId: string | null,
): ExternalVilkårsgrunnlag | null => {
    const person = useRecoilValue(personState)?.person;
    const aktivPeriode = useAktivPeriode();

    if (!person) throw Error('Finner ikke vilkårsgrunnlaghistorikk fordi person mangler');

    if (!skjæringstidspunkt || !vilkårsgrunnlaghistorikkId) {
        return null;
    }

    if (!person.vilkårsgrunnlagHistorikk[vilkårsgrunnlaghistorikkId]) {
        return null;
    }
    return (
        person.vilkårsgrunnlagHistorikk[vilkårsgrunnlaghistorikkId]?.[skjæringstidspunkt] ??
        finnVilkårsgrunnlaghistorikkInnenforPeriodenNærmestSkjæringstidspunktet(
            person.vilkårsgrunnlagHistorikk[vilkårsgrunnlaghistorikkId],
            aktivPeriode as TidslinjeperiodeMedSykefravær,
        )
    );
};

const finnVilkårsgrunnlaghistorikkInnenforPeriodenNærmestSkjæringstidspunktet = (
    vilkårsgrunnlagHistorikk: Record<string, ExternalVilkårsgrunnlag>,
    aktivPeriode: TidslinjeperiodeMedSykefravær,
): ExternalVilkårsgrunnlag | null => {
    const vilkårsgrunnlag = Object.entries(vilkårsgrunnlagHistorikk).filter(
        ([key, value]) =>
            dayjs(value.skjæringstidspunkt).isSameOrAfter(aktivPeriode.skjæringstidspunkt) &&
            dayjs(value.skjæringstidspunkt).isSameOrBefore(aktivPeriode.tom),
    );
    return vilkårsgrunnlag.length > 0
        ? vilkårsgrunnlag.sort((a, b) => (dayjs(a[0]).isAfter(b[0]) ? 1 : -1))[0][1]
        : null;
};

export const useOrganisasjonsnummer = (): string => {
    const periode = useMaybeAktivPeriode();

    if (!periode) throw Error('Finner ikke organisasjonsnummer fordi aktiv periode mangler');

    return periode.organisasjonsnummer;
};

const useArbeidsgiver = (organisasjonsnummer: string): ExternalArbeidsgiver => {
    const person = usePerson();

    if (!person) throw Error('Finner ikke arbeidsgiver fordi person mangler');

    return person.arbeidsgivereV2.find((it) => it.organisasjonsnummer === organisasjonsnummer) as ExternalArbeidsgiver;
};

export const useArbeidsgivernavn = (organisasjonsnummer: string): string => {
    return useArbeidsgiver(organisasjonsnummer).navn;
};

export const useArbeidsgiverbransjer = (organisasjonsnummer: string): string[] => {
    return useArbeidsgiver(organisasjonsnummer).bransjer ?? [];
};

export const useIsLoadingPerson = () => useRecoilValue(loadingPersonState);
