import { useRouter } from 'next/navigation';

import { teamLogger } from '@navikt/next-logger/team-log';

import { useLoadingToast } from '@hooks/useLoadingToast';
import { FetchError, NotFoundError, UgyldigFødselsnummerError, UgyldigIdentifikatorError } from '@io/errors';
import { usePostPersonSok } from '@io/rest/generated/personer/personer';
import { ApiPersonSokRequest } from '@io/rest/generated/spesialist.schemas';
import { Personkilde, merkKildeForNestePerson } from '@observability/hendelser';
import { useNullstillSaksbildeTab } from '@state/tab';
import { useAddVarsel } from '@state/varsler';
import { PeriodeUrlId, lagPeriodeUrl } from '@utils/undersider';

import { validerFødselsnummer } from './validering';

export function usePersonsøk(kilde: Personkilde, ekstraLoading: boolean = false) {
    const addVarsel = useAddVarsel();
    const router = useRouter();
    const nullstillSaksbildeTab = useNullstillSaksbildeTab();
    const { mutate, isPending } = usePostPersonSok();
    const loading = isPending || ekstraLoading;

    useLoadingToast({ isLoading: loading, message: 'Henter person' });

    function søkPerson(request: ApiPersonSokRequest, periode?: PeriodeUrlId) {
        mutate(
            { data: request },
            {
                onSuccess: (data) => {
                    nullstillSaksbildeTab();
                    merkKildeForNestePerson(kilde);
                    router.push(
                        periode ? lagPeriodeUrl(data.personPseudoId, periode) : `/person/${data.personPseudoId}`,
                    );
                },
                onError: (error) => {
                    if (error.status !== undefined) {
                        if (error.status >= 400 && error.status < 500) {
                            teamLogger.warn(error, 'Fikk klientfeil fra søk etter person, viser at person ikke finnes');
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

    function søkPersonMedFødselsnummerEllerAktørId(søketekst: string) {
        if (!(kanVæreAktørId(søketekst) || kanVæreFødselsnummer(søketekst))) {
            router.push('/');
            addVarsel(new UgyldigIdentifikatorError(søketekst));
        } else if (kanVæreFødselsnummer(søketekst) && !validerFødselsnummer(søketekst)) {
            router.push('/');
            addVarsel(new UgyldigFødselsnummerError(søketekst));
        } else {
            søkPerson(kanVæreFødselsnummer(søketekst) ? { identitetsnummer: søketekst } : { aktørId: søketekst });
        }
    }

    return { søkPerson, søkPersonMedFødselsnummerEllerAktørId, loading };
}

function kanVæreFødselsnummer(value: string) {
    return /^\d{11}$/.test(value);
}

function kanVæreAktørId(value: string) {
    return /^\d{13}$/.test(value);
}
