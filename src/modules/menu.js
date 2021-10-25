import React from 'react';
import Quill from 'quill';
import Module from 'quill/core/module';
import _ from 'lodash';
import Header from '../formats/header';
import { renderMenu } from '../ui/menu/menu';

class Menu extends Module {
    constructor(quill, options) {
        super(quill, options);
        this.containerNode = document.querySelector(options.container);
        const update = _.debounce(this.update.bind(this), 300, { leading: false });
        // 目录
        this.menus = [];
        // 当前页面上的 header （除了 subtitle）
        this.headerBlots = [];
        this.quill.on(Quill.events.TEXT_CHANGE, () => {
            update();
        });
    }

    update() {
        const newMenus = [];
        this.headerBlots = [];
        // 获得当前文档类型为 Header 的 Blot
        this.quill.scroll.descendants(Header).forEach((header, index) => {
            const type = Header.formats(header.domNode);
            const value = this.quill.getText(header.offset(), header.length());
            if (type !== 'subtitle') {
                this.headerBlots.push(header);
                newMenus.push({
                    type,
                    value,
                    index
                });
            }
        });

        // 判断 menu 是否发生了变化
        if (!_.isEqual(newMenus, this.menus)) {
            this.menus = newMenus;
            this.render();
        }
    }

    render() {
        renderMenu(this.menus, this.containerNode, this.onClick.bind(this));
    }

    onClick(menu) {
        const { index } = menu;
        const { domNode } = this.headerBlots[index];
        const scrollContainer = this.quill.scrollingContainer;

        if (domNode && domNode.offsetTop) {
            scrollContainer.scrollTo({
                top: domNode.offsetTop,
                behavior: 'smooth'
            });
        }
    }
}

export default Menu;
