'use client';

import React, { PropsWithChildren, ReactElement } from 'react';

import { Tilbakemelding } from '@components/flexjar/Tilbakemeldinger';
import { VisHvisSkrivetilgang } from '@components/VisHvisSkrivetilgang';
import { AndreYtelserHistorikk } from '@saksbilde/andreYtelser/AndreYtelserHistorikk';
import { AndreYtelserSaksbilde } from '@saksbilde/andreYtelser/AndreYtelserSaksbilde';
import { VenstremenyUtenPeriode } from '@saksbilde/venstremeny/VenstremenyUtenPeriode';

export default function Layout({ children }: PropsWithChildren): ReactElement {
    return (
        <>
            <VenstremenyUtenPeriode />
            <AndreYtelserSaksbilde>{children}</AndreYtelserSaksbilde>
            <AndreYtelserHistorikk />
            <VisHvisSkrivetilgang>
                <Tilbakemelding.ForSaksbilde />
            </VisHvisSkrivetilgang>
        </>
    );
}
