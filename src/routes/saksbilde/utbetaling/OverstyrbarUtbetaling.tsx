import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { VStack } from '@navikt/ds-react';

import { OverstyringFormFields, lagOverstyringSchema } from '@form-schemas/overstyringSkjema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    ApiBeregnetPeriode,
    ApiSaksbildePerson,
    ApiUberegnetPeriode,
    ApiUtbetalingstatus,
} from '@io/rest/generated/spesialist.schemas';
import { kanStrekkes } from '@saksbilde/historikk/mapping';
import { OverstyringToolBar } from '@saksbilde/utbetaling/OverstyringToolBar';
import { LeggTilDagerForm } from '@saksbilde/utbetaling/utbetalingstabell/LeggTilDagerForm';
import { Endringshandling, UtbetalingHeader } from '@saksbilde/utbetaling/utbetalingstabell/UtbetalingHeader';
import { EndreDagerForm } from '@saksbilde/utbetaling/utbetalingstabell/endringForm/EndreDagerForm';
import { GraderteAndreYtelserForm } from '@saksbilde/utbetaling/utbetalingstabell/endringForm/GraderteAndreYtelserForm';
import type { Dagendring } from '@saksbilde/utbetaling/utbetalingstabell/endringForm/types';
import { finnGraderteAndreYtelser, useGraderteAndreYtelser } from '@state/graderteAndreYtelser';
import { Inntektsforhold, tilReferanse } from '@state/inntektsforhold/inntektsforhold';
import { useKanVurdereOppholdskrav } from '@state/toggles';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';
import { cn } from '@utils/tw';
import { isBeregnetPeriode, isSelvstendigNaering } from '@utils/typeguards';

import { MarkerAlleDagerCheckbox } from './utbetalingstabell/MarkerAlleDagerCheckbox';
import { OverstyringForm } from './utbetalingstabell/OverstyringForm';
import { RadmarkeringCheckbox } from './utbetalingstabell/RadmarkeringCheckbox';
import { Utbetalingstabell } from './utbetalingstabell/Utbetalingstabell';
import { useDagendringer } from './utbetalingstabell/useDagendringer';
import { useOverstyrDager } from './utbetalingstabell/useOverstyrDager';

interface OverstyrbarUtbetalingProps {
    person: ApiSaksbildePerson;
    inntektsforhold: Inntektsforhold;
    dager: Map<string, Utbetalingstabelldag>;
    periode: ApiBeregnetPeriode | ApiUberegnetPeriode;
}

