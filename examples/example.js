console.log('example.js');

import * as React from 'react';
import ReactDOM from 'react-dom';

import {
  createProvider,
  connectToProvider,
  fieldDefaults,
  withForm,
  withInput,
} from '../lib/react-universal-form.min.js';

const App = ({ children, ...rest }) => {
  return <div>{children}</div>;
};

const Example = props => {
  window.setTimeout(() => {
    props.setProviderState(oldState => ({
      ...oldState,
      hello: oldState.hello + 1,
    }));
  }, 1000);
  return (
    <div>
      <h1>Example {JSON.stringify(props)}</h1>
      <div>{Object.keys(props).join(', ')}</div>
    </div>
  );
};

const AppContainer = createProvider({
  initialState: () => ({
    hello: 1,
  }),
  name: 'example',
})(App);

const ExampleContainer = connectToProvider({
  name: 'example',
  select: ({ hello }) => ({
    hello,
  }),
})(Example);

ReactDOM.render(
  <AppContainer>
    <ExampleContainer other={'prop'} />
  </AppContainer>,
  document.querySelector('#app-provider')
);

const Form = withForm({
  email: {
    ...fieldDefaults,
    value: 'random@email.com',
  },
})(App);

const Input = withInput('email')(({ onChange, ...props }) => (
  <input {...props} onChange={e => onChange(e.currentTarget.value)} />
));

ReactDOM.render(
  <Form>
    <div>
      <Input />
    </div>
  </Form>,
  document.querySelector('#app-form')
);
