const user = sessionStorage.getItem('collectionist-user')
  ? JSON.parse(sessionStorage.getItem('collectionist-user') || '')
  : '';

export const initialState = {
  user: '' || user,
  loading: false,
  error: null
};

export const UserReducer = (initialState: any, action: any) => {
  switch(action.type) {
    case "LOGIN_INIT":
      return {
        ...initialState,
        loading: true
      };
    case "LOGIN_SUCCESS":
      return {
        ...initialState,
        user: action.payload,
        loading: false
      };
    case "LOGOUT":
      return {
        ...initialState,
        user: ''
      };
    case "LOGIN_ERROR":
      return {
        ...initialState,
        loading: false,
        error: action.error
      };
    case "REGISTER_INIT":
      return {
        ...initialState,
        loading: true
      };
    case "REGISTER_SUCCESS":
      return {
        ...initialState,
        loading: false,
        error: undefined
      };
    case "REGISTER_ERROR":
      return {
        ...initialState,
        loading: false,
        error: action.error
      };
    case "CURRENT_USER_UPDATE_INIT":
      return {
        ...initialState,
        loading: true
      };
    case "CURRENT_USER_UPDATE_SUCCESS":
      return {
        ...initialState,
        user: action.payload,
        loading: false
      };
    case "CURRENT_USER_UPDATE_ERROR":
      return {
        ...initialState,
        loading: false,
        error: action.error
      };
    default:
      throw new Error();
  }
};