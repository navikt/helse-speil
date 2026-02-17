import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';

import { ErrorType } from '@app/axios/orval-mutator';
import { useGetBehandledeOppgaver } from '@io/rest/generated/behandlede-oppgaver/behandlede-oppgaver';
import {
    ApiBehandletOppgaveProjeksjon,
    ApiHttpProblemDetailsApiGetBehandletOppgaverErrorCode,
} from '@io/rest/generated/spesialist.schemas';
import { limit, useCurrentPageValue } from '@oversikt/table/state/pagination';
import { ISO_DATOFORMAT } from '@utils/date';

interface BehandledeOppgaverFeed {
    oppgaver?: ApiBehandletOppgaveProjeksjon[];
    error: ErrorType<ApiHttpProblemDetailsApiGetBehandletOppgaverErrorCode> | null;
    loading: boolean;
    antallOppgaver: number;
    refetch: (fom: Dayjs, tom: Dayjs) => void;
}

export const useBehandledeOppgaverFeed = (): BehandledeOppgaverFeed => {
    const currentPage = useCurrentPageValue();
    const [dates, setDates] = useState<{ fom: string; tom: string }>({
        fom: dayjs().format(ISO_DATOFORMAT),
        tom: dayjs().format(ISO_DATOFORMAT),
    });
    const {
        data,
        error,
        isFetching: loading,
    } = useGetBehandledeOppgaver({
        sidestoerrelse: limit,
        sidetall: currentPage,
        fom: dates.fom,
        tom: dates.tom,
    });

    return {
        oppgaver: data?.elementer,
        error,
        loading,
        antallOppgaver: data?.totaltAntall ?? 0,
        refetch: (fom, tom) => setDates({ fom: fom.format(ISO_DATOFORMAT), tom: tom.format(ISO_DATOFORMAT) }),
    };
};
