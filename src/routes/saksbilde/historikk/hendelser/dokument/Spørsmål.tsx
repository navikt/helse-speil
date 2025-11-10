import classNames from 'classnames';
import React, { ReactElement } from 'react';

import { CheckmarkIcon } from '@navikt/aksel-icons';

import { ApiSporsmal, ApiSvar, ApiSvartype } from '@io/rest/generated/spesialist.schemas';
import { somNorskDato, somNorskÅrMåned } from '@utils/date';
import { toKronerOgØre } from '@utils/locale';

import { DokumentFragment } from './DokumentFragment';

import styles from './Søknadsinnhold.module.css';

interface SpørsmålProps {
    spørsmål: ApiSporsmal[];
    rotnivå?: boolean;
}

export const Spørsmål = ({ spørsmål, rotnivå = true }: SpørsmålProps): ReactElement[] => {
    return spørsmål?.map((it) => {
        const underspørsmål = getUndersporsmal(it);

        return (
            <div
                key={(it.tag ?? '') + (it.undertekst ?? '')}
                className={classNames(
                    styles.spørsmål,
                    rotnivå && styles.rotspørsmål,
                    it.svar?.[0]?.verdi === 'CHECKED' && styles.sammelinje,
                )}
            >
                {it.svar && it.svartype && (
                    <DokumentFragment overskrift={it?.sporsmalstekst ?? ''}>
                        {getSvarForVisning(it.svar, it.svartype)}
                    </DokumentFragment>
                )}
                {underspørsmål && <Spørsmål spørsmål={underspørsmål} rotnivå={false} />}
            </div>
        );
    });
};

function getUndersporsmal(it: ApiSporsmal): ApiSporsmal[] | null {
    const sporsmal = it as ApiSporsmal & { undersporsmal: ApiSporsmal[] | null };

    return sporsmal?.undersporsmal && sporsmal.undersporsmal.length > 0 ? sporsmal.undersporsmal : null;
}

const getSvarForVisning = (svar: ApiSvar[], svartype: ApiSvartype) => {
    if (svar.length === 0 || !svar[0]?.verdi) return;

    switch (svartype) {
        case ApiSvartype.CHECKBOX:
        case ApiSvartype.RADIO:
            return <CheckmarkIcon fill="#000" style={{ border: '1px solid #000' }} />;
        case ApiSvartype.BELOP:
            return toKronerOgØre(Number(svar[0]?.verdi) / 100);
        case ApiSvartype.DATO:
        case ApiSvartype.RADIO_GRUPPE_UKEKALENDER:
            return somNorskDato(svar[0]?.verdi);
        case ApiSvartype.DATOER:
        case ApiSvartype.INFO_BEHANDLINGSDAGER:
            return svar
                .flatMap((it) => somNorskDato(it.verdi ?? undefined))
                .join(', ')
                .replace(/,(?=[^,]*$)/, ' og');
        case ApiSvartype.PERIODE:
            return `${somNorskDato(JSON.parse(svar[0]?.verdi).fom)} – ${somNorskDato(JSON.parse(svar[0]?.verdi).tom)}`;
        case ApiSvartype.PERIODER:
            return svar
                .map((it) => {
                    if (!it.verdi) return;
                    const periode = JSON.parse(it.verdi);
                    return `${somNorskDato(periode.fom)} – ${somNorskDato(periode.tom)}`;
                })
                .join(', ')
                .replace(/,(?=[^,]*$)/, ' og');
        case ApiSvartype.CHECKBOX_GRUPPE:
        case ApiSvartype.COMBOBOX_MULTI:
            return svar
                .flatMap((it) => it.verdi)
                .join(', ')
                .replace(/,(?=[^,]*$)/, ' og');
        case ApiSvartype.PROSENT:
            return `${svar[0]?.verdi} prosent`;
        case ApiSvartype.TIMER:
            return `${svar[0]?.verdi} timer`;
        case ApiSvartype.KILOMETER:
            return `${svar[0]?.verdi} km`;
        case ApiSvartype.JA_NEI:
            return svar[0]?.verdi === 'JA' ? 'Ja' : 'Nei';
        case ApiSvartype.RADIO_GRUPPE_TIMER_PROSENT:
            return;
        case ApiSvartype.AAR_MANED:
        case ApiSvartype.AAR_MAANED:
            return `${somNorskÅrMåned(svar[0]?.verdi)}`;
        default:
            return svar[0]?.verdi;
    }
};
