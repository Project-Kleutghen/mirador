import ActionTypes from '../action-types';

const workspaceReducer = (state = {}, action) => {
  console.log('Reducing', action.type);

  switch (action.type) {
    case ActionTypes.FOCUS_WINDOW:
      return Object.assign({}, state, { focusedWindowId: action.windowId });
    default:
      return state;
  }
};

export { workspaceReducer as default };
