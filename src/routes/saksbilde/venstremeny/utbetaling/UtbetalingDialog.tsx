import { ReactElement } from 'react';

import { BodyShort, Button, Dialog, ErrorMessage, HStack, Spacer, VStack } from '@navikt/ds-react';

import { Inntektsforholdnavn } from '@components/Inntektsforholdnavn';
import { AnonymizableTextWithEllipsis } from '@components/anonymizable/AnonymizableText';
import { Arbeidsgiverikon } from '@components/ikoner/Arbeidsgiverikon';
import { SykmeldtikonMedTooltip } from '@components/ikoner/SykmeldtikonMedTooltip';
import { Personinfo, Utbetaling, Utbetalingstatus } from '@io/graphql';
import { InntektsforholdReferanse } from '@state/inntektsforhold/inntektsforhold';
import { capitalizeName, somPenger } from '@utils/locale';

type UtbetalingDialogProps = {
    open: boolean;
    isSending: boolean;
    onApprove: () => void;
    onOpenChange: (open: boolean) => void;
    error: BackendFeil | null;
    totrinnsvurdering: boolean;
    utbetaling?: Utbetaling;
    inntektsforholdReferanse: InntektsforholdReferanse;
    personinfo?: Personinfo;
};

export type BackendFeil = {
    message: string;
};

export function UtbetalingDialog({
    open,
    isSending,
    onApprove,
    onOpenChange,
    error,
    totrinnsvurdering,
    utbetaling,
    inntektsforholdReferanse,
    personinfo,
}: UtbetalingDialogProps): ReactElement {
    return (
        <Dialog open={open} onOpenChange={onOpenChange} aria-label="Utbetaling dialog">
            <Dialog.Popup width="small">
                <Dialog.Header>
                    <Dialog.Title>Er du sikker?</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body className="flex flex-col gap-8">
                    {utbetaling && personinfo && (
                        <TilUtbetaling
                            utbetaling={utbetaling}
                            inntektsforholdReferanse={inntektsforholdReferanse}
                            personinfo={personinfo}
                        />
                    )}
                    <BodyShort>
                        Når du trykker ja{' '}
                        {totrinnsvurdering
                            ? 'sendes oppgaven til beslutter for godkjenning.'
                            : 'blir utbetalingen sendt til oppdragsystemet.'}
                    </BodyShort>
                </Dialog.Body>
                <Dialog.Footer>
                    <Button variant="tertiary" type="button" onClick={() => onOpenChange(false)} disabled={isSending}>
                        Avbryt
                    </Button>
                    <Button variant="primary" type="button" loading={isSending} onClick={onApprove}>
                        Ja
                    </Button>
                </Dialog.Footer>
                {error && <ErrorMessage className="px-6 pb-4">{error.message ?? 'En feil har oppstått.'}</ErrorMessage>}
            </Dialog.Popup>
        </Dialog>
    );
}

type TilUtbetalingProps = {
    utbetaling: Utbetaling;
    inntektsforholdReferanse: InntektsforholdReferanse;
    personinfo: Personinfo;
};

function TilUtbetaling({ utbetaling, inntektsforholdReferanse, personinfo }: TilUtbetalingProps): ReactElement {
    return (
        <VStack gap="space-4">
            <HStack align="center" gap="space-16" className="[&>svg]:w-4">
                <BodyShort weight="semibold">
                    {utbetaling.status !== Utbetalingstatus.Ubetalt ? 'Utbetalt beløp' : 'Beløp til utbetaling'}
                </BodyShort>
                <Spacer />
                <BodyShort weight="semibold">
                    {somPenger(utbetaling.arbeidsgiverNettoBelop + utbetaling.personNettoBelop)}
                </BodyShort>
            </HStack>
            {inntektsforholdReferanse.type === 'Arbeidsgiver' && (
                <HStack align="center" gap="space-16" className="[&>svg]:w-4">
                    <Arbeidsgiverikon />
                    <Inntektsforholdnavn inntektsforholdReferanse={inntektsforholdReferanse} />
                    <Spacer />
                    <BodyShort>{somPenger(utbetaling.arbeidsgiverNettoBelop)}</BodyShort>
                </HStack>
            )}
            <HStack align="center" gap="space-16" className="[&>svg]:w-4">
                <SykmeldtikonMedTooltip />
                <AnonymizableTextWithEllipsis>
                    {capitalizeName(getFormattedName(personinfo))}
                </AnonymizableTextWithEllipsis>
                <Spacer />
                <BodyShort>{somPenger(utbetaling.personNettoBelop)}</BodyShort>
            </HStack>
        </VStack>
    );
}

function getFormattedName(personinfo: Personinfo): string {
    return `${personinfo.fornavn} ${
        personinfo.mellomnavn ? `${personinfo.mellomnavn} ${personinfo.etternavn}` : personinfo.etternavn
    }`;
}
