import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, Session } from '@supabase/supabase-js';
import { AuthService } from '@/lib/services/auth.service';
import type {
  AuthState,
  UserProfile,
  PlayerProfile,
  CoachProfile,
  SignUpData,
  SignInData,
} from '@/types/auth.types';

const initialState: AuthState = {
  user: null,
  profile: null,
  playerProfile: null,
  coachProfile: null,
  session: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

// Async thunks
export const signUp = createAsyncThunk(
  'auth/signUp',
  async (data: SignUpData, { rejectWithValue }) => {
    try {
      const result = await AuthService.signUp(data);
      return result;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Sign up failed'
      );
    }
  }
);

export const signIn = createAsyncThunk(
  'auth/signIn',
  async (data: SignInData, { rejectWithValue }) => {
    try {
      const result = await AuthService.signIn(data);
      
      if (!result.user) {
        throw new Error('Sign in failed');
      }

      // Load user profile
      const profile = await AuthService.getUserProfile(result.user.id);
      
      let playerProfile: PlayerProfile | null = null;
      let coachProfile: CoachProfile | null = null;

      if (profile.role === 'player') {
        playerProfile = await AuthService.getPlayerProfile(result.user.id);
      } else if (profile.role === 'coach') {
        coachProfile = await AuthService.getCoachProfile(result.user.id);
      }

      return {
        ...result,
        profile,
        playerProfile,
        coachProfile,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Sign in failed'
      );
    }
  }
);

export const signOut = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      await AuthService.signOut();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Sign out failed'
      );
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      // Use getUser() first to securely verify authentication
      const user = await AuthService.getUser();
      if (!user) {
        return null;
      }

      // Get session for access token after verifying user
      const session = await AuthService.getSession();
      if (!session) {
        return null;
      }

      const profile = await AuthService.getUserProfile(user.id);
      
      let playerProfile: PlayerProfile | null = null;
      let coachProfile: CoachProfile | null = null;

      if (profile.role === 'player') {
        playerProfile = await AuthService.getPlayerProfile(user.id);
      } else if (profile.role === 'coach') {
        coachProfile = await AuthService.getCoachProfile(user.id);
      }

      return {
        user,
        session,
        profile,
        playerProfile,
        coachProfile,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Auth check failed'
      );
    }
  }
);

export const loadProfile = createAsyncThunk(
  'auth/loadProfile',
  async (userId: string, { rejectWithValue }) => {
    try {
      const profile = await AuthService.getUserProfile(userId);
      
      let playerProfile: PlayerProfile | null = null;
      let coachProfile: CoachProfile | null = null;

      if (profile.role === 'player') {
        playerProfile = await AuthService.getPlayerProfile(userId);
      } else if (profile.role === 'coach') {
        coachProfile = await AuthService.getCoachProfile(userId);
      }

      return {
        profile,
        playerProfile,
        coachProfile,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to load profile'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setSession: (state, action: PayloadAction<Session | null>) => {
      state.session = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setProfile: (state, action: PayloadAction<UserProfile | null>) => {
      state.profile = action.payload;
    },
    setPlayerProfile: (state, action: PayloadAction<PlayerProfile | null>) => {
      state.playerProfile = action.payload;
    },
    setCoachProfile: (state, action: PayloadAction<CoachProfile | null>) => {
      state.coachProfile = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearAuth: (state) => {
      state.user = null;
      state.profile = null;
      state.playerProfile = null;
      state.coachProfile = null;
      state.session = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Sign up
    builder
      .addCase(signUp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.session = action.payload.session;
        state.profile = action.payload.profile;
        state.isAuthenticated = !!action.payload.user;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Sign in
    builder
      .addCase(signIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.session = action.payload.session;
        state.profile = action.payload.profile;
        state.playerProfile = action.payload.playerProfile;
        state.coachProfile = action.payload.coachProfile;
        state.isAuthenticated = true;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Sign out
    builder
      .addCase(signOut.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.profile = null;
        state.playerProfile = null;
        state.coachProfile = null;
        state.session = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Check auth
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload.user;
          state.session = action.payload.session;
          state.profile = action.payload.profile;
          state.playerProfile = action.payload.playerProfile;
          state.coachProfile = action.payload.coachProfile;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.session = null;
          state.profile = null;
          state.playerProfile = null;
          state.coachProfile = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Load profile
    builder
      .addCase(loadProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload.profile;
        state.playerProfile = action.payload.playerProfile;
        state.coachProfile = action.payload.coachProfile;
      })
      .addCase(loadProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setUser,
  setSession,
  setProfile,
  setPlayerProfile,
  setCoachProfile,
  setError,
  clearAuth,
} = authSlice.actions;

export default authSlice.reducer;

