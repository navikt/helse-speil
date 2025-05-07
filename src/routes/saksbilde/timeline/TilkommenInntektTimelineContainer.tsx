import classNames from 'classnames';
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
    fødselsnummer: string;
}

export const TilkommenInntektTimelineContainer = ({
    start,
    end,
    fødselsnummer,
}: TilkommenInntektTimelineContainerProps): ReactElement => {
    const { loading, data, error } = useHentTilkommenInntektQuery(fødselsnummer);

    if (loading) {
        return <TimelineRowSkeleton />;
    }

    if (error) {
        return (
            <div className={classNames(styles.Timeline, styles.Error)}>
                <BodyShort>Det har skjedd en feil. Kan ikke vise tilkomne inntekter for denne saken.</BodyShort>
            </div>
        );
    }
    const tilkomneInntektskilder = data!.tilkomneInntektskilderV2;

    return (
        <div className={styles.Rows}>
            {tilkomneInntektskilder.map((tilkommenInntektskilde) => {
                return (
                    <TilkommenInntektTimelineRow
                        key={tilkommenInntektskilde.organisasjonsnummer}
                        start={start}
                        end={end}
                        organisasjonsnummer={tilkommenInntektskilde.organisasjonsnummer}
                        tilkomneInntekter={tilkommenInntektskilde.inntekter}
                    ></TilkommenInntektTimelineRow>
                );
            })}
        </div>
    );
};
