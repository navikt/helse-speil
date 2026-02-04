import dayjs from 'dayjs';
import React from 'react';

import { PersonPencilIcon, XMarkIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, ErrorMessage } from '@navikt/ds-react';

import { Endringstrekant } from '@components/Endringstrekant';
import { VisHvisSkrivetilgang } from '@components/VisHvisSkrivetilgang';
import { SkjønnsfastsettingMal } from '@external/sanity';
import {
    BeregnetPeriodeFragment,
    PersonFragment,
    Sykepengegrunnlagsgrense,
    Sykepengegrunnlagskjonnsfastsetting,
} from '@io/graphql';
import { EndringsloggSkjønnsfastsettingButton } from '@saksbilde/sykepengegrunnlag/skjønnsfastsetting/EndringsloggSkjønnsfastsettingButton';
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
    person: PersonFragment;
    sykepengegrunnlag: number;
    endretSykepengegrunnlag: number | null;
    sykepengegrunnlagsgrense: Sykepengegrunnlagsgrense;
    editing: boolean;
    openForm: () => void;
    maler: SkjønnsfastsettingMal[] | undefined;
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

    const erBeslutteroppgave = (aktivPeriode as BeregnetPeriodeFragment).totrinnsvurdering?.erBeslutteroppgave ?? false;
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
            {!erBeslutteroppgave && harMaler && (
                <VisHvisSkrivetilgang>
                    {!editing ? (
                        <Button
                            onClick={openForm}
                            size="xsmall"
                            variant="secondary"
                            icon={<PersonPencilIcon />}
                            className={styles.redigeringsknapp}
                        >
                            Skjønnsfastsett
                        </Button>
                    ) : (
                        <Button
                            onClick={closeAndResetForm}
                            size="xsmall"
                            variant="tertiary"
                            icon={<XMarkIcon />}
                            className={styles.redigeringsknapp}
                            style={{ marginRight: '1rem' }}
                        >
                            Avbryt
                        </Button>
                    )}
                </VisHvisSkrivetilgang>
            )}
            {malerError && <ErrorMessage>{malerError}</ErrorMessage>}
        </div>
    );
};

export interface SykepengegrunnlagskjonnsfastsettingMedArbeidsgiverInfo extends Sykepengegrunnlagskjonnsfastsetting {
    inntektsforholdReferanse: InntektsforholdReferanse;
}
