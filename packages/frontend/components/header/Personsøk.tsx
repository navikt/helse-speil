import React, { FormEvent, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Search } from '@navikt/ds-react';

import styles from '@components/header/Header.module.css';
import { useLoadingToast } from '@hooks/useLoadingToast';
import { erGyldigPersonId } from '@hooks/useRefreshPersonVedUrlEndring';
import { NotFoundError } from '@io/graphql/errors';
import { useFetchPerson } from '@state/person';
import { useAddVarsel, useRemoveVarsel } from '@state/varsler';
import { SpeilError } from '@utils/error';

export const Personsøk: React.FC = () => {
    const fetchPerson = useFetchPerson();
    const removeVarsel = useRemoveVarsel();
    const addVarsel = useAddVarsel();
    const navigate = useNavigate();
    const [isFetching, setIsFetching] = useState(false);

    useLoadingToast({ isLoading: isFetching, message: 'Henter person' });

    const searchRef = useRef<HTMLInputElement>(null);

    const søkOppPerson = (event: FormEvent) => {
        event.preventDefault();
        removeVarsel('ugyldig-søk');
        const personId = searchRef.current?.value;

        if (!personId || isFetching) {
            return;
        }

        if (!erGyldigPersonId(personId)) {
            addVarsel(new SpeilError(`"${personId}" er ikke en gyldig aktør-ID/fødselsnummer.`));
        } else {
            setIsFetching(true);
            fetchPerson(personId)
                .then((personState) => {
                    if (personState?.person?.arbeidsgivere.length === 0) {
                        addVarsel(new NotFoundError());
                        return;
                    }
                    if (personState?.person) {
                        navigate(`/person/${personState.person.aktorId}/utbetaling`);
                    }
                })
                .finally(() => {
                    setIsFetching(false);
                });
        }
    };

    return (
        <form className={styles.SearchForm} onSubmit={søkOppPerson}>
            <Search label="Søk" size="small" variant="secondary" placeholder="Søk" ref={searchRef} />
        </form>
    );
};
