import React from 'react';

const QlHeader: React.FC = () => (
    <select className="ql-header" defaultValue="false">
        <option value="false">正文</option>
        <option value="title">标题</option>
        <option value="subtitle">副标题</option>
        <option value="1">标题1</option>
        <option value="2">标题2</option>
        <option value="3">标题3</option>
        <option value="4">标题4</option>
    </select>
);

export default QlHeader;
