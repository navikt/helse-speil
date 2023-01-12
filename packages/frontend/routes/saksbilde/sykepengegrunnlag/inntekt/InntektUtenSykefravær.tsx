import classNames from 'classnames';
import React, { useState } from 'react';

import { Bag } from '@navikt/ds-icons';
import { Tooltip } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { Flex } from '@components/Flex';
import { Kilde } from '@components/Kilde';
import { AnonymizableTextWithEllipsis } from '@components/TextWithEllipsis';
import { AnonymizableContainer } from '@components/anonymizable/AnonymizableContainer';
import { Clipboard } from '@components/clipboard';
import { Arbeidsgiver, BeregnetPeriode, Inntektskilde, Maybe, OmregnetArsinntekt, Periodetilstand } from '@io/graphql';
import { Refusjonsopplysning } from '@io/http';
import { useEndringerForPeriode } from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
import { useCurrentPerson } from '@state/person';
import { kanOverstyreRefusjonsopplysninger } from '@utils/featureToggles';
import { kildeForkortelse } from '@utils/inntektskilde';
import { isBeregnetPeriode, isGhostPeriode } from '@utils/typeguards';

import { OverstyrArbeidsforholdUtenSykdom } from '../OverstyrArbeidsforholdUtenSykdom';
import { BegrunnelseForOverstyring } from '../overstyring.types';
import { Refusjonsoversikt } from '../refusjon/Refusjonsoversikt';
import { EditableInntekt } from './EditableInntekt';
import { EndringsloggButton } from './EndringsloggButton';
import { ReadOnlyInntekt } from './ReadOnlyInntekt';
import { RedigerGhostInntekt } from './RedigerGhostInntekt';

import styles from './Inntekt.module.css';

const maybePeriodeTilGodkjenning = (person: FetchedPerson, skjæringstidspunkt: DateString): Maybe<BeregnetPeriode> => {
    return (
        (
            person?.arbeidsgivere
                .flatMap((it) => it.generasjoner[0]?.perioder)
                .filter(isBeregnetPeriode) as Array<BeregnetPeriode>
        ).find(
            (it) =>
                it.periodetilstand === Periodetilstand.TilGodkjenning && it.skjaeringstidspunkt === skjæringstidspunkt
        ) ?? null
    );
};

const maybePeriodeForSkjæringstidspunkt = (
    person: FetchedPerson,
    skjæringstidspunkt: DateString
): Maybe<BeregnetPeriode> => {
    return (
        (
            person?.arbeidsgivere
                .flatMap((it) => it.generasjoner[0]?.perioder)
                .filter(isBeregnetPeriode) as Array<BeregnetPeriode>
        ).find((it) => it.skjaeringstidspunkt === skjæringstidspunkt) ?? null
    );
};

const harIngenUtbetaltePerioderFor = (person: FetchedPerson, skjæringstidspunkt: DateString): boolean => {
    return (
        person?.arbeidsgivere
            .flatMap((it) => it.generasjoner[0]?.perioder)
            .filter(isBeregnetPeriode)
            .filter((it) => it.skjaeringstidspunkt === skjæringstidspunkt)
            .every((it) =>
                [
                    Periodetilstand.TilGodkjenning,
                    Periodetilstand.VenterPaEnAnnenPeriode,
                    Periodetilstand.ForberederGodkjenning,
                    Periodetilstand.ManglerInformasjon,
                ].includes(it.periodetilstand)
            ) ?? false
    );
};

const harIngenPerioderTilBeslutterFor = (person: FetchedPerson, skjæringstidspunkt: DateString): boolean => {
    return (
        (
            person?.arbeidsgivere
                .flatMap((it) => it.generasjoner[0]?.perioder)
                .filter(
                    (it) => isBeregnetPeriode(it) && it.skjaeringstidspunkt === skjæringstidspunkt
                ) as Array<BeregnetPeriode>
        ).every((it) => !it.oppgave?.erBeslutter) ?? false
    );
};

const useArbeidsforholdKanOverstyres = (organisasjonsnummer: string): boolean => {
    const person = useCurrentPerson();
    const activePeriod = useActivePeriod();

    if (!isGhostPeriode(activePeriod) || !person) {
        return false;
    }

    const periodeForSkjæringstidspunkt = maybePeriodeForSkjæringstidspunkt(person, activePeriod.skjaeringstidspunkt);

    const harIngenPerioderTilBeslutter = harIngenPerioderTilBeslutterFor(person, activePeriod.skjaeringstidspunkt);

    return (
        activePeriod.organisasjonsnummer === organisasjonsnummer &&
        harIngenPerioderTilBeslutter &&
        periodeForSkjæringstidspunkt !== undefined
    );
};

const useGhostInntektKanOverstyres = (organisasjonsnummer: string): boolean => {
    const person = useCurrentPerson();
    const activePeriod = useActivePeriod();

    if (!isGhostPeriode(activePeriod) || !person) {
        return false;
    }

    const periodeTilGodkjenning = maybePeriodeTilGodkjenning(person, activePeriod.skjaeringstidspunkt);

    const harIngenUtbetaltePerioder = harIngenUtbetaltePerioderFor(person, activePeriod.skjaeringstidspunkt);

    const harIngenPerioderTilBeslutter = harIngenPerioderTilBeslutterFor(person, activePeriod.skjaeringstidspunkt);

    return (
        activePeriod.organisasjonsnummer === organisasjonsnummer &&
        harIngenUtbetaltePerioder &&
        harIngenPerioderTilBeslutter &&
        periodeTilGodkjenning !== undefined
    );
};

