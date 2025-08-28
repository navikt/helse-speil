import { useBrukerGrupper } from '@auth/brukerContext';
import { hoppTilModia, redirigerTilArbeidOgInntektUrl } from '@components/SystemMenu';
import { Action, Key, useKeyboard } from '@hooks/useKeyboard';
import { useNavigation } from '@hooks/useNavigation';
import { useActivePeriod } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { useAddToast } from '@state/toasts';
import { kanBrukeUtviklersnarveier } from '@utils/featureToggles';
import { isBeregnetPeriode, isNotNullOrUndefined, isPerson, isUberegnetPeriode } from '@utils/typeguards';

const useCurrentFødselsnummer = (): string | null => {
    const { loading, data } = useFetchPersonQuery();
    return !loading && data !== undefined && isPerson(data.person) ? data.person.fodselsnummer : null;
};

const useCurrentAktørId = (): string | null => {
    const { loading, data } = useFetchPersonQuery();

    return !loading && data !== undefined && isPerson(data.person) ? data.person.aktorId : null;
};

const useCopyFødselsnummer = (): (() => void) => {
    const fødselsnummer = useCurrentFødselsnummer();
    const addToast = useAddToast();

    return () => {
        if (fødselsnummer) {
            void copyString(fødselsnummer, false);
            addToast({
                key: 'kopierFødselsnummerToastKey',
                message: 'Fødselsnummer er kopiert',
                timeToLiveMs: 3000,
            });
        } else {
            addToast({
                key: 'fødselsnummerIkkeKopiert',
                message: 'Fødselsnummer ble ikke kopiert',
                timeToLiveMs: 3000,
            });
        }
    };
};

const useCopyVedtaksperiodeId = (): (() => void) => {
    const { loading, data } = useFetchPersonQuery();
    const person = !loading && isNotNullOrUndefined(data) && isPerson(data.person) ? data.person : null;
    const periode = useActivePeriod(person);
    const addToast = useAddToast();

    return () => {
        if (isBeregnetPeriode(periode) || isUberegnetPeriode(periode)) {
            void copyString(periode.vedtaksperiodeId, false);
            addToast({
                key: 'kopierVedtaksperiodeIdToastKey',
                message: `VedtaksperiodeId "${periode.vedtaksperiodeId}" er kopiert`,
                timeToLiveMs: 5000,
            });
        } else {
            addToast({
                key: 'vedtaksperiodeIdIkkeKopiert',
                message: 'Aktiv periode har ikke vedtaksperiodeId',
                timeToLiveMs: 3000,
            });
        }
    };
};

const useCopyPersondata = (): (() => void) => {
    const { loading, data } = useFetchPersonQuery();
    const addToast = useAddToast();

    return () => {
        if (!loading && isNotNullOrUndefined(data)) {
            void copyString(JSON.stringify({ data }, null, 2), true);
            addToast({
                key: 'kopierPersondataToastKey',
                message: 'Persondata er kopiert',
                timeToLiveMs: 3000,
            });
        } else {
            addToast({
                key: 'persondataIkkeKopiert',
                message: 'Klarte ikke å kopiere persondata',
                timeToLiveMs: 3000,
            });
        }
    };
};

const useCopyAktørId = (): (() => void) => {
    const aktørId = useCurrentAktørId();
    const addToast = useAddToast();

    return () => {
        if (aktørId) {
            void copyString(aktørId, false);
            addToast({
                key: 'kopierAktørIdToastKey',
                message: 'Aktør-ID er kopiert',
                timeToLiveMs: 3000,
            });
        } else {
            addToast({
                key: 'aktørIdIkkeKopiert',
                message: 'Aktør-ID ble ikke kopiert',
                timeToLiveMs: 3000,
            });
        }
    };
};

const useOpenForeldrepenger = (): (() => void) => {
    const aktørId = useCurrentAktørId();
    const url = aktørId ? `https://fpsak.intern.nav.no/aktoer/${aktørId}` : 'https://fpsak.intern.nav.no';
    return () => window.open(url, '_blank');
};
const useOpenGosys = (): (() => void) => {
    const fødselsnummer = useCurrentFødselsnummer();
    const url = fødselsnummer
        ? `https://gosys.intern.nav.no/gosys/personoversikt/fnr=${fødselsnummer}`
        : 'https://gosys.intern.nav.no/gosys/';
    return () => window.open(url, '_blank');
};
const useOpenModiaSykefraværsoppfølging = (): (() => void) => {
    const fødselsnummer = useCurrentFødselsnummer();
    return () => hoppTilModia('https://syfomodiaperson.intern.nav.no/sykefravaer/', fødselsnummer);
};
const useModiaPersonoversikt = (): (() => void) => {
    const fødselsnummer = useCurrentFødselsnummer();
    const url = fødselsnummer
        ? `https://app.adeo.no/modiapersonoversikt/person/${fødselsnummer}`
        : 'https://app.adeo.no/modiapersonoversikt';
    return () => window.open(url, '_blank');
};

