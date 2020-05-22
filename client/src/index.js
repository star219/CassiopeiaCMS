import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import Blog from './views/blog/blog';
import View from './views/blog/view';
import Contact from './views/blog/contact';
import Login from './views/admin/login';
import Editor from './views/admin/editor';
import NotFound from './views/blog/404';
import Dashboard from './views/admin/dashboard';
import * as serviceWorker from './serviceWorker';

const routing = (
    <Router>
      <div>
        <Route exact path="/" component={Blog} />
        <Route exact path="/blog" component={Blog} />
	<Route path="/blog/:id" component={View}/>
        <Route path="/contact" component={Contact}/>
        <Route exact path="/admin/editor" component={Editor} />
        <Route exact path="/admin/editor/:cid/:id" component={Editor} />
       	<Route path="/admin/login" component={Login}/>
	<Route path="/404" component={NotFound}/>
        <Route path="/admin/dashboard" component={Dashboard}/>
      </div>
    </Router>
)

ReactDOM.render(routing , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
