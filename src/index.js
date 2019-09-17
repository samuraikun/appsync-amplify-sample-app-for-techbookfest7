import React from 'react';
import ReactDOM from 'react-dom';
import Amplify from 'aws-amplify';
import aws_exports from './aws-exports';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'element-theme-default';

Amplify.configure(aws_exports);

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();
