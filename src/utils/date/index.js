export const toDate = dateString =>
    new Date(dateString).toLocaleDateString('nb-NO');

export const daysBetween = (firstDate, lastDate) => {
    const first = new Date(firstDate);
    const last = new Date(lastDate);
    return Math.ceil(
        Math.abs((first.getTime() - last.getTime()) / (24 * 60 * 60 * 1000))
    );
};
