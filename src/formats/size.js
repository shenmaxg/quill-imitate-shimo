import Quill from 'quill';

const { StyleAttributor, Scope, ClassAttributor } = Quill.import('parchment');

const SizeClass = new ClassAttributor('size', 'ql-size', {
    scope: Scope.INLINE,
    whitelist: ['9', '10', '11', '12', '13', '14', '16', '18', '20', '22', '24', '30', '36']
});

const SizeStyle = new StyleAttributor('size', 'font-size', {
    scope: Scope.INLINE,
    whitelist: ['10px', '18px', '32px']
});

export { SizeClass, SizeStyle };
