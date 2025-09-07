import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { trackingAPI, adminAPI, TrackingItem as APITrackingItem, healthCheck } from '@/services/api';

// Keep the existing interface structure for compatibility
export interface TrackingUpdate {
  id: string;
  timestamp: Date;
  location: string;
  status: string;
  description: string;
  emoji: string;
  pigeonName?: string;
}

// Our local interface structure
export interface TrackingItem {
  id: string;
  trackingNumber: string;
  senderName: string;
  senderAddress: string;
  recipientName: string;
  recipientAddress: string;
  messageContent?: string;
  createdAt: Date;
  estimatedDelivery: Date;
  currentStatus: string;
  updates: TrackingUpdate[];
  deliveryImages?: string[];
  deliveryVideos?: string[];
  isDelivered: boolean;
  timeline?: Array<{
    stage: string;
    time: string;
    completed: boolean;
  }>;
  // API compatibility fields
  sender: string;
  recipient: string;
  message: string;
  status: string;
}

interface TrackingContextType {
  trackings: TrackingItem[];
  addTracking: (tracking: Omit<TrackingItem, 'id' | 'trackingNumber' | 'createdAt' | 'updates'>) => Promise<string>;
  updateTrackingStatus: (trackingNumber: string, update: Omit<TrackingUpdate, 'id' | 'timestamp'>) => void;
  getTracking: (trackingNumber: string) => TrackingItem | undefined;
  addDeliveryMedia: (trackingNumber: string, images?: string[], videos?: string[]) => void;
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  clearAllData: () => Promise<void>;
  forceStatusUpdate: () => Promise<void>;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isBackendAvailable: boolean;
}

const TrackingContext = createContext<TrackingContextType | undefined>(undefined);

// Convert API tracking to our format
const convertAPITrackingToLocal = (apiTracking: APITrackingItem): TrackingItem => {
  return {
    id: apiTracking.id?.toString() || apiTracking.trackingNumber,
    trackingNumber: apiTracking.trackingNumber,
    senderName: apiTracking.sender,
    senderAddress: 'Pigeon Post Service', // Default for API
    recipientName: apiTracking.recipient,
    recipientAddress: 'Delivery Location', // Default for API
    messageContent: apiTracking.message,
    createdAt: apiTracking.createdAt ? new Date(apiTracking.createdAt) : new Date(),
    estimatedDelivery: new Date(apiTracking.estimatedDelivery),
    currentStatus: apiTracking.status,
    isDelivered: apiTracking.status === 'delivered',
    updates: [], // Will be generated from timeline
    deliveryImages: [],
    deliveryVideos: [],
    timeline: apiTracking.timeline,
    sender: apiTracking.sender,
    recipient: apiTracking.recipient,
    message: apiTracking.message,
    status: apiTracking.status
  };
};


// Sample data for fallback
const sampleTrackings: TrackingItem[] = [
  {
    id: '1',
    trackingNumber: 'PPS789ABC',
    senderName: 'Emily Watson',
    senderAddress: 'Central Park, NYC',
    recipientName: 'James Mitchell',
    recipientAddress: 'Liberty Park, Jersey City, NJ',
    messageContent: 'My dearest James, I hope this letter finds you well. The winter snow reminds me of our cozy evenings together...',
    createdAt: new Date('2025-01-15T10:00:00'),
    estimatedDelivery: new Date('2025-01-16T15:00:00'),
    currentStatus: 'in-transit',
    isDelivered: false,
    updates: [],
    sender: 'Emily Watson',
    recipient: 'James Mitchell',
    message: 'My dearest James, I hope this letter finds you well. The winter snow reminds me of our cozy evenings together...',
    status: 'in-transit'
  }
];

