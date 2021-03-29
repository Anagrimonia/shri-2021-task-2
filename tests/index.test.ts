const { expect } = require('chai');

import input from './data/input/input.json';
import inputDeepNested from './data/input/input-deep-nested.json';
import inputSelfLike from './data/input/input-self-like.json';

import output from './data/output/output.json';
import outputNotYet from './data/output/output-not-yet.json';
import outputEmpty from './data/output/output-empty.json';
import outputDeepNested from './data/output/output-deep-nested.json';
import outputSelfLike from './data/output/output-self-like.json';


const { prepareData } = require('../build/index');
var fs = require('fs');

describe('PrepareData tests', () => {
    it('Checking result for an example', () => { 
        const data = prepareData(input, { sprintId: 977 })
        expect(data).to.deep.equal(output);
    });

    it('Checking result for a not yet sprint', () => {
        const data = prepareData(input, { sprintId: 996 })
        expect(data).to.deep.equal(outputNotYet);
    });

    it('Checking result for an empty input array', () => { 
      const data = prepareData([], { sprintId: 0 })
      expect(data).to.deep.equal(outputEmpty);
    });

    it('Checking result for deep nested JSON', () => { 
      const data = prepareData(inputDeepNested, { sprintId: 1 })
      expect(data).to.deep.equal(outputDeepNested);
    });

    it('Checking result for self-liking case', () => { 
      const data = prepareData(inputSelfLike, { sprintId: 1 })
      expect(data).to.deep.equal(outputSelfLike);
    });
});