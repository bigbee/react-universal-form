# React-universal-form

For handling classical form fields in a cross-platform recompose inspired way (react-native and web).


## Features


## Getting started

```
import {
  withInput,
  withForm,
  defaultField,
} from 'react-universal-form';

const Input = ({ valid, invalid, value, onChangeText, onBlur, ...rest }) =>
  <input
    type="text"
    value={ value }
    onChange={ (e) => onChangeText(e.target.value) }
    onBlur={ onBlur }
    className={ `${ valid ? 'field-valid' : '' } ${ invalid ? 'field-invalid' : '' }` }
    { ...rest }
  />;

const EmailInput = withInput('email')(Input);
const PasswordInput = withInput('password)(Input);

const Form = withForm({
  email: {
    ...defaultField,
    rules: value => rules.required({value}) && rules.email({ value }),
  },
  password: {
    ...defaultField,
    rules: value => rules.required({value}) && value.length >= 6),
  },
})(({ form, isValid, isTouched }) => {
  <form className={ isValid ? 'valid' : '' } onSubmit={ (e) => {
    e.preventDefault();
    if (isValid && isTouched) {
      console.log('submitting form', form);
    } else {
      const errors = Object.keys(form)
        .map(name => ({ name, ...form[name] }))
        .filter(field => field.invalid);
      alert('Form not valid');
    }
  }}>
    <EmailInput />
    <PasswordInput type="password" />

    <button>Submit</button>
  </form>
}));

```
