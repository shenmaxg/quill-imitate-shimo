import Quill from 'quill';
import { SizeClass, SizeStyle } from './size';

const { ClassAttributor } = Quill.import('parchment');
const Block = Quill.import('blots/block');
const BlockEmbed = Quill.import('blots/block/embed');
const Inline = Quill.import('blots/inline');
const Bold = Quill.import('formats/bold');

const HeaderClass = new ClassAttributor('header', 'ql-heading');

class Header extends Block {
    static register(globalRegistry) {
        // 注册 class 到 blot 的映射关系
        Header.className = 'ql-heading-title';
        globalRegistry.register(Header);
        Header.className = 'ql-heading-subtitle';
        globalRegistry.register(Header);
        Header.className = null;
    }

    static create(value) {
        let node;

        if (parseInt(value, 10).toString() === value) {
            value = parseInt(value, 10);
        }
        if (typeof value === 'number') {
            node = document.createElement(this.tagName[value - 1]);
        } else if (typeof value === 'string') {
            node = document.createElement(this.defaultTagName);
            HeaderClass.add(node, value.toLowerCase());
        } else {
            node = document.createElement(this.tagName[0]);
        }

        return node;
    }

    format(name, value) {
        this.attributes.attributes = {};

        super.format(name, value);
    }

    insertBefore(childBlot, refBlot) {
        // header 和 size 冲突
        if (childBlot instanceof Inline) {
            SizeClass.remove(childBlot.domNode);
            SizeStyle.remove(childBlot.domNode);
        }
        // header 和 bold 冲突
        if (childBlot.statics.blotName === Bold.blotName) {
            childBlot.unwrap();
        }

        super.insertBefore(childBlot, refBlot);
    }

    static formats(domNode) {
        if (domNode.tagName === Header.defaultTagName) {
            return HeaderClass.value(domNode);
        }
        return this.tagName.indexOf(domNode.tagName) + 1;
    }
}
Header.blotName = 'header';
Header.tagName = ['H1', 'H2', 'H3', 'H4'];
Header.defaultTagName = 'P';

export default Header;
