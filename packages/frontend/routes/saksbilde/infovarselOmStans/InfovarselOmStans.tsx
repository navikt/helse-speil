import classNames from 'classnames';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { useCurrentPerson, useFetchPersonQuery } from '@state/person';

import { UnntattFraAutomatisering } from './UnntattFraAutomatisering';

import styles from '../personHeader/PersonHeader.module.css';

const InfovarselOmStansContainer: React.FC = () => {
    const currentPerson = useCurrentPerson();
    const { loading } = useFetchPersonQuery();

    if (loading) {
        return <div></div>;
    }

    if (!currentPerson) {
        return <div />;
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

const InfovarselOmStansError: React.FC = () => {
    return (
        <div className={classNames(styles.Error)}>
            <BodyShort>Det oppstod en feil. Kan ikke vise personinformasjon.</BodyShort>
        </div>
    );
};

export const InfovarselOmStans: React.FC = () => {
    return (
        <ErrorBoundary fallback={<InfovarselOmStansError />}>
            <InfovarselOmStansContainer />
        </ErrorBoundary>
    );
};
