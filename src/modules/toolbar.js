import Quill from 'quill';
import { EmbedBlot } from 'parchment';
import Delta from 'quill-delta';
import logger from 'quill/core/logger';
import QuillToolBar from 'quill/modules/toolbar';

const debug = logger('quill:toolbar');

const conflictPairs = {
    header: ['size', 'bold']
};

class Toolbar extends QuillToolBar {
    attach(input) {
        let format = Array.from(input.classList).find((className) => className.indexOf('ql-') === 0);
        if (!format) return;
        format = format.slice('ql-'.length);
        if (input.tagName === 'BUTTON') {
            input.setAttribute('type', 'button');
        }
        if (
            this.handlers[format] == null
          && this.quill.scroll.query(format) == null
        ) {
            debug.warn('ignoring attaching to nonexistent format', format, input);
            return;
        }
        const eventName = input.tagName === 'SELECT' ? 'change' : 'click';
        input.addEventListener(eventName, (e) => {
            if (!input.getAttribute('data-disabled')) {
                let value;
                if (input.tagName === 'SELECT') {
                    if (input.selectedIndex < 0) return;
                    const selected = input.options[input.selectedIndex];
                    if (selected.hasAttribute('selected')) {
                        value = false;
                    } else {
                        value = selected.value || false;
                    }
                } else {
                    if (input.classList.contains('ql-active')) {
                        value = false;
                    } else {
                        value = input.value || !input.hasAttribute('value');
                    }
                    e.preventDefault();
                }
                this.quill.focus();
                const [range] = this.quill.selection.getRange();
                if (this.handlers[format] != null) {
                    this.handlers[format].call(this, value);
                } else if (
                    this.quill.scroll.query(format).prototype instanceof EmbedBlot
                ) {
                    value = prompt(`Enter ${format}`); // eslint-disable-line no-alert
                    if (!value) return;
                    this.quill.updateContents(
                        new Delta()
                            .retain(range.index)
                            .delete(range.length)
                            .insert({ [format]: value }),
                        Quill.sources.USER
                    );
                } else {
                    this.quill.format(format, value, Quill.sources.USER);
                }
                this.update(range);
            }
        });
        this.controls.push([format, input]);
    }

    update(range) {
        // 获得当前范围格式
        const formats = range == null ? {} : this.quill.getFormat(range);

        // 获得当前格式冲突的格式
        const conflictFormatSet = new Set();
        Object.keys(formats).forEach((format) => {
            const conflictFormats = conflictPairs[format];
            if (conflictFormats) {
                conflictFormats.forEach((conflictFormat) => {
                    conflictFormatSet.add(conflictFormat);
                });
            }
        });

        // 更新 Toolbar
        this.controls.forEach((pair) => {
            const [format, input] = pair;

            // 冲突的 input 不显示
            if (conflictFormatSet.has(format)) {
                input.setAttribute('data-disabled', true);
            } else {
                input.removeAttribute('data-disabled');
            }

            // Select 值来自于 quill.getFormat
            if (input.tagName === 'SELECT') {
                const mockSelectEle = this.container.querySelector(`.ql-picker.ql-${format}`);
                if (mockSelectEle) {
                    if (conflictFormatSet.has(format)) {
                        mockSelectEle.setAttribute('data-disabled', true);
                    } else {
                        mockSelectEle.removeAttribute('data-disabled');
                    }
                }

                let option;
                if (range == null) {
                    option = null;
                } else if (formats[format] == null) {
                    option = input.querySelector('option[selected]');
                } else if (!Array.isArray(formats[format])) {
                    let value = formats[format];
                    if (typeof value === 'string') {
                        value = value.replace(/"/g, '\\"');
                    }
                    option = input.querySelector(`option[value="${value}"]`);
                }
                if (option == null) {
                    input.value = '';
                    input.selectedIndex = -1;
                } else {
                    option.selected = true;
                }
            } else if (range == null) {
                input.classList.remove('ql-active');
            } else if (input.hasAttribute('value')) {
                // input 有值的，需判断该值和 format 是否一致
                const isActive = formats[format] === input.getAttribute('value')
              || (formats[format] != null
                && formats[format].toString() === input.getAttribute('value'))
              || (formats[format] == null && !input.getAttribute('value'));
                input.classList.toggle('ql-active', isActive);
            } else {
                // 只有 value 不为 null，就认为是 active 的
                input.classList.toggle('ql-active', formats[format] != null);
            }
        });
    }
}

export default Toolbar;
