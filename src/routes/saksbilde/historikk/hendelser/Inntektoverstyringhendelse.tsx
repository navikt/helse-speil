import dayjs from 'dayjs';
import React from 'react';

import { CaseworkerFilled } from '@navikt/ds-icons';
import { BodyShort } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { Kilde } from '@components/Kilde';
import { Inntektskilde, Refusjonsopplysning } from '@io/graphql';
import { ISO_DATOFORMAT, NORSK_DATOFORMAT, getFormattedDateString } from '@utils/date';
import { somPenger } from '@utils/locale';

import { ExpandableHistorikkContent } from './ExpandableHistorikkContent';
import { Hendelse } from './Hendelse';
import { HendelseDate } from './HendelseDate';

import styles from './Overstyringshendelse.module.css';

type InntektoverstyringhendelseProps = Omit<InntektoverstyringhendelseObject, 'type' | 'id'>;

export const Inntektoverstyringhendelse: React.FC<InntektoverstyringhendelseProps> = ({
    erRevurdering,
    saksbehandler,
    timestamp,
    inntekt,
}) => {
    return (
        <>
            {inntekt.fraManedligInntekt !== inntekt.manedligInntekt && (
                <Hendelse
                    title={erRevurdering ? 'Månedsinntekt revurdert' : 'Månedsinntekt endret'}
                    icon={
                        <Kilde type={Inntektskilde.Saksbehandler}>
                            <CaseworkerFilled title="Caseworker-ikon" height={20} width={20} />
                        </Kilde>
                    }
                >
                    <ExpandableHistorikkContent>
                        <div className={styles.Grid}>
                            <Bold>Begrunnelse </Bold>
                            <BodyShort>{inntekt.begrunnelse}</BodyShort>
                            <Bold>Forklaring </Bold>
                            <BodyShort>{inntekt.forklaring}</BodyShort>
                            <Bold>Mnd. inntekt </Bold>
                            <BodyShort>
                                {inntekt.fraManedligInntekt !== undefined && (
                                    <span className={styles.FromValue}>{somPenger(inntekt.fraManedligInntekt)}</span>
                                )}
                                {somPenger(inntekt.manedligInntekt)}
                            </BodyShort>
                            <Bold>Skj. tidspunkt</Bold>
                            <BodyShort>{getFormattedDateString(inntekt.skjaeringstidspunkt)}</BodyShort>
                        </div>
                    </ExpandableHistorikkContent>
                    <HendelseDate timestamp={timestamp} ident={saksbehandler} />
                </Hendelse>
            )}
            {JSON.stringify(inntekt?.fraRefusjonsopplysninger) !==
                JSON.stringify(
                    inntekt?.refusjonsopplysninger &&
                        [...inntekt.refusjonsopplysninger].sort(
                            (a: Refusjonsopplysning, b: Refusjonsopplysning) =>
                                new Date(b.fom).getTime() - new Date(a.fom).getTime(),
                        ),
                ) && (
                <Hendelse
                    title={erRevurdering ? 'Refusjon revurdert' : 'Refusjon endret'}
                    icon={
                        <Kilde type={Inntektskilde.Saksbehandler}>
                            <CaseworkerFilled title="Caseworker-ikon" height={20} width={20} />
                        </Kilde>
                    }
                >
                    <ExpandableHistorikkContent>
                        <div className={styles.Grid}>
                            <Bold>Begrunnelse </Bold>
                            <BodyShort>{inntekt.begrunnelse}</BodyShort>
                            <Bold>Forklaring</Bold>
                            <BodyShort>{inntekt.forklaring}</BodyShort>
                            <Bold>Refusjon </Bold>
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
                                                            ? dayjs(fraRefusjonsopplysning?.tom, ISO_DATOFORMAT).format(
                                                                  NORSK_DATOFORMAT,
                                                              ) ?? ''
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
                                                {dayjs(refusjonsopplysning.fom, ISO_DATOFORMAT).format(
                                                    NORSK_DATOFORMAT,
                                                )}
                                                -
                                                {dayjs(refusjonsopplysning?.tom, ISO_DATOFORMAT).isValid()
                                                    ? dayjs(refusjonsopplysning?.tom, ISO_DATOFORMAT).format(
                                                          NORSK_DATOFORMAT,
                                                      ) ?? ''
                                                    : ' '}
                                                {': '}
                                                {refusjonsopplysning.belop}
                                            </BodyShort>
                                        );
                                    })}
                            </div>
                            <Bold>Skj. tidspunkt</Bold>
                            <BodyShort>{getFormattedDateString(inntekt.skjaeringstidspunkt)}</BodyShort>
                        </div>
                    </ExpandableHistorikkContent>
                    <HendelseDate timestamp={timestamp} ident={saksbehandler} />
                </Hendelse>
            )}
        </>
    );
};
