export const LOGIN_SUCCESS = "LOGIN_SUCCESS"; // Define LOGIN_SUCCESS action type
export const LOGOUT = "LOGOUT"; // Define LOGOUT action type

const initialState = {
  isAuthenticated: localStorage.getItem("isAuthenticated") === "true",
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: JSON.parse(localStorage.getItem("token")) || null,
  loginTime: localStorage.getItem("loginTime")
    ? Number(localStorage.getItem("loginTime"))
    : null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS: // Use LOGIN_SUCCESS constant in your switch case
      console.log(action);
      localStorage.setItem("isAuthenticated", "true"); // Boolean should be string
      localStorage.setItem(
        "user",
        JSON.stringify(action.payload.response.data)
      ); // Store as string
      localStorage.setItem("loginTime", Date.now().toString()); // Store as string
      localStorage.setItem(
        "token",
        JSON.stringify(action.payload.response.token)
      ); // Store as string
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.response.data,
        loginTime: Date.now(),
        token: action.payload.response.token
      }; // Store the login time
    case LOGOUT: // Use LOGOUT constant in your switch case
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
      localStorage.removeItem("loginTime");
      localStorage.removeItem("token");
      return { ...state, isAuthenticated: false, user: null, loginTime: null };
    default:
      return state;
  }
};

export default authReducer;