const endreInntektUtenSykefraværBegrunnelser: BegrunnelseForOverstyring[] = [
    {
        id: '0',
        forklaring: 'Arbeidsforhold har vart kortere enn 3 måneder',
        subsumsjon: { paragraf: '8-28', ledd: '3', bokstav: 'b' },
    },
    {
        id: '1',
        forklaring: 'Varig lønnsendring',
        subsumsjon: { paragraf: '8-28', ledd: '3', bokstav: 'c' },
    },
    {
        id: '2',
        forklaring: 'Innrapportert feil inntekt til A-ordningen',
        subsumsjon: { paragraf: '8-28', ledd: '5' },
    },
    {
        id: '3',
        forklaring: 'Annen kilde til endring',
        subsumsjon: { paragraf: '8-28' },
    },
];

interface InntektUtenSykefraværProps {
    organisasjonsnummer: string;
    skjæringstidspunkt: DateString;
    erDeaktivert?: Maybe<boolean>;
    omregnetÅrsinntekt?: Maybe<OmregnetArsinntekt>;
    vilkårsgrunnlagId?: Maybe<string>;
    arbeidsgiver: Arbeidsgiver;
    refusjon?: Maybe<Refusjonsopplysning[]>;
}

export const InntektUtenSykefravær = ({
    organisasjonsnummer,
    skjæringstidspunkt,
    erDeaktivert,
    omregnetÅrsinntekt,
    vilkårsgrunnlagId,
    arbeidsgiver,
    refusjon,
}: InntektUtenSykefraværProps) => {
    const [editingInntekt, setEditingInntekt] = useState(false);
    const [endret, setEndret] = useState(false);

    const arbeidsforholdKanOverstyres = useArbeidsforholdKanOverstyres(organisasjonsnummer);
    const inntektKanOverstyres = useGhostInntektKanOverstyres(organisasjonsnummer);
    const { arbeidsforholdendringer } = useEndringerForPeriode(organisasjonsnummer);

    return (
        <div
            className={classNames(styles.Inntekt, editingInntekt && styles.editing, erDeaktivert && styles.deaktivert)}
        >
            <div className={classNames(styles.Header, editingInntekt && styles.editing)}>
                <div className={styles.ArbeidsgiverHeader}>
                    <Tooltip content="Arbeidsgiver">
                        <Bag title="Arbeidsgiver" />
                    </Tooltip>
                    <Tooltip content="Arbeidsgivernavn">
                        <div className={styles.Arbeidsgivernavn}>
                            <AnonymizableTextWithEllipsis>{arbeidsgiver.navn}</AnonymizableTextWithEllipsis>
                        </div>
                    </Tooltip>
                    <div className={styles.Organisasjonsnummer}>
                        (
                        <Clipboard
                            copyMessage="Organisasjonsnummer er kopiert"
                            tooltip={{ content: 'Kopier organisasjonsnummer' }}
                        >
                            <AnonymizableContainer>{arbeidsgiver.organisasjonsnummer}</AnonymizableContainer>
                        </Clipboard>
                        )
                    </div>
                    <Kilde type="AINNTEKT">AA</Kilde>
                </div>
                {vilkårsgrunnlagId && inntektKanOverstyres && !erDeaktivert && (
                    <RedigerGhostInntekt setEditing={setEditingInntekt} editing={editingInntekt} />
                )}
            </div>
            <Flex alignItems="center">
                <Bold>Beregnet månedsinntekt</Bold>
                {endret || omregnetÅrsinntekt?.kilde === Inntektskilde.Saksbehandler ? (
                    <EndringsloggButton endringer={arbeidsforholdendringer} />
                ) : (
                    <Kilde type={omregnetÅrsinntekt?.kilde}>{kildeForkortelse(omregnetÅrsinntekt?.kilde)}</Kilde>
                )}
            </Flex>
            {editingInntekt ? (
                <EditableInntekt
                    omregnetÅrsinntekt={omregnetÅrsinntekt!}
                    close={() => setEditingInntekt(false)}
                    onEndre={setEndret}
                    begrunnelser={endreInntektUtenSykefraværBegrunnelser}
                />
            ) : (
                <ReadOnlyInntekt omregnetÅrsinntekt={omregnetÅrsinntekt} deaktivert={erDeaktivert} />
            )}
            {!editingInntekt && arbeidsforholdKanOverstyres && (
                <OverstyrArbeidsforholdUtenSykdom
                    organisasjonsnummerAktivPeriode={organisasjonsnummer}
                    skjæringstidspunkt={skjæringstidspunkt}
                    arbeidsforholdErDeaktivert={erDeaktivert}
                />
            )}
            {refusjon &&
                refusjon.length !== 0 &&
                ((kanOverstyreRefusjonsopplysninger && !editingInntekt) || !kanOverstyreRefusjonsopplysninger) && (
                    <Refusjonsoversikt refusjon={refusjon} />
                )}
        </div>
    );
};
