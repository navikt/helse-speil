import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

import { Alert } from '@navikt/ds-react';

import { TilkommenInntektTimelineRow } from '@saksbilde/timeline/TilkommenInntektTimelineRow';
import { TimelineRowSkeleton } from '@saksbilde/timeline/TimelineRow';
import { useHentTilkommenInntektQuery } from '@state/tilkommenInntekt';

interface TilkommenInntektTimelineContainerProps {
    start: dayjs.Dayjs;
    end: dayjs.Dayjs;
    personPseudoId: string;
    alignWithExpandable?: boolean;
}

export const TilkommenInntektTimelineRows = ({
    start,
    end,
    personPseudoId,
    alignWithExpandable = false,
}: TilkommenInntektTimelineContainerProps): ReactElement => {
    const { isFetching, data, error } = useHentTilkommenInntektQuery(personPseudoId);

    if (isFetching) {
        return <TimelineRowSkeleton />;
    }

    if (error) {
        return (
            <Alert variant="error">Det har skjedd en feil. Kan ikke vise tilkomne inntekter for denne personen.</Alert>
        );
    }

    return (
        <>
            {data?.map((tilkommenInntektskilde) => (
                <TilkommenInntektTimelineRow
                    key={tilkommenInntektskilde.organisasjonsnummer}
                    start={start}
                    end={end}
                    organisasjonsnummer={tilkommenInntektskilde.organisasjonsnummer}
                    tilkomneInntekter={tilkommenInntektskilde.inntekter}
                    alignWithExpandable={alignWithExpandable}
                />
            ))}
        </>
    );
};
