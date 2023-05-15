import classNames from 'classnames';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { LoadingShimmer } from '@components/LoadingShimmer';
import { Kjonn } from '@io/graphql';
import { useIsAnonymous } from '@state/anonymization';
import { useCurrentPerson, useIsFetchingPerson } from '@state/person';

import { GenderIcon } from './GenderIcon';
import { PersonHeaderWithContent } from './PersonHeaderWIthContent';

import styles from './PersonHeader.module.css';

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
