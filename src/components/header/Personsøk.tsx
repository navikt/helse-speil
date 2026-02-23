import { useRouter } from 'next/navigation';
import React, { FormEvent, ReactElement, useRef } from 'react';
import { validate } from 'uuid';

import { Search } from '@navikt/ds-react';
import { teamLogger } from '@navikt/next-logger/team-log';

import { useLoadingToast } from '@hooks/useLoadingToast';
import { validFødselsnummer } from '@io/graphql/common';
import { BadRequestError, FetchError, NotFoundError } from '@io/graphql/errors';
import { usePostPersonSok } from '@io/rest/generated/personsøk/personsøk';
import { ApiPersonSokRequest } from '@io/rest/generated/spesialist.schemas';
import { useAbonnerPåEndringer } from '@io/sse/useAbonnerPåEndringer';
import { usePersonKlargjøres } from '@state/personSomKlargjøres';
import { useAddVarsel } from '@state/varsler';

import styles from './Personsøk.module.css';

const erGyldigPersonId = (value: string) => value.match(/^\d{13}$/) || value.match(/^\d{11}$/) || validate(value);

export const Personsøk = (): ReactElement => {
    const addVarsel = useAddVarsel();
    const router = useRouter();
    const { mutate, isPending: loading } = usePostPersonSok();
    const { venterPåKlargjøring, klargjortPseudoId } = usePersonKlargjøres();
    useAbonnerPåEndringer(klargjortPseudoId);

    useLoadingToast({ isLoading: loading, message: 'Henter person' });

    const searchRef = useRef<HTMLInputElement>(null);

    const søkOppPerson = async (event: FormEvent) => {
        event.preventDefault();
        const rawPersonId = searchRef.current?.value;
        const personId = rawPersonId?.replace(/\s/g, '');

        if (!personId || loading) {
            return;
        }

        if (!erGyldigPersonId(personId)) {
            router.push('/');
            addVarsel(new BadRequestError(personId));
        } else {
            if (validate(personId)) {
                router.push(`/person/${personId}/dagoversikt`);
                return;
            }
            const personsøkVariables: ApiPersonSokRequest = validFødselsnummer(personId)
                ? { identitetsnummer: personId }
                : { aktørId: personId };

            void mutate(
                { data: personsøkVariables },
                {
                    onSuccess: (data) => {
                        if (!data.klarForVisning) {
                            venterPåKlargjøring(data.personPseudoId);
                        } else {
                            router.push(`/person/${data.personPseudoId}/dagoversikt`);
                        }
                    },
                    onError: (error) => {
                        if (error.response) {
                            if (error.response.status >= 400 && error.response.status < 500) {
                                teamLogger.warn(
                                    error,
                                    'Fikk klientfeil fra søk etter person, viser at person ikke finnes',
                                );
                                addVarsel(new NotFoundError());
                            } else {
                                teamLogger.error(error, 'Fikk serverfeil fra søk etter person, viser feilmelding');
                                addVarsel(new FetchError());
                            }
                        }
                    },
                },
            );
        }
    };

    return (
        <>
            <form className={styles.searchForm} onSubmit={søkOppPerson} autoComplete="off">
                <Search label="Søk" size="small" variant="secondary" placeholder="Søk" ref={searchRef} />
            </form>
        </>
    );
};
