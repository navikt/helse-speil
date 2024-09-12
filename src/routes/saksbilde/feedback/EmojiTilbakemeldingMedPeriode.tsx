import React, { ReactElement } from 'react';

import { EmojiTilbakemelding } from '@components/flexjar/EmojiTilbamelding';
import { Widget } from '@components/flexjar/Widget';
import { useActivePeriod } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { isBeregnetPeriode } from '@utils/typeguards';

export const EmojiTilbakemeldingMedPeriode = (): ReactElement => {
    const { data } = useFetchPersonQuery();
    const person = data?.person ?? null;
    const aktivPeriode = useActivePeriod(person);

    return (
        <Widget>
            <EmojiTilbakemelding
                feedbackId="speil-generell"
                tittel="Hjelp oss å gjøre Speil bedre"
                sporsmal="Hvordan fungerer Speil for deg?"
                feedbackProps={{
                    egenskaper: isBeregnetPeriode(aktivPeriode) && aktivPeriode.egenskaper.map((it) => it.egenskap),
                }}
            />
        </Widget>
    );
};