export function OverstyrbarUtbetaling({
    person,
    inntektsforhold,
    dager,
    periode,
}: OverstyrbarUtbetalingProps): ReactElement {
    const aktuellPeriode = useRef(periode);

    const [endringshandling, setEndringshandling] = useState<Endringshandling | null>(null);
    const [vurdererOppholdskrav, setVurdererOppholdskrav] = useState(false);
    const kanVurdereOppholdskrav = useKanVurdereOppholdskrav();
    const overstyrer = endringshandling !== null;
    const markererDager = endringshandling === 'Endre dagtype' || endringshandling === 'Legg til graderte ytelser';
    const fordelerGraderteYtelser = endringshandling === 'Legg til graderte ytelser';

    const { postOverstyring, error, done } = useOverstyrDager();
    const graderteAndreYtelser = finnGraderteAndreYtelser(useGraderteAndreYtelser(), inntektsforhold);
    const lagredeGraderteDager = graderteAndreYtelser?.dager ?? [];

    const {
        markerteDager,
        setMarkerteDager,
        overstyrteDager,
        overstyrMarkerteDager,
        nyeDager,
        leggTilNyeDager,
        markerDag,
        markerDagerTil,
        slettSisteNyeDag,
        fjernNyeOgOverstyrteDager,
        fjernAlleDager,
    } = useDagendringer();

    if (aktuellPeriode.current.id !== periode.id) {
        lukkEndringshandling();
        aktuellPeriode.current = periode;
    }

    const alleDager = new Map<string, Utbetalingstabelldag>([...nyeDager, ...dager]);
    const alleOverstyrteDager = new Map<string, Utbetalingstabelldag>([...nyeDager, ...overstyrteDager]);
    const harUsendteEndringer = alleOverstyrteDager.size > 0;
    const viserOppholdskravSkjema = vurdererOppholdskrav && !harUsendteEndringer;

    const form = useForm<OverstyringFormFields>({
        mode: 'onBlur',
        shouldFocusError: false,
        resolver: zodResolver(
            // Hver fordeling har begrunnelsen til klyngen sin, så den felles begrunnelsen gjelder bare vanlige endringer
            lagOverstyringSchema(
                alleOverstyrteDager,
                alleDager,
                isSelvstendigNaering(inntektsforhold),
                !fordelerGraderteYtelser,
            ),
        ),
        defaultValues: { begrunnelse: '' },
    });

    const onSubmitOverstyring = (values: OverstyringFormFields) => {
        void postOverstyring(
            Array.from(alleDager.values()),
            Array.from(alleOverstyrteDager.values()),
            values.begrunnelse,
            periode,
            inntektsforhold,
            lukkEndringshandling,
        );
    };

    const avbryt = () => {
        fjernAlleDager();
        form.reset();
        lukkEndringshandling();
    };

    function lukkEndringshandling() {
        setEndringshandling(null);
        setVurdererOppholdskrav(false);
    }

    const toggleChecked = (dag: Utbetalingstabelldag) => (event: React.ChangeEvent<HTMLInputElement>) => {
        if ((event.nativeEvent as KeyboardEvent)?.shiftKey) {
            markerDagerTil(dag, alleDager, event.target.checked);
        } else {
            markerDag(dag, event.target.checked);
        }
    };

    const onSubmitEndring = (endring: Dagendring) => {
        overstyrMarkerteDager(endring, lagredeGraderteDager);
    };

    useEffect(() => {
        if (done) {
            fjernNyeOgOverstyrteDager();
            form.reset();
        }
    }, [done, fjernNyeOgOverstyrteDager, form]);

    const periodeFom = Array.from(alleDager.values())[0];
    if (periodeFom == undefined) return <></>;

    return (
        <VStack
            as="section"
            gap="space-16"
            paddingBlock={overstyrer ? 'space-16 space-64' : 'space-0 space-64'}
            className={cn('relative h-full', overstyrer && 'h-max overflow-y-hidden bg-ax-bg-info-soft pr-8 pl-0')}
            data-testid="utbetaling"
        >
            {!overstyrer && (
                <UtbetalingHeader
                    periodeErForkastet={
                        isBeregnetPeriode(periode) && periode.utbetaling.status === ApiUtbetalingstatus.FORKASTET
                    }
                    velgEndringshandling={setEndringshandling}
                    kanLeggeTilDager={kanStrekkes(periode, inntektsforhold)}
                    inntektsforholdReferanse={tilReferanse(inntektsforhold)}
                />
            )}
            <VStack
                gap="space-16"
                className={cn(overstyrer && '-mt-4 pt-4 inset-shadow-[3px_0px] inset-shadow-ax-border-accent-strong')}
            >
                {overstyrer && (
                    <OverstyringToolBar tittel={endringshandling} avbryt={avbryt}>
                        {endringshandling === 'Legg til dager' && (
                            <LeggTilDagerForm
                                onSubmitPølsestrekk={leggTilNyeDager}
                                periodeFom={periodeFom.dato}
                                erSelvstendig={isSelvstendigNaering(inntektsforhold)}
                            />
                        )}
                    </OverstyringToolBar>
                )}
                <VStack gap="space-32" className="relative mb-4 h-full">
                    <Utbetalingstabell
                        fom={periode.fom}
                        tom={periode.tom}
                        dager={alleDager}
                        lokaleOverstyringer={alleOverstyrteDager}
                        markerteDager={markerteDager}
                        overstyrer={overstyrer}
                        harRadmarkering={markererDager}
                        slettSisteNyeDag={slettSisteNyeDag}
                        person={person}
                        erSelvstendigNæring={isSelvstendigNaering(inntektsforhold)}
                        graderteAndreYtelser={graderteAndreYtelser}
                    />
                    {markererDager && (
                        <VStack className="absolute top-17 left-4">
                            <MarkerAlleDagerCheckbox
                                alleDager={alleDager}
                                markerteDager={markerteDager}
                                setMarkerteDager={setMarkerteDager}
                            />
                            {Array.from(alleDager.values()).map((dag, i) => (
                                <RadmarkeringCheckbox
                                    key={i}
                                    index={i}
                                    onChange={toggleChecked(dag)}
                                    checked={markerteDager.get(dag.dato) !== undefined}
                                />
                            ))}
                        </VStack>
                    )}
                    {endringshandling === 'Endre dagtype' && (
                        <EndreDagerForm
                            markerteDager={markerteDager}
                            onSubmitEndring={onSubmitEndring}
                            erSelvstendig={isSelvstendigNaering(inntektsforhold)}
                            oppholdskrav={
                                kanVurdereOppholdskrav
                                    ? {
                                          behandlingId: periode.behandlingId,
                                          vurderer: vurdererOppholdskrav,
                                          harUsendteEndringer,
                                          onVurderer: setVurdererOppholdskrav,
                                          onAvsluttet: avbryt,
                                      }
                                    : undefined
                            }
                        />
                    )}
                    {endringshandling === 'Legg til graderte ytelser' && (
                        <GraderteAndreYtelserForm markerteDager={markerteDager} onSubmitEndring={onSubmitEndring} />
                    )}
                    {overstyrer && !viserOppholdskravSkjema && (
                        <FormProvider {...form}>
                            <form onSubmit={form.handleSubmit(onSubmitOverstyring)} autoComplete="off">
                                <OverstyringForm
                                    overstyrteDager={alleOverstyrteDager}
                                    error={error}
                                    toggleOverstyring={avbryt}
                                    fordelerGraderteYtelser={fordelerGraderteYtelser}
                                />
                            </form>
                        </FormProvider>
                    )}
                </VStack>
            </VStack>
        </VStack>
    );
}
