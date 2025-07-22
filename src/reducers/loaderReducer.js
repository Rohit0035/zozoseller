const initialState = {
  loader: false // Ensure this is a boolean
};

const loaderReducer = (state = initialState, action) => {
  //console.log('Reducer action:', action)
  switch (action.type) {
    case "loader":
      return { ...state, ...action };
    default:
      return state;
  }
};

export default loaderReducer;
