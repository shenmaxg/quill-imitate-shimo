import React from 'react';
import Quill from 'quill';
import { SizeClass, SizeStyle } from '../../formats/size';
import { FontClass, FontStyle } from '../../formats/font';
import Header from '../../formats/header';
import Menu from '../../modules/menu';
import { Comment } from '../../modules/comment';
import CommentBlot from '../../formats/comment';
import ToolBar from '../../modules/toolbar';
import Snow from '../../theme/snow.js';

Quill.register({
    'themes/snow': Snow
},
true);

Quill.register(
    {
        'attributors/class/font': FontClass,
        'attributors/class/size': SizeClass,
        'attributors/style/size': SizeStyle,
        'attributors/style/font': FontStyle
    },
    true
);

Quill.register(
    {
        'formats/font': FontClass,
        'formats/size': SizeClass,
        'formats/header': Header,
        'formats/comment': CommentBlot,
        'modules/menu': Menu,
        'modules/toolbar': ToolBar,
        'modules/comment': Comment
    },
    true
);

const Register: React.FC = () => (
    <>
        {/* 注册覆盖模块 */}
    </>
);

export default Register;
