import classNames from 'classnames';
import React, { ReactElement } from 'react';

import { CheckmarkIcon } from '@navikt/aksel-icons';

import { SporsmalFragment, Svar, Svartype } from '@io/graphql';
import { somNorskDato } from '@utils/date';
import { toKronerOgØre } from '@utils/locale';

import { DokumentFragment } from './DokumentFragment';

import styles from './Søknadsinnhold.module.css';

interface SpørsmålProps {
    spørsmål: SporsmalFragment[];
    rotnivå?: boolean;
}

export const Spørsmål = ({ spørsmål, rotnivå = true }: SpørsmålProps): ReactElement[] => {
    return spørsmål?.map((it) => {
        const underspørsmål = getUndersporsmal(it);

        return (
            <div
                key={it.tag}
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

function getUndersporsmal(it: SporsmalFragment): SporsmalFragment[] | null {
    const sporsmal = it as SporsmalFragment & { undersporsmal: SporsmalFragment[] | null };

    return sporsmal?.undersporsmal && sporsmal.undersporsmal.length > 0 ? sporsmal.undersporsmal : null;
}

const getSvarForVisning = (svar: Svar[], svartype: Svartype) => {
    if (svar.length === 0 || !svar[0]?.verdi) return;

    switch (svartype) {
        case Svartype.Checkbox:
        case Svartype.Radio:
            return <CheckmarkIcon fill="#000" style={{ border: '1px solid #000' }} />;
        case Svartype.Belop:
            return toKronerOgØre(Number(svar[0]?.verdi) / 100);
        case Svartype.Dato:
        case Svartype.RadioGruppeUkekalender:
            return somNorskDato(svar[0]?.verdi);
        case Svartype.Datoer:
        case Svartype.InfoBehandlingsdager:
            return svar
                .flatMap((it) => somNorskDato(it.verdi ?? undefined))
                .join(', ')
                .replace(/,(?=[^,]*$)/, ' og');
        case Svartype.Periode:
            return `${somNorskDato(JSON.parse(svar[0]?.verdi).fom)} – ${somNorskDato(JSON.parse(svar[0]?.verdi).tom)}`;
        case Svartype.Perioder:
            return svar
                .map((it) => {
                    if (!it.verdi) return;
                    const periode = JSON.parse(it.verdi);
                    return `${somNorskDato(periode.fom)} – ${somNorskDato(periode.tom)}`;
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
            return `${svar[0]?.verdi} prosent`;
        case Svartype.Timer:
            return `${svar[0]?.verdi} timer`;
        case Svartype.Kilometer:
            return `${svar[0]?.verdi} km`;
        case Svartype.JaNei:
            return svar[0]?.verdi === 'JA' ? 'Ja' : 'Nei';
        case Svartype.RadioGruppeTimerProsent:
            return;
        default:
            return svar[0]?.verdi;
    }
};
