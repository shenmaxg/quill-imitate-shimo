import React from 'react';
import Quill from 'quill';
import Module from 'quill/core/module';
import _ from 'lodash';
import { v4 } from 'uuid';
import Delta from 'quill-delta';
import CommentFormat from '../formats/comment';
import CommentIcon from '../icons/comment.svg';
import { renderCommentForm, renderCommentList } from '../ui/comment';

const commentEnter = (range, context, quill) => {
    const [line, offset] = quill.getLine(range.index);
    const delta = new Delta()
        .retain(range.index)
        .insert('\n', context.format)
        .retain(line.length() - offset - 1)
        .retain(1, { comment: null });
    quill.updateContents(delta, Quill.sources.USER);
    quill.setSelection(range.index + 1, Quill.sources.SILENT);
    quill.scrollIntoView();
};

class Comment extends Module {
    constructor(quill, options) {
        super(quill, options);
        this.root = quill.addContainer('ql-comment');
        this.sortedCommentList = [];

        // 初始化新增按钮
        this.commentIcon = this.buildCommentIcon();
        this.root.appendChild(this.commentIcon);

        // 初始化评论列表
        this.initCommentList();

        // 初始化新增区域
        this.buildCommentForm();

        const update = _.debounce(this.update.bind(this), 200, { leading: false });
        this.quill.on(Quill.events.EDITOR_CHANGE, (eventName, ...args) => {
            let range;
            if (eventName === Quill.events.SELECTION_CHANGE) {
                [range] = args;
            }
            update(range);
        });

        // 初始化数据
        this.initData();
    }

    update(range) {
        this.updateCommentIcon();
        this.updateCommentPosition(range);
    }

    buildCommentIcon() {
        const commentIcon = document.createElement('div');
        commentIcon.classList.add('ql-comment-add-icon');
        commentIcon.innerHTML = CommentIcon;

        commentIcon.addEventListener('click', () => {
            this.showCommentForm();
        });

        return commentIcon;
    }

    updateCommentIcon() {
        const range = this.quill.getSelection();
        if (range) {
            // 已经评论过的不显示按钮
            const formats = this.quill.getFormat(range);
            if (Object.keys(formats).indexOf('comment') === -1) {
                const [line, offset] = this.quill.getLine(range.index);
                // 本行无内容不显示
                if (line.length() > 1) {
                    const bounds = this.quill.getBounds(range.index, range.length);
                    this.updateCommentIconPosition(bounds);
                } else {
                    this.commentIcon.style.display = 'none';
                }
            } else {
                this.commentIcon.style.display = 'none';
            }
        } else {
            this.commentIcon.style.display = 'none';
        }
    }

    updateCommentIconPosition({ top }) {
        this.commentIcon.setAttribute('position_top', top);
        this.commentIcon.style.top = `${top}px`;
        this.commentIcon.style.display = 'block';
    }

    initCommentList() {
        this.commentListArea = document.createElement('div');
        this.commentListArea.classList.add('ql-comment-list');

        this.root.appendChild(this.commentListArea);

        this.commentArea = document.createElement('div');
        this.commentArea.classList.add('ql-comment-submitted');
        this.commentListArea.appendChild(this.commentArea);
    }

    buildCommentForm() {
        this.commentFormHeight = 0;
        this.commentForm = document.createElement('div');
        this.commentForm.classList.add('ql-comment-add-wrapper');

        this.commentListArea.appendChild(this.commentForm);
    }

