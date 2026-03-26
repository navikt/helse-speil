import React, { PropsWithChildren, ReactElement } from 'react';

import { BodyShort, Dialog, HStack, Heading, VStack } from '@navikt/ds-react';

import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { ApiOppgaveProjeksjonPaaVentInfo, ApiPersonnavn } from '@io/rest/generated/spesialist.schemas';
import { getFormattedDatetimeString, somNorskDato } from '@utils/date';
import { getFormatertNavn } from '@utils/string';

interface PåVentListeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    navn: ApiPersonnavn;
    påVentInfo: ApiOppgaveProjeksjonPaaVentInfo;
}

export function PåVentListeDialog({ open, onOpenChange, navn, påVentInfo }: PåVentListeDialogProps): ReactElement {
    const søkernavn = getFormatertNavn(navn);

    return (
        <Dialog open={open} onOpenChange={onOpenChange} aria-label="Legg på vent notater">
            <Dialog.Popup>
                <Dialog.Header>
                    <Dialog.Title>Lagt på vent</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                    <VStack gap="space-24">
                        <HStack gap="space-48">
                            <Innhold tittel="Søker" anonymize>
                                {søkernavn}
                            </Innhold>
                            <Innhold tittel="Dato">{getFormattedDatetimeString(påVentInfo.opprettet)}</Innhold>
                            <Innhold tittel="Frist">{somNorskDato(påVentInfo.tidsfrist)}</Innhold>
                            <Innhold tittel="Saksbehandler">{påVentInfo.saksbehandler}</Innhold>
                        </HStack>
                        {påVentInfo.arsaker.length > 0 && (
                            <VStack>
                                <Heading level="2" size="xsmall">
                                    Årsak
                                </Heading>
                                <ul>
                                    {påVentInfo.arsaker.map((årsak) => (
                                        <li key={årsak}>{årsak}</li>
                                    ))}
                                </ul>
                            </VStack>
                        )}
                        {!!påVentInfo.tekst && <Innhold tittel="Notat">{påVentInfo.tekst}</Innhold>}
                        {påVentInfo.kommentarer.length > 0 && (
                            <VStack>
                                <Heading level="2" size="xsmall">
                                    Kommentarer
                                </Heading>
                                {påVentInfo.kommentarer.map((kommentar) => (
                                    <HStack gap="space-24" wrap={false} key={kommentar.id}>
                                        <BodyShort className="whitespace-nowrap">
                                            {getFormattedDatetimeString(kommentar.opprettet)}
                                        </BodyShort>
                                        <BodyShort>{kommentar.tekst}</BodyShort>
                                    </HStack>
                                ))}
                            </VStack>
                        )}
                    </VStack>
                </Dialog.Body>
            </Dialog.Popup>
        </Dialog>
    );
}

interface InnholdProps {
    tittel: string;
    anonymize?: boolean;
}

function Innhold({ tittel, children, anonymize = false }: PropsWithChildren<InnholdProps>): ReactElement {
    return (
        <VStack>
            <Heading level="2" size="xsmall">
                {tittel}
            </Heading>
            {anonymize ? <AnonymizableText>{children}</AnonymizableText> : <BodyShort>{children}</BodyShort>}
        </VStack>
    );
}
