import Picker from './picker';
import DropdownIcon from '../icons/dropdown.svg';
import { colorList } from '../components/Color';

class ColorPicker extends Picker {
    constructor(select, icon, colors) {
        super(select, icon, colors);

        this.container.classList.add('ql-color-picker');
    }

    buildLabel(icon) {
        const label = document.createElement('span');
        label.classList.add('ql-picker-label');
        label.tabIndex = '0';
        label.setAttribute('role', 'button');
        label.setAttribute('aria-expanded', 'false');

        const labelIcon = document.createElement('span');
        labelIcon.classList.add('color-icon');
        labelIcon.innerHTML = icon;

        const labelDropDown = document.createElement('span');
        labelDropDown.classList.add('color-dropdown');
        labelDropDown.innerHTML = DropdownIcon;

        label.appendChild(labelIcon);
        label.appendChild(labelDropDown);
        this.container.appendChild(label);
        return label;
    }

    buildItem(option, icon, colors) {
        const item = super.buildItem(option);

        item.style.backgroundColor = option.getAttribute('value') || '';
        const tip = document.createElement('span');
        const text = item.getAttribute('data-label');
        const value = item.getAttribute('data-value');

        const color = colors.find((item) => item.value.toLowerCase() === value);
        item.setAttribute('data-light', color.light);

        tip.innerText = text;
        tip.classList.add('color-name-tip');
        item.appendChild(tip);

        return item;
    }

    selectItem(item, trigger) {
        super.selectItem(item, trigger);
        const colorLabel = this.label.querySelector('.ql-color-label');
        let value = item ? item.getAttribute('data-value') || '' : '';

        // 颜色和背景删除时候， label 也要跟着变化
        if (!value || value === 'false') {
            if (this.select.classList.contains('ql-color')) {
                value = '#333333';
            } else if (this.select.classList.contains('ql-background')) {
                value = '#FFFFFF';
            }
        }

        if (colorLabel) {
            if (colorLabel.tagName === 'line') {
                colorLabel.style.stroke = value;
            } else {
                colorLabel.style.fill = value;
            }
        }
    }
}

export default ColorPicker;
