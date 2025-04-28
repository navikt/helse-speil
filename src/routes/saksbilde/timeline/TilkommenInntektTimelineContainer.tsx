import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { TilkommenInntektTimelineRow } from '@saksbilde/timeline/TilkommenInntektTimelineRow';
import styles from '@saksbilde/timeline/Timeline.module.css';
import { TimelineRowSkeleton } from '@saksbilde/timeline/TimelineRow';
import { useHentTilkommenInntektQuery } from '@state/tilkommenInntekt';

interface TilkommenInntektTimelineContainerProps {
    start: dayjs.Dayjs;
    end: dayjs.Dayjs;
}

export const TilkommenInntektTimelineContainer = ({
    start,
    end,
}: TilkommenInntektTimelineContainerProps): ReactElement => {
    const { loading, data, error } = useHentTilkommenInntektQuery();

    if (loading) {
        return <TimelineRowSkeleton />;
    }

    if (error) {
        return <BodyShort>{error.message}</BodyShort>;
    }
    const tilkomneInntektskilder = data!.tilkomneInntektskilder;

    return (
        <div className={styles.Rows}>
            {tilkomneInntektskilder.map((tilkommenInntektskilde) => {
                return (
                    <TilkommenInntektTimelineRow
                        key={tilkommenInntektskilde.organisasjonsnummer}
                        start={start}
                        end={end}
                        name={tilkommenInntektskilde.organisasjonsnummer}
                        tilkomneInntekter={tilkommenInntektskilde.inntekter}
                    ></TilkommenInntektTimelineRow>
                );
            })}
        </div>
    );
};
