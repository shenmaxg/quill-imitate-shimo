import React, { useState, useEffect, useRef } from 'react';
import ReactDom from 'react-dom';
import {
    Card,
    Avatar
} from 'antd';
import dayjs from 'dayjs';
import { UserOutlined } from '@ant-design/icons';

import styles from './comment.less';

interface IComment {
    guid: string;
    comment: string;
    date: number;
    top: number;
    selected: boolean;
}

interface IProps {
    commentList: IComment[];
    onClick: (guid: string) => void;
    formPosition: number
    formHeight: number
    top: number
}

const CommentList: React.FC<IProps> = (props) => {
    const {
        commentList, onClick, formPosition, formHeight, top
    } = props;
    const listRef = useRef<any>(null);
    const [transform, setTransform] = useState<number[]>([]);

    useEffect(() => {
        const listDom = listRef.current;
        const cardList = listDom.children;
        const calculatedTransform: number[] = [];
        let before = 0;
        let after = 0;

        // 从被选中的位置开始调整 card 的位置
        const selectedCommentIndex = commentList.findIndex((item) => (item.selected));
        if (selectedCommentIndex !== -1) {
            before = selectedCommentIndex;
            after = selectedCommentIndex;
        }

        // 存在 form 表单
        if (formPosition > -1) {
            before = formPosition;
            after = formPosition;
            calculatedTransform[after] = formHeight - 10;

            if (formPosition > 0) {
                const preHeight = cardList[formPosition - 1].offsetHeight;
                if (commentList[formPosition - 1].top + preHeight > top) {
                    calculatedTransform[formPosition - 1] = 0 - (commentList[formPosition - 1].top + preHeight + 10 - top);
                } else {
                    calculatedTransform[formPosition - 1] = 0;
                }

                before -= 1;
            }
        } else {
            calculatedTransform[before] = 0;
        }

        for (let i = before; i > 0; i -= 1) {
            const preHeight = cardList[i - 1].offsetHeight;
            if (commentList[i - 1].top + preHeight > commentList[i].top + calculatedTransform[i]) {
                calculatedTransform[i - 1] = calculatedTransform[i] - (commentList[i - 1].top + preHeight + 10 - commentList[i].top);
            } else {
                calculatedTransform[i - 1] = 0;
            }
        }

        // beginIndex 表示选中的位置或者评论表单位置
        for (let i = after; i < cardList.length - 1; i += 1) {
            const height = cardList[i].offsetHeight;
            if (calculatedTransform[i] + commentList[i].top + height > commentList[i + 1].top) {
                calculatedTransform[i + 1] = calculatedTransform[i] + commentList[i].top + height + 10 - commentList[i + 1].top;
            } else {
                calculatedTransform[i + 1] = 0;
            }
        }

        setTransform(calculatedTransform);
    }, [commentList, formPosition, formHeight, top]);

    return (
        <div ref={listRef}>
            {
                commentList.map((item, index) => {
                    const { selected } = item;
                    const opacity = selected ? 1 : 0.6;

                    return (
                        <Card
                            onClick={(e) => { onClick(item.guid); }}
                            key={item.date}
                            className={styles.listCard}
                            bordered={selected}
                            style={{ top: `${item.top}px`, transform: `translate(0px, ${transform[index]}px)`, opacity }}
                        >
                            <div className={styles.header}>
                                <div className={styles.autor}>
                                    <Avatar size={20} icon={<UserOutlined />} />
                                    <div className={styles.autorName}>张某/13012345670</div>
                                </div>
                                <div className={styles.time}>{dayjs(item.date).format('MM-DD HH:mm:ss')}</div>
                            </div>
                            <div className={styles.content}>
                                {item.comment}
                            </div>
                        </Card>
                    );
                })
            }
        </div>
    );
};

export const renderCommentList = (container: HTMLElement, commentList: IComment[], onClick: (guid: string) => void, formPosition = -1, formHeight = 0, top = -1) => {
    ReactDom.render(
        <CommentList
            commentList={commentList}
            onClick={onClick}
            formPosition={formPosition}
            formHeight={formHeight}
            top={top}
        />,
        container
    );
};
