import NextLink from 'next/link';
import { ReactElement } from 'react';

import { PlusIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

import { VisHvisSkrivetilgang } from '@components/VisHvisSkrivetilgang';
import { Inntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { useHarBeslutteroppgave } from '@state/totrinnsvurdering';
import { kanLeggeTilTilkommenInntekt } from '@utils/featureToggles';
import { isSelvstendigNaering } from '@utils/typeguards';

interface LeggTilPeriodeKnappProps {
    personPseudoId: string;
    inntektsforhold: Inntektsforhold[];
}

export function LeggTilPeriodeKnapp({ personPseudoId, inntektsforhold }: LeggTilPeriodeKnappProps): ReactElement {
    const kanLeggeTilPeriode = kanLeggeTilTilkommenInntekt(inntektsforhold.some(isSelvstendigNaering));
    const erBeslutteroppgave = useHarBeslutteroppgave();

    return (
        <div className="absolute bottom-4 left-6">
            <VisHvisSkrivetilgang>
                {kanLeggeTilPeriode && !erBeslutteroppgave && (
                    <Button
                        as={NextLink}
                        variant="tertiary"
                        size="small"
                        style={{ marginLeft: '-0.5rem' }}
                        icon={<PlusIcon aria-hidden />}
                        href={`/person/${personPseudoId}/leggtil`}
                    >
                        Legg til tilkommen inntekt
                    </Button>
                )}
            </VisHvisSkrivetilgang>
        </div>
    );
}
