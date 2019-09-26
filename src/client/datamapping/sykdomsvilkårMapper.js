import { item } from './mappingUtils';
import { toDate } from '../utils/date';
import { sykdomsvilkårtekster as tekster } from '../tekster';

const mindreEnnÅtteUker = data => [
    item(tekster('første_sykdomsdag'), toDate(data.førsteSykdomsdag)),
    item(tekster('siste_sykdomsdag'), toDate(data.sisteSykdomsdag))
];

export default {
    mindreEnnÅtteUker
};
