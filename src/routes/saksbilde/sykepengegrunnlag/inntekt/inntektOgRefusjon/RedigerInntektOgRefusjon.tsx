import React, { Dispatch, SetStateAction } from 'react';

import { PersonPencilIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

import { PopoverHjelpetekst } from '@components/PopoverHjelpetekst';
import { SortInfoikon } from '@components/ikoner/SortInfoikon';
import { ArbeidsgiverFragment, BeregnetPeriodeFragment, PersonFragment } from '@io/graphql';
import { useInntektKanRevurderes } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjon/inntektOgRefusjonUtils';
import {
    useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning,
    usePeriodForSkjæringstidspunktForArbeidsgiver,
} from '@state/arbeidsgiver';
import { isInCurrentGeneration } from '@state/selectors/period';
import { DateString } from '@typer/shared';

interface RedigerInntektProps {
    person: PersonFragment;
    setEditing: Dispatch<SetStateAction<boolean>>;
    skjæringstidspunkt: DateString;
    organisasjonsnummer: string;
    arbeidsgiver: ArbeidsgiverFragment;
}

export const RedigerInntektOgRefusjon = ({
    person,
    setEditing,
    skjæringstidspunkt,
    organisasjonsnummer,
    arbeidsgiver,
}: RedigerInntektProps) => {
    const periode = usePeriodForSkjæringstidspunktForArbeidsgiver(
        person,
        skjæringstidspunkt,
        organisasjonsnummer,
    ) as BeregnetPeriodeFragment;
    const kanRevurderes = useInntektKanRevurderes(person, skjæringstidspunkt);
    const erAktivPeriodeLikEllerFørPeriodeTilGodkjenning = useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning(person);

    if (!isInCurrentGeneration(periode, arbeidsgiver)) return null;

    return kanRevurderes ? (
        <Button onClick={() => setEditing(true)} size="xsmall" variant="secondary" icon={<PersonPencilIcon />}>
            Overstyr
        </Button>
    ) : (
        <PopoverHjelpetekst ikon={<SortInfoikon />}>
            <p>
                {!erAktivPeriodeLikEllerFørPeriodeTilGodkjenning
                    ? 'Perioden kan ikke overstyres fordi det finnes en oppgave på en tidligere periode'
                    : 'Det er ikke mulig å endre inntekt i denne perioden'}
            </p>
        </PopoverHjelpetekst>
    );
};
