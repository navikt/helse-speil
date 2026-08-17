import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

import { BodyShort, Button, Dialog, HStack, Heading, Table, VStack } from '@navikt/ds-react';

import { LovdataLenke } from '@components/LovdataLenke';
import {
    ApiFolketrygdlovenreferanse,
    ApiForsikringsvurdering,
    ApiKollektivForsikring,
    ApiNavKjøptForsikring,
} from '@io/rest/generated/spesialist.schemas';
import { NORSK_DATOFORMAT_MED_KLOKKESLETT, somNorskDato } from '@utils/date';

export const ForsikringDialog = ({
    forsikringsvurdering,
    skjæringstidspunkt,
    trigger,
}: {
    forsikringsvurdering: ApiForsikringsvurdering;
    skjæringstidspunkt: string;
    trigger: ReactElement;
}): ReactElement => {
    const forsikringer = forsikringsvurdering.navKjøpteForsikringer.toSorted(sammenlignForsikringer);
    const kollektivForsikring = forsikringsvurdering.kollektivForsikring;

    return (
        <Dialog>
            <Dialog.Trigger>{trigger}</Dialog.Trigger>
            <Dialog.Popup width="large">
                <Dialog.Header>
                    <Dialog.Title>Grunnlag for forsikringsvurdering</Dialog.Title>
                    <Dialog.Description>
                        Gjelder sykefravær med skjæringstidspunkt {somNorskDato(skjæringstidspunkt)}
                    </Dialog.Description>
                </Dialog.Header>
                <Dialog.Body>
                    <HStack align="center" gap="space-12" marginBlock="space-0 space-16">
                        <BodyShort>
                            Opplysninger hentet og vurdert{' '}
                            {dayjs(forsikringsvurdering.vurdertTidspunkt)
                                .tz('Europe/Oslo')
                                .format(NORSK_DATOFORMAT_MED_KLOKKESLETT)}
                        </BodyShort>
                        <Button size="small" variant="secondary">
                            Hent og vurder på nytt
                        </Button>
                    </HStack>
                    <VStack gap="space-8" marginBlock="space-0 space-24">
                        <Heading size="xsmall" level="3">
                            Kollektive forsikringer
                        </Heading>
                        {kollektivForsikring ? (
                            <>
                                <FolketrygdlovenLenke
                                    referanse={kollektivForsikring.kollektivFolketrygdlovenreferanse}
                                />
                                <KollektivForsikringTabell forsikring={kollektivForsikring} />
                                <BodyShort size="small" textColor="subtle">
                                    Merk: Kollektive forsikringer er utledet av søknadstypen, dette må ikke tolkes som
                                    en bekreftelse på at bruker har denne forsikringen.
                                </BodyShort>
                            </>
                        ) : (
                            <BodyShort>Ingen kollektive forsikringer</BodyShort>
                        )}
                    </VStack>
                    <VStack gap="space-8">
                        <Heading size="xsmall" level="3">
                            Nav-kjøpte forsikringer
                        </Heading>
                        {forsikringer.length > 0 ? (
                            <ForsikringTabell forsikringer={forsikringer} />
                        ) : (
                            <BodyShort>Ingen forsikringer funnet</BodyShort>
                        )}
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

const sammenlignForsikringer = (a: ApiNavKjøptForsikring, b: ApiNavKjøptForsikring): number => {
    const virkningsdato = a.virkningsdato.localeCompare(b.virkningsdato);
    if (virkningsdato !== 0) return virkningsdato;

    const opphørA = a.opphørsdato;
    const opphørB = b.opphørsdato;
    if (opphørA === opphørB) return 0;
    if (!opphørA) return 1;
    if (!opphørB) return -1;
    return opphørA.localeCompare(opphørB);
};

const ForsikringTabell = ({ forsikringer }: { forsikringer: ApiNavKjøptForsikring[] }): ReactElement => (
    <Table size="small">
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell scope="col">Type</Table.HeaderCell>
                <Table.HeaderCell scope="col">Gjelder fra</Table.HeaderCell>
                <Table.HeaderCell scope="col">Opphører</Table.HeaderCell>
                <Table.HeaderCell scope="col">Vurdering</Table.HeaderCell>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {forsikringer.map((forsikring, index) => (
                <Table.Row
                    key={`${forsikring.virkningsdato}-${index}`}
                    className={forsikring.lagtTilGrunn ? 'bg-ax-bg-success-soft' : 'bg-ax-bg-neutral-soft'}
                >
                    <Table.DataCell>
                        <VStack>
                            {forsikring.navn}
                            <FolketrygdlovenLenke referanse={forsikring.dekningFolketrygdlovenreferanse} />
                        </VStack>
                    </Table.DataCell>
                    <Table.DataCell>{somNorskDato(forsikring.virkningsdato)}</Table.DataCell>
                    <Table.DataCell>{somNorskDato(forsikring.opphørsdato ?? undefined) ?? '–'}</Table.DataCell>
                    <Table.DataCell>
                        {forsikring.konklusjon.forklaring}
                        {forsikring.konklusjon.folketrygdlovenreferanse && (
                            <>
                                {' '}
                                (
                                <FolketrygdlovenLenke referanse={forsikring.konklusjon.folketrygdlovenreferanse} />)
                            </>
                        )}
                    </Table.DataCell>
                </Table.Row>
            ))}
        </Table.Body>
    </Table>
);

const KollektivForsikringTabell = ({ forsikring }: { forsikring: ApiKollektivForsikring }): ReactElement => (
    <Table size="small">
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell scope="col">Type</Table.HeaderCell>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            <Table.Row className="bg-ax-bg-success-soft">
                <Table.DataCell>
                    <VStack>
                        {forsikring.navn}
                        <FolketrygdlovenLenke referanse={forsikring.dekningFolketrygdlovenreferanse} />
                    </VStack>
                </Table.DataCell>
            </Table.Row>
        </Table.Body>
    </Table>
);

export const FolketrygdlovenLenke = ({
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
