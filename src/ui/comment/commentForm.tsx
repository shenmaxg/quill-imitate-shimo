import React, { useState, useEffect, useRef } from 'react';
import ReactDom from 'react-dom';
import {
    Card, Input, Button,
    Avatar
} from 'antd';
import { UserOutlined } from '@ant-design/icons';

import styles from './comment.less';

const { TextArea } = Input;

interface IProps {
    show: boolean
    onSubmit: (comment: string) => void;
    onCancel: () => void;
    onChange: (comment: string) => void;
    icon: HTMLElement
}

const CommentFrom: React.FC<IProps> = (props) => {
    const {
        show, onSubmit, onCancel, onChange, icon
    } = props;
    const [comment, setCommet] = useState('');
    const textAreaRef = useRef<any>(null);
    const cardRef = useRef<any>(null);

    useEffect(() => {
        document.addEventListener('click', (e) => {
            if (show) {
                const target = e.target as HTMLElement;
                if (cardRef.current) {
                    const result = cardRef.current.contains(target) || icon.contains(target);
                    if (!result) {
                        onCancel();
                    }
                }
            }
        });
    }, [icon, onCancel, show]);

    const cancel = () => {
        setCommet('');
        onCancel();
    };

    const submit = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        onSubmit(comment);
        setCommet('');
    };

    const onchange = (value: string) => {
        setCommet(value);
    };

    const onResize = () => {
        onChange(comment);
    };

    return (
        show
            ? (
                <div ref={cardRef}>
                    <Card className={styles.card} bordered={false}>
                        <div className={styles.header}>
                            <div className={styles.autor}>
                                <Avatar size={20} icon={<UserOutlined />} />
                                <div className={styles.autorName}>张某某/13012345670</div>
                            </div>
                        </div>
                        <TextArea
                            ref={textAreaRef}
                            className={styles.input}
                            autoSize
                            value={comment}
                            onChange={(e) => { onchange(e.target.value); }}
                            onResize={(e) => { onResize(); }}
                            placeholder="点击评论按钮发送"
                        />
                        <div className={styles.btn}>
                            <Button size="small" disabled={!comment} onClick={(e) => submit(e)} type="primary">评论</Button>
                            <Button size="small" onClick={() => cancel()}>取消</Button>
                        </div>
                    </Card>
                </div>
            ) : null
    );
};

export const renderCommentForm = (container: HTMLElement,
    enableForm: boolean, onSubmit: (comment: string) => void, onCancel: () => void, onChange: (comment: string) => void, icon: HTMLElement) => {
    ReactDom.render(
        <CommentFrom
            show={enableForm}
            onSubmit={onSubmit}
            onCancel={onCancel}
            onChange={onChange}
            icon={icon}
        />,
        container
    );
};
