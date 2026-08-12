import React, { ReactElement, ReactNode } from 'react';

import { InformationSquareIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Dialog, HStack, Heading, Table, VStack } from '@navikt/ds-react';

import {
    ApiEkskluderingsårsak,
    ApiEkskludertForsikring,
    ApiForsikring,
    ApiForsikringsvurdering,
} from '@io/rest/generated/spesialist.schemas';
import { somNorskDato } from '@utils/date';

export const ForsikringDialog = ({
    forsikringsvurdering,
    dekningstekst,
}: {
    forsikringsvurdering: ApiForsikringsvurdering;
    dekningstekst: string;
}): ReactElement => {
    const { forsikringInnhold, gjeldendeForsikring, ekskluderteForsikringer } = forsikringsvurdering;

    return (
        <Dialog>
            <Dialog.Trigger>
                <Button
                    variant="tertiary"
                    size="small"
                    className="px-0 font-normal"
                    icon={<InformationSquareIcon aria-hidden />}
                    iconPosition="right"
                >
                    {dekningstekst}
                </Button>
            </Dialog.Trigger>
            <Dialog.Popup width="large">
                <Dialog.Header>
                    <Dialog.Title>Forsikring</Dialog.Title>
                    <Dialog.Description>Opplysninger fra forsikringsvurderingen</Dialog.Description>
                </Dialog.Header>
                <Dialog.Body>
                    <VStack gap="space-24">
                        <VStack gap="space-8">
                            <Heading level="2" size="xsmall">
                                Dekning brukt i beregningen
                            </Heading>
                            {forsikringInnhold ? (
                                <HStack gap="space-48">
                                    <Opplysning tittel="Dekningsgrad">{forsikringInnhold.dekningsgrad} %</Opplysning>
                                    <Opplysning tittel="Gjelder fra dag">{forsikringInnhold.gjelderFraDag}</Opplysning>
                                </HStack>
                            ) : (
                                <BodyShort>Ingen forsikring lagt til grunn</BodyShort>
                            )}
                        </VStack>
                        <VStack gap="space-8">
                            <Heading level="2" size="xsmall">
                                Gjeldende forsikring
                            </Heading>
                            {gjeldendeForsikring ? (
                                <ForsikringTabell forsikringer={[gjeldendeForsikring]} />
                            ) : (
                                <BodyShort>Ingen gjeldende forsikring</BodyShort>
                            )}
                        </VStack>
                        <VStack gap="space-8">
                            <Heading level="2" size="xsmall">
                                Ekskluderte forsikringer
                            </Heading>
                            {ekskluderteForsikringer.length > 0 ? (
                                <ForsikringTabell forsikringer={ekskluderteForsikringer} visEkskluderingsårsak />
                            ) : (
                                <BodyShort>Ingen ekskluderte forsikringer</BodyShort>
                            )}
                        </VStack>
                    </VStack>
                </Dialog.Body>
                <Dialog.Footer>
                    <Dialog.CloseTrigger>
                        <Button variant="secondary">Lukk</Button>
                    </Dialog.CloseTrigger>
                </Dialog.Footer>
            </Dialog.Popup>
        </Dialog>
    );
};

const ForsikringTabell = ({
    forsikringer,
    visEkskluderingsårsak = false,
}: {
    forsikringer: (ApiForsikring | ApiEkskludertForsikring)[];
    visEkskluderingsårsak?: boolean;
}): ReactElement => (
    <Table size="small" zebraStripes>
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell scope="col">Virkningsdato</Table.HeaderCell>
                <Table.HeaderCell scope="col">Opphørsdato</Table.HeaderCell>
                <Table.HeaderCell scope="col">Dekningsgrad</Table.HeaderCell>
                <Table.HeaderCell scope="col">Dekning i ventetid</Table.HeaderCell>
                {visEkskluderingsårsak && <Table.HeaderCell scope="col">Årsak til ekskludering</Table.HeaderCell>}
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {forsikringer.map((forsikring, index) => (
                <Table.Row key={`${forsikring.virkningsdato}-${index}`}>
                    <Table.DataCell>{somNorskDato(forsikring.virkningsdato)}</Table.DataCell>
                    <Table.DataCell>{somNorskDato(forsikring.opphørsdato ?? undefined) ?? '–'}</Table.DataCell>
                    <Table.DataCell>{forsikring.dekningsgrad} %</Table.DataCell>
                    <Table.DataCell>{forsikring.dekningIVentetid ? 'Ja' : 'Nei'}</Table.DataCell>
                    {visEkskluderingsårsak && (
                        <Table.DataCell>
                            {'ekskluderingsårsak' in forsikring
                                ? somEkskluderingsårsak(forsikring.ekskluderingsårsak)
                                : '–'}
                        </Table.DataCell>
                    )}
                </Table.Row>
            ))}
        </Table.Body>
    </Table>
);

const Opplysning = ({ tittel, children }: { tittel: string; children: ReactNode }): ReactElement => (
    <VStack>
        <BodyShort size="small" className="text-ax-text-neutral-subtle">
            {tittel}
        </BodyShort>
        <BodyShort>{children}</BodyShort>
    </VStack>
);

export const somEkskluderingsårsak = (årsak: ApiEkskluderingsårsak): string => {
    switch (årsak) {
        case ApiEkskluderingsårsak.SKJÆRINGSTIDSPUNKT_INNEN_28_DAGER_FØR_VIRKNINGSDATO:
            return 'Skjæringstidspunkt innen 28 dager før virkningsdato';
        case ApiEkskluderingsårsak.SKJÆRINGSTIDSPUNKT_MER_ENN_28_DAGER_FØR_VIRKNINGSDATO:
            return 'Skjæringstidspunkt mer enn 28 dager før virkningsdato';
        case ApiEkskluderingsårsak.OPPHØRT_PÅ_SKJÆRINGSTIDSPUNKT:
            return 'Opphørt på skjæringstidspunkt';
        case ApiEkskluderingsårsak.ALDRI_BETALT:
            return 'Aldri betalt';
    }
};
