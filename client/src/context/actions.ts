import axios from 'axios';

export const updateUser = async (dispatch: any) => {
  try {
    dispatch({ type: "CURRENT_USER_UPDATE_INIT" });
    const token = sessionStorage.getItem('collectionist-token');

    if (!token) {
      throw new Error();
    }

    const userResponse = await axios({
      method: 'get',
      url: 'http://localhost:8000/api/user',
      headers: {
          'Authorization': token
      }
    });

    if (!userResponse.data) {
      throw new Error();
    }

    const { user } = userResponse.data;
    sessionStorage.setItem('collectionist-user', JSON.stringify(user));
    dispatch({ type: "CURRENT_USER_UPDATE_SUCCESS", payload: user });
    return user;
  } catch (error) {
    dispatch({ type: "CURRENT_USER_UPDATE_ERROR", error: error });
    return false;
  }
};

export const register = async (dispatch: any, payload: any) => {
  try {
    dispatch({ type: "REGISTER_INIT" });
    const { email, password, confirmPassword } = payload;
    await axios.post('http://localhost:8000/api/register', { email, password, password_confirmation: confirmPassword });
    dispatch({ type: "REGISTER_SUCCESS" });
    return true;
  } catch (error) {
    dispatch({ type: "REGISTER_ERROR", error: error });
    return false;
  }
};

export const login = async (dispatch: any, payload: any) => {
  try {
    dispatch({ type: "LOGIN_INIT" });
    const { email, password } = payload;
    const response = await axios.post('http://localhost:8000/api/login', {email, password });

    if (response.data) {
      const { token } = response.data;
      sessionStorage.setItem('collectionist-token', `Bearer ${token}`);

      if (!token) {
        throw new Error();
      }

      const userResponse = await axios({
        method: 'get',
        url: 'http://localhost:8000/api/user',
        headers: {
            'Authorization': `Bearer ${token}`
        }
      });

      if (!userResponse.data) {
        throw new Error();
      }

      const { user } = userResponse.data;
      sessionStorage.setItem('collectionist-user', JSON.stringify(user));
      dispatch({ type: "LOGIN_SUCCESS", payload: user });
      return user;
    }
  } catch (error) {
    dispatch({ type: "LOGIN_ERROR", error: error });
  }
};

export const logout = async (dispatch: any) => {
  dispatch({ type: "LOGOUT" });
  sessionStorage.removeItem('collectionist-user');
  sessionStorage.removeItem('collectionist-token');
};