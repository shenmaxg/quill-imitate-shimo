import React from 'react';
import { Layout, Tooltip, Divider } from 'antd';
import { IoIosUndo, IoIosRedo } from 'react-icons/io';
import {
    AiOutlineClear, AiOutlineBold, AiOutlineItalic, AiOutlineUnderline, AiOutlineStrikethrough
} from 'react-icons/ai';
import styles from './EditorToolBar.less';
import FontSize from '../FontSize';
import { FontFamily } from '../FontFamily';
import QlHeader from '../QlHeader';
import { Color } from '../Color';
import { Background } from '../Background';

const {
    Header
} = Layout;

// 正确的做法是使用 svg 将 icons 中的替换，这里为了方便，使用 react icon 替换。
const EditorToolBar: React.FC = () => (
    <Header className={styles.header} id="toolbar">

        {/* 外层加 div 的原因在于 Tooltip 会修改下属元素的 class，而下属元素的 class 同时受 editor 的控制，会冲突 */}
        <Tooltip title="撤销">
            <div>
                <button type="button" className="ql-undo">
                    <IoIosUndo />
                </button>
            </div>
        </Tooltip>

        <Tooltip title="重做">
            <div>
                <button type="button" className="ql-redo">
                    <IoIosRedo />
                </button>
            </div>
        </Tooltip>

        <Tooltip title="清除格式">
            <div>
                <button type="button" className="ql-clean">
                    <AiOutlineClear />
                </button>
            </div>
        </Tooltip>

        <Divider type="vertical" />

        <Tooltip title="标题">
            <div>
                <QlHeader />
            </div>
        </Tooltip>

        <Tooltip title="字体">
            <div>
                <FontFamily />
            </div>
        </Tooltip>

        <Tooltip title="字号">
            <div>
                <FontSize />
            </div>
        </Tooltip>

        <Divider type="vertical" />

        <Tooltip title="粗体">
            <div>
                <button type="button" className="ql-bold">
                    <AiOutlineBold />
                </button>
            </div>
        </Tooltip>

        <Tooltip title="斜体">
            <div>
                <button type="button" className="ql-italic">
                    <AiOutlineItalic />
                </button>
            </div>
        </Tooltip>

        <Tooltip title="下划线">
            <div>
                <button type="button" className="ql-underline">
                    <AiOutlineUnderline />
                </button>
            </div>
        </Tooltip>

        <Tooltip title="中划线">
            <div>
                <button type="button" className="ql-strike">
                    <AiOutlineStrikethrough />
                </button>
            </div>
        </Tooltip>

        <Tooltip title="文本颜色">
            <div>
                <Color />
            </div>
        </Tooltip>

        <Tooltip title="文本高亮">
            <div>
                <Background />
            </div>
        </Tooltip>

        {/* <Tooltip title="有序列表">
            <div>
                <button className="ql-list" value="ordered"></button>
            </div>
        </Tooltip> */}

    </Header>
);

export default EditorToolBar;
