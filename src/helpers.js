// @flow
import PropTypes from 'prop-types';
import {
  compose,
  pure,
  mapProps,
  lifecycle,
  getContext,
  withContext,
} from 'recompose';

export const withInput = (fieldName: string) =>
  compose(
    pure,
    connectToProvider({
      name: 'form',
      select: ({ form: { [fieldName]: field }, form, ...rest }) => ({
        ...rest,
        field,
      }),
    }),
    mapProps(
      ({
        field,
        setForm,
        onChangeFieldValue,
        onFieldBlur,
        setProviderState,
        ...rest
      }) => ({
        ...rest,
        valid: field.touched && !field.error,
        invalid: field.error && field.touched,
        value: field.value,
        onChange: onChangeFieldValue.bind(this, fieldName),
        onBlur: onFieldBlur.bind(this, fieldName),
      })
    ),
  );

import type { Component, Element } from 'react';
import shallowEqual from 'shallowequal';

const _createChannelNames = (name: string) => {
  const channelName = 'provider-channel_' + name + '_';
  return {
    name,
    state: channelName + 'state',
    subscribe: channelName + 'subscribe',
    setProviderState: channelName + 'setProviderState',
  };
};

type ProviderOptions = {
  name?: string,
  initialState: Object => Object,
};
export const createProvider = ({
  name = 'global',
  initialState,
}: ProviderOptions) => {
  const keys = _createChannelNames(name);
  let state = initialState;
  let listeners = [];
  const subscribe = listener => {
    listeners = listeners.concat([listener]);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  };
  const setState = props => {
    let state = initialState(props);
    return transform => {
      const oldState = state;
      state = transform(state); // TODO: batch setStates till end of JS frame.
      if (!shallowEqual(state, oldState)) {
        listeners.forEach(listener => listener(state));
      }
    };
  };
  return compose(
    pure,
    lifecycle({
      componentWillReceiveProps(nextProps) {
        if (!shallowEqual(nextProps[name], this.props[name])) {
          setState(this.props)(prev => initialState(nextProps));
        }
      },
    }),
    withContext(
      {
        [keys.state]: PropTypes.object.isRequired,
        [keys.subscribe]: PropTypes.func.isRequired,
        [keys.setProviderState]: PropTypes.func.isRequired,
      },
      props => ({
        [keys.state]: initialState(props),
        [keys.subscribe]: subscribe,
        [keys.setProviderState]: setState(props),
      })
    ),
  );
};

type ConnectToProviderOptions = {
  name?: string,
  select: Object => Object,
};
export const connectToProvider = ({
  name = 'global',
  select
}: ConnectToProviderOptions) => {
  const keys = _createChannelNames(name);
  const createListener = (instance: *) => {
    let lastSelectedState = null;
    return newState => {
      const newSelectedState = select(newState);
      if (!shallowEqual(newSelectedState, lastSelectedState)) {
        lastSelectedState = newSelectedState;
        instance.setState(prev => ({ ...prev, ...newSelectedState }));
      }
    };
  };

  return compose(
    pure,
    getContext({
      [keys.state]: PropTypes.object.isRequired,
      [keys.subscribe]: PropTypes.func.isRequired,
      [keys.setProviderState]: PropTypes.func.isRequired,
    }),
    lifecycle({
      componentWillMount() {
        const { [keys.subscribe]: subscribe, [keys.state]: state } = this.props;
        this._unsubscribe = subscribe(createListener(this));
        this.setState(prev => ({
          ...prev,
          ...select(state),
        }));
      },

      componentWillUnmount() {
        this._unsubscribe && this._unsubscribe();
      },
    }),
    mapProps(
      ({
        [keys.state]: state,
        [keys.subscribe]: subscribe,
        [keys.setProviderState]: setProviderState,
        ...rest
      }) => ({
        ...rest,
        setProviderState,
      })
    )
  );
};
