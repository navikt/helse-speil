export const item = (label, value) => ({ label, value });

export const toDate = dateString => new Date(dateString).toLocaleDateString('nb-NO');

export const capitalize = string =>
    string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

