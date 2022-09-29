import React, { FormEvent, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Search } from '@navikt/ds-react';

import { useFetchPerson } from '@state/person';
import { useToggleEasterEgg } from '@state/easterEgg';
import { useAddVarsel, useRemoveVarsel } from '@state/varsler';
import { erGyldigPersonId } from '@hooks/useRefreshPersonVedUrlEndring';
import { useLoadingToast } from '@hooks/useLoadingToast';
import { SpeilError } from '@utils/error';

import styles from '@components/header/Header.module.css';

export const Personsøk: React.FC = () => {
    const fetchPerson = useFetchPerson();
    const removeVarsel = useRemoveVarsel();
    const addVarsel = useAddVarsel();
    const history = useHistory();
    const [isFetching, setIsFetching] = useState(false);
    const toggleEasterEgg = useToggleEasterEgg();

    useLoadingToast({ isLoading: isFetching, message: 'Henter person' });

    const searchRef = useRef<HTMLInputElement>(null);

    const søkOppPerson = (event: FormEvent) => {
        event.preventDefault();
        removeVarsel('ugyldig-søk');
        const personId = searchRef.current?.value;

        if (!personId || isFetching) {
            return;
        }

        if (personId.toLowerCase() === 'agurk') {
            toggleEasterEgg('Agurk');
            return;
        }

        if (!erGyldigPersonId(personId)) {
            addVarsel(new SpeilError(`"${personId}" er ikke en gyldig aktør-ID/fødselsnummer.`));
        } else {
            setIsFetching(true);
            fetchPerson(personId)
                .then((personState) => {
                    if (personState?.person) {
                        history.push(`/person/${personState.person.aktorId}/utbetaling`);
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
