import classNames from 'classnames';
import dayjs from 'dayjs';
import React from 'react';

import { CheckmarkIcon } from '@navikt/aksel-icons';

import { Sporsmal, Svar, Svartype } from '@io/graphql';
import { NORSK_DATOFORMAT } from '@utils/date';
import { toKronerOgØre } from '@utils/locale';

import { SøknadFragment } from './SøknadFragment';

import styles from './Søknadsinnhold.module.css';

interface SpørsmålProps {
    spørsmål: Array<Sporsmal>;
    rotnivå?: boolean;
}

export const Spørsmål: React.FC<SpørsmålProps> = ({ spørsmål, rotnivå = true }) => {
    return spørsmål?.map((it) => {
        if (it === undefined || it === null) return;
        const underspørsmål = it?.undersporsmal && it.undersporsmal.length > 0 ? it.undersporsmal : null;
        return (
            <div
                className={classNames(
                    styles.spørsmål,
                    rotnivå && styles.rotspørsmål,
                    it.svar?.[0]?.verdi === 'CHECKED' && styles.sammelinje,
                )}
            >
                {it.svar && it.svartype && (
                    <SøknadFragment overskrift={it?.sporsmalstekst ?? ''}>
                        {getSvarForVisning(it.svar, it.svartype)}
                    </SøknadFragment>
                )}
                {underspørsmål && <Spørsmål spørsmål={underspørsmål} rotnivå={false} />}
            </div>
        );
    });
};

const getSvarForVisning = (svar: Svar[], svartype: Svartype) => {
    if (svar.length === 0 || !svar[0].verdi) return;

    switch (svartype) {
        case Svartype.Checkbox:
        case Svartype.Radio:
            return <CheckmarkIcon fill="#000" style={{ border: '1px solid #000' }} />;
        case Svartype.Belop:
            return toKronerOgØre(svar[0].verdi);
        case Svartype.Dato:
        case Svartype.RadioGruppeUkekalender:
            return dayjs(svar[0].verdi).format(NORSK_DATOFORMAT);
        case Svartype.Datoer:
        case Svartype.InfoBehandlingsdager:
            return svar
                .flatMap((it) => dayjs(it.verdi).format(NORSK_DATOFORMAT))
                .join(', ')
                .replace(/,(?=[^,]*$)/, ' og');
        case Svartype.Periode:
            return `${dayjs(JSON.parse(svar[0].verdi).fom).format(NORSK_DATOFORMAT)} – ${dayjs(
                JSON.parse(svar[0].verdi).tom,
            ).format(NORSK_DATOFORMAT)}`;
        case Svartype.Perioder:
            return svar
                .map((it) => {
                    if (!it.verdi) return;
                    const periode = JSON.parse(it.verdi);
                    return `${dayjs(periode.fom).format(NORSK_DATOFORMAT)} – ${dayjs(periode.tom).format(
                        NORSK_DATOFORMAT,
                    )}`;
                })
                .join(', ')
                .replace(/,(?=[^,]*$)/, ' og');
        case Svartype.CheckboxGruppe:
        case Svartype.ComboboxMulti:
            return svar
                .flatMap((it) => it.verdi)
                .join(', ')
                .replace(/,(?=[^,]*$)/, ' og');
        case Svartype.Prosent:
            return `${svar[0].verdi} prosent`;
        case Svartype.Timer:
            return `${svar[0].verdi} timer`;
        case Svartype.Kilometer:
            return `${svar[0].verdi} km`;
        case Svartype.JaNei:
            return svar[0].verdi === 'JA' ? 'Ja' : 'Nei';
        case Svartype.RadioGruppeTimerProsent:
            return;
        default:
            return svar[0].verdi;
    }
};
