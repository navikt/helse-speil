import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

import { Alert } from '@navikt/ds-react';

import { TilkommenInntektTimelineRow } from '@saksbilde/timeline/TilkommenInntektTimelineRow';
import { TimelineRowSkeleton } from '@saksbilde/timeline/TimelineRow';
import { useHentTilkommenInntektQuery } from '@state/tilkommenInntekt';

interface TilkommenInntektTimelineContainerProps {
    start: dayjs.Dayjs;
    end: dayjs.Dayjs;
    aktørId: string;
}

export const TilkommenInntektTimelineRows = ({
    start,
    end,
    aktørId,
}: TilkommenInntektTimelineContainerProps): ReactElement => {
    const { loading, data, error } = useHentTilkommenInntektQuery(aktørId);

    if (loading) {
        return <TimelineRowSkeleton />;
    }

    if (error) {
        return (
            <Alert variant="error">Det har skjedd en feil. Kan ikke vise tilkomne inntekter for denne personen.</Alert>
        );
    }
    const tilkomneInntektskilder = data!.restGetTilkomneInntektskilder;

    return (
        <>
            {tilkomneInntektskilder.map((tilkommenInntektskilde) => {
                return (
                    <TilkommenInntektTimelineRow
                        key={tilkommenInntektskilde.organisasjonsnummer}
                        start={start}
                        end={end}
                        organisasjonsnummer={tilkommenInntektskilde.organisasjonsnummer}
                        tilkomneInntekter={tilkommenInntektskilde.inntekter}
                    />
                );
            })}
        </>
    );
};
