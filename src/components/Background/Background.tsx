import React from 'react';
import { colorList } from '../Color';

// 调整默认色
const bgColorList = [{
    name: '无背景',
    value: 'false',
    light: 'light'
}];

colorList.forEach((item, index) => {
    if (index > 0) {
        if (item.name === '墨') {
            bgColorList.push({
                name: '墨',
                value: '#494949',
                light: 'dark'
            });
        } else {
            bgColorList.push(item);
        }
    }
});

const Background: React.FC = () => (
    <select className="ql-background" defaultValue="false">
        {
            bgColorList.map((color) => (
                <option key={`${color.value}`} value={`${color.value.toLowerCase()}`}>
                    {color.name}
                </option>
            ))
        }
    </select>
);

export { Background, bgColorList };
