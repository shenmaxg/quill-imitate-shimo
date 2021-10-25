import React from 'react';
import { Layout } from 'antd';
import styles from './layout.less';
import Editor from '../components/Editor';

const {
    Header, Footer, Content
} = Layout;

const LayoutComponent: React.FC = () => (
    <Layout>
        <Header className={styles.header}>富文本编辑器</Header>
        <Content>
            <Editor />
        </Content>
    </Layout>
);

export default LayoutComponent;
