export class LazyLoadPendingError extends Error {}

export class LazyLoadError extends Error {
    constructor(message?: string) {
        super(message ?? 'Kunne ikke laste inn deler av siden. Kontakt en utvikler.');
        this.name = 'LazyLoadError';
    }
}

export const onLazyLoadFail = (error: Error): Promise<never> => {
    console.log(error.message);
    const numberOfTimesFailed = Number(window.sessionStorage.getItem(error.message));

    if (numberOfTimesFailed < 2) {
        window.sessionStorage.setItem(error.message, `${numberOfTimesFailed + 1}`);
        window.location.reload();
        return Promise.reject(new LazyLoadPendingError());
    } else {
        return Promise.reject(new LazyLoadError());
    }
};
