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
    index: number;
    person: PersonFragment;
    erAnnullertBeregnetPeriode: boolean;
}

export function HendelseRenderer({
    hendelse,
    index,
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
            return <InntektoverstyringRenderer hendelse={hendelse} index={index} />;
        case 'Sykepengegrunnlagskjonnsfastsetting':
            return <SykepengegrunnlagskjonnsfastsettingRenderer hendelse={hendelse} index={index} />;
        case 'MinimumSykdomsgradoverstyring':
            return <MinimumSykdomsgradRenderer hendelse={hendelse} index={index} />;
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
    return <Arbeidsforholdoverstyringhendelse key={hendelse.id} {...hendelse} />;
}

function AnnetArbeidsforholdoverstyringRenderer({
    hendelse,
}: {
    hendelse: AnnetArbeidsforholdoverstyringhendelseObject;
}) {
    return <AnnetArbeidsforholdoverstyringhendelse key={hendelse.id} {...hendelse} />;
}

function DagoverstyringRenderer({ hendelse }: { hendelse: DagoverstyringhendelseObject }) {
    return <Dagoverstyringhendelse key={hendelse.id} {...hendelse} />;
}

function InntektoverstyringRenderer({
    hendelse,
    index,
}: {
    hendelse: InntektoverstyringhendelseObject;
    index: number;
}) {
    return <Inntektoverstyringhendelse key={`${hendelse.id}-${index}`} {...hendelse} />;
}

function SykepengegrunnlagskjonnsfastsettingRenderer({
    hendelse,
    index,
}: {
    hendelse: SykepengegrunnlagskjonnsfastsettinghendelseObject;
    index: number;
}) {
    return <SykepengegrunnlagSkjønnsfastsatthendelse key={`${hendelse.id}-${index}`} {...hendelse} />;
}

function MinimumSykdomsgradRenderer({
    hendelse,
    index,
}: {
    hendelse: MinimumSykdomsgradhendelseObject;
    index: number;
}) {
    return <ArbeidstidVurderthendelse key={`${hendelse.id}-${index}`} {...hendelse} />;
}

function DokumentRenderer({ hendelse, person }: { hendelse: DokumenthendelseObject; person: PersonFragment }) {
    return <DokumentHendelse hendelse={hendelse} person={person} />;
}

function NotatRenderer({ hendelse }: { hendelse: NotathendelseObject }) {
    return <Notathendelse key={`${hendelse.id}-notat`} {...hendelse} />;
}

function UtbetalingRenderer({ hendelse }: { hendelse: UtbetalinghendelseObject }) {
    return <Utbetalinghendelse key={hendelse.id} {...hendelse} />;
}

function HistorikkRenderer({ hendelse, person }: { hendelse: HistorikkhendelseObject; person: PersonFragment }) {
    return <HistorikkHendelse key={hendelse.id} hendelse={hendelse} person={person} />;
}

function VedtakBegrunnelseRenderer({ hendelse }: { hendelse: VedtakBegrunnelseObject }) {
    return <VedtakBegrunnelsehendelse key={hendelse.id} {...hendelse} />;
}

function AnnulleringRenderer({
    hendelse,
    erAnnullertBeregnetPeriode,
}: {
    hendelse: AnnulleringhendelseObject;
    erAnnullertBeregnetPeriode: boolean;
}) {
    return (
        <Annulleringhendelse key={hendelse.id} erAnnullertBeregnetPeriode={erAnnullertBeregnetPeriode} {...hendelse} />
    );
}
