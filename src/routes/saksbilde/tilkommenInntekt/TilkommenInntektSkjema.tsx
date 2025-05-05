import dayjs from 'dayjs';
import React, { ReactElement } from 'react';
import { useForm } from 'react-hook-form';

import { Alert, HStack } from '@navikt/ds-react';

import { TilkommenInntektSchema, lagTilkommenInntektSchema } from '@/form-schemas';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { zodResolver } from '@hookform/resolvers/zod';
import { GhostPeriodeFragment, PeriodeFragment, PersonFragment, TilkommenInntektskilde } from '@io/graphql';
import { TilkommenInntektSkjemaTabell } from '@saksbilde/tilkommenInntekt/TilkommenInntektSkjemaTabell';
import { TilkommenInntektSkjemafelter } from '@saksbilde/tilkommenInntekt/TilkommenInntektSkjemafelter';
import {
    filtrerDager,
    lagDatoIntervall,
    lagEksisterendePerioder,
    utledSykefraværstilfeller,
} from '@saksbilde/tilkommenInntekt/tilkommenInntektUtils';
import { DateString } from '@typer/shared';
import { erGyldigDato } from '@utils/date';

interface TilkommenInntektProps {
    person: PersonFragment;
    periode: PeriodeFragment | GhostPeriodeFragment;
    tilkommeneInntektskilder: TilkommenInntektskilde[];
}

export const TilkommenInntektSkjema = ({
    person,
    periode,
    tilkommeneInntektskilder,
}: TilkommenInntektProps): ReactElement => {
    const [dagerSomSkalEkskluderes, setdagerSomSkalEkskluderes] = React.useState<DateString[]>([]);

    const sykefraværstilfeller = utledSykefraværstilfeller(person);
    const eksisterendePerioder = lagEksisterendePerioder(tilkommeneInntektskilder);
    const form = useForm<TilkommenInntektSchema>({
        resolver: zodResolver(lagTilkommenInntektSchema(sykefraværstilfeller, eksisterendePerioder)),
        defaultValues: {
            organisasjonsnummer: '',
            fom: '',
            tom: '',
            periodebeløp: 0,
            notat: '',
        },
    });
    const fom = form.watch('fom');
    const tom = form.watch('tom');
    const datoIntervall = lagDatoIntervall(fom, tom);

    const defaultFom = dayjs(periode.fom).toDate();
    const defaultTom = dayjs(periode.tom).toDate();

    const dagerTilGradering = filtrerDager(datoIntervall, dagerSomSkalEkskluderes);

    return (
        <ErrorBoundary fallback={<TilkommenInntektError />}>
            <HStack wrap={false}>
                <TilkommenInntektSkjemafelter
                    form={form}
                    dagerTilFordeling={dagerTilGradering.length}
                    defaultFom={defaultFom}
                    defaultTom={defaultTom}
                />
                {erGyldigDato(fom) && erGyldigDato(tom) && (
                    <TilkommenInntektSkjemaTabell
                        arbeidsgivere={person.arbeidsgivere}
                        fom={fom}
                        tom={tom}
                        setDagerSomSkalEkskluderes={setdagerSomSkalEkskluderes}
                    />
                )}
            </HStack>
        </ErrorBoundary>
    );
};

const TilkommenInntektError = (): ReactElement => (
    <Alert variant="error" size="small">
        Noe gikk galt. Kan ikke vise tilkommen inntekt for denne perioden.
    </Alert>
);
