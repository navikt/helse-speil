import dayjs from 'dayjs';
import { ReactElement, useId } from 'react';

import {
    BodyShort,
    Box,
    Checkbox,
    ErrorMessage,
    HStack,
    Heading,
    Loader,
    Tag,
    Tooltip,
    VStack,
} from '@navikt/ds-react';

import { UTEN_SKRIVETILGANG_TEKST } from '@components/skrivetilgang/utenSkrivetilgang';
import { useHarSkrivetilgang } from '@hooks/brukerrolleHooks';
import { ApiSaksbildeVarselstatus, ApiVarselDTO } from '@io/rest/generated/spesialist.schemas';
import { NORSK_DATOFORMAT_MED_KLOKKESLETT, getFormattedDatetimeString } from '@utils/date';

import { EkspanderbartVarsel } from './EkspanderbartVarsel';
import { Varselseksjon } from './Varselseksjon';
import { useVarselvurdering } from './useVarselvurdering';
import { VarselstatusType, statusetikett } from './varselstatus';

interface VarselItemProps {
    varsel: ApiVarselDTO;
    status: VarselstatusType;
}

export function VarselItem({ varsel, status }: VarselItemProps): ReactElement {
    const tittelId = useId();
    const måLøses = status === 'feil';
    const kanÅpnes = !!varsel.forklaring && !!varsel.handling;
    const tittel = <Varseltittel varsel={varsel} tittelId={tittelId} />;

    if (!kanÅpnes) {
        return (
            <Box background={`${statusetikett[status].farge}-soft`} borderRadius="8" data-status={status}>
                <Box paddingInline="space-56 space-8" paddingBlock={måLøses ? 'space-12' : 'space-12 space-0'}>
                    {tittel}
                </Box>
                {!måLøses && (
                    <Box paddingInline="space-56 space-8" paddingBlock="space-0 space-12">
                        <Vurdering varsel={varsel} />
                    </Box>
                )}
            </Box>
        );
    }

    return (
        <Box background={`${statusetikett[status].farge}-soft`} borderRadius="8" data-status={status}>
            <EkspanderbartVarsel>
                <EkspanderbartVarsel.Header
                    aria-labelledby={tittelId}
                    flexDirection="row-reverse"
                    justify="start"
                    className={måLøses ? 'text-ax-text-neutral' : 'pb-0 text-ax-text-neutral'}
                >
                    {tittel}
                </EkspanderbartVarsel.Header>
                {!måLøses && (
                    <Box paddingInline="space-56 space-8" paddingBlock="space-0 space-12">
                        <Vurdering varsel={varsel} />
                    </Box>
                )}
                <EkspanderbartVarsel.Content>
                    <Box paddingInline="space-56 space-8" paddingBlock="space-0 space-12">
                        <VStack gap="space-8" align="start">
                            <Varselseksjon tittel="Hva betyr det?">{varsel.forklaring}</Varselseksjon>
                            <Varselseksjon tittel="Hva gjør du?">{varsel.handling}</Varselseksjon>
                            <Tag size="small" variant="moderate" data-color="neutral">
                                Opprettet: {dayjs(varsel.opprettet).format(NORSK_DATOFORMAT_MED_KLOKKESLETT)}
                            </Tag>
                        </VStack>
                    </Box>
                </EkspanderbartVarsel.Content>
            </EkspanderbartVarsel>
        </Box>
    );
}

interface VarseltittelProps {
    varsel: ApiVarselDTO;
    tittelId: string;
}

function Varseltittel({ varsel, tittelId }: VarseltittelProps): ReactElement {
    return (
        <HStack justify="space-between" align="start" gap="space-8" wrap={false} flexGrow="1">
            <Heading id={tittelId} level="3" size="xsmall" className="text-ax-medium">
                {varsel.tittel}
            </Heading>
        </HStack>
    );
}

function Vurdering({ varsel }: { varsel: ApiVarselDTO }): ReactElement {
    const harSkrivetilgang = useHarSkrivetilgang();
    const { settVurdert, settAktiv, lagrer, feilmelding } = useVarselvurdering(varsel);
    const vurdering = varsel.vurdering;
    const erGodkjent = vurdering?.status === ApiSaksbildeVarselstatus.GODKJENT;
    const erVurdert = erGodkjent || vurdering?.status === ApiSaksbildeVarselstatus.VURDERT;
    const manglerSkrivetilgang = !erGodkjent && !harSkrivetilgang;

    function endreVurdering() {
        if (manglerSkrivetilgang || lagrer) return;
        if (erVurdert) settAktiv();
        else settVurdert();
    }

    const avkrysning = (
        <Checkbox
            size="small"
            checked={erVurdert}
            readOnly={erGodkjent}
            aria-disabled={manglerSkrivetilgang || undefined}
            onChange={endreVurdering}
        >
            Vurdert
        </Checkbox>
    );

    return (
        <VStack gap="space-4">
            <HStack gap="space-8" align="center">
                {manglerSkrivetilgang ? (
                    <Tooltip content={UTEN_SKRIVETILGANG_TEKST} describesChild>
                        {avkrysning}
                    </Tooltip>
                ) : (
                    avkrysning
                )}
                {lagrer && <Loader size="small" title="Lagrer vurderingen" />}
            </HStack>
            {erVurdert && (
                <BodyShort size="small" textColor="subtle">
                    Vurdert: {getFormattedDatetimeString(vurdering?.tidsstempel)} av{' '}
                    <span data-sensitive>{vurdering?.ident}</span>
                </BodyShort>
            )}
            {feilmelding && <ErrorMessage size="small">{feilmelding}</ErrorMessage>}
        </VStack>
    );
}
