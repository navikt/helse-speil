import classNames from 'classnames';
import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { Maybe } from '@io/graphql';
import { useCurrentPerson, useFetchPersonQuery } from '@state/person';

import { UnntattFraAutomatisering } from './UnntattFraAutomatisering';

import styles from '../personHeader/PersonHeader.module.css';

const InfovarselOmStansContainer = (): Maybe<ReactElement> => {
    const currentPerson = useCurrentPerson();
    const { loading } = useFetchPersonQuery();

    if (loading) {
        return null;
    }

    if (!currentPerson) {
        return null;
    }

    const unntattFraAutomatisering = currentPerson.personinfo.unntattFraAutomatisering;

    if (unntattFraAutomatisering && unntattFraAutomatisering.erUnntatt) {
        return (
            <UnntattFraAutomatisering
                årsaker={unntattFraAutomatisering.arsaker}
                tidspunkt={unntattFraAutomatisering.tidspunkt!}
                fødselsnummer={currentPerson.fodselsnummer}
            />
        );
    }

    return null;
};

const InfovarselOmStansError = (): ReactElement => {
    return (
        <div className={classNames(styles.Error)}>
            <BodyShort>Det oppstod en feil. Kan ikke vise personinformasjon.</BodyShort>
        </div>
    );
};

export const InfovarselOmStans = (): ReactElement => {
    return (
        <ErrorBoundary fallback={<InfovarselOmStansError />}>
            <InfovarselOmStansContainer />
        </ErrorBoundary>
    );
};
