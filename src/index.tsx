import React from 'react';
import ReactDom from 'react-dom';
import {
    HashRouter as Router,
    Switch,
    Route
} from 'react-router-dom';
import Layout from './layout';
import './index.less';

const App: React.FC = () => (
    <Router>
        <Switch>
            <Route
                path="/"
                component={Layout}
            ></Route>
        </Switch>
    </Router>

);

const renderApp = () => {
    ReactDom.render(
        <App />,
        document.getElementById('app')
    );
};

if ((module as any).hot) {
    // 启动热替换代码
    (module as any).hot.accept();
    renderApp();
} else {
    renderApp();
}
