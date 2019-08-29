const log = string => {
    const seed = new Date();
    const now = new Date(seed.getTime() - seed.getTimezoneOffset() * 60000)
        .toISOString()
        .replace(/Z/, '');
    console.log(`${now}: ${string}`);
};

module.exports = {
    log
};
