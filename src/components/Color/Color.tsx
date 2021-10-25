import React from 'react';

interface IColorItem {
    name: string;
    value: string;
    light: string
}

const colorList: IColorItem[] = [
    {
        name: '白',
        value: '#FFFFFF',
        light: 'light'
    },
    {
        name: '漆黑',
        value: '#000000',
        light: 'dark'
    },
    {
        name: '红',
        value: '#FF0000',
        light: 'dark'
    },
    {
        name: '橙',
        value: '#FF7800',
        light: 'dark'
    },
    {
        name: '黄',
        value: '#FFD900',
        light: 'light'
    },
    {
        name: '葱绿',
        value: '#A3E043',
        light: 'dark'
    },
    {
        name: '湖蓝',
        value: '#37D9F0',
        light: 'dark'
    },
    {
        name: '天色',
        value: '#4DA8EE',
        light: 'dark'
    },
    {
        name: '藤紫',
        value: '#956FE7',
        light: 'dark'
    },
    {
        name: '白练',
        value: '#F3F3F4',
        light: 'light'
    },
    {
        name: '白鼠',
        value: '#CCCCCC',
        light: 'light'
    },
    {
        name: '樱',
        value: '#FEF2F0',
        light: 'light'
    },
    {
        name: '缟',
        value: '#FEF5E7',
        light: 'light'
    },
    {
        name: '练',
        value: '#FEFCD9',
        light: 'light'
    },
    {
        name: '芽',
        value: '#EDF6E8',
        light: 'light'
    },
    {
        name: '水',
        value: '#E6FAFA',
        light: 'light'
    },
    {
        name: '缥',
        value: '#EBF4FC',
        light: 'light'
    },
    {
        name: '丁香',
        value: '#F0EDF6',
        light: 'light'
    },
    {
        name: '薄钝',
        value: '#7B7F83',
        light: 'dark'
    },
    {
        name: '墨',
        value: 'false',
        light: 'dark'
    },
    {
        name: '甚三红',
        value: '#EE7976',
        light: 'dark'
    },
    {
        name: '珊瑚',
        value: '#FAA573',
        light: 'dark'
    },
    {
        name: '金',
        value: '#E6B322',
        light: 'dark'
    },
    {
        name: '薄青',
        value: '#98C091',
        light: 'dark'
    },
    {
        name: '白群',
        value: '#79C6CD',
        light: 'dark'
    },
    {
        name: '薄花',
        value: '#6EAAD7',
        light: 'dark'
    },
    {
        name: '紫苑',
        value: '#9C8EC1',
        light: 'dark'
    }
];

const Color: React.FC = () => (
    <select className="ql-color" defaultValue="false">
        {
            colorList.map((color) => (
                <option key={`${color.value}`} value={`${color.value.toLowerCase()}`}>
                    {color.name}
                </option>
            ))
        }
    </select>
);

export { Color, colorList };
