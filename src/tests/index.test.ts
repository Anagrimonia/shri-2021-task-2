import { expect } from 'chai';

import input from '../input.json';
import output from '../output.json';

const { prepareData } = require('../index');

describe('PrepareData tests', () => {
    it('Checking an example', () => {
        const data = prepareData(input, { sprintId: 977 })
        expect(data).to.deep.equal(output);
    });

    it('dummy test', () => { 

         
    });

    it('dummy test', () => { 

         
    });

    it('dummy test', () => { 

         
    });

    it('dummy test', () => { 

         
    });

    it('dummy test', () => { 

         
    });

    it('dummy test', () => { 

         
    });

    it('dummy test', () => { 

         
    });

    it('dummy test', () => { 

         
    });

    it('dummy test', () => { 

         
    });
});