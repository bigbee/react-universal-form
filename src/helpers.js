// @flow
import PropTypes from 'prop-types';
import { compose, pure, mapProps, lifecycle, getContext } from 'recompose';

export const withInput = (fieldName: string) =>
  compose(
    pure,
    getContext({
      form: PropTypes.object.isRequired,
      onChangeFieldValue: PropTypes.func.isRequired,
      onFieldBlur: PropTypes.func.isRequired,
      subscribe: PropTypes.func.isRequired,
    }),
    lifecycle({
      componentWillMount() {
        const { form } = this.props;
        this.setState(prev => ({
          ...prev,
          form,
        }));
      },
      componentDidMount() {
        const { subscribe } = this.props;
        const listener = form => {
          if (form[fieldName] !== this.state.form[fieldName]) {
            this.setState(prev => ({ ...prev, form }));
          }
        };
        this._unsubscribe = subscribe(listener);
      },
      componentWillUnmount() {
        this._unsubscribe();
        delete this._unsubscribe;
      },
    }),
    mapProps(
      ({
        form: { [fieldName]: field },
        onChangeFieldValue,
        onFieldBlur,
        subscribe,
        ...rest
      }) => ({
        ...rest,
        valid: field.touched && !field.error,
        invalid: field.error && field.touched,
        value: field.value,
        onChangeText: onChangeFieldValue.bind(this, fieldName),
        onBlur: onFieldBlur.bind(this, fieldName),
      })
    )
  );
