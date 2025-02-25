import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

import { PersonPencilFillIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

import { BodyShortWithPreWrap } from '@components/BodyShortWithPreWrap';
import { Kilde } from '@components/Kilde';
import { Inntektskilde, Refusjonsopplysning } from '@io/graphql';
import { HistorikkSection } from '@saksbilde/historikk/komponenter/HistorikkSection';
import { Historikkhendelse } from '@saksbilde/historikk/komponenter/Historikkhendelse';
import { InntektoverstyringhendelseObject } from '@typer/historikk';
import { ISO_DATOFORMAT, NORSK_DATOFORMAT, getFormattedDateString } from '@utils/date';
import { somPenger } from '@utils/locale';

import styles from './Inntektoverstyringhendelse.module.css';

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
                        <BodyShortWithPreWrap>{inntekt.forklaring}</BodyShortWithPreWrap>
                    </HistorikkSection>
                    <HistorikkSection tittel="Mnd. inntekt">
                        <BodyShort>
                            {inntekt.fraManedligInntekt !== undefined && (
                                <span className={styles.fromvalue}>{somPenger(inntekt.fraManedligInntekt)}</span>
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
                        <div className={classNames(styles.gridfullwidth, styles.refusjonselementer)}>
                            {inntekt.fraRefusjonsopplysninger &&
                                [...inntekt.fraRefusjonsopplysninger]
                                    .sort(
                                        (a: Refusjonsopplysning, b: Refusjonsopplysning) =>
                                            new Date(b.fom).getTime() - new Date(a.fom).getTime(),
                                    )
                                    .map((fraRefusjonsopplysning, index) => {
                                        return (
                                            <BodyShort
                                                className={styles.gridfullwidth}
                                                key={`${fraRefusjonsopplysning?.fom}${index}`}
                                            >
                                                <span className={styles.fromvalue}>
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
                        <div className={classNames(styles.gridfullwidth, styles.refusjonselementer)}>
                            {inntekt.refusjonsopplysninger &&
                                inntekt.refusjonsopplysninger.map((refusjonsopplysning, index) => {
                                    return (
                                        <BodyShort
                                            className={styles.gridfullwidth}
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
