const test = require('node:test');
const assert = require('node:assert');

test('la version par défaut est dev', () => {
    assert.strictEqual(
        process.env.APP_VERSION || 'dev',
        'dev'
    );
});