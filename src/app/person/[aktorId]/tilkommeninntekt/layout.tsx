'use client';

import React, { PropsWithChildren, ReactElement } from 'react';

import { Saksbilde } from '@saksbilde/Saksbilde';
import { EmojiTilbakemeldingMedPeriode } from '@saksbilde/feedback/EmojiTilbakemeldingMedPeriode';
import { Historikk } from '@saksbilde/historikk';
import { VenstremenyTilkommenInntekt } from '@saksbilde/venstremeny/VenstremenyTilkommenInntekt';

export default function Layout({ children }: PropsWithChildren): ReactElement {
    return (
        <>
            <VenstremenyTilkommenInntekt />
            <Saksbilde>{children}</Saksbilde>
            <Historikk />
            <EmojiTilbakemeldingMedPeriode />
        </>
    );
}
