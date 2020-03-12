import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import minMax from 'dayjs/plugin/minMax';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Person, SpleisPerson, SpleisVedtaksperiode, Vedtaksperiode } from '../types';
import { Personinfo } from '../../../types';
import { mapVedtaksperiode } from './vedtaksperiodemapper';

dayjs.extend(relativeTime);
dayjs.extend(minMax);
dayjs.extend(isSameOrAfter);

const reversert = (a: Vedtaksperiode, b: Vedtaksperiode) =>
    dayjs(b.fom).valueOf() - dayjs(a.fom).valueOf();

export const mapPerson = (unmappedPerson: SpleisPerson, personinfo: Personinfo): Person => {
    const arbeidsgivere = unmappedPerson.arbeidsgivere.map(arbeidsgiver => {
        const dataForVilkårsvurdering = arbeidsgiver.vedtaksperioder
            .map(periode => periode.dataForVilkårsvurdering)
            .find(data => data !== undefined && data !== null);

        const tilVedtaksperiode = (periode: SpleisVedtaksperiode) =>
            mapVedtaksperiode(
                periode,
                personinfo,
                unmappedPerson.hendelser,
                dataForVilkårsvurdering,
                arbeidsgiver.organisasjonsnummer
            );
        return {
            id: arbeidsgiver.id,
            organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
            vedtaksperioder: arbeidsgiver.vedtaksperioder.map(tilVedtaksperiode).sort(reversert)
        };
    });

    return {
        aktørId: unmappedPerson.aktørId,
        personinfo,
        arbeidsgivere,
        fødselsnummer: unmappedPerson.fødselsnummer,
        hendelser: unmappedPerson.hendelser
    };
};
