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

export const useKeyboardShortcuts = () => {
    const { navigateToNext, navigateToPrevious } = useNavigation();
    const clickPrevious = () => navigateToPrevious?.();
    const clickNext = () => navigateToNext?.();
    const copyFødselsnummer = useCopyFødselsnummer();
    const openGosys = useOpenGosys();
    const openModiaPersonoversikt = useModiaPersonoversikt();
    const openModiaSykefraværsoppfølging = useOpenModiaSykefraværsoppfølging();

    const actions = {
        [Key.Left]: { action: clickPrevious, ignoreIfModifiers: true },
        [Key.Right]: { action: clickNext, ignoreIfModifiers: true },
        [Key.C]: { action: copyFødselsnummer, ignoreIfModifiers: false, modifier: Key.Alt },
        [Key.H]: {
            action: () => console.log('toggle historikk'),
            ignoreIfModifiers: false,
            modifier: Key.Alt,
        },
        [Key.N]: {
            action: () => console.log('åpne notat'),
            ignoreIfModifiers: false,
            modifier: Key.Alt,
        },
        [Key.A]: {
            action: () =>
                window.open('https://arbeid-og-inntekt.nais.adeo.no/api/v2/redirect/sok/arbeidstaker', '_blank'),
            ignoreIfModifiers: false,
            modifier: Key.Shift,
        },
        [Key.B]: {
            action: () => window.open('https://brreg.no', '_blank'),
            ignoreIfModifiers: false,
            modifier: Key.Shift,
        },
        [Key.G]: {
            action: openGosys,
            ignoreIfModifiers: false,
            modifier: Key.Shift,
        },
        [Key.I]: {
            action: () => window.open('https://arbeid-og-inntekt.nais.adeo.no/api/v2/redirect/sok/a-inntekt', '_blank'),
            ignoreIfModifiers: false,
            modifier: Key.Shift,
        },
        [Key.L]: {
            action: () => window.open('https://lovdata.no/nav/folketrygdloven/kap8', '_blank'),
            ignoreIfModifiers: false,
            modifier: Key.Shift,
        },
        [Key.M]: {
            action: openModiaPersonoversikt,
            ignoreIfModifiers: false,
            modifier: Key.Shift,
        },
        [Key.O]: {
            action: () => window.open('https://wasapp.adeo.no/oppdrag/venteregister/details.html', '_blank'),
            ignoreIfModifiers: false,
            modifier: Key.Shift,
        },
        [Key.R]: {
            action: () =>
                window.open(
                    'https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-sykefravarsoppfolging-og-sykepenger/SitePages/Samhandlings--og-samordningsrutiner.aspx',
                    '_blank',
                ),
            ignoreIfModifiers: false,
            modifier: Key.Shift,
        },
        [Key.S]: {
            action: openModiaSykefraværsoppfølging,
            ignoreIfModifiers: false,
            modifier: Key.Shift,
        },
    };
    useKeyboard(actions);
};