export function TrackingProvider({ children }: { children: ReactNode }) {
  const [trackings, setTrackings] = useState<TrackingItem[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBackendAvailable, setIsBackendAvailable] = useState(false);

  // Clear localStorage on app start to prevent stale data
  useEffect(() => {
    localStorage.removeItem('pps_trackings');
  }, []);

  // Check backend availability on mount
  useEffect(() => {
    const checkBackend = async () => {
      const available = await healthCheck();
      setIsBackendAvailable(available);
      
      if (!available) {
        toast.error('Backend not available. Please check your connection.');
        setTrackings([]); // Don't load sample data
      }
    };

    checkBackend();
  }, []);

  // Check admin session on mount and restore from localStorage
  useEffect(() => {
    const checkAdminSession = async () => {
      // First check if we have a session in localStorage
      const session = adminAPI.getSession();
      if (session) {
        // Try to verify with backend
        const isValid = await adminAPI.verify();
        if (isValid) {
          setIsAdmin(true);
        } else {
          // Session invalid, clear it
          await adminAPI.logout();
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };

    checkAdminSession();
  }, []);

  // Load trackings when admin state changes
  useEffect(() => {
    if (isAdmin) {
      // Clear localStorage before loading to prevent mixing data
      localStorage.removeItem('pps_trackings');
      loadTrackings();
    }
  }, [isAdmin]);

  const loadTrackings = async () => {
    try {
      const apiTrackings = await trackingAPI.getAll();
      const convertedTrackings = apiTrackings.map(convertAPITrackingToLocal);
      setTrackings(convertedTrackings);
    } catch (error) {
      console.error('Failed to load trackings:', error);
      toast.error('Failed to load trackings');
    }
  };

  const addTracking = async (trackingData: Omit<TrackingItem, 'id' | 'trackingNumber' | 'createdAt' | 'updates'>): Promise<string> => {
    try {
      const apiData: Omit<APITrackingItem, 'trackingNumber' | 'id'> = {
        sender: trackingData.senderName,
        recipient: trackingData.recipientName,
        message: trackingData.messageContent || '',
        estimatedDelivery: trackingData.estimatedDelivery.toISOString(),
        status: trackingData.currentStatus
      };
      const newTracking = await trackingAPI.create(apiData);
      const convertedTracking = convertAPITrackingToLocal(newTracking);
      
      setTrackings(prev => [...prev, convertedTracking]);
      toast.success('Tracking created successfully');
      
      return newTracking.trackingNumber;
    } catch (error) {
      console.error('Failed to create tracking:', error);
      toast.error('Failed to create tracking');
      throw error;
    }
  };

  const updateTrackingStatus = (trackingNumber: string, updateData: Omit<TrackingUpdate, 'id' | 'timestamp'>) => {
    // This function is kept for compatibility but doesn't update the backend
    // In a real implementation, you'd want to add an API endpoint for status updates
    setTrackings(prev => prev.map(tracking => {
      if (tracking.trackingNumber === trackingNumber) {
        const newUpdate: TrackingUpdate = {
          id: Math.random().toString(36).substring(2),
          timestamp: new Date(),
          ...updateData
        };
        
        return {
          ...tracking,
          currentStatus: updateData.status,
          isDelivered: updateData.status === 'delivered',
          updates: [...tracking.updates, newUpdate]
        };
      }
      return tracking;
    }));
  };

  const getTracking = (trackingNumber: string): TrackingItem | undefined => {
    return trackings.find(tracking => tracking.trackingNumber === trackingNumber);
  };

  const addDeliveryMedia = (trackingNumber: string, images?: string[], videos?: string[]) => {
    setTrackings(prev => prev.map(tracking => {
      if (tracking.trackingNumber === trackingNumber) {
        return {
          ...tracking,
          deliveryImages: images ? [...(tracking.deliveryImages || []), ...images] : tracking.deliveryImages,
          deliveryVideos: videos ? [...(tracking.deliveryVideos || []), ...videos] : tracking.deliveryVideos
        };
      }
      return tracking;
    }));
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      await adminAPI.login(username, password);
      
      // Clear localStorage to prevent mixing local and backend data
      localStorage.removeItem('pps_trackings');
      
      setIsAdmin(true);
      toast.success('Login successful');
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed: Invalid credentials');
      return false;
    }
  };

  const logout = async () => {
    try {
      await adminAPI.logout();
      setIsAdmin(false);
      setTrackings([]);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      setIsAdmin(false);
      setTrackings([]);
    }
  };

  const clearAllData = async () => {
    try {
      if (isBackendAvailable && isAdmin) {
        await adminAPI.clearData();
        setTrackings([]);
        toast.success('All data cleared from server');
      } else {
        // Fallback to localStorage clear
        localStorage.clear();
        setTrackings(sampleTrackings);
        toast.success('Local data cleared and reset to demo data');
      }
    } catch (error) {
      console.error('Failed to clear data:', error);
      toast.error('Failed to clear data');
    }
  };

  const forceStatusUpdate = async () => {
    try {
      if (isBackendAvailable && isAdmin) {
        const result = await adminAPI.forceUpdate();
        await loadTrackings(); // Reload trackings to get updated statuses
        toast.success(`Status update complete. Updated ${result.updated} trackings.`);
      } else {
        toast.info('Status updates checked (local mode)');
      }
    } catch (error) {
      console.error('Failed to force status update:', error);
      toast.error('Failed to update statuses');
    }
  };

  return (
    <TrackingContext.Provider value={{
      trackings,
      addTracking,
      updateTrackingStatus,
      getTracking,
      addDeliveryMedia,
      isAdmin,
      setIsAdmin,
      clearAllData,
      forceStatusUpdate,
      login,
      logout,
      isBackendAvailable
    }}>
      {children}
    </TrackingContext.Provider>
  );
}

export function useTracking() {
  const context = useContext(TrackingContext);
  if (context === undefined) {
    throw new Error('useTracking must be used within a TrackingProvider');
  }
  return context;
}