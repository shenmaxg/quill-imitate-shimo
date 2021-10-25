import Quill from 'quill';

const Inline = Quill.import('blots/inline');

function sanitize(url, protocols) {
    const anchor = document.createElement('a');
    anchor.href = url;
    const protocol = anchor.href.slice(0, anchor.href.indexOf(':'));
    return protocols.indexOf(protocol) > -1;
}

class CLink extends Inline {
    static create(value) {
        const node = super.create(value);
        value = this.sanitize(value);
        node.setAttribute('href', value);
        node.setAttribute('rel', 'noopener noreferrer');
        node.setAttribute('class', 'ql-clink');
        node.setAttribute('target', '_blank');
        return node;
    }

    static formats(domNode) {
        return domNode.getAttribute('href');
    }

    static sanitize(url) {
        return sanitize(url, this.PROTOCOL_WHITELIST) ? url : this.SANITIZED_URL;
    }

    format(name, value) {
        if (name !== this.statics.blotName || !value) return super.format(name, value);
        value = this.constructor.sanitize(value);
        this.domNode.setAttribute('href', value);
    }
}
CLink.blotName = 'clink';
CLink.tagName = 'A';
CLink.SANITIZED_URL = 'about:blank';
CLink.PROTOCOL_WHITELIST = ['http', 'https', 'mailto', 'tel'];

export { CLink as default, sanitize };
