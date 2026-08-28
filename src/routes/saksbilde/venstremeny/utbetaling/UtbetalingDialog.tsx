import { useParams } from 'next/navigation';
import { ReactElement } from 'react';

import { BodyShort, Button, Dialog, ErrorMessage, HStack, Spacer, VStack } from '@navikt/ds-react';

import { Inntektsforholdnavn } from '@components/Inntektsforholdnavn';
import { AnonymizableTextWithEllipsis } from '@components/anonymizable/AnonymizableText';
import { Arbeidsgiverikon } from '@components/ikoner/Arbeidsgiverikon';
import { SykmeldtikonMedTooltip } from '@components/ikoner/SykmeldtikonMedTooltip';
import { Utbetaling, Utbetalingstatus } from '@io/graphql';
import { useGetPerson } from '@io/rest/generated/personer/personer';
import { ApiPerson } from '@io/rest/generated/spesialist.schemas';
import { getFormattedName } from '@saksbilde/venstremeny/personnavn';
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
}: UtbetalingDialogProps): ReactElement {
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const { data: person } = useGetPerson(personPseudoId);

    return (
        <Dialog open={open} onOpenChange={onOpenChange} aria-label="Utbetaling dialog">
            <Dialog.Popup width="small">
                <Dialog.Header>
                    <Dialog.Title>Er du sikker?</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body className="flex flex-col gap-8">
                    {utbetaling && person && (
                        <TilUtbetaling
                            utbetaling={utbetaling}
                            inntektsforholdReferanse={inntektsforholdReferanse}
                            person={person}
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
    person: ApiPerson;
};

function TilUtbetaling({ utbetaling, inntektsforholdReferanse, person }: TilUtbetalingProps): ReactElement {
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
                <AnonymizableTextWithEllipsis>{capitalizeName(getFormattedName(person))}</AnonymizableTextWithEllipsis>
                <Spacer />
                <BodyShort>{somPenger(utbetaling.personNettoBelop)}</BodyShort>
            </HStack>
        </VStack>
    );
}
