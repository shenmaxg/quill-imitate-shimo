import extend from 'extend';
import Emitter from 'quill/core/emitter';
import Theme from 'quill/core/theme';
import IconPicker from 'quill/ui/icon-picker';
import Tooltip from 'quill/ui/tooltip';
import Quill from 'quill';
import ColorPicker from '../ui/color-picker';
import Picker from '../ui/picker';
import { fontFamilyList, isSupportFontFamily } from '../components/FontFamily';
import ColorIcon from '../icons/color.svg';
import BgColorIcon from '../icons/background.svg';
import { colorList } from '../components/Color';
import { bgColorList } from '../components/Background';

const icons = {
    color: ColorIcon,
    background: BgColorIcon
};

const colors = {
    color: colorList,
    background: bgColorList
};

const ALIGNS = [false, 'center', 'right', 'justify'];

class BaseTheme extends Theme {
    constructor(quill, options) {
        super(quill, options);
        const listener = (e) => {
            if (!document.body.contains(quill.root)) {
                document.body.removeEventListener('click', listener);
                return;
            }
            if (
                this.tooltip != null
        && !this.tooltip.root.contains(e.target)
        && document.activeElement !== this.tooltip.textbox
        && !this.quill.hasFocus()
            ) {
                this.tooltip.hide();
            }
            if (this.pickers != null) {
                this.pickers.forEach((picker) => {
                    if (!picker.container.contains(e.target)) {
                        picker.close();
                    }
                });
            }
        };
        quill.emitter.listenDOM('click', document.body, listener);
    }

    addModule(name) {
        const module = super.addModule(name);
        if (name === 'toolbar') {
            this.extendToolbar(module);
        }
        return module;
    }

    buildPickers(selects) {
        this.pickers = Array.from(selects).map((select) => {
            if (select.classList.contains('ql-align')) {
                if (select.querySelector('option') == null) {
                    fillSelect(select, ALIGNS);
                }
                return new IconPicker(select, icons.align);
            }

            // 判断字体在当前环境是否支持
            if (select.classList.contains('ql-font')) {
                select.options.forEach((option) => {
                    const value = option.getAttribute('value');
                    const font = fontFamilyList.find((item) => (`${item.value}` === value));
                    if (typeof font.attr === 'string') {
                        option.setAttribute('disabled', !isSupportFontFamily(font.attr));
                    }
                });
            }

            let picker;

            // 文本颜色以及文本背景色
            if (select.classList.contains('ql-background') || select.classList.contains('ql-color')) {
                const format = select.classList.contains('ql-background')
                    ? 'background'
                    : 'color';
                picker = new ColorPicker(select, icons[format], colors[format]);
            } else {
                picker = new Picker(select);
            }

            const { label } = picker;

            // label 点击后，编辑器会失去焦点，导致 toolbar 数据错误
            // 将编辑器重新聚焦
            label.addEventListener('click', () => {
                this.quill.focus();
            });

            return picker;
        });
        const update = () => {
            this.pickers.forEach((picker) => {
                picker.update();
            });
        };
        this.quill.on(Emitter.events.EDITOR_CHANGE, update);
        // 换行的时候也需要更新 label
        this.quill.on(Quill.events.SCROLL_OPTIMIZE, update);
    }
}
BaseTheme.DEFAULTS = extend(true, {}, Theme.DEFAULTS, {
    modules: {
        toolbar: {
            handlers: {
                formula() {
                    this.quill.theme.tooltip.edit('formula');
                },
                image() {
                    let fileInput = this.container.querySelector(
                        'input.ql-image[type=file]'
                    );
                    if (fileInput == null) {
                        fileInput = document.createElement('input');
                        fileInput.setAttribute('type', 'file');
                        fileInput.setAttribute(
                            'accept',
                            this.quill.uploader.options.mimetypes.join(', ')
                        );
                        fileInput.classList.add('ql-image');
                        fileInput.addEventListener('change', () => {
                            const range = this.quill.getSelection(true);
                            this.quill.uploader.upload(range, fileInput.files);
                            fileInput.value = '';
                        });
                        this.container.appendChild(fileInput);
                    }
                    fileInput.click();
                },
                video() {
                    this.quill.theme.tooltip.edit('video');
                }
            }
        }
    }
});

class BaseTooltip extends Tooltip {
    constructor(quill, boundsContainer) {
        super(quill, boundsContainer);
        this.textbox = this.root.querySelector('input[type="text"]');
        this.listen();
    }

    listen() {
        this.textbox.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                this.save();
                event.preventDefault();
            } else if (event.key === 'Escape') {
                this.cancel();
                event.preventDefault();
            }
        });
    }

    cancel() {
        this.hide();
    }

    edit(mode = 'link', preview = null) {
        this.root.classList.remove('ql-hidden');
        this.root.classList.add('ql-editing');
        if (preview != null) {
            this.textbox.value = preview;
        } else if (mode !== this.root.getAttribute('data-mode')) {
            this.textbox.value = '';
        }
        this.position(this.quill.getBounds(this.quill.selection.savedRange));
        this.textbox.select();
        this.textbox.setAttribute(
            'placeholder',
            this.textbox.getAttribute(`data-${mode}`) || ''
        );
        this.root.setAttribute('data-mode', mode);
    }

    restoreFocus() {
        const { scrollTop } = this.quill.scrollingContainer;
        this.quill.focus();
        this.quill.scrollingContainer.scrollTop = scrollTop;
    }

    save() {
        let { value } = this.textbox;
        switch (this.root.getAttribute('data-mode')) {
        case 'link': {
            const { scrollTop } = this.quill.root;
            if (this.linkRange) {
                this.quill.formatText(
                    this.linkRange,
                    'link',
                    value,
                    Emitter.sources.USER
                );
                delete this.linkRange;
            } else {
                this.restoreFocus();
                this.quill.format('link', value, Emitter.sources.USER);
            }
            this.quill.root.scrollTop = scrollTop;
            break;
        }
        case 'video': {
            value = extractVideoUrl(value);
        } // eslint-disable-next-line no-fallthrough
        case 'formula': {
            if (!value) break;
            const range = this.quill.getSelection(true);
            if (range != null) {
                const index = range.index + range.length;
                this.quill.insertEmbed(
                    index,
                    this.root.getAttribute('data-mode'),
                    value,
                    Emitter.sources.USER
                );
                if (this.root.getAttribute('data-mode') === 'formula') {
                    this.quill.insertText(index + 1, ' ', Emitter.sources.USER);
                }
                this.quill.setSelection(index + 2, Emitter.sources.USER);
            }
            break;
        }
        default:
        }
        this.textbox.value = '';
        this.hide();
    }
}

function extractVideoUrl(url) {
    let match = url.match(
        /^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtube\.com\/watch.*v=([a-zA-Z0-9_-]+)/
    )
    || url.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (match) {
        return `${match[1] || 'https'}://www.youtube.com/embed/${match[2]
        }?showinfo=0`;
    }
    // eslint-disable-next-line no-cond-assign
    if ((match = url.match(/^(?:(https?):\/\/)?(?:www\.)?vimeo\.com\/(\d+)/))) {
        return `${match[1] || 'https'}://player.vimeo.com/video/${match[2]}/`;
    }
    return url;
}

function fillSelect(select, values, defaultValue = false) {
    values.forEach((value) => {
        const option = document.createElement('option');
        if (value === defaultValue) {
            option.setAttribute('selected', 'selected');
        } else {
            option.setAttribute('value', value);
        }
        select.appendChild(option);
    });
}

export { BaseTooltip, BaseTheme as default };
