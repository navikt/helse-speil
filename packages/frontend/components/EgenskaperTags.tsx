import React from 'react';

import { Tag, TagProps } from '@navikt/ds-react';

import { Egenskap, Kategori, Oppgaveegenskap } from '@io/graphql';

const tilTekst = (egenskap: Egenskap) => {
    switch (egenskap) {
        case Egenskap.EgenAnsatt:
            return 'Egen ansatt';
        case Egenskap.FortroligAdresse:
            return 'Fortrolig adresse';
        case Egenskap.Fullmakt:
            return 'Fullmakt';
        case Egenskap.Haster:
            return 'Haster';
        case Egenskap.Retur:
            return 'Retur';
        case Egenskap.RiskQa:
            return 'Risk QA';
        case Egenskap.Spesialsak:
            return '🌰';
        case Egenskap.Stikkprove:
            return 'Stikkprøve';
        case Egenskap.Utland:
            return 'Utland';
        case Egenskap.Vergemal:
            return 'Vergemål';
        case Egenskap.Beslutter:
            return 'Beslutter';
        case Egenskap.Skjonnsfastsettelse:
            return 'Skjønnsfastsettelse';
        case Egenskap.PaVent:
            return 'På vent';
        case Egenskap.Forstegangsbehandling:
            return 'Førstegang.';
        case Egenskap.Forlengelse:
        case Egenskap.Infotrygdforlengelse:
            return 'Forlengelse';
        case Egenskap.OvergangFraIt:
            return 'Forlengelse IT';
        case Egenskap.Soknad:
            return 'Søknad';
        case Egenskap.Revurdering:
            return 'Revurdering';
        case Egenskap.DelvisRefusjon:
            return 'Begge';
        case Egenskap.UtbetalingTilSykmeldt:
            return 'Sykmeldt';
        case Egenskap.UtbetalingTilArbeidsgiver:
            return 'Arbeidsgiver';
        case Egenskap.IngenUtbetaling:
            return 'Ingen mottaker';
        default:
            return egenskap.toString();
    }
};

const tilVariant = (kategori: Kategori): TagProps['variant'] =>
    kategori === Kategori.Ukategorisert
        ? 'alt2'
        : kategori === Kategori.Oppgavetype
        ? 'alt3'
        : kategori === Kategori.Mottaker
        ? 'alt1'
        : kategori === Kategori.Status
        ? 'warning'
        : 'neutral';

const getData = (egenskaper: Oppgaveegenskap[]) => {
    return egenskaper
        .filter(
            ({ kategori }) =>
                kategori === Kategori.Ukategorisert ||
                kategori === Kategori.Status ||
                kategori === Kategori.Periodetype ||
                kategori === Kategori.Oppgavetype ||
                kategori === Kategori.Mottaker,
        )
        .map(({ kategori, egenskap }) => ({
            kategori,
            variant: tilVariant(kategori),
            tekst: tilTekst(egenskap),
        }))
        .sort((a, b) => {
            let kategoriVerdi = 0;
            if (a.kategori !== b.kategori) {
                if (a.kategori === Kategori.Status) kategoriVerdi = -1;
                else if (a.kategori === Kategori.Periodetype && b.kategori !== Kategori.Status) kategoriVerdi = -1;
                else if (a.kategori === Kategori.Periodetype) kategoriVerdi = 1;
                else if (a.kategori === Kategori.Ukategorisert) kategoriVerdi = 1;
                else if (b.kategori === Kategori.Oppgavetype && a.kategori === Kategori.Mottaker) kategoriVerdi = 1;
                else if (b.kategori === Kategori.Periodetype) kategoriVerdi = 1;
                else if (b.kategori === Kategori.Status) kategoriVerdi = 1;
                else kategoriVerdi = -1;
            }
            if (kategoriVerdi === 0) return a.tekst.localeCompare(b.tekst);
            return kategoriVerdi;
        });
};

interface EgenskaperTagsProps {
    egenskaper: Oppgaveegenskap[];
}

export const EgenskaperTags = ({ egenskaper }: EgenskaperTagsProps) => {
    return (
        <>
            {getData(egenskaper).map((egenskap, index) => (
                <Tag style={{ fontSize: 16 }} size="small" variant={egenskap.variant} key={index}>
                    {egenskap.tekst}
                </Tag>
            ))}
        </>
    );
};
