import mapInstances from './mapInstances';
import { CONTEXT_KEY, isServer, isProd } from './consts';


export default ({
  reducePropsToState,
  handleStateChangeOnClient,
  mapStateOnServer,
}) => {
  if (!isProd) {
    if (typeof reducePropsToState !== 'function') {
      throw new Error('Expected reducePropsToState to be a function.');
    }
    if (typeof handleStateChangeOnClient !== 'function') {
      throw new Error('Expected handleStateChangeOnClient to be a function.');
    }
    if (typeof mapStateOnServer !== 'undefined' && typeof mapStateOnServer !== 'function') {
      throw new Error('Expected mapStateOnServer to either be undefined or a function.');
    }
  }
  return (Component) => {
    if (!isProd) {
      if (typeof Component !== 'object' || typeof Component.render !== 'function') {
        throw new Error('Expected Component to be a Vue Component.');
      }
    }
    const instances = [];

    const Provider = {
      inject: [CONTEXT_KEY],
      props: {
        context: {
          type: Object,
          default: () => ({}),
        },
      },
      created() {
        if (this[CONTEXT_KEY]) throw new Error('Nesting of side-efect Providers is not allowed');
      },
      updated() {
        const nextState = reducePropsToState(mapInstances(instances));
        handleStateChangeOnClient(nextState);
        this.context.state = nextState;
      },
      provide() {
        return {
          [CONTEXT_KEY]: {
            staticContext: this.$props.context,
            provider: this,
          },
        };
      },
      render() {
        return this.$slots.default;
      },
    };

    const NullComponent = {
      render() {
        return this.$slots.default;
      },
    };

    const WithSideEffect = {
      inject: [CONTEXT_KEY],
      props: Component.props,
      created() {
        if (!this[CONTEXT_KEY]) {
          throw new Error('cannot render a side-effect without a side-effect Provider');
        }
        instances.push(this);
        if (!isServer) return;
        let nextState = reducePropsToState(mapInstances(instances));
        if (mapStateOnServer) nextState = mapStateOnServer(nextState);
        this[CONTEXT_KEY].staticContext.state = nextState;
      },
      mounted() {
        this[CONTEXT_KEY].provider.$forceUpdate();
      },
      beforeDestroy() {
        instances.splice(instances.indexOf(this), 1);
        this[CONTEXT_KEY].provider.$forceUpdate();
      },
      render(h) {
        return h(
          Component,
          {
            props: this.$props,
            attrs: this.$attrs,
            listeners: this.$on,
            scopedSlots: this.$scopedSlots,
          },
          Object.entries(this.$slots).map(([slot, vnode]) => ({
            slot,
            render: () => h(NullComponent, vnode),
          })),
        );
      },
    };

    return { Provider, WithSideEffect };
  };
};
