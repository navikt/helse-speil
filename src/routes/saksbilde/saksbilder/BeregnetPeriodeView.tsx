import { usePathname } from 'next/navigation';
import React, { ReactElement, useState } from 'react';
import { last } from 'remeda';

import { Button } from '@navikt/ds-react';
import { Box } from '@navikt/ds-react/Box';

import { BeregnetPeriodeFragment, PersonFragment } from '@io/graphql';
import { Sykepengegrunnlag } from '@saksbilde/sykepengegrunnlag/Sykepengegrunnlag';
import { Utbetaling } from '@saksbilde/utbetaling/Utbetaling';
import { Inngangsvilkår } from '@saksbilde/vilkår/Inngangsvilkår';
import { InngangsvilkårNy } from '@saksbilde/vilkår/ny-inngangsvilkår/InngangsvilkårNy';
import { Vurderingsmomenter } from '@saksbilde/vurderingsmomenter/Vurderingsmomenter';
import { kanSeNyInngangsvilkår } from '@utils/featureToggles';

interface BeregnetPeriodeViewProps {
    period: BeregnetPeriodeFragment;
    person: PersonFragment;
}

export const BeregnetPeriodeView = ({ period, person }: BeregnetPeriodeViewProps): ReactElement => {
    const tab = last(usePathname().split('/'));
    const [visNyInngangsvilkår, setVisNyInngangsvilkår] = useState(false);

    return (
        <Box overflowX="auto">
            {tab === 'dagoversikt' && <Utbetaling person={person} periode={period} />}
            {decodeURI(tab ?? '') === 'inngangsvilkår' &&
                (kanSeNyInngangsvilkår ? (
                    <div>
                        <Button size="small" onClick={() => setVisNyInngangsvilkår(!visNyInngangsvilkår)}>
                            ✨
                        </Button>
                        {visNyInngangsvilkår ? (
                            <InngangsvilkårNy periode={period} />
                        ) : (
                            <Inngangsvilkår person={person} periode={period} />
                        )}
                    </div>
                ) : (
                    <Inngangsvilkår person={person} periode={period} />
                ))}
            {tab === 'sykepengegrunnlag' && <Sykepengegrunnlag person={person} periode={period} />}
            {tab === 'vurderingsmomenter' && <Vurderingsmomenter periode={period} />}
        </Box>
    );
};
