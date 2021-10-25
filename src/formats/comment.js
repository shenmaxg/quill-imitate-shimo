import Quill from 'quill';

const Inline = Quill.import('blots/inline');

class CommentBlot extends Inline {
    static create(value) {
        const node = super.create(value);
        node.setAttribute('data-comment-guid', value);
        return node;
    }

    static formats(domNode) {
        return domNode.getAttribute('data-comment-guid');
    }

    format(name, value) {
        if (name !== this.statics.blotName || !value) {
            super.format(name, value);
        }
        this.domNode.setAttribute('data-comment-guid', value);
    }
}
CommentBlot.blotName = 'comment';
CommentBlot.tagName = 'span';
CommentBlot.className = 'ql-commented';

export default CommentBlot;
