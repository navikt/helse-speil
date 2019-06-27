'use strict';

const FakeS3 = require('fake-s3');
const storage = require('../../src/server/storage');
const port = 1234;

let server = null;

beforeAll(done => {
    server = new FakeS3({
        port: port,
        buckets: ['speil'],
        prefix: 'teststuff/'
    });
    server.bootstrap(err => {
        storage.init(`localhost:${port}`, 'anAccessKeyId', 'aSecretAccessKey');
        done();
    });
});

afterAll(() => {
    server.close();
});

test('save file and read it back', async () => {
    await storage.save('123456ABC', 'some arbitrary text');
    const fileReadResult = await storage.load('123456ABC');
    expect(fileReadResult.Body.toString()).toEqual('some arbitrary text');
});

test('create a new bucket and verify its existense', async () => {
    expect(await storage.bucketExists('nonexisting')).toEqual(false);
    await storage.createBucket('nonexisting');
    expect(await storage.bucketExists('nonexisting')).toEqual(true);
});
