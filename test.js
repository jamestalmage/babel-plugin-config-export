import {serial as test} from 'ava';
import * as babel from 'babel-core';
import fn from './';

function transform(input, ...configNames) {
	return babel.transform(input, {
		plugins: configNames.map(fn),
		filename: 'some-file.js'
	});
}

const source = `
    export const avaConfig = {foo: 'bar'};
    export const avaConfig2 = {baz: 'quz'};
    export const foo = 'bar';
    export function burp() {}
`;

test(t => {
	const result = transform(source, 'avaConfig', 'avaConfig2', 'foo', 'burp');

	t.deepEqual(fn.getConfig(result, 'avaConfig'), {foo: 'bar'});
	t.deepEqual(fn.getConfig(result, 'avaConfig2'), {baz: 'quz'});
	t.is(fn.getConfig(result, 'foo'), 'bar');
	t.is(fn.getConfig(result, 'burp'), null);

	t.is(fn('foo').getConfig(result), 'bar');
});

