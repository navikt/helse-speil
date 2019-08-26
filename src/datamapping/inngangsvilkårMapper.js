import { item } from './mappingUtils';
import { toDate } from '../utils/date';
import { capitalize, toKroner } from '../utils/locale';
import { inngangsvilkårtekster as tekster } from '../tekster';

const medlemskap = medlemskap => [
    item(
        tekster('etikett -> statsborgerskap'),
        medlemskap.statsborgerskap === 'NOR'
            ? 'Norsk'
            : medlemskap.statsborgerskap
    ),
    item(tekster('etikett -> bosatt'), medlemskap.bosattINorge ? 'Ja' : 'Nei'),
    item(
        tekster('etikett -> diskresjonskode'),
        medlemskap.diskresjonskode || 'Ingen'
    )
];

const opptjening = opptjening => [
    item(
        tekster('etikett.førsteSykdomsdag'),
        toDate(opptjening.førsteSykdomsdag)
    ),
    item(tekster('etikett.startdato'), toDate(opptjening.startdato)),
    item(
        tekster('etikett.sluttdato'),
        opptjening.sluttdato ? toDate(opptjening.sluttdato) : '-'
    ),
    item(tekster('etikett.antall dager'), `${opptjening.antallDager}`)
];

const merEnn05G = merEnn05G => [
    item(tekster('etikett_sykepengegrunnlaget'), `${toKroner(merEnn05G)} kr`),
    item(tekster('etikett_05Ger').replace('{$1}', toKroner(98866 / 2)))
];

const søknadsfrist = søknadsfrist => [
    item(tekster('etikett_sendt_nav'), toDate(søknadsfrist.sendtNav)),
    item(
        tekster('etikett_siste_sykdomsdag'),
        toDate(søknadsfrist.sisteSykdomsdag)
    ),
    item(tekster('etikett_innen_3_mnd'), søknadsfrist.innen3Mnd ? 'Ja' : 'Nei')
];

const dagerIgjen = dagerIgjen => [
    item(
        tekster('etikett: første fraværsdag'),
        toDate(dagerIgjen.førsteFraværsdag)
    ),
    item(
        tekster('etikett: første sykepengedag'),
        toDate(dagerIgjen.førsteSykepengedag)
    ),
    item(tekster('etikett: yrkesstatus'), capitalize(dagerIgjen.yrkesstatus)),
    item(
        tekster('etikett: tidligere perioder'),
        dagerIgjen.tidligerePerioder.length || '-'
    ),
    item(tekster('etikett: max dato'), toDate(dagerIgjen.maxDato))
];

const under67År = dagerIgjen => [
    item(tekster('etikett -> alder'), `${dagerIgjen.alder}`)
];

export default {
    medlemskap,
    opptjening,
    merEnn05G,
    søknadsfrist,
    dagerIgjen,
    under67År
};
