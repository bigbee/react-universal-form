# React-universal-form

For handling classical form fields in a cross-platform way (react-native and web).

Simple example:
```
import {
  withInput,
  withForm,
  defaultField,
} from 'react-universal-form';

const Input = ({ value, onChangeText, onBlur, ...rest }) =>
  <input
    type="text"
    value={ value }
    onChange={ (e) => onChangeText(e.target.value) }
    onBlur={ onBlur }
    { ...rest }
  />;

const EmailInput = withInput('email')(Input);
const passwordInput = withInput('password)(Input);

const Form = withForm({
  email: { ...defaultField },
  password: { ...defaultField },
})(({ form, isValid, isTouched, customSubmit }) => {
  <div>
    <EmailInput />
    <PasswordInput type="password" />

    <button
      onClick={ () => isValid && isTouched ? customSubmit(form) : alert('Form not valid') }
    >Submit</button>
  </div>
}));

```

## Features


## Getting started

## Scripts

