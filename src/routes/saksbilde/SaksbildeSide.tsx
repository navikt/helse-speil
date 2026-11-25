import dynamic from 'next/dynamic';
import { ReactElement } from 'react';

import { VisHvisSkrivetilgang } from '@components/VisHvisSkrivetilgang';
import { Tilbakemelding } from '@components/flexjar/Tilbakemeldinger';
import { Saksbilde } from '@saksbilde/Saksbilde';
import { HistorikkSkeleton } from '@saksbilde/historikk/komponenter/HistorikkSkeleton';
import { Venstremeny } from '@saksbilde/venstremeny/Venstremeny';
import { useSaksbildedel } from '@state/tab';

const Historikk = dynamic(() => import('@saksbilde/historikk').then((mod) => mod.Historikk), {
    ssr: false,
    loading: () => <HistorikkSkeleton />,
});

export function SaksbildeSide(): ReactElement {
    const del = useSaksbildedel();

    return (
        <>
            {del === 'periode' && <Venstremeny />}
            <Saksbilde />
            <Historikk />
            <VisHvisSkrivetilgang>
                <Tilbakemelding.ForSaksbilde />
            </VisHvisSkrivetilgang>
        </>
    );
}
