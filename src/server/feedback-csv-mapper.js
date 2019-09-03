const csvMapper = feedbacks => {
    return header + feedbacks.map(mapFeedback).join('\n\n');
};

const mapFeedback = f => {
    const feedback = f.value;
    const feedbackId = f.key;
    const submittedDate = feedback.submittedDate;
    const kommentarer = feedback.kommentarer;

    const mapUenighet = uenighet => {
        const uenighetId = uenighet.id;
        const userId = uenighet.userId.email || 'ukjent bruker';
        const items = (uenighet.items || [])
            .map(item => `${item.label}, ${item.value}`)
            .join(' - ');
        return `${uenighet.label};${uenighet.value};${items};${uenighetId};${userId};${submittedDate};${kommentarer};${feedbackId}`;
    };

    return feedback.uenigheter.map(mapUenighet).join('\n');
};

const header =
    'uenighet-label;uenighet-value;uenighet-items;uenighet-id;uenighet-userId;submittedDate;kommentarer;behandlingsId\n';

module.exports = {
    csvMapper
};
