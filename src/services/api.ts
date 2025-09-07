// Force Railway URL for production
const API_BASE_URL = 'https://pps-production-a9a7.up.railway.app/api';

// Types
export interface TrackingItem {
  id?: number;
  trackingNumber: string;
  sender: string;
  recipient: string;
  message: string;
  status: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  timeline?: Array<{
    stage: string;
    time: string;
    completed: boolean;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminSession {
  sessionId: string;
  username: string;
  expiresAt: string;
}

// Local storage keys for fallback
const STORAGE_KEYS = {
  ADMIN_SESSION: 'pps_admin_session',
  TRACKINGS: 'pps_trackings'
};

// Session management
let currentSession: AdminSession | null = null;

// Initialize session from localStorage
const initializeSession = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
  if (stored) {
    try {
      currentSession = JSON.parse(stored);
    } catch (e) {
      console.error('Invalid session data');
      localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
    }
  }
};

// Save session to localStorage
const saveSession = (session: AdminSession | null) => {
  currentSession = session;
  if (session) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(session));
  } else {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
  }
};

// Get auth headers
const getAuthHeaders = (): Record<string, string> => {
  if (!currentSession) return {};
  return {
    'Authorization': `Bearer ${currentSession.sessionId}`
  };
};

// API request wrapper
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
};

// Initialize on import
initializeSession();

// Admin API
export const adminAPI = {
  // Login
  login: async (username: string, password: string): Promise<AdminSession> => {
    const result = await apiRequest('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    
    const session: AdminSession = {
      sessionId: result.sessionId,
      username: result.username || username,
      expiresAt: result.expiresAt
    };
    
    saveSession(session);
    return session;
  },

  // Logout
  logout: async (): Promise<void> => {
    if (currentSession) {
      await apiRequest('/admin/logout', {
        method: 'POST',
        body: JSON.stringify({ sessionId: currentSession.sessionId })
      });
    }
    saveSession(null);
  },

  // Verify session
  verify: async (): Promise<boolean> => {
    if (!currentSession) return false;
    
    try {
      await apiRequest('/admin/verify');
      return true;
    } catch (error) {
      console.warn('Session verification failed:', error);
      // Don't clear session immediately - might be network issue
      // Only clear on 401 (unauthorized) errors
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        saveSession(null);
        return false;
      }
      // For other errors, assume session is still valid
      return true;
    }
  },

  // Get current session
  getSession: (): AdminSession | null => currentSession,

  // Check if logged in
  isLoggedIn: (): boolean => !!currentSession,

  // Get stats
  getStats: async () => {
    return await apiRequest('/admin/stats');
  },

  // Force status update
  forceUpdate: async () => {
    return await apiRequest('/admin/force-update', { method: 'POST' });
  },

  // Clear all data
  clearData: async () => {
    return await apiRequest('/admin/clear-data', { method: 'DELETE' });
  }
};

// Tracking API
export const trackingAPI = {
  // Get all trackings (admin only)
  getAll: async (): Promise<TrackingItem[]> => {
    return await apiRequest('/tracking');
  },

  // Get specific tracking
  getByTrackingNumber: async (trackingNumber: string): Promise<TrackingItem | null> => {
    try {
      return await apiRequest(`/tracking/${trackingNumber}`);
    } catch (error) {
      // Fallback to localStorage
      console.warn('Using localStorage fallback for tracking lookup');
      const stored = localStorage.getItem(STORAGE_KEYS.TRACKINGS);
      const trackings: TrackingItem[] = stored ? JSON.parse(stored) : [];
      return trackings.find(t => t.trackingNumber === trackingNumber) || null;
    }
  },

  // Create new tracking (admin only)
  create: async (tracking: Omit<TrackingItem, 'trackingNumber' | 'id'>): Promise<TrackingItem> => {
    return await apiRequest('/tracking', {
      method: 'POST',
      body: JSON.stringify(tracking)
    });
  },

  // Update tracking (admin only)
  update: async (trackingNumber: string, tracking: Partial<TrackingItem>): Promise<TrackingItem> => {
    try {
      return await apiRequest(`/tracking/${trackingNumber}`, {
        method: 'PUT',
        body: JSON.stringify(tracking)
      });
    } catch (error) {
      // Fallback to localStorage
      console.warn('Using localStorage fallback for updating tracking');
      const stored = localStorage.getItem(STORAGE_KEYS.TRACKINGS);
      const trackings: TrackingItem[] = stored ? JSON.parse(stored) : [];
      const index = trackings.findIndex(t => t.trackingNumber === trackingNumber);
      
      if (index !== -1) {
        trackings[index] = { ...trackings[index], ...tracking };
        localStorage.setItem(STORAGE_KEYS.TRACKINGS, JSON.stringify(trackings));
        return trackings[index];
      }
      
      throw new Error('Tracking not found');
    }
  },

  // Delete tracking (admin only)
  delete: async (trackingNumber: string): Promise<void> => {
    try {
      await apiRequest(`/tracking/${trackingNumber}`, { method: 'DELETE' });
    } catch (error) {
      // Fallback to localStorage
      console.warn('Using localStorage fallback for deleting tracking');
      const stored = localStorage.getItem(STORAGE_KEYS.TRACKINGS);
      const trackings: TrackingItem[] = stored ? JSON.parse(stored) : [];
      const filtered = trackings.filter(t => t.trackingNumber !== trackingNumber);
      localStorage.setItem(STORAGE_KEYS.TRACKINGS, JSON.stringify(filtered));
    }
  },

  // Add tracking update (admin only)
  addUpdate: async (trackingNumber: string, update: {
    status: string;
    location: string;
    description: string;
    emoji?: string;
    pigeonName?: string;
  }): Promise<any> => {
    try {
      return await apiRequest(`/tracking/${trackingNumber}/updates`, {
        method: 'POST',
        body: JSON.stringify(update)
      });
    } catch (error) {
      console.error('Failed to add tracking update:', error);
      throw error;
    }
  },

  // Get tracking updates
  getUpdates: async (trackingNumber: string): Promise<any[]> => {
    try {
      return await apiRequest(`/tracking/${trackingNumber}/updates`);
    } catch (error) {
      console.error('Failed to get tracking updates:', error);
      return [];
    }
  },

  // Update tracking status (admin only)
  updateStatus: async (trackingNumber: string, statusData: {
    status: string;
    location?: string;
    description?: string;
    emoji?: string;
    pigeonName?: string;
  }): Promise<any> => {
    try {
      return await apiRequest(`/tracking/${trackingNumber}/status`, {
        method: 'PUT',
        body: JSON.stringify(statusData)
      });
    } catch (error) {
      console.error('Failed to update tracking status:', error);
      throw error;
    }
  }
};

// Health check
export const healthCheck = async (): Promise<boolean> => {
  try {
    await fetch(`${API_BASE_URL}/health`);
    return true;
  } catch (error) {
    console.warn('Backend not available, using localStorage fallback');
    return false;
  }
};
