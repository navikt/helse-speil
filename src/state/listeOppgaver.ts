import { ErrorType } from '@app/axios/orval-mutator';
import { useGetListeOppgaver } from '@io/rest/generated/liste-oppgaver/liste-oppgaver';
import {
    ApiHttpProblemDetailsApiGetOppgaverErrorCode,
    ApiOppgaveProjeksjon,
} from '@io/rest/generated/spesialist.schemas';
import { limit, useCurrentPageValue } from '@oversikt/table/state/pagination';

interface OppgaveFeedResponse {
    oppgaver?: ApiOppgaveProjeksjon[];
    error: ErrorType<ApiHttpProblemDetailsApiGetOppgaverErrorCode> | null;
    loading: boolean;
    antallOppgaver: number;
}

export const useListeOppgaveFeed = (): OppgaveFeedResponse => {
    const currentPage = useCurrentPageValue();

    const {
        data,
        error,
        isFetching: loading,
    } = useGetListeOppgaver(
        {
            sidestoerrelse: limit,
            sidetall: currentPage,
        },
        {
            query: {
                staleTime: 0,
            },
        },
    );

    return {
        oppgaver: data?.elementer,
        antallOppgaver: data?.totaltAntall ?? 0,
        error,
        loading,
    };
};
