import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useParams, usePathname, useRouter } from 'next/navigation';

import { Maybe, Periodetilstand, PersonFragment } from '@io/graphql';
import { ActivePeriod } from '@typer/shared';
import { raise } from '@utils/ts';
import { isBeregnetPeriode, isUberegnetPeriode } from '@utils/typeguards';

const activePeriodIdState = atom<Maybe<string>>(null);

export const useSetActivePeriodId = (person: PersonFragment) => {
    const [activePeriodId, setActivePeriodId] = useAtom(activePeriodIdState);

    return (periodeId: string) => {
        if (activePeriodId === periodeId) return;
        const periode = findPeriod(periodeId, person ?? raise('Kan ikke aktivere periode uten person'));
        if (!periode) return;
        setActivePeriodId(periode.id);
    };
};

export const useActivePeriod = (person: Maybe<PersonFragment>): Maybe<ActivePeriod> => {
    const activePeriodId = useAtomValue(activePeriodIdState);
    const pathname = usePathname();
    const erPåTilkommenInntektSide = pathname.includes('/tilkommeninntekt/');

    if (erPåTilkommenInntektSide || !person) return null;

    return findPeriod(activePeriodId, person) ?? findPeriodToSelect(person);
};

export const useSetActiveTilkommenInntektId = () => {
    const { aktorId } = useParams<{ aktorId?: string }>();
    const router = useRouter();

    return (tilkommenInntektId: string) => {
        router.push(`/person/${aktorId}/tilkommeninntekt/${tilkommenInntektId}`);
    };
};

export const useActiveTilkommenInntektId = (): Maybe<string> => {
    const { tilkommenInntektId } = useParams<{ tilkommenInntektId?: string }>();

    return tilkommenInntektId !== undefined ? tilkommenInntektId : null;
};

export const useActivePeriodWithPerson = (person: PersonFragment): Maybe<ActivePeriod> => useActivePeriod(person);

export const useSelectPeriod = () => {
    const setActivePeriodId = useSetAtom(activePeriodIdState);
    return (person: PersonFragment) => {
        const periodToSelect = findPeriodToSelect(person);
        if (periodToSelect) {
            setActivePeriodId(periodToSelect.id);
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
