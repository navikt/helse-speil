import React, { ReactElement } from 'react';

import { Tag, TagProps, Tooltip } from '@navikt/ds-react';

import { Kategori } from '@io/graphql';
import { ApiEgenskap } from '@io/rest/generated/spesialist.schemas';
import { kategoriForEgenskap } from '@state/oppgaver';

const tilTekst = (egenskap: ApiEgenskap) => {
    switch (egenskap) {
        case ApiEgenskap.EGEN_ANSATT:
            return 'Egen ansatt';
        case ApiEgenskap.FORTROLIG_ADRESSE:
            return 'Fortrolig adresse';
        case ApiEgenskap.HASTER:
            return 'Haster';
        case ApiEgenskap.RETUR:
            return 'Retur';
        case ApiEgenskap.RISK_QA:
            return 'Risk QA';
        case ApiEgenskap.STIKKPROVE:
            return 'Stikkprøve';
        case ApiEgenskap.UTLAND:
            return 'Utland';
        case ApiEgenskap.VERGEMAL:
            return 'Vergemål';
        case ApiEgenskap.BESLUTTER:
            return 'Beslutter';
        case ApiEgenskap.SKJONNSFASTSETTELSE:
            return 'Skjønnsfastsettelse';
        case ApiEgenskap.PA_VENT:
            return 'På vent';
        case ApiEgenskap.FORSTEGANGSBEHANDLING:
            return 'Førstegang.';
        case ApiEgenskap.FORLENGELSE:
        case ApiEgenskap.INFOTRYGDFORLENGELSE:
            return 'Forlengelse';
        case ApiEgenskap.OVERGANG_FRA_IT:
            return 'Forlengelse IT';
        case ApiEgenskap.SOKNAD:
            return 'Søknad';
        case ApiEgenskap.REVURDERING:
            return 'Revurdering';
        case ApiEgenskap.DELVIS_REFUSJON:
            return 'Begge';
        case ApiEgenskap.UTBETALING_TIL_SYKMELDT:
            return 'Sykmeldt';
        case ApiEgenskap.UTBETALING_TIL_ARBEIDSGIVER:
            return 'Arbeidsgiver';
        case ApiEgenskap.INGEN_UTBETALING:
            return 'Ingen mottaker';
        case ApiEgenskap.TILBAKEDATERT:
            return 'Tilbakedatert';
        case ApiEgenskap.MANGLER_IM:
            return 'Mangler IM';
        case ApiEgenskap.MEDLEMSKAP:
            return 'Medlemskap';
        case ApiEgenskap.GOSYS:
            return 'Gosys';
        case ApiEgenskap.GRUNNBELOPSREGULERING:
            return 'Grunnbeløpsregulering';
        case ApiEgenskap.ARBEIDSTAKER:
            return 'Arbeidstaker';
        case ApiEgenskap.SELVSTENDIG_NAERINGSDRIVENDE:
            return 'Selvstendig næringsdrivende';
        case ApiEgenskap.JORDBRUKER_REINDRIFT:
            return 'Jordbruk / Reindrift';
        default:
            return egenskap.toString();
    }
};

const tilTooltip = (egenskap: ApiEgenskap) => {
    switch (egenskap) {
        case ApiEgenskap.FORSTEGANGSBEHANDLING:
            return 'Førstegangsbehandling';
        default:
            return tilTekst(egenskap);
    }
};

const tilDataColor = (kategori: Kategori): TagProps['data-color'] =>
    kategori === Kategori.Ukategorisert
        ? 'gammalost'
        : kategori === Kategori.Oppgavetype
          ? 'info'
          : kategori === Kategori.Mottaker
            ? 'meta-purple'
            : kategori === Kategori.Status
              ? 'warning'
              : kategori === Kategori.Inntektsforhold || kategori === Kategori.Arbeidssituasjon
                ? 'info'
                : 'neutral';

const getData = (egenskaper: ApiEgenskap[]) => {
    return egenskaper
        .map((egenskap) => ({ egenskap: egenskap, kategori: kategoriForEgenskap(egenskap) }))
        .filter(
            ({ kategori }) =>
                kategori === Kategori.Ukategorisert ||
                kategori === Kategori.Status ||
                kategori === Kategori.Periodetype ||
                kategori === Kategori.Oppgavetype ||
                kategori === Kategori.Inntektsforhold ||
                kategori === Kategori.Arbeidssituasjon ||
                kategori === Kategori.Mottaker,
        )
        .map(({ kategori, egenskap }) => ({
            kategori,
            dataColor: tilDataColor(kategori),
            tekst: tilTekst(egenskap),
            tooltiptekst: tilTooltip(egenskap),
        }))
        .sort((a, b) => {
            let kategoriVerdi = 0;
            if (a.kategori !== b.kategori) {
                if (a.kategori === Kategori.Inntektsforhold) kategoriVerdi = -1;
                else if (b.kategori === Kategori.Inntektsforhold) kategoriVerdi = 1;
                else if (b.kategori === Kategori.Arbeidssituasjon) kategoriVerdi = 1;
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
    egenskaper: ApiEgenskap[];
}

export const EgenskaperTags = ({ egenskaper }: EgenskaperTagsProps): ReactElement => {
    return (
        <>
            {getData(egenskaper).map((egenskap, index) => (
                <Tooltip content={egenskap.tooltiptekst} key={index}>
                    <Tag style={{ fontSize: 16 }} size="small" variant="outline" data-color={egenskap.dataColor}>
                        {egenskap.tekst}
                    </Tag>
                </Tooltip>
            ))}
        </>
    );
};
