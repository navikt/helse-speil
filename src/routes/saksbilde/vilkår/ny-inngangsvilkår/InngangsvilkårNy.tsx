import { ReactElement, useState } from 'react';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';

import { CheckmarkCircleFillIcon, ExclamationmarkTriangleFillIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import {
    BodyShort,
    Box,
    HStack,
    Heading,
    Link,
    LocalAlert,
    Radio,
    RadioGroup,
    Table,
    Textarea,
    VStack,
} from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { BeregnetPeriode } from '@io/graphql';
import { somNorskDato } from '@utils/date';
import { cn } from '@utils/tw';

function InngangsvilkårContainer({ periode }: { periode: BeregnetPeriode }) {
    return (
        <VStack marginBlock="space-20" marginInline="space-24" gap="space-20">
            <Heading size="xsmall">
                Inngangsvilkår for skjæringstidspunkt {somNorskDato(periode.skjaeringstidspunkt)}
            </Heading>
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell />
                        <Table.HeaderCell textSize="small" className="font-ax-regular text-ax-text-neutral-subtle">
                            Vurdering
                        </Table.HeaderCell>
                        <Table.HeaderCell textSize="small" className="font-ax-regular text-ax-text-neutral-subtle">
                            Vurdert av
                        </Table.HeaderCell>
                        <Table.HeaderCell textSize="small" className="font-ax-regular text-ax-text-neutral-subtle">
                            Vurdert dato
                        </Table.HeaderCell>
                        <Table.HeaderCell />
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    <Vilkår
                        vilkår={{
                            vilkår: 'Opptjeningstid',
                            lovreferanse: '§ 8-2',
                            lovdatalenke: { href: '#', lenketekst: 'Folketrygdloven § 8-2' },
                        }}
                        vurdering={{
                            status: 'Oppfylt',
                            vurdertAv: 'B123456',
                            vurdertDato: '01.02.2026',
                        }}
                    />
                    <Vilkår
                        vilkår={{
                            vilkår: 'Medlemskap',
                            lovreferanse: 'Ftrl. kapittel 2',
                            lovdatalenke: { href: '#', lenketekst: 'Folketrygdloven kapittel 2' },
                        }}
                        vurdering={{
                            status: 'IkkeOppfylt',
                            vurdertAv: 'Automatisk',
                            vurdertDato: '8.01.2026',
                        }}
                    />
                    <Vilkår
                        vilkår={{
                            vilkår: 'MinsteSykepengegrunnlag',
                            lovreferanse: '§ 8-3',
                            lovdatalenke: { href: '#', lenketekst: 'Folketrygdloven § 8-3' },
                        }}
                    />
                </Table.Body>
            </Table>
        </VStack>
    );
}

interface Vilkår {
    vilkår: string;
    lovreferanse: string;
    lovdatalenke: { href: string; lenketekst: string };
}

type VilkårStatus = 'Oppfylt' | 'IkkeOppfylt' | 'IkkeVurdert';
interface Vurdering {
    status: 'Oppfylt' | 'IkkeOppfylt';
    vurdertAv: string;
    vurdertDato: string;
}

interface VilkårProps {
    vilkår: Vilkår;
    vurdering?: Vurdering;
}

function Vilkår({ vilkår, vurdering }: VilkårProps) {
    const [erÅpen, setErÅpen] = useState(false);
    return (
        <Table.ExpandableRow
            content={<VilkårContent vilkår={vilkår} />}
            togglePlacement="right"
            className={cn({ 'bg-ax-bg-accent-moderate': erÅpen })}
            contentGutter="none"
            expandOnRowClick
            onOpenChange={setErÅpen}
        >
            <HStack as={Table.DataCell} gap="space-12">
                <VilkårStatusIkon status={vurdering?.status ?? 'IkkeVurdert'} />
                <BodyShort>
                    {vilkår.lovreferanse} {vilkår.vilkår}
                </BodyShort>
            </HStack>
            <Table.DataCell>{vurdering?.status ?? 'Ikke vurdert'}</Table.DataCell>
            <Table.DataCell>{vurdering?.vurdertAv ?? '–'}</Table.DataCell>
            <Table.DataCell>{vurdering?.vurdertDato ?? '–'}</Table.DataCell>
        </Table.ExpandableRow>
    );
}

function VilkårContent({ vilkår }: { vilkår: Vilkår }) {
    return (
        <Box
            borderWidth="1 0 0"
            borderColor="neutral-subtle"
            background="accent-moderate"
            // Minus marginer for å kompensere for tvungen margin fra aksel, for at bakgrunnsfargen skal dekke
            className="-mt-4 -mr-2 -mb-4 -ml-2"
        >
            <VStack paddingInline="space-44" paddingBlock="space-12" gap="space-20">
                <Link href={vilkår.lovdatalenke.href}>{vilkår.lovdatalenke.lenketekst}</Link>
                <VilkårForm />
                <Endringslogg />
            </VStack>
        </Box>
    );
}

function Endringslogg() {
    return (
        <Box borderWidth="1 0 0" paddingBlock="space-20" borderColor="neutral" paddingInline="space-8">
            <Heading size="xsmall">Endringslogg:</Heading>
            <Table size="small" zebraStripes>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell textSize="small" className="font-ax-regular text-ax-text-neutral-subtle">
                            Vurdert dato
                        </Table.HeaderCell>
                        <Table.HeaderCell textSize="small" className="font-ax-regular text-ax-text-neutral-subtle">
                            Vurdering
                        </Table.HeaderCell>
                        <Table.HeaderCell textSize="small" className="font-ax-regular text-ax-text-neutral-subtle">
                            Utvidet begrunnelse
                        </Table.HeaderCell>
                        <Table.HeaderCell textSize="small" className="font-ax-regular text-ax-text-neutral-subtle">
                            Kilde
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    <Table.Row>
                        <Table.DataCell>01.02.2026 kl. 10:31</Table.DataCell>
                        <Table.DataCell>Oppfylt</Table.DataCell>
                        <Table.DataCell>
                            <Link href="#">Jeg har vurdert bla bla bla</Link>
                        </Table.DataCell>
                        <Table.DataCell>B123456</Table.DataCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.DataCell>18.01.2026 kl. 11:49</Table.DataCell>
                        <Table.DataCell>Ikke oppfylt</Table.DataCell>
                        <Table.DataCell>
                            <Link href="#">Åpne datagrunnlaget for den automatiske vurderingen</Link>
                        </Table.DataCell>
                        <Table.DataCell>Automatisk</Table.DataCell>
                    </Table.Row>
                </Table.Body>
            </Table>
        </Box>
    );
}

function VilkårForm() {
    const form = useForm();
    const handleSubmit = async (_: FieldValues) => {
        return Promise.resolve();
    };
    return (
        <FormProvider {...form}>
            <VStack as="form" onSubmit={form.handleSubmit(handleSubmit)} gap="space-20" maxWidth="522px">
                <RadioGroup legend="Er vilkåret oppfylt?" size="small">
                    <Radio value="ja">Ja</Radio>
                    <Radio value="delvis">Delvis</Radio>
                    <Radio value="nei">Nei</Radio>
                </RadioGroup>
                <Textarea
                    label="Utvidet begrunnelse"
                    description="Teksten blir ikke vist til den sykmeldte, med mindre hen ber om innsyn."
                ></Textarea>
            </VStack>
        </FormProvider>
    );
}

function VilkårStatusIkon({ status }: { status: VilkårStatus }) {
    switch (status) {
        case 'Oppfylt':
            return <CheckmarkCircleFillIcon fontSize="1.5rem" className="text-ax-text-success-decoration" />;
        case 'IkkeOppfylt':
            return <XMarkOctagonFillIcon fontSize="1.5rem" className="text-ax-text-danger-decoration" />;
        case 'IkkeVurdert':
            return <ExclamationmarkTriangleFillIcon fontSize="1.5rem" className="text-ax-text-warning-decoration" />;
    }
}

interface InngangsvilkårNyProps {
    periode: BeregnetPeriode;
}

export function InngangsvilkårNy({ periode }: InngangsvilkårNyProps): ReactElement {
    return (
        <ErrorBoundary fallback={inngangsvilkårError}>
            <InngangsvilkårContainer periode={periode} />
        </ErrorBoundary>
    );
}

function inngangsvilkårError(error: Error): ReactElement {
    return (
        <Box marginBlock="space-16" marginInline="space-16">
            <LocalAlert status="error" size="small">
                <LocalAlert.Header>
                    <LocalAlert.Title>Kan ikke vise inngangsvilkår</LocalAlert.Title>
                </LocalAlert.Header>
                <LocalAlert.Content>
                    <VStack gap="space-8">
                        <BodyShort>Det skjedde en feil som gjorde at vi ikke kan vise inngangsvilkår.</BodyShort>
                        <VStack>
                            <BodyShort>Feilmelding:</BodyShort>
                            <Box
                                borderWidth="0 0 0 2"
                                borderColor="neutral-subtle"
                                paddingInline="space-4 space-0"
                                marginInline="space-2 space-0"
                            >
                                <BodyShort>{error.message}</BodyShort>
                            </Box>
                        </VStack>
                    </VStack>
                </LocalAlert.Content>
            </LocalAlert>
        </Box>
    );
}
