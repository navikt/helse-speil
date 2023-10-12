import { useParams } from 'react-router-dom';

import { useQuery } from '@apollo/client';
import { redirigerTilArbeidOgInntektUrl } from '@components/SystemMenu';
import { copyString } from '@components/clipboard/util';
import { Action, Key, useKeyboard } from '@hooks/useKeyboard';
import { useNavigation } from '@hooks/useNavigation';
import { FetchPersonDocument } from '@io/graphql';
import { useAddToast } from '@state/toasts';
import { isPerson } from '@utils/typeguards';

const useCurrentFødselsnummer = (): string | null => {
    const { aktorId } = useParams<{ aktorId: string }>();
    const { loading, data } = useQuery(FetchPersonDocument, { variables: { aktorId } });

    return !loading && data !== undefined && isPerson(data.person) ? data.person.fodselsnummer : null;
};

const useCurrentAktørId = (): string | null => {
    const { aktorId } = useParams<{ aktorId: string }>();
    const { loading, data } = useQuery(FetchPersonDocument, { variables: { aktorId } });

    return !loading && data !== undefined && isPerson(data.person) ? data.person.aktorId : null;
};

const useCopyFødselsnummer = (): (() => void) => {
    const fødselsnummer = useCurrentFødselsnummer();
    const addToast = useAddToast();

    return () => {
        if (fødselsnummer) {
            copyString(fødselsnummer, false);
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

const useCopyAktørId = (): (() => void) => {
    const aktørId = useCurrentAktørId();
    const addToast = useAddToast();

    return () => {
        if (aktørId) {
            copyString(aktørId, false);
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

const useOpenGosys = (): (() => void) => {
    const fødselsnummer = useCurrentFødselsnummer();
    const url = fødselsnummer
        ? `https://gosys.intern.nav.no/gosys/personoversikt/fnr=${fødselsnummer}`
        : 'https://gosys.intern.nav.no/gosys/';
    return () => window.open(url, '_blank');
};
const useOpenModiaSykefraværsoppfølging = (): (() => void) => {
    const fødselsnummer = useCurrentFødselsnummer();
    const url = `https://syfomodiaperson.intern.nav.no/sykefravaer/${fødselsnummer ?? ''}`;
    return () => window.open(url, '_blank');
};
const useModiaPersonoversikt = (): (() => void) => {
    const fødselsnummer = useCurrentFødselsnummer();
    const url = fødselsnummer
        ? `https://app.adeo.no/modiapersonoversikt/person/${fødselsnummer}`
        : 'https://app.adeo.no/modiapersonoversikt';
    return () => window.open(url, '_blank');
};

export const useKeyboardActions = (): Action[] => {
    const { navigateToNext, navigateToPrevious } = useNavigation();
    const clickPrevious = () => navigateToPrevious?.();
    const clickNext = () => navigateToNext?.();
    const fødselsnummer = useCurrentFødselsnummer();
    const copyFødselsnummer = useCopyFødselsnummer();
    const copyAktørId = useCopyAktørId();
    const openGosys = useOpenGosys();
    const openModiaPersonoversikt = useModiaPersonoversikt();
    const openModiaSykefraværsoppfølging = useOpenModiaSykefraværsoppfølging();

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
            visningstekst: 'Åpne modal for utbetaling/send til godkjenning',
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
            visningstekst: 'Kopier aktørId',
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
            visningstekst: 'Åpne aareg i ny fane',
            visningssnarvei: ['⇧', 'A'],
            action: () =>
                fødselsnummer &&
                redirigerTilArbeidOgInntektUrl(
                    'https://arbeid-og-inntekt.nais.adeo.no/api/v2/redirect/sok/arbeidstaker',
                    fødselsnummer,
                ),
            ignoreIfModifiers: false,
            modifier: Key.Shift,
        },
        {
            key: Key.B,
            visningstekst: 'Åpne brreg i ny fane',
            visningssnarvei: ['⇧', 'B'],
            action: () => window.open('https://brreg.no', '_blank'),
            ignoreIfModifiers: false,
            modifier: Key.Shift,
        },
        {
            key: Key.G,
            visningstekst: 'Åpne gosys på person i ny fane',
            visningssnarvei: ['⇧', 'G'],
            action: openGosys,
            ignoreIfModifiers: false,
            modifier: Key.Shift,
        },
        {
            key: Key.I,
            visningstekst: 'Åpne a-inntekt i ny fane',
            visningssnarvei: ['⇧', 'I'],
            action: () =>
                fødselsnummer &&
                redirigerTilArbeidOgInntektUrl(
                    'https://arbeid-og-inntekt.nais.adeo.no/api/v2/redirect/sok/a-inntekt',
                    fødselsnummer,
                ),
            ignoreIfModifiers: false,
            modifier: Key.Shift,
        },
        {
            key: Key.L,
            visningstekst: 'Åpne lovdata i ny fane',
            visningssnarvei: ['⇧', 'L'],
            action: () => window.open('https://lovdata.no/nav/folketrygdloven/kap8', '_blank'),
            ignoreIfModifiers: false,
            modifier: Key.Shift,
        },
        {
            key: Key.M,
            visningstekst: 'Åpne modia personoversikt på person i ny fane',
            visningssnarvei: ['⇧', 'M'],
            action: openModiaPersonoversikt,
            ignoreIfModifiers: false,
            modifier: Key.Shift,
        },
        {
            key: Key.O,
            visningstekst: 'Åpne oppdrag i ny fane',
            visningssnarvei: ['⇧', 'O'],
            action: () => window.open('https://wasapp.adeo.no/oppdrag/venteregister/details.htm', '_blank'),
            ignoreIfModifiers: false,
            modifier: Key.Shift,
        },
        {
            key: Key.R,
            visningstekst: 'Åpne rutine i ny fane',
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
            visningstekst: 'Åpne modia sykefraværsoppfølging på person i ny fane',
            visningssnarvei: ['⇧', 'S'],
            action: openModiaSykefraværsoppfølging,
            ignoreIfModifiers: false,
            modifier: Key.Shift,
        },
    ];
};

export const useKeyboardShortcuts = () => {
    const actions = useKeyboardActions();
    useKeyboard(actions);
};
