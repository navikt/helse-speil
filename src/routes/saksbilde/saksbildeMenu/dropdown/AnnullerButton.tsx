import React, { ReactElement } from 'react';

import { ActionMenu } from '@navikt/ds-react';

import { ApiBeregnetPeriode, ApiUtbetalingstatus } from '@io/rest/generated/spesialist.schemas';
import { Inntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { useHarBeslutteroppgaveForSkjæringstidspunkt } from '@state/totrinnsvurdering';
import { isBeregnetPeriode } from '@utils/typeguards';

const kanAnnullere = (harBeslutteroppgavePåSykefraværet: boolean, harMinstEnUtbetaltPeriode: boolean): boolean => {
    return !harBeslutteroppgavePåSykefraværet && harMinstEnUtbetaltPeriode;
};

interface AnnullerButtonProps {
    periode: ApiBeregnetPeriode;
    inntektsforhold: Inntektsforhold;
    showModal: () => void;
}

export const AnnullerButton = ({ periode, inntektsforhold, showModal }: AnnullerButtonProps): ReactElement | null => {
    const harMinstEnUtbetaltPeriode =
        inntektsforhold.behandlinger
            .flatMap((it) => it.perioder)
            .filter(
                (it) =>
                    isBeregnetPeriode(it) &&
                    it.skjaeringstidspunkt === periode.skjaeringstidspunkt &&
                    it.utbetaling.vurdering?.godkjent === true &&
                    it.utbetaling.status !== ApiUtbetalingstatus.ANNULLERT,
            ).length !== 0;
    const harBeslutteroppgavePåSykefraværet = useHarBeslutteroppgaveForSkjæringstidspunkt(periode.skjaeringstidspunkt);

    if (!kanAnnullere(harBeslutteroppgavePåSykefraværet, harMinstEnUtbetaltPeriode)) {
        return null;
    }

    return (
        <ActionMenu.Item onSelect={showModal} className="text-ax-large">
            Annuller
        </ActionMenu.Item>
    );
};
