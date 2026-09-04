import { useRouter } from 'next/navigation';
import React, { FormEvent, ReactElement, useRef } from 'react';
import { validate as validateUuid } from 'uuid';

import { Search } from '@navikt/ds-react';
import { teamLogger } from '@navikt/next-logger/team-log';

import { useLoadingToast } from '@hooks/useLoadingToast';
import { FetchError, NotFoundError, UgyldigFødselsnummerError, UgyldigIdentifikatorError } from '@io/graphql/errors';
import { usePostPersonSok } from '@io/rest/generated/personer/personer';
import { ApiPersonSokRequest } from '@io/rest/generated/spesialist.schemas';
import { useAbonnerPåEndringer } from '@io/sse/useAbonnerPåEndringer';
import { usePersonKlargjøres } from '@state/personSomKlargjøres';
import { useAddVarsel } from '@state/varsler';

import { validerFødselsnummer } from './validering';

import styles from './Personsøk.module.css';

const kanVæreFødselsnummer = (value: string) => value.match(/^\d{11}$/);
const kanVæreAktørId = (value: string) => value.match(/^\d{13}$/);

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
        const søketekst = searchRef.current?.value?.replace(/\s/g, '');

        if (!søketekst || loading) {
            return;
        }
        if (validateUuid(søketekst)) {
            router.push(`/person/${søketekst}`);
            return;
        }
        if (!(kanVæreAktørId(søketekst) || kanVæreFødselsnummer(søketekst))) {
            router.push('/');
            addVarsel(new UgyldigIdentifikatorError(søketekst));
        } else if (kanVæreFødselsnummer(søketekst) && !validerFødselsnummer(søketekst)) {
            router.push('/');
            addVarsel(new UgyldigFødselsnummerError(søketekst));
        } else {
            const personsøkVariables: ApiPersonSokRequest = kanVæreFødselsnummer(søketekst)
                ? { identitetsnummer: søketekst }
                : { aktørId: søketekst };

            void mutate(
                { data: personsøkVariables },
                {
                    onSuccess: (data) => {
                        if (!data.klarForVisning) {
                            venterPåKlargjøring(data.personPseudoId);
                        } else {
                            router.push(`/person/${data.personPseudoId}`);
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
