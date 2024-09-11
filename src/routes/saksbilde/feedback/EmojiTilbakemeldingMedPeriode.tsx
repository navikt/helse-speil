import React, { ReactElement } from 'react';

import { EmojiTilbakemelding } from '@components/flexjar/EmojiTilbamelding';
import { Widget } from '@components/flexjar/Widget';
import { useActivePeriodOld } from '@state/periode';
import { isBeregnetPeriode } from '@utils/typeguards';

export const EmojiTilbakemeldingMedPeriode = (): ReactElement => {
    const aktivPeriode = useActivePeriodOld();

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
