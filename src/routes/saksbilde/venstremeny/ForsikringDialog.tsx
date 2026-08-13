import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

import { BodyShort, Button, Dialog, HStack, Table, VStack } from '@navikt/ds-react';

import { LovdataLenke } from '@components/LovdataLenke';
import {
    ApiEkskludertForsikring,
    ApiFolketrygdlovenreferanse,
    ApiForsikringsvurdering,
    ApiForsikringsvurderingGjeldendeForsikring,
} from '@io/rest/generated/spesialist.schemas';
import { NORSK_DATOFORMAT_MED_KLOKKESLETT, somNorskDato } from '@utils/date';

type Forsikringsrad = {
    forsikring: NonNullable<ApiForsikringsvurderingGjeldendeForsikring> | ApiEkskludertForsikring;
    erGjeldende: boolean;
};

export const ForsikringDialog = ({
    forsikringsvurdering,
    skjæringstidspunkt,
    trigger,
}: {
    forsikringsvurdering: ApiForsikringsvurdering;
    skjæringstidspunkt: string;
    trigger: ReactElement;
}): ReactElement => {
    const { gjeldendeForsikring, ekskluderteForsikringer } = forsikringsvurdering;

    const rader: Forsikringsrad[] = [
        ...(gjeldendeForsikring ? [{ forsikring: gjeldendeForsikring, erGjeldende: true }] : []),
        ...ekskluderteForsikringer.map((forsikring) => ({ forsikring, erGjeldende: false })),
    ].toSorted(sammenlignForsikringsrader);

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
                            {dayjs(forsikringsvurdering.dataHentetTidspunkt).format(NORSK_DATOFORMAT_MED_KLOKKESLETT)}
                        </BodyShort>
                        <Button size="small" variant="secondary">
                            Hent og vurder på nytt
                        </Button>
                    </HStack>
                    {rader.length > 0 ? (
                        <ForsikringTabell rader={rader} />
                    ) : (
                        <BodyShort>Ingen forsikringer funnet</BodyShort>
                    )}
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

const sammenlignForsikringsrader = (a: Forsikringsrad, b: Forsikringsrad): number => {
    const virkningsdato = a.forsikring.virkningsdato.localeCompare(b.forsikring.virkningsdato);
    if (virkningsdato !== 0) return virkningsdato;

    const opphørA = a.forsikring.opphørsdato;
    const opphørB = b.forsikring.opphørsdato;
    if (opphørA === opphørB) return 0;
    if (!opphørA) return 1;
    if (!opphørB) return -1;
    return opphørA.localeCompare(opphørB);
};

const ForsikringTabell = ({ rader }: { rader: Forsikringsrad[] }): ReactElement => (
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
            {rader.map(({ forsikring, erGjeldende }, index) => (
                <Table.Row
                    key={`${forsikring.virkningsdato}-${index}`}
                    className={erGjeldende ? 'bg-ax-bg-success-soft' : 'bg-ax-bg-neutral-soft'}
                >
                    <Table.DataCell>
                        <VStack>
                            {forsikring.navn}
                            <FolketrygdlovenLenke referanse={forsikring.folketrygdlovenreferanse} />
                        </VStack>
                    </Table.DataCell>
                    <Table.DataCell>{somNorskDato(forsikring.virkningsdato)}</Table.DataCell>
                    <Table.DataCell>{somNorskDato(forsikring.opphørsdato ?? undefined) ?? '–'}</Table.DataCell>
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
                            'Lagt til grunn'
                        )}
                    </Table.DataCell>
                </Table.Row>
            ))}
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
