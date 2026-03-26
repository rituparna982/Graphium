import { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

// ─── State & Actions ──────────────────────────────────────────────────────────

const initialState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'AUTH_LOGOUT':
      return { ...initialState, isLoading: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'UPDATE_TOKEN':
      return { ...state, accessToken: action.payload };
    default:
      return state;
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const refreshTimerRef = useRef(null);

  // Attach access token to all API requests
  useEffect(() => {
    const interceptor = api.interceptors.request.use((config) => {
      if (state.accessToken) {
        config.headers.Authorization = `Bearer ${state.accessToken}`;
      }
      return config;
    });
    return () => api.interceptors.request.eject(interceptor);
  }, [state.accessToken]);

  // Auto-refresh access token before expiry
  const scheduleRefresh = useCallback(() => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    // Refresh 1 minute before the 15-min expiry
    refreshTimerRef.current = setTimeout(async () => {
      try {
        const res = await api.post('/api/auth/refresh', {}, { withCredentials: true });
        dispatch({ type: 'UPDATE_TOKEN', payload: res.data.accessToken });
        scheduleRefresh();
      } catch {
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    }, 13 * 60 * 1000); // 13 minutes
  }, []);

  // Try to restore session on mount via refresh token cookie
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await api.post('/api/auth/refresh', {}, { withCredentials: true });
        const { accessToken } = res.data;
        const meRes = await api.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user: meRes.data.user, accessToken },
        });
        scheduleRefresh();
      } catch {
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    };
    restoreSession();
    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, [scheduleRefresh]);

  // ─── Auth Methods ─────────────────────────────────────────────────────────

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password }, { withCredentials: true });
    dispatch({
      type: 'AUTH_SUCCESS',
      payload: { user: res.data.user, accessToken: res.data.accessToken },
    });
    scheduleRefresh();
    return res.data;
  };

  const guestLogin = async () => {
    const res = await api.post('/api/auth/guest', {}, { withCredentials: true });
    dispatch({
      type: 'AUTH_SUCCESS',
      payload: { user: res.data.user, accessToken: res.data.accessToken },
    });
    scheduleRefresh();
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await api.post('/api/auth/register', { name, email, password }, { withCredentials: true });
    dispatch({
      type: 'AUTH_SUCCESS',
      payload: { user: res.data.user, accessToken: res.data.accessToken },
    });
    scheduleRefresh();
    return res.data;
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout', {}, { withCredentials: true });
    } catch {
      // Continue even if backend fails
    }
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    dispatch({ type: 'AUTH_LOGOUT' });
  };

  const oauthLogin = (accessToken, user) => {
    dispatch({
      type: 'AUTH_SUCCESS',
      payload: { user, accessToken },
    });
    scheduleRefresh();
  };

  return (
    <AuthContext.Provider value={{ ...state, login, guestLogin, register, logout, oauthLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export default AuthContext;