const useOpenDemosiderForVedtak = (): (() => void) => {
    const fødselsnummer = useCurrentFødselsnummer();
    return () => hoppTilModia('https://demo.ekstern.dev.nav.no/syk/sykepenger', fødselsnummer);
};

export const useKeyboardActions = (): Action[] => {
    const { navigateToNext, navigateToPrevious } = useNavigation();
    const erUtvikler = kanBrukeUtviklersnarveier(useBrukerGrupper());
    const clickPrevious = () => navigateToPrevious?.();
    const clickNext = () => navigateToNext?.();
    const fødselsnummer = useCurrentFødselsnummer();
    const copyFødselsnummer = useCopyFødselsnummer();
    const copyVedtaksperiodeId = useCopyVedtaksperiodeId();
    const copyPersondata = useCopyPersondata();
    const copyAktørId = useCopyAktørId();
    const openForeldrepenger = useOpenForeldrepenger();
    const openGosys = useOpenGosys();
    const openModiaPersonoversikt = useModiaPersonoversikt();
    const openModiaSykefraværsoppfølging = useOpenModiaSykefraværsoppfølging();
    const openDemosiderForVedtak = useOpenDemosiderForVedtak();

    return [
        {
            key: Key.Esc,
            visningstekst: 'Lukk modal',
            visningssnarvei: ['Esc'],
            action: () => {},
            ignoreIfModifiers: true,
            modifier: undefined,
        },
        {
            key: Key.Left,
            visningstekst: 'Gå til fanen til venstre i saksbildet',
            visningssnarvei: ['←'],
            action: clickPrevious,
            ignoreIfModifiers: true,
            modifier: undefined,
        },
        {
            key: Key.Right,
            visningstekst: 'Gå til fanen til høyre i saksbildet',
            visningssnarvei: ['→'],
            action: clickNext,
            ignoreIfModifiers: true,
            modifier: undefined,
        },
        {
            key: Key.F1,
            visningstekst: 'Åpne denne modalen med tastatursnarveiene',
            visningssnarvei: ['F1'],
            action: () => {},
            ignoreIfModifiers: true,
            modifier: undefined,
        },
        {
            key: Key.F6,
            visningstekst: 'Åpne modal for fatting av vedtak/send til godkjenning',
            visningssnarvei: ['F6'],
            action: () => {},
            ignoreIfModifiers: true,
            modifier: undefined,
        },
        {
            // Minus er pluss og slash er minus selvfølgelig, se https://www.toptal.com/developers/keycode
            key: Key.Minus,
            visningstekst: 'Bla fremover i tidslinjen',
            visningssnarvei: ['ALT', '+'],
            action: () => {},
            ignoreIfModifiers: false,
            modifier: Key.Alt,
        },
        {
            key: Key.NumpadAdd,
            visningstekst: 'Bla fremover i tidslinjen',
            visningssnarvei: undefined,
            action: () => {},
            ignoreIfModifiers: false,
            modifier: Key.Alt,
        },
        {
            // Minus er pluss og slash er minus på norsk tastatur selvfølgelig, se https://www.toptal.com/developers/keycode
            key: Key.Slash,
            visningstekst: 'Bla bakover i tidslinjen',
            visningssnarvei: ['ALT', '-'],
            action: () => {},
            ignoreIfModifiers: false,
            modifier: Key.Alt,
        },
        {
            key: Key.NumpadSubtract,
            visningstekst: 'Bla bakover i tidslinjen',
            visningssnarvei: undefined,
            action: () => {},
            ignoreIfModifiers: false,
            modifier: Key.Alt,
        },
        {
            key: Key.A,
            visningstekst: 'Kopier aktør-ID',
            visningssnarvei: ['ALT', 'A'],
            action: copyAktørId,
            ignoreIfModifiers: false,
            modifier: Key.Alt,
        },
        {
            key: Key.C,
            visningstekst: 'Kopier fødselsnummer',
            visningssnarvei: ['ALT', 'C'],
            action: copyFødselsnummer,
            ignoreIfModifiers: false,
            modifier: Key.Alt,
        },
        {
            key: Key.H,
            visningstekst: 'Åpne/lukk historikk',
            visningssnarvei: ['ALT', 'H'],
            action: () => {},
            ignoreIfModifiers: false,
            modifier: Key.Alt,
        },
        {
            key: Key.N,
            visningstekst: 'Åpne generelt notat (fokus på tekstfeltet om notatet allerede er åpent)',
            visningssnarvei: ['ALT', 'N'],
            action: () => {},
            ignoreIfModifiers: false,
            modifier: Key.Alt,
        },
        {
            key: Key.A,
            visningstekst: 'Åpne Aa-reg',
            visningssnarvei: ['⇧', 'A'],
            action: () =>
                redirigerTilArbeidOgInntektUrl(
                    'https://arbeid-og-inntekt.nais.adeo.no/api/v2/redirect/sok/arbeidstaker',
                    fødselsnummer,
                ),
            ignoreIfModifiers: false,
            modifier: Key.Shift,
        },
        {
            key: Key.B,
            visningstekst: 'Åpne Brreg',
            visningssnarvei: ['⇧', 'B'],
            action: () => window.open('https://brreg.no', '_blank'),
            ignoreIfModifiers: false,
            modifier: Key.Shift,
        },
        {
            key: Key.D,
            visningstekst: 'Demosider for vedtak',
            visningssnarvei: ['⇧', 'D'],
            action: openDemosiderForVedtak,
            ignoreIfModifiers: false,
            modifier: Key.Shift,
        },
        {
            key: Key.E,
            visningstekst: 'Åpne A-inntekt',
            visningssnarvei: ['⇧', 'E'],
            action: () =>
                redirigerTilArbeidOgInntektUrl(
                    'https://arbeid-og-inntekt.nais.adeo.no/api/v2/redirect/sok/a-inntekt',
                    fødselsnummer,
                ),
            ignoreIfModifiers: false,
            modifier: Key.Shift,
        },
        {
            key: Key.F,
            visningstekst: 'Åpne Foreldrepenger',
            visningssnarvei: ['⇧', 'F'],
            action: openForeldrepenger,
            ignoreIfModifiers: false,
            modifier: Key.Shift,
        },
        {
            key: Key.G,
            visningstekst: 'Åpne Gosys',
            visningssnarvei: ['⇧', 'G'],
            action: openGosys,
            ignoreIfModifiers: false,
            modifier: Key.Shift,
        },
        {
            key: Key.L,
            visningstekst: 'Åpne Lovdata',
            visningssnarvei: ['⇧', 'L'],
            action: () => window.open('https://lovdata.no/pro/#document/NL/lov/1997-02-28-19/KAPITTEL_4-4', '_blank'),
            ignoreIfModifiers: false,
            modifier: Key.Shift,
        },
        {
            key: Key.M,
            visningstekst: 'Åpne Modia personoversikt',
            visningssnarvei: ['⇧', 'M'],
            action: openModiaPersonoversikt,
            ignoreIfModifiers: false,
            modifier: Key.Shift,
        },
        {
            key: Key.O,
            visningstekst: 'Åpne oppdrag',
            visningssnarvei: ['⇧', 'O'],
            action: () => window.open('https://wasapp.adeo.no/oppdrag/venteregister/details.htm', '_blank'),
            ignoreIfModifiers: false,
            modifier: Key.Shift,
        },
        {
            key: Key.R,
            visningstekst: 'Åpne rutiner for sykepenger',
            visningssnarvei: ['⇧', 'R'],
            action: () =>
                window.open(
                    'https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-sykefravarsoppfolging-og-sykepenger/SitePages/Samhandlings--og-samordningsrutiner.aspx',
                    '_blank',
                ),
            ignoreIfModifiers: false,
            modifier: Key.Shift,
        },
        {
            key: Key.S,
            visningstekst: 'Åpne Modia sykefraværsoppfølging',
            visningssnarvei: ['⇧', 'S'],
            action: openModiaSykefraværsoppfølging,
            ignoreIfModifiers: false,
            modifier: Key.Shift,
        },
        ...(erUtvikler
            ? [
                  {
                      key: Key.V,
                      visningstekst: 'Kopier vedtaksperiodeId',
                      visningssnarvei: ['ALT', 'V'],
                      action: copyVedtaksperiodeId,
                      ignoreIfModifiers: false,
                      modifier: Key.Alt,
                      utviklerOnly: true,
                  },
                  {
                      key: Key.P,
                      visningstekst: 'Kopier persondata',
                      visningssnarvei: ['ALT', 'P'],
                      action: copyPersondata,
                      ignoreIfModifiers: false,
                      modifier: Key.Alt,
                      utviklerOnly: true,
                  },
              ]
            : []),
    ];
};

export const useKeyboardShortcuts = () => {
    const actions = useKeyboardActions();
    useKeyboard(actions);
};

const removeSpaces = (s: string) => s.replace(/\s/g, '');

const writeToClipboard = (data: string) => navigator?.clipboard?.writeText(data);

const copyString = (data: string, preserveWhitespace: boolean) =>
    writeToClipboard(preserveWhitespace ? data : removeSpaces(data))
        .then(() => true)
        .catch(() => false);
