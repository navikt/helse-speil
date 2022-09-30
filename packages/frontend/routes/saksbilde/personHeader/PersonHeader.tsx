import { DødsdatoTag } from './DødsdatoTag';
import { Fødselsnummer } from './Fødselsnummer';
import classNames from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';

import { BodyShort } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { LoadingShimmer } from '@components/LoadingShimmer';
import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { Clipboard } from '@components/clipboard';
import { Enhet, Kjonn, Maybe, Personinfo } from '@io/graphql';
import { useIsAnonymous } from '@state/anonymization';
import { useCurrentPerson, useIsFetchingPerson } from '@state/person';
import { utbetalingsoversikt } from '@utils/featureToggles';

import { AdressebeskyttelseTag } from './AdressebeskyttelseTag';
import { GenderIcon } from './GenderIcon';
import { NavnOgAlder } from './NavnOgAlder';
import { ReservasjonTag } from './ReservasjonTag';

import styles from './PersonHeader.module.css';

interface PersonHeaderWithContentProps {
    fødselsnummer: string;
    aktørId: string;
    enhet: Enhet;
    personinfo: Personinfo;
    isAnonymous: boolean;
    dødsdato?: Maybe<DateString>;
}

const PersonHeaderWithContent: React.FC<PersonHeaderWithContentProps> = ({
    fødselsnummer,
    aktørId,
    enhet,
    personinfo,
    isAnonymous,
    dødsdato,
}) => {
    return (
        <div className={styles.PersonHeader}>
            <GenderIcon gender={isAnonymous ? Kjonn.Ukjent : personinfo.kjonn} />
            <NavnOgAlder personinfo={personinfo} />
            <BodyShort className={styles.Separator}>/</BodyShort>
            <Fødselsnummer fødselsnummer={fødselsnummer} />
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
            <div className={styles.Tags}>
                <AdressebeskyttelseTag adressebeskyttelse={personinfo.adressebeskyttelse} />
                <ReservasjonTag reservasjon={personinfo.reservasjon} />
                <DødsdatoTag dødsdato={dødsdato} />
            </div>
        </div>
    );
};

const PersonHeaderContainer: React.FC = () => {
    const currentPerson = useCurrentPerson();
    const isAnonymous = useIsAnonymous();
    const isLoading = useIsFetchingPerson();

    if (isLoading) {
        return <PersonHeaderSkeleton />;
    }

    if (!currentPerson) {
        return <div className={styles.PersonHeader} />;
    }

    return (
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

const PersonHeaderSkeleton: React.FC = () => {
    return (
        <div className={styles.PersonHeader}>
            <GenderIcon gender={Kjonn.Ukjent} />
            <LoadingShimmer />
            <BodyShort className={styles.Separator}>/</BodyShort>
            <LoadingShimmer />
            <BodyShort className={styles.Separator}>/</BodyShort>
            <LoadingShimmer />
            <BodyShort className={styles.Separator}>/</BodyShort>
            <LoadingShimmer />
            <BodyShort className={styles.Separator}>/</BodyShort>
            <LoadingShimmer />
        </div>
    );
};

const PersonHeaderError: React.FC = () => {
    return (
        <div className={classNames(styles.PersonHeader, styles.Error)}>
            <BodyShort>Det oppstod en feil. Kan ikke vise personinformasjon.</BodyShort>
        </div>
    );
};

export const PersonHeader: React.FC = () => {
    return (
        <ErrorBoundary fallback={<PersonHeaderError />}>
            <PersonHeaderContainer />
        </ErrorBoundary>
    );
};

export const _PersonHeader = PersonHeaderWithContent;
