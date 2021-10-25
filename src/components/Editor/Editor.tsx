import React, { useEffect } from 'react';
import { Layout } from 'antd';
import Quill, { QuillOptionsStatic } from 'quill';
import styles from './Editor.less';
import 'quill/dist/quill.snow.css';
import './overlap.less';
import EditorToolBar from '../EditorToolbar';
import Register from '../Register';
import { commentEnter } from '../../modules/comment';

const {
    Header, Content, Footer
} = Layout;

const Editor: React.FC = () => {
    useEffect(() => {
        // const toolbarOptions = [
        //     [{ align: [] }], // 对齐方式
        //     ['blockquote', 'code-block'], // 文本块/代码块
        //     [{ list: 'ordered' }, { list: 'bullet' }], // 有序/无序列表
        //     [{ script: 'sub' }, { script: 'super' }], // 上标/下标
        //     [{ indent: '-1' }, { indent: '+1' }], // 减少缩进/缩进
        //     ['clean'], // 清除格式
        //     ['image', 'link', 'video'] // 图片 / 链接 / 视频
        // ];

        const options: QuillOptionsStatic = {
            modules: {
                menu: {
                    container: '#editor-menu'
                },
                comment: true,
                keyboard: {
                    bindings: {
                        'comment enter': {
                            key: 'Enter',
                            collapsed: true,
                            format: ['comment'],
                            suffix: /^$/,
                            handler(range:any, context:any) {
                                commentEnter(range, context, this.quill);
                            }

                        }
                    }
                },
                toolbar: {
                    container:
                        '#toolbar',
                    handlers: {
                        undo() {
                            this.quill.history.undo();
                        },
                        redo() {
                            this.quill.history.redo();
                        },
                        link(value) {
                            console.log(value);
                            if (value) {
                                const range = this.quill.getSelection();
                                if (range == null || range.length == 0) return;
                                let preview = this.quill.getText(range);
                                if (/^\S+@\S+\.\S+$/.test(preview) && preview.indexOf('mailto:') !== 0) {
                                    preview = `mailto:${preview}`;
                                }
                                const { tooltip } = this.quill.theme;
                                tooltip.edit('link', preview);
                            } else {
                                this.quill.format('link', false);
                            }
                        }
                    }
                }
            },
            scrollingContainer: '#content-scroll',
            theme: 'snow' // 使用主题样式
        };

        const editor = new Quill('#editor', options);
    }, []);

    return (
        <Layout className={styles.layout}>
            <Register />
            <EditorToolBar />
            <div className={styles.menu} id="editor-menu"></div>
            <Content id="content-scroll" className={styles.content}>
                <div id="editor" className={styles.editor}></div>

                <Footer className={styles.footer}>ImitateShimo ©2021 Created by shenmaxg</Footer>
            </Content>
            <div className={styles.comment} id="editor-comment"></div>
        </Layout>
    );
};

export default Editor;
