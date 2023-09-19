import { redirigerTilArbeidOgInntektUrl } from '@components/SystemMenu';
import { copyString } from '@components/clipboard/util';
import { Key, useKeyboard } from '@hooks/useKeyboard';
import { useNavigation } from '@hooks/useNavigation';
import { usePersonLoadable } from '@state/person';
import { useAddToast } from '@state/toasts';
import { isPerson } from '@utils/typeguards';

const useCurrentFødselsnummer = (): string | null => {
    const person = usePersonLoadable();

    return person.state === 'hasValue' && isPerson(person.contents) ? person.contents.fodselsnummer : null;
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

export const useKeyboardActions = () => {
    const { navigateToNext, navigateToPrevious } = useNavigation();
    const clickPrevious = () => navigateToPrevious?.();
    const clickNext = () => navigateToNext?.();
    const fødselsnummer = useCurrentFødselsnummer();
    const copyFødselsnummer = useCopyFødselsnummer();
    const openGosys = useOpenGosys();
    const openModiaPersonoversikt = useModiaPersonoversikt();
    const openModiaSykefraværsoppfølging = useOpenModiaSykefraværsoppfølging();

    return {
        [Key.Esc]: {
            action: () => {},
            ignoreIfModifiers: true,
            modifier: undefined,
            visningstekst: 'Lukk modal',
            visningssnarvei: ['Esc'],
        },
        [Key.Left]: {
            action: clickPrevious,
            ignoreIfModifiers: true,
            modifier: undefined,
            visningstekst: 'Gå til fanen til venstre i saksbildet',
            visningssnarvei: ['←'],
        },
        [Key.Right]: {
            action: clickNext,
            ignoreIfModifiers: true,
            modifier: undefined,
            visningstekst: 'Gå til fanen til høyre i saksbildet',
            visningssnarvei: ['→'],
        },
        [Key.F1]: {
            action: () => {},
            ignoreIfModifiers: true,
            modifier: undefined,
            visningstekst: 'Åpne denne modalen med tastatursnarveiene',
            visningssnarvei: ['F1'],
        },
        [Key.F6]: {
            action: () => {},
            ignoreIfModifiers: true,
            modifier: undefined,
            visningstekst: 'Åpne modal for utbetaling/send til godkjenning',
            visningssnarvei: ['F6'],
        },
        [Key.Minus]: {
            // Minus er pluss og slash er minus selvfølgelig, se https://www.toptal.com/developers/keycode
            action: () => {},
            ignoreIfModifiers: false,
            modifier: Key.Alt,
            visningstekst: 'Bla fremover i tidslinjen',
            visningssnarvei: ['ALT', '+'],
        },
        [Key.NumpadAdd]: {
            action: () => {},
            ignoreIfModifiers: false,
            visningstekst: 'Bla fremover i tidslinjen',
            modifier: Key.Alt,
            visningssnarvei: undefined,
        },
        [Key.Slash]: {
            // Minus er pluss og slash er minus på norsk tastatur selvfølgelig, se https://www.toptal.com/developers/keycode
            action: () => {},
            ignoreIfModifiers: false,
            modifier: Key.Alt,
            visningstekst: 'Bla bakover i tidslinjen',
            visningssnarvei: ['ALT', '-'],
        },
        [Key.NumpadSubtract]: {
            action: () => {},
            ignoreIfModifiers: false,
            modifier: Key.Alt,
            visningstekst: 'Bla bakover i tidslinjen',
            visningssnarvei: undefined,
        },
        [Key.C]: {
            action: copyFødselsnummer,
            ignoreIfModifiers: false,
            modifier: Key.Alt,
            visningstekst: 'Kopier fødselsnummer',
            visningssnarvei: ['ALT', 'C'],
        },
        [Key.H]: {
            action: () => {},
            ignoreIfModifiers: false,
            modifier: Key.Alt,
            visningstekst: 'Åpne/lukk historikk',
            visningssnarvei: ['ALT', 'H'],
        },
        [Key.N]: {
            action: () => {},
            ignoreIfModifiers: false,
            modifier: Key.Alt,
            visningstekst: 'Åpne notat',
            visningssnarvei: ['ALT', 'N'],
        },
        [Key.A]: {
            action: () =>
                fødselsnummer &&
                redirigerTilArbeidOgInntektUrl(
                    'https://arbeid-og-inntekt.nais.adeo.no/api/v2/redirect/sok/arbeidstaker',
                    fødselsnummer,
                ),
            ignoreIfModifiers: false,
            modifier: Key.Shift,
            visningstekst: 'Åpne aareg i ny fane',
            visningssnarvei: ['⇧', 'A'],
        },
        [Key.B]: {
            action: () => window.open('https://brreg.no', '_blank'),
            ignoreIfModifiers: false,
            modifier: Key.Shift,
            visningstekst: 'Åpne brreg i ny fane',
            visningssnarvei: ['⇧', 'B'],
        },
        [Key.G]: {
            action: openGosys,
            ignoreIfModifiers: false,
            modifier: Key.Shift,
            visningstekst: 'Åpne gosys på person i ny fane',
            visningssnarvei: ['⇧', 'G'],
        },
        [Key.I]: {
            action: () =>
                fødselsnummer &&
                redirigerTilArbeidOgInntektUrl(
                    'https://arbeid-og-inntekt.nais.adeo.no/api/v2/redirect/sok/a-inntekt',
                    fødselsnummer,
                ),
            ignoreIfModifiers: false,
            modifier: Key.Shift,
            visningstekst: 'Åpne a-inntekt i ny fane',
            visningssnarvei: ['⇧', 'I'],
        },
        [Key.L]: {
            action: () => window.open('https://lovdata.no/nav/folketrygdloven/kap8', '_blank'),
            ignoreIfModifiers: false,
            modifier: Key.Shift,
            visningstekst: 'Åpne lovdata i ny fane',
            visningssnarvei: ['⇧', 'L'],
        },
        [Key.M]: {
            action: openModiaPersonoversikt,
            ignoreIfModifiers: false,
            modifier: Key.Shift,
            visningstekst: 'Åpne modia personoversikt på person i ny fane',
            visningssnarvei: ['⇧', 'M'],
        },
        [Key.O]: {
            action: () => window.open('https://wasapp.adeo.no/oppdrag/venteregister/details.htm', '_blank'),
            ignoreIfModifiers: false,
            modifier: Key.Shift,
            visningstekst: 'Åpne oppdrag i ny fane',
            visningssnarvei: ['⇧', 'O'],
        },
        [Key.R]: {
            action: () =>
                window.open(
                    'https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-sykefravarsoppfolging-og-sykepenger/SitePages/Samhandlings--og-samordningsrutiner.aspx',
                    '_blank',
                ),
            ignoreIfModifiers: false,
            modifier: Key.Shift,
            visningstekst: 'Åpne rutine i ny fane',
            visningssnarvei: ['⇧', 'R'],
        },
        [Key.S]: {
            action: openModiaSykefraværsoppfølging,
            ignoreIfModifiers: false,
            modifier: Key.Shift,
            visningstekst: 'Åpne modia sykefraværsoppfølging på person i ny fane',
            visningssnarvei: ['⇧', 'S'],
        },
    };
};

export const useKeyboardShortcuts = () => {
    const actions = useKeyboardActions();
    useKeyboard(actions);
};
