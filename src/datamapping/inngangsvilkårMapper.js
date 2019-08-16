import { item } from './mappingUtils';
import { toDate } from '../utils/date';
import { capitalize } from '../utils/locale';

const medlemskap = medlemskap => [
    item(
        'Statsborgerskap',
        medlemskap.statsborgerskap === 'NOR'
            ? 'Norsk'
            : medlemskap.statsborgerskap
    ),
    item('Bosatt i Norge', medlemskap.bosattINorge ? 'Ja' : 'Nei'),
    item('Diskresjonskode', medlemskap.diskresjonskode || 'Nei')
];

const opptjening = opptjening => [
    item('Første sykdomsdag', toDate(opptjening.førsteSykdomsdag)),
    item('Startdato', toDate(opptjening.startdato)),
    item(
        'Sluttdato',
        opptjening.sluttdato ? toDate(opptjening.sluttdato) : '-'
    ),
    item('Antall dager (>28)', `${opptjening.antallDager}`)
];

const søknadsfrist = søknadsfrist => [
    item('Sendt NAV', toDate(søknadsfrist.sendtNav)),
    item('Siste sykdomsdag', toDate(søknadsfrist.sisteSykdomsdag)),
    item('Innen 3 mnd', søknadsfrist.innen3Mnd ? 'Ja' : 'Nei')
];

const dagerIgjen = dagerIgjen => [
    item('Første fraværsdag', toDate(dagerIgjen.førsteFraværsdag)),
    item('Første sykepengedag', toDate(dagerIgjen.førsteSykepengedag)),
    item('Yrkesstatus', capitalize(dagerIgjen.yrkesstatus)),
    item('Tidligere perioder', dagerIgjen.tidligerePerioder.length || '-'),
    item('Max dato', toDate(dagerIgjen.maxDato))
];

const under67År = dagerIgjen => [item('Alder', `${dagerIgjen.alder}`)];

export default {
    medlemskap,
    opptjening,
    søknadsfrist,
    dagerIgjen,
    under67År
};
