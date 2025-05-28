import React, { ReactElement } from 'react';

import { EmojiTilbakemelding } from '@components/flexjar/EmojiTilbamelding';
import { Widget } from '@components/flexjar/Widget';
import { Egenskap } from '@io/graphql';
import { useActivePeriod } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { isBeregnetPeriode } from '@utils/typeguards';

type FeedbackProps = { erOppgaveOversikt: boolean } | { egenskaper: Egenskap[] };

const SpeilEmojiTilbakemelding = (feedbackProps: FeedbackProps): ReactElement => (
    <Widget>
        <EmojiTilbakemelding
            feedbackId="speil-generell"
            tittel="Hjelp oss å gjøre Speil bedre"
            feedbackProps={feedbackProps}
        />
    </Widget>
);

const EmojiTilbakemeldingForSaksbilde = (): ReactElement => {
    const { data } = useFetchPersonQuery();
    const person = data?.person ?? null;
    const aktivPeriode = useActivePeriod(person);
    const egenskaper = isBeregnetPeriode(aktivPeriode) ? aktivPeriode.egenskaper.map((it) => it.egenskap) : [];
    return <SpeilEmojiTilbakemelding egenskaper={egenskaper}></SpeilEmojiTilbakemelding>;
};

const EmojiTilbakemeldingForOversikt = (): ReactElement => <SpeilEmojiTilbakemelding erOppgaveOversikt={true} />;

export const Tilbakemelding = {
    ForOversikt: EmojiTilbakemeldingForOversikt,
    ForSaksbilde: EmojiTilbakemeldingForSaksbilde,
};
