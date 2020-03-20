// This file will add both p5 instanced and global intellisence 
import p5Module = require('p5');
import * as p5Global from 'p5/global'

import lodashGlobal = require('lodash');

export = p5Module;
export as namespace p5;
declare global {
    interface Window {
        p5: typeof p5Module,
        _: typeof lodashGlobal
    }
}

