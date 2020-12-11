import Adapter from 'enzyme-adapter-react-16';
import { configure } from 'enzyme';

const { JSDOM } = require('jsdom');

const jsdom = new JSDOM();
const { window } = jsdom;

function copyProps(src, target) {
    const props = Object.getOwnPropertyNames(src)
        .filter(prop => typeof target[prop] === 'undefined')
        .map(prop => Object.getOwnPropertyDescriptor(src, prop));
    Object.defineProperties(target, props);
}

global.window = window;
global.document = window.document;
global.navigator = {
    userAgent: 'node.js',
};
copyProps(window, global);

// Ignore React Web errors when using React Native
// but still show relevant errors
const suppressedErrors = /(React does not recognize the.*prop on a DOM element|Unknown event handler property|is using uppercase HTML|Received `true` for a non-boolean attribute `accessible`|The tag.*is unrecognized in this browser)|is using incorrect casing|Received `true` for a non-boolean attribute `enabled`/;
const realConsoleError = console.error; // eslint-disable-line
// eslint-disable-next-line
console.error = message => {

    const mensagemIgnorada = "If you want to write it to the DOM";
    if (message.match(suppressedErrors) || message.includes(mensagemIgnorada)) {
        return;
    }
    realConsoleError(message);
};

configure({ adapter: new Adapter() });