    showCommentForm() {
        const guid = `comment-${v4().slice(0, 16)}`;
        const top = this.commentIcon.getAttribute('position_top') - 40;
        this.commentForm.style.top = `${top}px`;

        // 获得表单在已有 comment 中的位置
        let formPosition = 0;
        const uniqueComment = {};
        this.quill.focus();
        const { index } = this.quill.getSelection();
        this.quill.scroll.descendants(CommentFormat).forEach((item) => {
            const guid = CommentFormat.formats(item.domNode);
            const itemIndex = this.quill.getIndex(item);
            if (itemIndex < index && !uniqueComment[guid]) {
                formPosition += 1;
                uniqueComment[guid] = true;
            }
        });

        renderCommentForm(this.commentForm,
            true,
            this.onSubmit.bind(this, guid),
            this.onCancel.bind(this),
            this.onChange.bind(this, formPosition, top),
            this.commentIcon);

        this.commentFormHeight = 0;
        this.onChange(formPosition, top);
    }

    updateCommentPosition(range) {
        const commentMap = {};
        const sortedCommentList = [];
        this.commentList.forEach((comment) => {
            commentMap[comment.guid] = comment;
        });
        const formats = range == null ? {} : this.quill.getFormat(range);

        // 根据当前的文本中的评论信息更新评论列表
        this.quill.scroll.descendants(CommentFormat).forEach((item) => {
            const guid = CommentFormat.formats(item.domNode);
            const comment = commentMap[guid];
            // 获得文本所在的位置
            const bound = this.quill.getBounds(this.quill.getIndex(item), 0);
            const { top } = bound;
            comment.top = top - 40;

            // 判断当前是否聚焦某个评论
            if (formats.comment && guid === formats.comment) {
                comment.selected = true;
            } else {
                comment.selected = false;
            }

            if (sortedCommentList.findIndex((item) => (item.guid === guid)) === -1) {
                sortedCommentList.push(comment);
            }
        });

        if (!_.isEqual(this.sortedCommentList, sortedCommentList)) {
            this.sortedCommentList = _.cloneDeep(sortedCommentList);
            renderCommentList(this.commentArea, this.sortedCommentList, this.onClick.bind(this));
        }
    }

    insertForm2List(formPosition, formHeight, top) {
        renderCommentList(this.commentArea, this.sortedCommentList, this.onClick.bind(this), formPosition, formHeight, top);
    }

    onSubmit(guid, comment) {
        const range = this.formatComment(guid);
        this.commentList.push({
            guid,
            comment,
            date: Date.now()
        });
        this.updateCommentPosition(range);
        this.hideCommentForm();
    }

    onClick(guid) {
        const commentBlotList = this.quill.scroll.descendants(CommentFormat).filter((item) => CommentFormat.formats(item.domNode) === guid);

        // 单行选中
        if (commentBlotList.length === 1) {
            const index = this.quill.getIndex(commentBlotList[0]);
            const length = commentBlotList[0].length();
            this.quill.setSelection(index, length);
        } else if (commentBlotList.length > 1) {
            // 多行选中
            const index = this.quill.getIndex(commentBlotList[0]);
            const lastItem = commentBlotList[commentBlotList.length - 1];
            const length = this.quill.getIndex(lastItem) + lastItem.length();
            this.quill.setSelection(index, length);
        }
    }

    onCancel() {
        this.hideCommentForm();
    }

    onChange(formPosition, top) {
        const formHeight = this.commentForm.offsetHeight;

        if (this.commentFormHeight !== formHeight) {
            this.commentFormHeight = formHeight;
            this.insertForm2List(formPosition, formHeight, top);
        }
    }

    hideCommentForm() {
        renderCommentForm(this.commentForm, false, this.onSubmit.bind(this), this.onCancel.bind(this));
    }

    formatComment(guid) {
        this.quill.focus();

        const range = this.quill.getSelection();
        if (range) {
            const { index, length } = range;
            // 如果没有选中文字，认为是选中当前行
            if (length === 0) {
                const [line, offset] = this.quill.getLine(index);
                this.quill.setSelection(index - offset, line.length());

                this.formatComment(guid);
            } else {
                this.quill.format('comment', guid, Quill.sources.USER);
            }
        }

        return range;
    }

    initData() {
        this.commentList = [];
    }
}

export { Comment, commentEnter };
