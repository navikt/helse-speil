import React, { ReactElement } from 'react';

import { BodyShort, HStack, Skeleton } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { Kjonn } from '@io/graphql';
import { useIsAnonymous } from '@state/anonymization';
import { useFetchPersonQuery } from '@state/person';
import { cn } from '@utils/tw';

import { GenderIcon } from './GenderIcon';
import { PersonHeaderWithContent } from './PersonHeaderWIthContent';

import styles from './PersonHeader.module.css';

const PersonHeaderContainer = (): ReactElement | null => {
    const isAnonymous = useIsAnonymous();
    const { loading, data } = useFetchPersonQuery();
    const person = data?.person;

    if (loading) {
        return <PersonHeaderSkeleton />;
    }

    if (!person) {
        return null;
    }

    return <PersonHeaderWithContent isAnonymous={isAnonymous} person={person} />;
};

const PersonHeaderSkeleton = (): ReactElement => {
    return (
        <div className={styles.PersonHeader}>
            <GenderIcon gender={Kjonn.Ukjent} />
            <Skeleton variant="rectangle" width="200px" />
            <BodyShort className={styles.Separator}>/</BodyShort>
            <Skeleton variant="rectangle" width="200px" />
            <BodyShort className={styles.Separator}>/</BodyShort>
            <Skeleton variant="rectangle" width="200px" />
            <BodyShort className={styles.Separator}>/</BodyShort>
            <Skeleton variant="rectangle" width="200px" />
            <HStack paddingInline="space-12 space-0" gap="space-12">
                <Skeleton variant="rectangle" width="6rem" />
            </HStack>
        </div>
    );
};

const PersonHeaderError = (): ReactElement => {
    return (
        <div className={cn(styles.PersonHeader, styles.Error)}>
            <BodyShort>Det oppstod en feil. Kan ikke vise personinformasjon.</BodyShort>
        </div>
    );
};

export const PersonHeader = (): ReactElement => {
    return (
        <ErrorBoundary fallback={<PersonHeaderError />}>
            <PersonHeaderContainer />
        </ErrorBoundary>
    );
};
