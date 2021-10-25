import { ClassAttributor, Scope, StyleAttributor } from 'parchment';

const config = {
    scope: Scope.INLINE,
    whitelist: ['simsun', 'simhei', 'microsoftyahei', 'fangsong', 'kaiti', 'arial', 'droid', 'source', 'timesnewroman', 'notosans']
};

const FontClass = new ClassAttributor('font', 'ql-font', config);

class FontStyleAttributor extends StyleAttributor {
    value(node) {
        return super.value(node).replace(/["']/g, '');
    }
}

const FontStyle = new FontStyleAttributor('font', 'font-family', config);

export { FontStyle, FontClass };
