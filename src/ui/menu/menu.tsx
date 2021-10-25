import React from 'react';
import ReactDom from 'react-dom';
import classNames from 'classnames';
import { List } from 'antd';
import styles from './menu.less';

interface menuItem {
    type: string | number;
    value: string;
    level?: number;
}

interface IProps {
    list: menuItem[];
    onClick: (menu: menuItem) => void;
}

const typeOrder = ['title', '1', '2', '3', '4'];

const Menu: React.FC<IProps> = (props) => {
    const { list, onClick } = props;
    const types: string[] = [];
    list.forEach((menu) => {
        if (types.indexOf(`${menu.type}`) === -1) {
            types.push(`${menu.type}`);
        }
    });
    types.sort((a, b) => typeOrder.indexOf(a) - typeOrder.indexOf(b));
    list.forEach((item) => {
        item.level = types.indexOf(`${item.type}`);
    });

    return (
        <List
            size="small"
            className={styles.menu}
            header={<div className={styles.menuTitle}>目录</div>}
            bordered={false}
            dataSource={list}
            renderItem={(menu) => (
                <List.Item
                    className={classNames([styles[`menu_level_${menu.level}`], styles.menuItem])}
                    onClick={() => onClick(menu)}
                >
                    {menu.value}
                </List.Item>
            )}
            locale={{
                emptyText: '添加标题后会在这里自动生成目录。'
            }}
        />
    );
};

export const renderMenu = (list: menuItem[], container: HTMLElement, onClick: (menu: menuItem) => void) => {
    ReactDom.render(
        <Menu list={list} onClick={onClick} />,
        container
    );
};
