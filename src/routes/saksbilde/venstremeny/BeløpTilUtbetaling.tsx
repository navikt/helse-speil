import { useParams } from 'next/navigation';
import React from 'react';

import { BodyShort, HStack, Spacer, VStack } from '@navikt/ds-react';

import { Inntektsforholdnavn } from '@components/Inntektsforholdnavn';
import { Arbeidsgiverikon } from '@components/ikoner/Arbeidsgiverikon';
import { SykmeldtikonMedTooltip } from '@components/ikoner/SykmeldtikonMedTooltip';
import { useGetPerson } from '@io/rest/generated/personer/personer';
import { ApiSimulering, ApiUtbetaling, ApiUtbetalingstatus } from '@io/rest/generated/spesialist.schemas';
import { Inntektsforhold, tilReferanse } from '@state/inntektsforhold/inntektsforhold';
import { capitalizeName, somPenger } from '@utils/locale';
import { isArbeidsgiver } from '@utils/typeguards';

import { getFormattedName } from './personnavn';
import { OpenSimuleringButton } from './utbetaling/simulering/OpenSimuleringButton';

type BeløpTilUtbetalingProps = {
    utbetaling: ApiUtbetaling;
    arbeidsgiversimulering?: ApiSimulering | null;
    personsimulering?: ApiSimulering | null;
    periodePersonNettoBeløp: number;
    periodeArbeidsgiverNettoBeløp: number;
    inntektsforhold: Inntektsforhold;
};

export const BeløpTilUtbetaling = ({
    utbetaling,
    personsimulering,
    arbeidsgiversimulering,
    periodePersonNettoBeløp,
    periodeArbeidsgiverNettoBeløp,
    inntektsforhold,
}: BeløpTilUtbetalingProps) => {
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const { data: person } = useGetPerson(personPseudoId);

    return (
        <VStack gap="space-4">
            <HStack align="center" gap="space-16" className="[&>svg]:w-4">
                <BodyShort weight="semibold">
                    {utbetaling.status !== ApiUtbetalingstatus.UBETALT ? 'Utbetalt for perioden' : 'Beløp for perioden'}
                </BodyShort>
                <Spacer />
                <BodyShort weight="semibold">
                    {somPenger(periodePersonNettoBeløp + periodeArbeidsgiverNettoBeløp)}
                </BodyShort>
            </HStack>
            {isArbeidsgiver(inntektsforhold) && (
                <>
                    <HStack align="center" gap="space-16" className="[&>svg]:w-4">
                        <Arbeidsgiverikon />
                        <Inntektsforholdnavn
                            inntektsforholdReferanse={tilReferanse(inntektsforhold)}
                            maxWidth="200px"
                        />
                        <Spacer />
                        <BodyShort>{somPenger(periodeArbeidsgiverNettoBeløp)}</BodyShort>
                    </HStack>
                    {arbeidsgiversimulering && isSimulering(arbeidsgiversimulering) && (
                        <OpenSimuleringButton
                            simulering={arbeidsgiversimulering}
                            utbetaling={utbetaling}
                            className="mb-1 ml-8 w-max"
                        />
                    )}
                </>
            )}
            <HStack align="center" gap="space-16" wrap={false} className="[&>svg]:w-4">
                <SykmeldtikonMedTooltip />
                <BodyShort truncate data-sensitive>
                    {person && capitalizeName(getFormattedName(person))}
                </BodyShort>
                <Spacer />
                <BodyShort className="whitespace-nowrap">{somPenger(periodePersonNettoBeløp)}</BodyShort>
            </HStack>
            {personsimulering && isSimulering(personsimulering) && (
                <OpenSimuleringButton
                    simulering={personsimulering}
                    utbetaling={utbetaling}
                    className="mb-1 ml-8 w-max"
                />
            )}
        </VStack>
    );
};

const isSimulering = (simulering?: ApiSimulering | null): simulering is ApiSimulering => {
    return Array.isArray(simulering?.perioder);
};
