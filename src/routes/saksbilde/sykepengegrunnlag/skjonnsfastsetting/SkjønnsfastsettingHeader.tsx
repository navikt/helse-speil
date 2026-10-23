import dayjs from 'dayjs';
import React from 'react';

import { PersonPencilIcon, XMarkIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, ErrorMessage } from '@navikt/ds-react';

import { Endringstrekant } from '@components/Endringstrekant';
import { VisHvisSkrivetilgang } from '@components/VisHvisSkrivetilgang';
import {
    ApiBeregnetPeriode,
    ApiSaksbildePerson,
    ApiSykepengegrunnlagsgrense,
    ApiSykepengegrunnlagskjonnsfastsetting,
} from '@io/rest/generated/spesialist.schemas';
import type { SkjonnsfastsettelseMalerQueryResult } from '@io/sanity/generated/sanity.types';
import { EndringsloggSkjønnsfastsettingButton } from '@saksbilde/sykepengegrunnlag/skjonnsfastsetting/EndringsloggSkjønnsfastsettingButton';
import {
    InntektsforholdReferanse,
    finnAlleInntektsforhold,
    tilReferanse,
} from '@state/inntektsforhold/inntektsforhold';
import { useActivePeriod } from '@state/periode';
import { somPenger, toKronerOgØre } from '@utils/locale';
import { isSykepengegrunnlagskjønnsfastsetting } from '@utils/typeguards';

import styles from './SkjønnsfastsettingHeader.module.css';

interface SkjønnsfastsettingHeaderProps {
    person: ApiSaksbildePerson;
    sykepengegrunnlag: number;
    endretSykepengegrunnlag: number | null;
    sykepengegrunnlagsgrense: ApiSykepengegrunnlagsgrense;
    editing: boolean;
    kanSkjønnsfastsette: boolean;
    openForm: () => void;
    maler: SkjonnsfastsettelseMalerQueryResult | undefined;
    malerError: string | undefined;
    organisasjonsnummer: string;
    closeAndResetForm: () => void;
}

export const SkjønnsfastsettingHeader = ({
    person,
    sykepengegrunnlag,
    endretSykepengegrunnlag,
    sykepengegrunnlagsgrense,
    editing,
    kanSkjønnsfastsette,
    openForm,
    maler,
    malerError,
    closeAndResetForm,
}: SkjønnsfastsettingHeaderProps) => {
    const aktivPeriode = useActivePeriod(person);
    const harMaler = maler && maler.length > 0;

    if (!person || !aktivPeriode) return <></>;

    const skjønnsfastsettingEndringer: SykepengegrunnlagskjonnsfastsettingMedArbeidsgiverInfo[] =
        finnAlleInntektsforhold(person).flatMap((inntektsforhold) =>
            inntektsforhold.overstyringer
                .filter(isSykepengegrunnlagskjønnsfastsetting)
                .filter((overstyring) =>
                    dayjs(overstyring.skjonnsfastsatt.skjaeringstidspunkt).isSame(aktivPeriode.skjaeringstidspunkt),
                )
                .map((overstyring) => ({
                    ...overstyring,
                    inntektsforholdReferanse: tilReferanse(inntektsforhold),
                })),
        );

    const erBeslutteroppgave = (aktivPeriode as ApiBeregnetPeriode).totrinnsvurdering?.erBeslutteroppgave ?? false;
    const visningEndretSykepengegrunnlag = endretSykepengegrunnlag
        ? endretSykepengegrunnlag > sykepengegrunnlagsgrense.grense
            ? sykepengegrunnlagsgrense.grense
            : endretSykepengegrunnlag
        : null;
    const visningharEndring = visningEndretSykepengegrunnlag && visningEndretSykepengegrunnlag !== sykepengegrunnlag;

    return (
        <div className={styles.header}>
            {!editing && (
                <>
                    <BodyShort weight="semibold" className={styles.label}>
                        Sykepengegrunnlag
                    </BodyShort>
                    <div className={styles.beløp}>
                        {visningharEndring && <Endringstrekant />}
                        <BodyShort>{somPenger(visningEndretSykepengegrunnlag ?? sykepengegrunnlag)}</BodyShort>
                    </div>
                    {visningharEndring && (
                        <p className={styles.opprinneligSykepengegrunnlag}>{toKronerOgØre(sykepengegrunnlag)}</p>
                    )}
                    {skjønnsfastsettingEndringer.length > 0 && (
                        <EndringsloggSkjønnsfastsettingButton
                            endringer={skjønnsfastsettingEndringer}
                            className={styles.kildeIkon}
                        />
                    )}
                </>
            )}
            {kanSkjønnsfastsette && !erBeslutteroppgave && harMaler && (
                <VisHvisSkrivetilgang>
                    <Button
                        onClick={editing ? closeAndResetForm : openForm}
                        size="xsmall"
                        variant={editing ? 'tertiary' : 'secondary'}
                        icon={editing ? <XMarkIcon /> : <PersonPencilIcon />}
                        className={styles.redigeringsknapp}
                        style={editing ? { marginRight: '1rem' } : undefined}
                    >
                        {editing ? 'Avbryt' : 'Skjønnsfastsett'}
                    </Button>
                </VisHvisSkrivetilgang>
            )}
            {malerError && <ErrorMessage>{malerError}</ErrorMessage>}
        </div>
    );
};

export interface SykepengegrunnlagskjonnsfastsettingMedArbeidsgiverInfo extends ApiSykepengegrunnlagskjonnsfastsetting {
    inntektsforholdReferanse: InntektsforholdReferanse;
}
