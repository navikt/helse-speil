import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

import { PersonPencilFillIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

import { Kilde } from '@components/Kilde';
import { Inntektskilde, Refusjonsopplysning } from '@io/graphql';
import { Historikkhendelse } from '@saksbilde/historikk/hendelser/Historikkhendelse';
import { HistorikkSection } from '@saksbilde/historikk/komponenter/HistorikkSection';
import { InntektoverstyringhendelseObject } from '@typer/historikk';
import { ISO_DATOFORMAT, NORSK_DATOFORMAT, getFormattedDateString } from '@utils/date';
import { somPenger } from '@utils/locale';

import styles from './Overstyringshendelse.module.css';

type InntektoverstyringhendelseProps = Omit<InntektoverstyringhendelseObject, 'type' | 'id'>;

export const Inntektoverstyringhendelse = ({
    erRevurdering,
    saksbehandler,
    timestamp,
    inntekt,
}: InntektoverstyringhendelseProps): ReactElement => {
    return (
        <>
            {inntekt.fraManedligInntekt !== inntekt.manedligInntekt && (
                <Historikkhendelse
                    icon={
                        <Kilde type={Inntektskilde.Saksbehandler}>
                            <PersonPencilFillIcon title="Saksbehandler ikon" />
                        </Kilde>
                    }
                    title={erRevurdering ? 'Månedsinntekt revurdert' : 'Månedsinntekt endret'}
                    timestamp={timestamp}
                    saksbehandler={saksbehandler}
                    aktiv={false}
                >
                    <HistorikkSection tittel="Begrunnelse">
                        <BodyShort>{inntekt.begrunnelse}</BodyShort>
                    </HistorikkSection>
                    <HistorikkSection tittel="Forklaring">
                        <BodyShort>{inntekt.forklaring}</BodyShort>
                    </HistorikkSection>
                    <HistorikkSection tittel="Mnd. inntekt">
                        <BodyShort>
                            {inntekt.fraManedligInntekt !== undefined && (
                                <span className={styles.FromValue}>{somPenger(inntekt.fraManedligInntekt)}</span>
                            )}
                            {somPenger(inntekt.manedligInntekt)}
                        </BodyShort>
                    </HistorikkSection>
                    <HistorikkSection tittel="Skj. tidspunkt">
                        <BodyShort>{getFormattedDateString(inntekt.skjaeringstidspunkt)}</BodyShort>
                    </HistorikkSection>
                </Historikkhendelse>
            )}
            {JSON.stringify(inntekt?.fraRefusjonsopplysninger) !==
                JSON.stringify(
                    inntekt?.refusjonsopplysninger &&
                        [...inntekt.refusjonsopplysninger].sort(
                            (a: Refusjonsopplysning, b: Refusjonsopplysning) =>
                                new Date(b.fom).getTime() - new Date(a.fom).getTime(),
                        ),
                ) && (
                <Historikkhendelse
                    icon={
                        <Kilde type={Inntektskilde.Saksbehandler}>
                            <PersonPencilFillIcon title="Saksbehandler ikon" />
                        </Kilde>
                    }
                    title={erRevurdering ? 'Refusjon revurdert' : 'Refusjon endret'}
                    timestamp={timestamp}
                    saksbehandler={saksbehandler}
                    aktiv={false}
                >
                    <HistorikkSection tittel="Begrunnelse">
                        <BodyShort>{inntekt.begrunnelse}</BodyShort>
                    </HistorikkSection>
                    <HistorikkSection tittel="Forklaring">
                        <BodyShort>{inntekt.forklaring}</BodyShort>
                    </HistorikkSection>
                    <HistorikkSection tittel="Refusjon">
                        <div className={`${styles.GridFullWidth} ${styles.Refusjonselementer}`}>
                            {inntekt.fraRefusjonsopplysninger &&
                                [...inntekt.fraRefusjonsopplysninger]
                                    .sort(
                                        (a: Refusjonsopplysning, b: Refusjonsopplysning) =>
                                            new Date(b.fom).getTime() - new Date(a.fom).getTime(),
                                    )
                                    .map((fraRefusjonsopplysning, index) => {
                                        return (
                                            <BodyShort
                                                className={`${styles.GridFullWidth} ${styles.Refusjonselement}`}
                                                key={`${fraRefusjonsopplysning?.fom}${index}`}
                                            >
                                                <span className={styles.FromValue}>
                                                    {dayjs(fraRefusjonsopplysning.fom, ISO_DATOFORMAT).format(
                                                        NORSK_DATOFORMAT,
                                                    )}
                                                    -
                                                    {dayjs(fraRefusjonsopplysning?.tom, ISO_DATOFORMAT).isValid()
                                                        ? (dayjs(fraRefusjonsopplysning?.tom, ISO_DATOFORMAT).format(
                                                              NORSK_DATOFORMAT,
                                                          ) ?? '')
                                                        : ' '}
                                                    {': '}
                                                    {fraRefusjonsopplysning.belop}
                                                </span>
                                            </BodyShort>
                                        );
                                    })}
                        </div>
                        <div className={`${styles.GridFullWidth} ${styles.Refusjonselementer}`}>
                            {inntekt.refusjonsopplysninger &&
                                inntekt.refusjonsopplysninger.map((refusjonsopplysning, index) => {
                                    return (
                                        <BodyShort
                                            className={`${styles.GridFullWidth} ${styles.Refusjonselement}`}
                                            key={`${refusjonsopplysning?.fom}${index}`}
                                        >
                                            {dayjs(refusjonsopplysning.fom, ISO_DATOFORMAT).format(NORSK_DATOFORMAT)}-
                                            {dayjs(refusjonsopplysning?.tom, ISO_DATOFORMAT).isValid()
                                                ? (dayjs(refusjonsopplysning?.tom, ISO_DATOFORMAT).format(
                                                      NORSK_DATOFORMAT,
                                                  ) ?? '')
                                                : ' '}
                                            {': '}
                                            {refusjonsopplysning.belop}
                                        </BodyShort>
                                    );
                                })}
                        </div>
                    </HistorikkSection>
                    <HistorikkSection tittel="Skj. tidspunkt">
                        <BodyShort>{getFormattedDateString(inntekt.skjaeringstidspunkt)}</BodyShort>
                    </HistorikkSection>
                </Historikkhendelse>
            )}
        </>
    );
};
