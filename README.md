# vue-side-effect

Render components that produce side effects on the client with serializable state on the server.

## Usage

```js
import vueSideEffect from 'vue-side-effect';

const VueTitle = {
  props: ['title'],
  render(h) {
    return null;
  },
};

const { Provider: TitleProvider, WithSideEffect } = withSideEffect(
  function reducePropsToState(instances) {
    if (!instances.length) return '';
    return instances[instances.length - 1].props.title;
  },
  function handleStateChangeOnClient(nextState) {
    document.title = nextState;
  },
  function mapStateOnServer(nextState) {
    return `<title>${nextState}</title>`;
  },
)(Component);


const App = Vue.extend({
  props: {
    titleContext: {
      default: () => ({}),
    },
  },
  render(h) {
    return (
      <Provider context={this.titleContext}>
        <div>
          <WithSideEffect title="Example Title" />
        </div>
      </Provider>
    )
  }
});

// server.js
const titleContext = {};
const markup = renderToString(new App({ propsData: { titleContext } }));
const title = titleContext.state;
```
