import React, { ReactElement } from 'react';

import { Tag, TagProps, Tooltip } from '@navikt/ds-react';

import { ApiEgenskap, ApiKategori } from '@io/rest/generated/spesialist.schemas';
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
        case ApiEgenskap.FORSIKRING:
            return 'Forsikring';
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

const tilDataColor = (kategori: ApiKategori): TagProps['data-color'] =>
    kategori === ApiKategori.Ukategorisert
        ? 'brand-magenta'
        : kategori === ApiKategori.Oppgavetype
          ? 'info'
          : kategori === ApiKategori.Mottaker
            ? 'meta-purple'
            : kategori === ApiKategori.Status
              ? 'brand-beige'
              : kategori === ApiKategori.Inntektsforhold || kategori === ApiKategori.Arbeidssituasjon
                ? 'info'
                : 'neutral';

const getData = (egenskaper: ApiEgenskap[]) => {
    return egenskaper
        .map((egenskap) => ({ egenskap: egenskap, kategori: kategoriForEgenskap(egenskap) }))
        .filter(
            ({ kategori }) =>
                kategori === ApiKategori.Ukategorisert ||
                kategori === ApiKategori.Status ||
                kategori === ApiKategori.Periodetype ||
                kategori === ApiKategori.Oppgavetype ||
                kategori === ApiKategori.Inntektsforhold ||
                kategori === ApiKategori.Arbeidssituasjon ||
                kategori === ApiKategori.Mottaker,
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
                if (a.kategori === ApiKategori.Inntektsforhold) kategoriVerdi = -1;
                else if (b.kategori === ApiKategori.Inntektsforhold) kategoriVerdi = 1;
                else if (b.kategori === ApiKategori.Arbeidssituasjon) kategoriVerdi = 1;
                else if (a.kategori === ApiKategori.Periodetype && b.kategori !== ApiKategori.Status)
                    kategoriVerdi = -1;
                else if (a.kategori === ApiKategori.Periodetype) kategoriVerdi = 1;
                else if (a.kategori === ApiKategori.Ukategorisert) kategoriVerdi = 1;
                else if (b.kategori === ApiKategori.Oppgavetype && a.kategori === ApiKategori.Mottaker)
                    kategoriVerdi = 1;
                else if (b.kategori === ApiKategori.Periodetype) kategoriVerdi = 1;
                else if (b.kategori === ApiKategori.Status) kategoriVerdi = 1;
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
                    <Tag
                        style={{ fontSize: 16 }}
                        size="small"
                        variant="outline"
                        data-color={egenskap.dataColor}
                        className="whitespace-nowrap"
                    >
                        {egenskap.tekst}
                    </Tag>
                </Tooltip>
            ))}
        </>
    );
};
