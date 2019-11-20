import { item } from './mappingUtils';
import { toDate } from '../utils/date';
import { capitalize, toKroner, toKronerOgØre } from '../utils/locale';

const medlemskap = medlemskap => [
    item(
        'Statsborgerskap',
        medlemskap.statsborgerskap === 'NOR' ? 'Norsk' : medlemskap.statsborgerskap
    ),
    item('Bosatt i Norge', medlemskap.bosattINorge ? 'Ja' : 'Nei'),
    item('Diskresjonskode', medlemskap.diskresjonskode || 'Ingen')
];

const opptjening = opptjening => [
    item('Første sykdomsdag', toDate(opptjening.førsteSykdomsdag)),
    item('Startdato', toDate(opptjening.startdato)),
    item('Sluttdato', opptjening.sluttdato ? toDate(opptjening.sluttdato) : '-'),
    item('Antall dager (>28)', `${opptjening.antallDager}`)
];

const merEnn05G = sykepengegrunnlag => [
    item('Sykepengegrunnlaget', `${toKronerOgØre(sykepengegrunnlag)} kr`),
    item(`0,5G er ${toKroner(99858 / 2)} kr`)
];

const søknadsfrist = søknadsfrist => [
    item('Sendt NAV', toDate(søknadsfrist.sendtNav)),
    item('Søknad TOM', toDate(søknadsfrist.søknadTom)),
    item('Innen 3 mnd', søknadsfrist.innen3Mnd ? 'Ja' : 'Nei')
];

const dagerIgjen = dagerIgjen => [
    item('Første fraværsdag', toDate(dagerIgjen.førsteFraværsdag)),
    item('Første sykepengedag', toDate(dagerIgjen.førsteSykepengedag)),
    item('Yrkesstatus', capitalize(dagerIgjen.yrkesstatus)),
    item('Dager brukt', dagerIgjen.dagerBrukt),
    item('Dager igjen', 248 - dagerIgjen.dagerBrukt),
    item('Maks dato', toDate(dagerIgjen.maksdato))
];

const alder = alder => [item('Alder', `${alder}`)];

export default {
    medlemskap,
    opptjening,
    merEnn05G,
    søknadsfrist,
    dagerIgjen,
    alder
};
