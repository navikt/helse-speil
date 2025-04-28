import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

import { Maybe, Periodetilstand, PersonFragment } from '@io/graphql';
import { ActivePeriod } from '@typer/shared';
import { raise } from '@utils/ts';
import { isBeregnetPeriode, isUberegnetPeriode } from '@utils/typeguards';

type ActivePeriodeIdState = {
    id: string;
    type: 'Periode' | 'TilkommenInntekt';
};

const activePeriodIdState = atom<Maybe<ActivePeriodeIdState>>(null);

export const useSetActivePeriodId = (person: PersonFragment) => {
    const [activePeriodId, setActivePeriodId] = useAtom(activePeriodIdState);

    return (periodeId: string) => {
        if (activePeriodId?.type === 'Periode' && activePeriodId?.id === periodeId) return;
        const periode = findPeriod(periodeId, person ?? raise('Kan ikke aktivere periode uten person'));
        if (!periode) return;
        setActivePeriodId({ id: periode.id, type: 'Periode' });
    };
};

export const useActivePeriod = (person: Maybe<PersonFragment>): Maybe<ActivePeriod> => {
    const activePeriodId = useAtomValue(activePeriodIdState);

    if (!person) return null;

    if (activePeriodId !== null && activePeriodId?.type !== 'Periode') return null;

    return findPeriod(activePeriodId?.id ?? null, person) ?? findPeriodToSelect(person);
};

export const useSetActiveTilkommenInntektId = () => {
    const [activePeriodId, setActivePeriodId] = useAtom(activePeriodIdState);

    return (tilkommenInntektId: string) => {
        if (activePeriodId?.type === 'TilkommenInntekt' && activePeriodId?.id === tilkommenInntektId) return;
        setActivePeriodId({ id: tilkommenInntektId, type: 'TilkommenInntekt' });
    };
};

export const useActiveTilkommenInntektId = (): Maybe<string> => {
    const activePeriodId = useAtomValue(activePeriodIdState);

    if (activePeriodId?.type !== 'TilkommenInntekt') return null;

    return activePeriodId.id;
};

export const useActivePeriodWithPerson = (person: PersonFragment): Maybe<ActivePeriod> => {
    const activePeriodId = useAtomValue(activePeriodIdState);

    if (activePeriodId?.type !== 'Periode') return null;

    const periodToSelect = person ? findPeriodToSelect(person) : null;

    return findPeriod(activePeriodId.id, person) ?? periodToSelect;
};

export const useSelectPeriod = () => {
    const setActivePeriodId = useSetAtom(activePeriodIdState);
    return (person: PersonFragment) => {
        const periodToSelect = findPeriodToSelect(person);
        if (periodToSelect) {
            setActivePeriodId({ id: periodToSelect.id, type: 'Periode' });
        }
    };
};

const findPeriodToSelect = (person: PersonFragment): Maybe<ActivePeriod> => {
    const perioderINyesteGenerasjoner = person.arbeidsgivere.flatMap(
        (arbeidsgiver) => arbeidsgiver.generasjoner[0]?.perioder ?? [],
    );

    const aktuellePerioder = perioderINyesteGenerasjoner
        .sort((a, b) => new Date(b.fom).getTime() - new Date(a.fom).getTime())
        .filter(
            (period) =>
                (isBeregnetPeriode(period) || isUberegnetPeriode(period)) &&
                period.periodetilstand !== Periodetilstand.TilInfotrygd,
        );

    const venteperioder = perioderINyesteGenerasjoner
        .sort((a, b) => new Date(a.fom).getTime() - new Date(b.fom).getTime())
        .filter((period) => venterTilstander.includes(period.periodetilstand));

    const periodeTilBehandling = aktuellePerioder.find((periode) =>
        tilBehandlingTilstander.includes(periode.periodetilstand),
    );

    return periodeTilBehandling ?? venteperioder[0] ?? aktuellePerioder[0] ?? null;
};

const findPeriod = (periodeId: Maybe<string>, person: PersonFragment) => {
    if (periodeId == null) return null;

    return (
        person?.arbeidsgivere
            .flatMap((arbeidsgiver) => [
                ...arbeidsgiver.generasjoner.flatMap((generasjon) => generasjon.perioder),
                ...arbeidsgiver.ghostPerioder,
                ...arbeidsgiver.nyeInntektsforholdPerioder,
            ])
            .find((periode) => periode.id === periodeId) ?? null
    );
};

const tilBehandlingTilstander = [Periodetilstand.TilGodkjenning, Periodetilstand.TilUtbetaling];
const venterTilstander = [
    Periodetilstand.VenterPaEnAnnenPeriode,
    Periodetilstand.UtbetaltVenterPaEnAnnenPeriode,
    Periodetilstand.AvventerInntektsopplysninger,
    Periodetilstand.ForberederGodkjenning,
];
