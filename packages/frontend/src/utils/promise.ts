export const ignorePromise = (promise: Promise<unknown>, onError: (err: Error) => void) => {
    promise.catch(onError);
};
