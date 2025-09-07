// localStorage utilities for persistent data storage
export const STORAGE_KEYS = {
  TRACKINGS: 'pigeon_post_trackings',
  ADMIN_STATE: 'pigeon_post_admin_state'
} as const;

export const storage = {
  // Get data from localStorage
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      
      const parsed = JSON.parse(item);
      
      // Convert date strings back to Date objects
      if (key === STORAGE_KEYS.TRACKINGS && Array.isArray(parsed)) {
        return parsed.map(tracking => ({
          ...tracking,
          createdAt: new Date(tracking.createdAt),
          estimatedDelivery: new Date(tracking.estimatedDelivery),
          updates: tracking.updates.map((update: any) => ({
            ...update,
            timestamp: new Date(update.timestamp)
          }))
        })) as T;
      }
      
      return parsed;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },

  // Set data to localStorage
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },

  // Remove data from localStorage
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },

  // Clear all data
  clear: (): void => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};

// Generate realistic pigeon delivery timeline
export const generateDeliveryTimeline = (
  startTime: Date, 
  estimatedDelivery: Date, 
  senderAddress: string, 
  recipientAddress: string
) => {
  const timeline = [];
  const totalDuration = estimatedDelivery.getTime() - startTime.getTime();
  
  // Calculate intermediate timestamps
  const departureTime = new Date(startTime.getTime() + totalDuration * 0.1);
  const midwayTime = new Date(startTime.getTime() + totalDuration * 0.6);
  const approachingTime = new Date(startTime.getTime() + totalDuration * 0.9);
  
  // Pigeon names for variety
  const pigeonNames = ['Winston', 'Duchess', 'Admiral', 'Lady Belle', 'Captain Feathers', 'Princess Coo'];
  const pigeonName = pigeonNames[Math.floor(Math.random() * pigeonNames.length)];
  
  // Status 1: Message Received
  timeline.push({
    scheduledTime: startTime,
    status: 'Message Received',
    description: 'Your heartfelt message has been carefully secured and prepared for delivery',
    emoji: '📝',
    location: senderAddress,
    pigeonName
  });

  // Status 2: Pigeon Departed
  timeline.push({
    scheduledTime: departureTime,
    status: 'Pigeon Departed',
    description: `${pigeonName} has taken flight with your precious message, soaring towards the destination`,
    emoji: '🕊️',
    location: senderAddress,
    pigeonName
  });

  // Status 3: En Route
  const midwayLocations = [
    'Over the countryside',
    'Crossing the river',
    'Flying over the hills',
    'Above the town square',
    'Through the valley'
  ];
  const midwayLocation = midwayLocations[Math.floor(Math.random() * midwayLocations.length)];
  
  timeline.push({
    scheduledTime: midwayTime,
    status: 'En Route',
    description: `${pigeonName} is making excellent progress through favorable winds`,
    emoji: '🌊',
    location: midwayLocation,
    pigeonName
  });

  // Status 4: Approaching Destination
  timeline.push({
    scheduledTime: approachingTime,
    status: 'Approaching Destination',
    description: `${pigeonName} has spotted the destination and is preparing for landing`,
    emoji: '🎯',
    location: `Near ${recipientAddress}`,
    pigeonName
  });

  // Status 5: Delivered
  timeline.push({
    scheduledTime: estimatedDelivery,
    status: 'Delivered',
    description: `Successfully delivered! Your message has reached its destination with joy`,
    emoji: '✨',
    location: recipientAddress,
    pigeonName
  });

  return timeline;
};

// Check and update tracking statuses based on current time
export const updateTrackingStatuses = (trackings: any[]) => {
  const now = new Date();
  
  return trackings.map(tracking => {
    // Skip if already fully delivered
    if (tracking.isDelivered) return tracking;
    
    // Get or generate timeline
    let timeline = tracking.timeline;
    if (!timeline) {
      timeline = generateDeliveryTimeline(
        tracking.createdAt,
        tracking.estimatedDelivery,
        tracking.senderAddress,
        tracking.recipientAddress
      );
    }
    
    // Find the latest status that should be active now
    const activeStatuses = timeline.filter((status: any) => status.scheduledTime <= now);
    
    if (activeStatuses.length === 0) {
      // No statuses should be active yet
      return { ...tracking, timeline };
    }
    
    // Get the latest active status
    const latestStatus = activeStatuses[activeStatuses.length - 1];
    
    // Convert timeline statuses to updates format
    const updates = activeStatuses.map((status: any, index: number) => ({
      id: `update_${tracking.id}_${index}`,
      timestamp: status.scheduledTime,
      location: status.location,
      status: status.status,
      description: status.description,
      emoji: status.emoji,
      pigeonName: status.pigeonName
    }));
    
    return {
      ...tracking,
      timeline,
      currentStatus: latestStatus.status,
      isDelivered: latestStatus.status === 'Delivered',
      updates
    };
  });
};
