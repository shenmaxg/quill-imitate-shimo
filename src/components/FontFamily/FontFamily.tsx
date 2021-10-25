import React from 'react';

interface IFontFamily {
    name: string;
    value: string | boolean;
    attr?: string | boolean;
}

const isSupportFontFamily = (fontName: string): boolean => {
    const baseFont = 'Arial';
    if (fontName.toLowerCase() === baseFont.toLowerCase()) {
        return true;
    }

    const testLetter = 'a';
    const fontSize = 100;
    const width = 100;
    const height = 100;
    const canvas = document.createElement('canvas');
    const context: CanvasRenderingContext2D | null = canvas.getContext('2d');

    if (context !== null) {
        canvas.width = width;
        canvas.height = height;
        context.textAlign = 'center';
        context.fillStyle = 'black';
        context.textBaseline = 'middle';

        const getImageInfo = (name: string) => {
            context.clearRect(0, 0, width, height);
            context.font = `${fontSize}px ${name}, ${baseFont}`;
            context.fillText(testLetter, width / 2, height / 2);
            const k = context.getImageData(0, 0, width, height).data;
            return [].slice.call(k).filter((l) => l !== 0);
        };
        return getImageInfo(baseFont).join('') !== getImageInfo(fontName).join('');
    }

    return true;
};

const fontFamilyList: IFontFamily[] = [
    {
        name: '默认字体',
        value: false,
        attr: false
    },
    {
        name: '宋体',
        value: 'simsun',
        attr: 'SimSun'
    },
    {
        name: '黑体',
        value: 'simhei',
        attr: 'SimHei'
    },
    {
        name: '微软雅黑',
        value: 'microsoftyahei',
        attr: 'Microsoft YaHei'
    },
    {
        name: '仿宋',
        value: 'fangsong',
        attr: 'FangSong'
    },
    {
        name: '楷体',
        value: 'kaiti',
        attr: 'KaiTi'
    },
    {
        name: 'Arial',
        value: 'arial',
        attr: 'Arial'
    },
    {
        name: 'Droid Serif',
        value: 'droid',
        attr: 'Droid Serif'
    },
    {
        name: 'Source Code Pro',
        value: 'source',
        attr: 'Source Code Pro'
    },
    {
        name: 'Times New Roman',
        value: 'timesnewroman',
        attr: 'Times New Roman'
    },
    {
        name: 'Noto Sans JP',
        value: 'notosans',
        attr: 'Noto Sans JP'
    }
];

const FontFamily: React.FC = () => (
    <select className="ql-font" defaultValue="false">
        {
            fontFamilyList.map((font) => (
                <option key={`${font.value}`} value={`${font.value}`}>
                    {font.name}
                </option>
            ))
        }
    </select>
);

export { FontFamily, fontFamilyList, isSupportFontFamily };
