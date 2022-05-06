import React from 'react';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import { BodyShort } from '@navikt/ds-react';

import { Clipboard } from '@components/clipboard';
import { Manneikon } from '@components/ikoner/Manneikon';
import { Kvinneikon } from '@components/ikoner/Kvinneikon';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { AnonymizableBold } from '@components/anonymizable/AnonymizableBold';
import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { KjønnsnøytraltIkon } from '@components/ikoner/KjønnsnøytraltIkon';
import { AnonymizableContainer } from '@components/anonymizable/AnonymizableContainer';

import { utbetalingsoversikt } from '@utils/featureToggles';
import { NORSK_DATOFORMAT } from '@utils/date';
import { capitalizeName } from '@utils/locale';
import { useIsAnonymous } from '@state/anonymization';
import { useCurrentPerson } from '@state/person';
import { Enhet, Kjonn, Maybe, Personinfo } from '@io/graphql';

import styles from './PersonHeader.module.css';

const getFormattedFødselsnummer = (fødselsnummer: string) => {
    return fødselsnummer.slice(0, 6) + ' ' + fødselsnummer.slice(6);
};

const getFormattedName = ({ etternavn, mellomnavn, fornavn }: Personinfo) => {
    return `${etternavn}, ${fornavn}${mellomnavn ? ` ${mellomnavn}` : ''}`;
};

interface GenderIconProps extends React.SVGAttributes<SVGElement> {
    gender?: Maybe<Kjonn>;
}

const GenderIcon: React.VFC<GenderIconProps> = ({ gender, ...svgProps }) => {
    switch (gender?.toLowerCase()) {
        case 'kvinne':
            return <Kvinneikon alt="Kvinne" {...svgProps} />;
        case 'mann':
            return <Manneikon alt="Mann" {...svgProps} />;
        default:
            return <KjønnsnøytraltIkon alt="Ukjent" {...svgProps} />;
    }
};

interface PersonHeaderWithContentProps {
    fødselsnummer: string;
    aktørId: string;
    enhet: Enhet;
    personinfo: Personinfo;
    isAnonymous: boolean;
    dødsdato?: Maybe<DateString>;
}

const PersonHeaderWithContent: React.VFC<PersonHeaderWithContentProps> = ({
    fødselsnummer,
    aktørId,
    enhet,
    personinfo,
    isAnonymous,
    dødsdato,
}) => {
    const formattedName = capitalizeName(getFormattedName(personinfo));
    const formattedAge = personinfo.fodselsdato !== null && ` (${dayjs().diff(personinfo.fodselsdato, 'year')} år)`;
    return (
        <div className={styles.PersonHeader}>
            <GenderIcon gender={isAnonymous ? Kjonn.Ukjent : personinfo.kjonn} />
            <AnonymizableBold>
                {formattedName}
                {formattedAge}
            </AnonymizableBold>
            <BodyShort className={styles.Separator}>/</BodyShort>
            {fødselsnummer ? (
                <Clipboard
                    preserveWhitespace={false}
                    copyMessage="Fødselsnummer er kopiert"
                    tooltip={{ content: 'Kopier fødselsnummer', keys: ['alt', 'c'] }}
                >
                    <AnonymizableText>{getFormattedFødselsnummer(fødselsnummer)}</AnonymizableText>
                </Clipboard>
            ) : (
                <BodyShort>Fødselsnummer ikke tilgjengelig</BodyShort>
            )}
            <BodyShort className={styles.Separator}>/</BodyShort>
            <AnonymizableText>Aktør-ID:&nbsp;</AnonymizableText>
            <Clipboard
                preserveWhitespace={false}
                copyMessage="Aktør-ID er kopiert"
                tooltip={{ content: 'Kopier aktør-ID' }}
            >
                <AnonymizableText>{aktørId}</AnonymizableText>
            </Clipboard>
            <BodyShort className={styles.Separator}>/</BodyShort>
            <AnonymizableText>
                Boenhet: {enhet.id} ({enhet.navn})
            </AnonymizableText>
            {utbetalingsoversikt && (
                <>
                    <BodyShort className={styles.Separator}>/</BodyShort>
                    <Link className={styles.Link} to={`${aktørId}/../utbetalingshistorikk`}>
                        Utbetalingsoversikt
                    </Link>
                </>
            )}
            {personinfo.adressebeskyttelse === 'Fortrolig' && (
                <AnonymizableContainer className={classNames(styles.Tag, styles.adressebeskyttelse)}>
                    {personinfo.adressebeskyttelse} adresse
                </AnonymizableContainer>
            )}
            {dødsdato && (
                <AnonymizableContainer className={classNames(styles.Tag, styles.dødsdato)}>
                    Død {dayjs(dødsdato)?.format(NORSK_DATOFORMAT)}
                </AnonymizableContainer>
            )}
        </div>
    );
};

const PersonHeaderContainer: React.VFC = () => {
    const currentPerson = useCurrentPerson();
    const isAnonymous = useIsAnonymous();

    return !currentPerson ? (
        <div className={styles.PersonHeader} />
    ) : (
        <PersonHeaderWithContent
            fødselsnummer={currentPerson.fodselsnummer}
            aktørId={currentPerson.aktorId}
            enhet={currentPerson.enhet}
            personinfo={currentPerson.personinfo}
            isAnonymous={isAnonymous}
            dødsdato={currentPerson.dodsdato}
        />
    );
};

const PersonHeaderSkeleton: React.VFC = () => {
    return (
        <div className={styles.PersonHeader}>
            <KjønnsnøytraltIkon />
            <div className={styles.LoadingText} />
            <BodyShort className={styles.Separator}>/</BodyShort>
            <div className={styles.LoadingText} />
            <BodyShort className={styles.Separator}>/</BodyShort>
            <div className={styles.LoadingText} />
            <BodyShort className={styles.Separator}>/</BodyShort>
            <div className={styles.LoadingText} />
            <BodyShort className={styles.Separator}>/</BodyShort>
            <div className={styles.LoadingText} />
        </div>
    );
};

const PersonHeaderError: React.VFC = () => {
    return (
        <div className={classNames(styles.PersonHeader, styles.Error)}>
            <BodyShort>Det oppstod en feil. Kan ikke vise personinformasjon.</BodyShort>
        </div>
    );
};

export const PersonHeader: React.VFC = () => {
    return (
        <React.Suspense fallback={<PersonHeaderSkeleton />}>
            <ErrorBoundary fallback={<PersonHeaderError />}>
                <PersonHeaderContainer />
            </ErrorBoundary>
        </React.Suspense>
    );
};

export const _PersonHeader = PersonHeaderWithContent;
