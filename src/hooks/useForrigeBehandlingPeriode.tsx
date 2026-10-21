import { ApiBeregnetPeriode, ApiSaksbildePerson } from '@io/rest/generated/spesialist.schemas';
import { finnBehandlingerForAktivPeriode } from '@state/inntektsforhold/inntektsforhold';
import { isBeregnetPeriode } from '@utils/typeguards';

export const useForrigeBehandlingPeriodeMedPeriode = (periode: ApiBeregnetPeriode, person: ApiSaksbildePerson) => {
    const behandlinger = finnBehandlingerForAktivPeriode(periode, person);

    const aktuellBehandling = behandlinger.findIndex((behandling) =>
        behandling.perioder.some((_periode) => isBeregnetPeriode(_periode) && _periode.id === periode.id),
    );

    if (aktuellBehandling === undefined || !isBeregnetPeriode(periode)) {
        return null;
    }

    return behandlinger[aktuellBehandling + 1]?.perioder.find(
        (_periode) => _periode.vedtaksperiodeId === periode.vedtaksperiodeId,
    );
};
