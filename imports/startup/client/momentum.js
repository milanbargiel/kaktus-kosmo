import { Momentum } from 'meteor/percolate:momentum';

Momentum.registerPlugin('fadeFast', () => {
  const insertElement = (node, next) => {
    $(node)
      .hide()
      .insertBefore(next)
      .velocity('fadeIn');
  };
  const removeElement = (node) => {
    $(node).remove();
  };

  return {
    insertElement,
    removeElement,
  };
});
