import React, { ReactElement, ReactNode } from 'react';

import { InformationSquareIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Dialog, HStack, Heading, Table, VStack } from '@navikt/ds-react';

import { LovdataLenke } from '@components/LovdataLenke';
import {
    ApiEkskludertForsikring,
    ApiFolketrygdlovenreferanse,
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
                                <ForsikringTabell forsikringer={ekskluderteForsikringer} visEkskluderingsbegrunnelse />
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
    visEkskluderingsbegrunnelse = false,
}: {
    forsikringer: (ApiForsikring | ApiEkskludertForsikring)[];
    visEkskluderingsbegrunnelse?: boolean;
}): ReactElement => (
    <Table size="small" zebraStripes>
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell scope="col">Type</Table.HeaderCell>
                <Table.HeaderCell scope="col">Gjelder fra</Table.HeaderCell>
                <Table.HeaderCell scope="col">Opphører</Table.HeaderCell>
                {visEkskluderingsbegrunnelse && <Table.HeaderCell scope="col">Årsak</Table.HeaderCell>}
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {forsikringer.map((forsikring, index) => (
                <Table.Row key={`${forsikring.virkningsdato}-${index}`}>
                    <Table.DataCell>
                        {forsikring.navn} (<FolketrygdlovenLenke referanse={forsikring.folketrygdlovenreferanse} />)
                    </Table.DataCell>
                    <Table.DataCell>{somNorskDato(forsikring.virkningsdato)}</Table.DataCell>
                    <Table.DataCell>{somNorskDato(forsikring.opphørsdato ?? undefined) ?? '–'}</Table.DataCell>
                    {visEkskluderingsbegrunnelse && (
                        <Table.DataCell>
                            {'ekskluderingsbegrunnelse' in forsikring ? (
                                <>
                                    {forsikring.ekskluderingsbegrunnelse.forklaring}
                                    {forsikring.ekskluderingsbegrunnelse.folketrygdlovenreferanse !== null && (
                                        <>
                                            {' '}
                                            (
                                            <FolketrygdlovenLenke
                                                referanse={forsikring.ekskluderingsbegrunnelse.folketrygdlovenreferanse}
                                            />
                                            )
                                        </>
                                    )}
                                </>
                            ) : (
                                '–'
                            )}
                        </Table.DataCell>
                    )}
                </Table.Row>
            ))}
        </Table.Body>
    </Table>
);

const FolketrygdlovenLenke = ({
    referanse,
}: {
    referanse?: ApiFolketrygdlovenreferanse | null;
}): ReactElement | string => {
    if (!referanse) return '–';

    const paragraf = `${referanse.kapittel}-${referanse.paragrafIKapittel}`;
    const ledd = referanse.ledd ? ` ${referanse.ledd}. ledd` : '';
    const bokstav = referanse.bokstav ? ` bokstav ${referanse.bokstav}` : '';

    return <LovdataLenke paragraf={paragraf}>{`§ ${paragraf}${ledd}${bokstav}`}</LovdataLenke>;
};

const Opplysning = ({ tittel, children }: { tittel: string; children: ReactNode }): ReactElement => (
    <VStack>
        <BodyShort size="small" className="text-ax-text-neutral-subtle">
            {tittel}
        </BodyShort>
        <BodyShort>{children}</BodyShort>
    </VStack>
);
