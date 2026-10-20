import { useRouter } from 'next/navigation';
import React, { FormEvent, ReactElement, useRef } from 'react';
import { validate as validateUuid } from 'uuid';

import { Search } from '@navikt/ds-react';

import { useNullstillSaksbildeTab } from '@state/tab';

import { usePersonsøk } from './usePersonsøk';

import styles from './Personsøk.module.css';

export const Personsøk = (): ReactElement => {
    const router = useRouter();
    const nullstillSaksbildeTab = useNullstillSaksbildeTab();
    const { søkPersonMedFødselsnummerEllerAktørId, loading } = usePersonsøk();

    const searchRef = useRef<HTMLInputElement>(null);

    const søkOppPerson = async (event: FormEvent) => {
        event.preventDefault();
        const søketekst = searchRef.current?.value?.replace(/\s/g, '');

        if (!søketekst || loading) {
            return;
        }
        if (validateUuid(søketekst)) {
            nullstillSaksbildeTab();
            router.push(`/person/${søketekst}`);
            return;
        }
        søkPersonMedFødselsnummerEllerAktørId(søketekst);
    };

    return (
        <>
            <form className={styles.searchForm} onSubmit={søkOppPerson} autoComplete="off">
                <Search label="Søk" size="small" variant="secondary" placeholder="Søk" ref={searchRef} />
            </form>
        </>
    );
};
