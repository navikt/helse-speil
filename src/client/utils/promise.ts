export const ignorePromise = (promise: Promise<any>, onError: (err: Error) => void) => {
    promise.catch(onError);
};
