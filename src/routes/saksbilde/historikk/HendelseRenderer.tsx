import { ReactElement } from 'react';

import { PersonFragment } from '@io/graphql';
import { HistorikkHendelse } from '@saksbilde/historikk/HistorikkHendelse';
import { Annulleringhendelse } from '@saksbilde/historikk/hendelser/Annulleringhendelse';
import { ArbeidstidVurderthendelse } from '@saksbilde/historikk/hendelser/ArbeidstidVurderthendelse';
import { DokumentHendelse } from '@saksbilde/historikk/hendelser/DokumentHendelse';
import { HendelseObject } from '@typer/historikk';

import { AnnetArbeidsforholdoverstyringhendelse } from './hendelser/AnnetArbeidsforholdoverstyringhendelse';
import { Arbeidsforholdoverstyringhendelse } from './hendelser/Arbeidsforholdoverstyringhendelse';
import { Dagoverstyringhendelse } from './hendelser/Dagoverstyringhendelse';
import { Inntektoverstyringhendelse } from './hendelser/Inntektoverstyringhendelse';
import { Notathendelse } from './hendelser/Notathendelse';
import { SykepengegrunnlagSkjønnsfastsatthendelse } from './hendelser/SykepengegrunnlagSkjønnsfastsatthendelse';
import { Utbetalinghendelse } from './hendelser/Utbetalinghendelse';
import { VedtakBegrunnelsehendelse } from './hendelser/VedtakBegrunnelsehendelse';

interface HendelseRendererProps {
    hendelse: HendelseObject;
    person: PersonFragment;
    erAnnullertBeregnetPeriode: boolean;
}

export function HendelseRenderer({
    hendelse,
    person,
    erAnnullertBeregnetPeriode,
}: HendelseRendererProps): ReactElement | null {
    switch (hendelse.type) {
        case 'Arbeidsforholdoverstyring':
            return <Arbeidsforholdoverstyringhendelse hendelse={hendelse} />;
        case 'AnnetArbeidsforholdoverstyring':
            return <AnnetArbeidsforholdoverstyringhendelse hendelse={hendelse} />;
        case 'Dagoverstyring':
            return <Dagoverstyringhendelse hendelse={hendelse} />;
        case 'Inntektoverstyring':
            return <Inntektoverstyringhendelse hendelse={hendelse} />;
        case 'Sykepengegrunnlagskjonnsfastsetting':
            return <SykepengegrunnlagSkjønnsfastsatthendelse hendelse={hendelse} />;
        case 'MinimumSykdomsgradoverstyring':
            return <ArbeidstidVurderthendelse hendelse={hendelse} />;
        case 'Dokument':
            return <DokumentHendelse hendelse={hendelse} person={person} />;
        case 'Notat':
            return <Notathendelse hendelse={hendelse} />;
        case 'Utbetaling':
            return <Utbetalinghendelse hendelse={hendelse} />;
        case 'Historikk':
            return <HistorikkHendelse hendelse={hendelse} person={person} />;
        case 'VedtakBegrunnelse':
            return <VedtakBegrunnelsehendelse hendelse={hendelse} />;
        case 'Annullering':
            return <Annulleringhendelse hendelse={hendelse} erAnnullertBeregnetPeriode={erAnnullertBeregnetPeriode} />;
        default:
            return null;
    }
}
