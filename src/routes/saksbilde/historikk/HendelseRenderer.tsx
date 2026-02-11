import { ReactElement } from 'react';

import { PersonFragment } from '@io/graphql';
import { HistorikkHendelse } from '@saksbilde/historikk/HistorikkHendelse';
import { Annulleringhendelse } from '@saksbilde/historikk/hendelser/Annulleringhendelse';
import { ArbeidstidVurderthendelse } from '@saksbilde/historikk/hendelser/ArbeidstidVurderthendelse';
import { DokumentHendelse } from '@saksbilde/historikk/hendelser/DokumentHendelse';
import {
    AnnetArbeidsforholdoverstyringhendelseObject,
    AnnulleringhendelseObject,
    ArbeidsforholdoverstyringhendelseObject,
    DagoverstyringhendelseObject,
    DokumenthendelseObject,
    HendelseObject,
    HistorikkhendelseObject,
    InntektoverstyringhendelseObject,
    MinimumSykdomsgradhendelseObject,
    NotathendelseObject,
    SykepengegrunnlagskjonnsfastsettinghendelseObject,
    UtbetalinghendelseObject,
    VedtakBegrunnelseObject,
} from '@typer/historikk';

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
            return <ArbeidsforholdoverstyringRenderer hendelse={hendelse} />;
        case 'AnnetArbeidsforholdoverstyring':
            return <AnnetArbeidsforholdoverstyringRenderer hendelse={hendelse} />;
        case 'Dagoverstyring':
            return <DagoverstyringRenderer hendelse={hendelse} />;
        case 'Inntektoverstyring':
            return <InntektoverstyringRenderer hendelse={hendelse} />;
        case 'Sykepengegrunnlagskjonnsfastsetting':
            return <SykepengegrunnlagskjonnsfastsettingRenderer hendelse={hendelse} />;
        case 'MinimumSykdomsgradoverstyring':
            return <MinimumSykdomsgradRenderer hendelse={hendelse} />;
        case 'Dokument':
            return <DokumentRenderer hendelse={hendelse} person={person} />;
        case 'Notat':
            return <NotatRenderer hendelse={hendelse} />;
        case 'Utbetaling':
            return <UtbetalingRenderer hendelse={hendelse} />;
        case 'Historikk':
            return <HistorikkRenderer hendelse={hendelse} person={person} />;
        case 'VedtakBegrunnelse':
            return <VedtakBegrunnelseRenderer hendelse={hendelse} />;
        case 'Annullering':
            return <AnnulleringRenderer hendelse={hendelse} erAnnullertBeregnetPeriode={erAnnullertBeregnetPeriode} />;
        default:
            return null;
    }
}

function ArbeidsforholdoverstyringRenderer({ hendelse }: { hendelse: ArbeidsforholdoverstyringhendelseObject }) {
    return <Arbeidsforholdoverstyringhendelse {...hendelse} />;
}

function AnnetArbeidsforholdoverstyringRenderer({
    hendelse,
}: {
    hendelse: AnnetArbeidsforholdoverstyringhendelseObject;
}) {
    return <AnnetArbeidsforholdoverstyringhendelse {...hendelse} />;
}

function DagoverstyringRenderer({ hendelse }: { hendelse: DagoverstyringhendelseObject }) {
    return <Dagoverstyringhendelse {...hendelse} />;
}

function InntektoverstyringRenderer({ hendelse }: { hendelse: InntektoverstyringhendelseObject }) {
    return <Inntektoverstyringhendelse {...hendelse} />;
}

function SykepengegrunnlagskjonnsfastsettingRenderer({
    hendelse,
}: {
    hendelse: SykepengegrunnlagskjonnsfastsettinghendelseObject;
}) {
    return <SykepengegrunnlagSkjønnsfastsatthendelse {...hendelse} />;
}

function MinimumSykdomsgradRenderer({ hendelse }: { hendelse: MinimumSykdomsgradhendelseObject }) {
    return <ArbeidstidVurderthendelse {...hendelse} />;
}

function DokumentRenderer({ hendelse, person }: { hendelse: DokumenthendelseObject; person: PersonFragment }) {
    return <DokumentHendelse hendelse={hendelse} person={person} />;
}

function NotatRenderer({ hendelse }: { hendelse: NotathendelseObject }) {
    return <Notathendelse {...hendelse} />;
}

function UtbetalingRenderer({ hendelse }: { hendelse: UtbetalinghendelseObject }) {
    return <Utbetalinghendelse {...hendelse} />;
}

function HistorikkRenderer({ hendelse, person }: { hendelse: HistorikkhendelseObject; person: PersonFragment }) {
    return <HistorikkHendelse hendelse={hendelse} person={person} />;
}

function VedtakBegrunnelseRenderer({ hendelse }: { hendelse: VedtakBegrunnelseObject }) {
    return <VedtakBegrunnelsehendelse {...hendelse} />;
}

function AnnulleringRenderer({
    hendelse,
    erAnnullertBeregnetPeriode,
}: {
    hendelse: AnnulleringhendelseObject;
    erAnnullertBeregnetPeriode: boolean;
}) {
    return <Annulleringhendelse erAnnullertBeregnetPeriode={erAnnullertBeregnetPeriode} {...hendelse} />;
}
