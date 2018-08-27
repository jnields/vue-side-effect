import { CONTEXT_KEY } from './consts';

/*
const instances = [
  { instance, children: [] },
  { instance, children: [] },
  {
    instance,
    children: [
      { instance, children: [] },
      { instance, children: [] },
    ],
  },
  {
    instance,
    children: [
      {
        instance,
        children: [],
      },
      {
        instance,
        children: [],
      },
    ],
  },
];
*/

export default (instances) => {
  const { provider } = instances[0][CONTEXT_KEY];
  instances.map((instance) => {
    let depth = 1;
    for (
      let currentNode = instance;
      instance.$parent !== provider;
      depth += 1, currentNode = currentNode.$parent
    ) {
      // empty
    }
    return { depth, instance };
  });
};
