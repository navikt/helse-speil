import NextLink from 'next/link';
import { ReactElement } from 'react';

import { PlusIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

import { VisHvisSkrivetilgang } from '@components/VisHvisSkrivetilgang';
import { useHarTotrinnsvurdering } from '@hooks/useHarTotrinnsvurdering';
import { PersonFragment } from '@io/graphql';
import { kanSeAndreYtelser } from '@utils/featureToggles';

interface TilkommenInntektKnappProps {
    person: PersonFragment;
    personPseudoId: string;
    kanLeggeTilTilkommenInntekt: boolean;
}

export function TilkommenInntektKnapp({
    person,
    personPseudoId,
    kanLeggeTilTilkommenInntekt,
}: TilkommenInntektKnappProps): ReactElement {
    const erBeslutteroppgave = useHarTotrinnsvurdering(person);
    return (
        <div className="absolute bottom-4 left-6">
            <VisHvisSkrivetilgang>
                {kanLeggeTilTilkommenInntekt && !erBeslutteroppgave && (
                    <Button
                        as={NextLink}
                        variant="tertiary"
                        size="small"
                        style={{ marginLeft: '-0.5rem' }}
                        icon={<PlusIcon title="Legg til tilkommen inntekt" />}
                        href={
                            kanSeAndreYtelser
                                ? `/person/${personPseudoId}/leggtilperiode`
                                : `/person/${personPseudoId}/tilkommeninntekt/ny`
                        }
                    >
                        Legg til tilkommen inntekt/periode
                    </Button>
                )}
            </VisHvisSkrivetilgang>
        </div>
    );
}
