import React, { ReactElement } from 'react';

import { BodyShort, Dialog, Table } from '@navikt/ds-react';

import { Inntektsforholdnavn } from '@components/Inntektsforholdnavn';
import { sortTimestampDesc } from '@components/endringslogg/endringsloggUtils';
import { getSkjønnsfastsettelseTypeTekst } from '@saksbilde/historikk/hendelser/SykepengegrunnlagSkjønnsfastsatthendelse';
import { SykepengegrunnlagskjonnsfastsettingMedArbeidsgiverInfo } from '@saksbilde/sykepengegrunnlag/skjonnsfastsetting/SkjønnsfastsettingHeader';
import { getFormattedDateString, getFormattedDatetimeString } from '@utils/date';
import { somPenger } from '@utils/locale';

type EndringsloggSykepengegrunnlagskjønnsfastsettingProps = {
    onOpenChange: (open: boolean) => void;
    endringer: SykepengegrunnlagskjonnsfastsettingMedArbeidsgiverInfo[];
};

export function EndringsloggSykepengegrunnlagskjønnsfastsetting({
    endringer,
    onOpenChange,
}: EndringsloggSykepengegrunnlagskjønnsfastsettingProps): ReactElement {
    return (
        <Dialog open onOpenChange={onOpenChange} aria-label="Endringslogg modal">
            <Dialog.Popup width="1200px">
                <Dialog.Header>
                    <Dialog.Title>Endringslogg</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                    <Table zebraStripes>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Dato og tidspunkt</Table.HeaderCell>
                                <Table.HeaderCell>Arbeidsgiver</Table.HeaderCell>
                                <Table.HeaderCell>Sykepengegrunnlag</Table.HeaderCell>
                                <Table.HeaderCell>Skjæringstidpunkt</Table.HeaderCell>
                                <Table.HeaderCell>Årsak</Table.HeaderCell>
                                <Table.HeaderCell>Type</Table.HeaderCell>
                                <Table.HeaderCell>Saksbehandler</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {endringer
                                .sort((a, b) => sortTimestampDesc(a.timestamp, b.timestamp))
                                .map((endring, i) => (
                                    <Table.Row key={i}>
                                        <Table.DataCell>{getFormattedDatetimeString(endring.timestamp)}</Table.DataCell>
                                        <Table.DataCell>
                                            <Inntektsforholdnavn
                                                inntektsforholdReferanse={endring.inntektsforholdReferanse}
                                            />
                                        </Table.DataCell>
                                        <Table.DataCell>
                                            <span className="line-through">
                                                {somPenger(endring.skjonnsfastsatt.fraArlig)}
                                            </span>{' '}
                                            {somPenger(endring.skjonnsfastsatt.arlig)}
                                        </Table.DataCell>
                                        <Table.DataCell>
                                            {getFormattedDateString(endring.skjonnsfastsatt.skjaeringstidspunkt)}
                                        </Table.DataCell>
                                        <Table.DataCell>
                                            <BodyShort className="max-w-75">{endring.skjonnsfastsatt.arsak}</BodyShort>
                                        </Table.DataCell>
                                        <Table.DataCell>
                                            <BodyShort className="max-w-75">
                                                {getSkjønnsfastsettelseTypeTekst(endring.skjonnsfastsatt.type)}
                                            </BodyShort>
                                        </Table.DataCell>
                                        <Table.DataCell>
                                            {endring.saksbehandler.ident ?? endring.saksbehandler.navn}
                                        </Table.DataCell>
                                    </Table.Row>
                                ))}
                        </Table.Body>
                    </Table>
                </Dialog.Body>
            </Dialog.Popup>
        </Dialog>
    );
}
