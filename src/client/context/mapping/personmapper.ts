import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import minMax from 'dayjs/plugin/minMax';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
    DataForVilkårsvurdering,
    Person,
    SpleisVedtaksperiode,
    SpleisPerson,
    Vedtaksperiode
} from '../types';
import { Personinfo, VedtaksperiodeTilstand } from '../../../types';
import { mapVedtaksperiode } from './vedtaksperiodemapper';

dayjs.extend(relativeTime);
dayjs.extend(minMax);
dayjs.extend(isSameOrAfter);

const klarTilBehandling = (vedtaksperiode: SpleisVedtaksperiode) =>
    ![
        VedtaksperiodeTilstand.AVVENTER_TIDLIGERE_PERIODE,
        VedtaksperiodeTilstand.AVVENTER_TIDLIGERE_PERIODE_ELLER_INNTEKTSMELDING
    ].includes(vedtaksperiode.tilstand as VedtaksperiodeTilstand);

const reversert = (a: Vedtaksperiode, b: Vedtaksperiode) =>
    dayjs(b.fom).valueOf() - dayjs(a.fom).valueOf();

export const mapPerson = (unmappedPerson: SpleisPerson, personinfo: Personinfo): Person => {
    const arbeidsgivere = unmappedPerson.arbeidsgivere.map(arbeidsgiver => {
        const perioderKlareTilBehanding = arbeidsgiver.vedtaksperioder.filter(klarTilBehandling);
        const dataForVilkårsvurdering:
            | DataForVilkårsvurdering
            | undefined = perioderKlareTilBehanding
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
            vedtaksperioder: perioderKlareTilBehanding.map(tilVedtaksperiode).sort(reversert)
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
