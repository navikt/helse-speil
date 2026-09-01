import NextLink from 'next/link';
import { ReactElement } from 'react';

import { PlusIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

import { VisHvisSkrivetilgang } from '@components/VisHvisSkrivetilgang';
import { useHarTotrinnsvurdering } from '@hooks/useHarTotrinnsvurdering';
import { PersonFragment } from '@io/graphql';

interface LeggTilPeriodeKnappProps {
    person: PersonFragment;
    personPseudoId: string;
    kanLeggeTilPeriode: boolean;
}

export function LeggTilPeriodeKnapp({
    person,
    personPseudoId,
    kanLeggeTilPeriode,
}: LeggTilPeriodeKnappProps): ReactElement {
    const erBeslutteroppgave = useHarTotrinnsvurdering(person);
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
                        Legg til tilkommen inntekt/annen ytelse
                    </Button>
                )}
            </VisHvisSkrivetilgang>
        </div>
    );
}
