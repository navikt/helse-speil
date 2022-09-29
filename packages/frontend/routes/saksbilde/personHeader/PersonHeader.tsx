import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { BodyShort } from '@navikt/ds-react';

import { Clipboard } from '@components/clipboard';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { LoadingShimmer } from '@components/LoadingShimmer';
import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { Enhet, Kjonn, Maybe, Personinfo } from '@io/graphql';
import { utbetalingsoversikt } from '@utils/featureToggles';
import { useCurrentPerson } from '@state/person';
import { useIsAnonymous } from '@state/anonymization';

import { AdressebeskyttelseTag } from './AdressebeskyttelseTag';
import { ReservasjonTag } from './ReservasjonTag';
import { Fødselsnummer } from './Fødselsnummer';
import { DødsdatoTag } from './DødsdatoTag';
import { NavnOgAlder } from './NavnOgAlder';
import { GenderIcon } from './GenderIcon';

import styles from './PersonHeader.module.css';

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

const PersonHeaderContainer: React.VFC = () => {
    const currentPerson = useCurrentPerson();
    const isAnonymous = useIsAnonymous();

    return !currentPerson ? (
        <PersonHeaderSkeleton />
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

const PersonHeaderError: React.VFC = () => {
    return (
        <div className={classNames(styles.PersonHeader, styles.Error)}>
            <BodyShort>Det oppstod en feil. Kan ikke vise personinformasjon.</BodyShort>
        </div>
    );
};

export const PersonHeader: React.VFC = () => {
    return (
        <ErrorBoundary fallback={<PersonHeaderError />}>
            <PersonHeaderContainer />
        </ErrorBoundary>
    );
};

export const _PersonHeader = PersonHeaderWithContent;
