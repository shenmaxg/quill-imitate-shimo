import DropdownIcon from '../icons/dropdown.svg';

let optionsCounter = 0;

function toggleAriaAttribute(element, attribute) {
    element.setAttribute(
        attribute,
        !(element.getAttribute(attribute) === 'true')
    );
}

class Picker {
    constructor(select, ...args) {
        this.select = select;
        this.container = document.createElement('span');
        this.buildPicker(...args);
        this.select.style.display = 'none';
        this.select.parentNode.insertBefore(this.container, this.select);

        this.label.addEventListener('mousedown', () => {
            if (!this.container.hasAttribute('data-disabled')) {
                this.togglePicker();
            }
        });
        this.label.addEventListener('keydown', (event) => {
            switch (event.key) {
            case 'Enter':
                if (!this.container.hasAttribute('data-disabled')) {
                    this.togglePicker();
                }
                break;
            case 'Escape':
                this.escape();
                event.preventDefault();
                break;
            default:
            }
        });
        this.select.addEventListener('change', this.update.bind(this));
    }

    togglePicker() {
        this.container.classList.toggle('ql-expanded');
        toggleAriaAttribute(this.label, 'aria-expanded');
        toggleAriaAttribute(this.options, 'aria-hidden');
    }

    buildItem(option) {
        const item = document.createElement('span');
        item.tabIndex = '0';
        item.setAttribute('role', 'button');
        item.classList.add('ql-picker-item');
        if (option.hasAttribute('value')) {
            item.setAttribute('data-value', option.getAttribute('value'));
        }
        if (option.textContent) {
            item.setAttribute('data-label', option.textContent);
        }
        if (option.getAttribute('disabled') === 'true') {
            item.setAttribute('data-disabled', option.getAttribute('disabled'));
        }
        item.addEventListener('click', () => {
            this.selectItem(item, true);
        });
        item.addEventListener('keydown', (event) => {
            switch (event.key) {
            case 'Enter':
                this.selectItem(item, true);
                event.preventDefault();
                break;
            case 'Escape':
                this.escape();
                event.preventDefault();
                break;
            default:
            }
        });

        return item;
    }

    buildLabel() {
        const label = document.createElement('span');
        label.classList.add('ql-picker-label');
        label.innerHTML = DropdownIcon;
        label.tabIndex = '0';
        label.setAttribute('role', 'button');
        label.setAttribute('aria-expanded', 'false');
        this.container.appendChild(label);
        return label;
    }

    buildOptions(...args) {
        const options = document.createElement('span');
        options.classList.add('ql-picker-options');

        // Don't want screen readers to read this until options are visible
        options.setAttribute('aria-hidden', 'true');
        options.tabIndex = '-1';

        // Need a unique id for aria-controls
        options.id = `ql-picker-options-${optionsCounter}`;
        optionsCounter += 1;
        this.label.setAttribute('aria-controls', options.id);

        this.options = options;

        Array.from(this.select.options).forEach((option) => {
            const item = this.buildItem(option, ...args);
            options.appendChild(item);
            if (option.selected === true) {
                this.selectItem(item);
            }
        });
        this.container.appendChild(options);
    }

    buildPicker(...args) {
        Array.from(this.select.attributes).forEach((item) => {
            this.container.setAttribute(item.name, item.value);
        });
        this.container.classList.add('ql-picker');
        this.label = this.buildLabel(...args);
        this.buildOptions(...args);
    }

    escape() {
        this.close();
        setTimeout(() => this.label.focus(), 1);
    }

    close() {
        this.container.classList.remove('ql-expanded');
        this.label.setAttribute('aria-expanded', 'false');
        this.options.setAttribute('aria-hidden', 'true');
    }

    selectItem(item, trigger = false) {
        if (item !== null && item.getAttribute('data-disabled') === 'true') {
            return;
        }

        const selected = this.container.querySelector('.ql-selected');
        if (item === selected) return;
        if (selected != null) {
            selected.classList.remove('ql-selected');
        }
        if (item == null) return;

        item.classList.add('ql-selected');
        this.select.selectedIndex = Array.from(item.parentNode.children).indexOf(
            item
        );
        if (item.hasAttribute('data-value')) {
            this.label.setAttribute('data-value', item.getAttribute('data-value'));
        } else {
            this.label.removeAttribute('data-value');
        }
        if (item.hasAttribute('data-label')) {
            this.label.setAttribute('data-label', item.getAttribute('data-label'));

            // 修改字体的默认显示
            if (item.getAttribute('data-label') === '默认字体' && this.select.classList.contains('ql-font')) {
                this.label.setAttribute('data-label', '字体');
            }
        } else {
            this.label.removeAttribute('data-label');
        }
        if (trigger) {
            this.select.dispatchEvent(new Event('change'));
            this.close();
        }
    }

    update() {
        let option;
        if (this.select.selectedIndex > -1) {
            const item = this.container.querySelector('.ql-picker-options').children[
                this.select.selectedIndex
            ];
            option = this.select.options[this.select.selectedIndex];
            this.selectItem(item);
        } else {
            this.selectItem(null);
        }
        const isActive = option != null
      && option !== this.select.querySelector('option[selected]');
        this.label.classList.toggle('ql-active', isActive);
    }
}

export default Picker;
