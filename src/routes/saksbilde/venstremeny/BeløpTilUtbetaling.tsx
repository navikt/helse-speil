import React from 'react';

import { BodyShort, HStack, Spacer, VStack } from '@navikt/ds-react';

import { Inntektsforholdnavn } from '@components/Inntektsforholdnavn';
import { AnonymizableTextWithEllipsis } from '@components/anonymizable/AnonymizableText';
import { Arbeidsgiverikon } from '@components/ikoner/Arbeidsgiverikon';
import { SykmeldtikonMedTooltip } from '@components/ikoner/SykmeldtikonMedTooltip';
import { Personinfo, Simulering, Utbetaling, Utbetalingstatus } from '@io/graphql';
import { Inntektsforhold, tilReferanse } from '@state/inntektsforhold/inntektsforhold';
import { capitalizeName, somPenger } from '@utils/locale';
import { isArbeidsgiver } from '@utils/typeguards';

import { OpenSimuleringButton } from './utbetaling/simulering/OpenSimuleringButton';

type BeløpTilUtbetalingProps = {
    utbetaling: Utbetaling;
    personinfo: Personinfo;
    arbeidsgiversimulering?: Simulering | null;
    personsimulering?: Simulering | null;
    periodePersonNettoBeløp: number;
    periodeArbeidsgiverNettoBeløp: number;
    inntektsforhold: Inntektsforhold;
};

export const BeløpTilUtbetaling = ({
    utbetaling,
    personinfo,
    personsimulering,
    arbeidsgiversimulering,
    periodePersonNettoBeløp,
    periodeArbeidsgiverNettoBeløp,
    inntektsforhold,
}: BeløpTilUtbetalingProps) => (
    <VStack gap="space-4">
        <HStack align="center" gap="space-16" className="[&>svg]:w-4">
            <BodyShort weight="semibold">
                {utbetaling.status !== Utbetalingstatus.Ubetalt ? 'Utbetalt for perioden' : 'Beløp for perioden'}
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
                    <Inntektsforholdnavn inntektsforholdReferanse={tilReferanse(inntektsforhold)} maxWidth="200px" />
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
            <AnonymizableTextWithEllipsis>{capitalizeName(getFormattedName(personinfo))}</AnonymizableTextWithEllipsis>
            <Spacer />
            <BodyShort className="whitespace-nowrap">{somPenger(periodePersonNettoBeløp)}</BodyShort>
        </HStack>
        {personsimulering && isSimulering(personsimulering) && (
            <OpenSimuleringButton simulering={personsimulering} utbetaling={utbetaling} className="mb-1 ml-8 w-max" />
        )}
    </VStack>
);

const getFormattedName = (personinfo: Personinfo): string => {
    return `${personinfo.fornavn} ${
        personinfo.mellomnavn ? `${personinfo.mellomnavn} ${personinfo.etternavn}` : personinfo.etternavn
    }`;
};

const isSimulering = (simulering?: Simulering | null): simulering is Simulering => {
    return Array.isArray(simulering?.perioder);
};
