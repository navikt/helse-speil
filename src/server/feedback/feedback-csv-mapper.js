const csvMapper = feedbacks => {
    return header + feedbacks.map(mapFeedback).join('\n\n');
};

const sanitizeForCsv = string =>
    string ? string.replace(/\n/g, ' - ').replace(/;/g, '-') : 'N/A';

const mapItems = items =>
    items?.map(item => `${item.label}, ${item.value}`).join(' - ') || '';

const mapFeedback = f => {
    const feedback = f.value;
    const feedbackId = f.key;
    const submittedDate =
        feedback.submittedDate?.replace('+02:00', '') || 'N/A';
    const kommentarer = sanitizeForCsv(feedback.kommentarer);

    const mapUenighet = uenighet => {
        const uenighetId = uenighet.id;
        const userId = uenighet.userId.email || 'ukjent bruker';
        const items = mapItems(uenighet.items);
        const enteredUenighetValue = sanitizeForCsv(uenighet.value);
        return `${uenighetId};${enteredUenighetValue};${items};${userId};${submittedDate};${kommentarer};${feedbackId}`;
    };

    const mapOldStyleFeedback = feedback =>
        feedback.map(uenighet => {
            const enteredUenighetValue = sanitizeForCsv(uenighet.value);
            return `${uenighet.label};${enteredUenighetValue};;N/A;N/A;N/A;${feedbackId}`;
        });

    if (feedback.uenigheter === undefined) {
        return mapOldStyleFeedback(feedback).join('\n');
    } else if (feedback.uenigheter.length === 0) {
        return `;;;N/A;${submittedDate};${kommentarer};${feedbackId}`;
    }
    return feedback.uenigheter.map(mapUenighet).join('\n');
};

const header =
    'Felt;Inntastet tekst;Kontekst;Saksbehandler;Innrapportert;Kommentarer;BehandlingsID\n';

module.exports = {
    csvMapper
};
