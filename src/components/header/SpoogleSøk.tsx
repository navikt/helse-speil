import { useRouter } from 'next/navigation';
import React, { FormEvent, ReactElement, useRef } from 'react';
import { validate as validateUuid } from 'uuid';

import { Search } from '@navikt/ds-react';
import { teamLogger } from '@navikt/next-logger/team-log';

import { FetchError } from '@io/errors';
import { useFinnFødselsnummerISpoogle } from '@io/rest/spoogle';
import { useNullstillSaksbildeTab } from '@state/tab';
import { useAddVarsel } from '@state/varsler';

import { usePersonsøk } from './usePersonsøk';

import styles from './Personsøk.module.css';

export function SpoogleSøk(): ReactElement {
    const addVarsel = useAddVarsel();
    const router = useRouter();
    const nullstillSaksbildeTab = useNullstillSaksbildeTab();
    const { mutate: finnFødselsnummer, isPending: henterFødselsnummer } = useFinnFødselsnummerISpoogle();
    const { søkPerson, søkPersonMedFødselsnummerEllerAktørId, loading } = usePersonsøk(henterFødselsnummer);

    const searchRef = useRef<HTMLInputElement>(null);

    function søk(event: FormEvent) {
        event.preventDefault();
        const søketekst = searchRef.current?.value?.replace(/\s/g, '');

        if (!søketekst || loading) {
            return;
        }
        if (!validateUuid(søketekst)) {
            søkPersonMedFødselsnummerEllerAktørId(søketekst);
            return;
        }

        finnFødselsnummer(søketekst, {
            onSuccess: (fødselsnummer) => søkPerson({ identitetsnummer: fødselsnummer }),
            onError: (error) => {
                if (error.status === 404) {
                    // Ukjent for Spoogle – kan være en personPseudoId, slik som i vanlig personsøk
                    nullstillSaksbildeTab();
                    router.push(`/person/${søketekst}`);
                } else {
                    teamLogger.error(error, 'Fikk feil fra spoogle ved søk');
                    addVarsel(new FetchError());
                }
            },
        });
    }

    return (
        <form className={styles.searchForm} onSubmit={søk} autoComplete="off">
            <Search label="Søk" size="small" variant="secondary" placeholder="Søk" ref={searchRef} />
        </form>
    );
}
