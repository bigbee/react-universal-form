// @flow
import PropTypes from 'prop-types';

import {
  compose,
  withHandlers,
  withProps,
  withReducer,
  withContext,
  lifecycle,
} from 'recompose';

type Input = { value: ?any };

const isAnEmail = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.([a-z]+)|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

export const rules = {
  required: ({ value }: Input) => !!value,
  email: ({ value }: Input) => value && value.match(isAnEmail),
};

export const fieldDefaults = {
  value: '',
  error: true,
  rules: () => false,
  message: 'Please fill out this field',
  touched: false,
};

type Field = {
  value: string,
  error: boolean,
  rules: (value: string) => boolean,
  message: ?string,
  touched: boolean,
};

type Form = {
  [string]: Field,
};
type FormAction = Form => Form;

type withFormOptions = {
  touchedOnChange: boolean,
  touchedOnBlur: boolean,
};
export const withForm = (
  fields: Form,
  { touchedOnChange = true, touchedOnBlur = true }: withFormOptions = {}
) =>
  compose(
    withReducer(
      'form',
      'setForm',
      (state: Form, action: FormAction) => action(state),
      {
        ...fields,
      }
    ),
    withHandlers({
      onChangeFieldValue: ({ setForm }) => (name: string, value: any) => {
        setForm(
          composeActions(
            ...[setFieldValue(name, value), validateField(name)].concat(
              touchedOnChange ? [touchField(name)] : []
            )
          )
        );
      },
      onFieldBlur: ({ setForm }) => name =>
        touchedOnBlur && setForm(touchField(name)),
    }),
    lifecycle({
      componentWillMount() {
        this._lastId = 0;
        this._subscriptions = {};
        const subscribe = (listener: Function) => {
          // const id = uuid.v4();
          const id = this._lastId + 1;
          this._lastId = id;
          this._subscriptions = {
            ...this._subscriptions,
            [id]: listener,
          };
          // this._subscriptions[id] = listener;
          return () => {
            const {
              [id]: extractedListener,
              ...remainingSubscriptions
            } = this._subscriptions;
            this._subscriptions = remainingSubscriptions;
          };
        };
        this.setState(prev => ({ subscribe }));
      },
      componentDidUpdate() {
        const { form } = this.props;
        Object.values(this._subscriptions).forEach(listener => listener(form));
      },
    }),
    withContext(
      {
        form: PropTypes.object.isRequired,
        onChangeFieldValue: PropTypes.func.isRequired,
        onFieldBlur: PropTypes.func.isRequired,
        subscribe: PropTypes.func.isRequired,
      },
      ({ onChangeFieldValue, onFieldBlur, form, subscribe }) => ({
        form,
        onChangeFieldValue,
        onFieldBlur,
        subscribe,
      })
    ),
    withProps(({ form }: { form: Form }) => {
      const fields: Array<Field> = (Object.values(form): Array<any>);
      const length = fields.length;
      const isValid = fields.filter(p => p.error).length === 0;
      const isTouched = fields.filter(p => p.touched).length === length;
      return {
        isValid,
        isTouched,
      };
    })
  );

export const composeActions = (...actions: Array<FormAction>): FormAction => (
  form: Form
): Form => {
  return actions.reduce(
    (form: Form, action: FormAction) => (action ? action(form) : form),
    form
  );
};

const setField = (
  name: string,
  fieldSetter: (field: Field) => Field
): FormAction => (form: Form): Form => ({
  ...form,
  [name]: fieldSetter(form[name]),
});

export const touchField = (name: string): FormAction =>
  setField(name, field => ({ ...field, touched: true }));

export const validateField = (name: string): FormAction =>
  setField(name, field => ({
    ...field,
    error: !field.rules(field.value),
  }));

export const setFieldValue = (name: string, value: string): FormAction =>
  setField(name, field => ({
    ...field,
    value: value,
  }));
