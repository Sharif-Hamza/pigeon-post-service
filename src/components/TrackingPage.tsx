import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Package, MapPin, Clock, User, Mail } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useTracking, TrackingItem } from '@/context/TrackingContext';
import { trackingAPI } from '@/services/api';
import { toast } from 'sonner';
import QRCode from '@/components/QRCode';
import PigeonLogo from '@/components/PigeonLogo';
import CountdownTimer from '@/components/CountdownTimer';
import { motion, AnimatePresence } from 'framer-motion';

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [searchedTracking, setSearchedTracking] = useState<TrackingItem | null>(null);
  const { isAdmin } = useTracking();
  const [searchParams, setSearchParams] = useSearchParams();

  // Handle URL parameters for direct tracking links
  useEffect(() => {
    const trackParam = searchParams.get('track');
    if (trackParam) {
      setTrackingNumber(trackParam);
      handleDirectSearch(trackParam.toUpperCase());
      // Clear the URL parameter after processing
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const handleDirectSearch = async (trackingNum: string) => {
    try {
      const tracking = await trackingAPI.getByTrackingNumber(trackingNum);
      if (tracking) {
        // Convert API response to our format
        const convertedTracking: TrackingItem = {
          id: tracking.id?.toString() || tracking.trackingNumber,
          trackingNumber: tracking.trackingNumber,
          senderName: tracking.sender,
          senderAddress: 'Pigeon Post Service',
          recipientName: tracking.recipient,
          recipientAddress: 'Delivery Location',
          messageContent: tracking.message,
          createdAt: tracking.createdAt ? new Date(tracking.createdAt) : new Date(),
          estimatedDelivery: new Date(tracking.estimatedDelivery),
          currentStatus: tracking.status,
          isDelivered: tracking.status === 'delivered',
          updates: [],
          deliveryImages: [],
          deliveryVideos: [],
          timeline: tracking.timeline,
          sender: tracking.sender,
          recipient: tracking.recipient,
          message: tracking.message,
          status: tracking.status
        };
        setSearchedTracking(convertedTracking);
      }
    } catch (error) {
      console.error('Direct search error:', error);
    }
  };

  const handleSearch = async () => {
    if (!trackingNumber.trim()) {
      toast.error('Please enter a tracking number');
      return;
    }

    try {
      const tracking = await trackingAPI.getByTrackingNumber(trackingNumber.trim().toUpperCase());
      if (tracking) {
        // Convert API response to our format
        const convertedTracking: TrackingItem = {
          id: tracking.id?.toString() || tracking.trackingNumber,
          trackingNumber: tracking.trackingNumber,
          senderName: tracking.sender,
          senderAddress: 'Pigeon Post Service',
          recipientName: tracking.recipient,
          recipientAddress: 'Delivery Location',
          messageContent: tracking.message,
          createdAt: tracking.createdAt ? new Date(tracking.createdAt) : new Date(),
          estimatedDelivery: new Date(tracking.estimatedDelivery),
          currentStatus: tracking.status,
          isDelivered: tracking.status === 'delivered',
          updates: [],
          deliveryImages: [],
          deliveryVideos: [],
          timeline: tracking.timeline,
          sender: tracking.sender,
          recipient: tracking.recipient,
          message: tracking.message,
          status: tracking.status
        };
        setSearchedTracking(convertedTracking);
        toast.success('Tracking information found!');
      } else {
        setSearchedTracking(null);
        toast.error('Tracking number not found. Please check and try again.');
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchedTracking(null);
      toast.error('Tracking number not found. Please check and try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'en route': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delayed': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'lost in transit': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen p-2 sm:p-4 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 overflow-x-hidden">
      {/* Header */}
      <motion.div 
        className="max-w-4xl mx-auto text-center py-6 sm:py-12"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <PigeonLogo size={64} className="mb-2 sm:mb-0" />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-900 tracking-tight font-serif text-center">
            Pigeon Post Service
          </h1>
        </motion.div>
        <motion.p 
          className="text-lg sm:text-xl text-amber-700 mb-6 sm:mb-8 font-medium px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Professional Message Delivery Since 1850
        </motion.p>
        
        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <Card className="max-w-2xl mx-2 sm:mx-auto bg-white/90 backdrop-blur-sm shadow-xl border-amber-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl sm:text-2xl text-amber-900 flex flex-col sm:flex-row items-center gap-2">
                <Search className="h-6 w-6" />
                Track Your Delivery
              </CardTitle>
              <CardDescription className="text-amber-600 text-center sm:text-left">
                Enter your tracking number to check delivery status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  placeholder="Enter tracking number (e.g., PGN789ABC)"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
                  className="text-base sm:text-lg border-amber-300 focus:border-amber-500 flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    onClick={handleSearch}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-4 sm:px-6 w-full sm:w-auto"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Track
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Tracking Results */}
      <AnimatePresence>
        {searchedTracking && (
          <motion.div 
            className="max-w-4xl mx-2 sm:mx-auto space-y-4 sm:space-y-6 mb-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.6 }}
          >
            {/* Overview Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-amber-200">
                <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100">
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl sm:text-2xl text-amber-900 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <Package className="h-6 w-6" />
                        <span className="break-all">Tracking #{searchedTracking.trackingNumber}</span>
                      </CardTitle>
                      <CardDescription className="text-amber-700 mt-2">
                        Created on {searchedTracking.createdAt.toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex flex-row lg:flex-col items-center lg:items-end gap-2 w-full lg:w-auto">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                      >
                        <Badge className={`text-sm px-3 py-1 ${getStatusColor(searchedTracking.currentStatus)}`}>
                          {searchedTracking.currentStatus}
                        </Badge>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, rotate: 180 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                      >
                        <QRCode value={`${window.location.origin}?track=${searchedTracking.trackingNumber}`} size={60} />
                      </motion.div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <motion.div 
                      className="space-y-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      <div className="flex items-start gap-3">
                        <User className="h-5 w-5 text-amber-600 mt-1 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-amber-900">From:</p>
                          <p className="text-gray-700 break-words">{searchedTracking.senderName}</p>
                          <p className="text-sm text-gray-600 break-words">{searchedTracking.senderAddress}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-amber-600 mt-1 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-amber-900">To:</p>
                          <p className="text-gray-700 break-words">{searchedTracking.recipientName}</p>
                          <p className="text-sm text-gray-600 break-words">{searchedTracking.recipientAddress}</p>
                        </div>
                      </div>
                    </motion.div>
                    <motion.div 
                      className="space-y-4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                    >
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-amber-600 mt-1 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-amber-900">Estimated Delivery:</p>
                          <p className="text-gray-700">{searchedTracking.estimatedDelivery.toLocaleDateString()}</p>
                          <p className="text-sm text-gray-600">{searchedTracking.estimatedDelivery.toLocaleTimeString()}</p>
                        </div>
                      </div>
                      {searchedTracking.isDelivered && searchedTracking.messageContent && (
                        <div className="flex items-start gap-3">
                          <Mail className="h-5 w-5 text-amber-600 mt-1 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-amber-900">Message Available:</p>
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => window.open(`/message/${searchedTracking.trackingNumber}`, '_blank')}
                                className="mt-2 border-amber-300 text-amber-700 hover:bg-amber-50 w-full sm:w-auto"
                              >
                                Read Message
                              </Button>
                            </motion.div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Countdown Timer */}
            {!searchedTracking.isDelivered && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 backdrop-blur-sm shadow-xl border-blue-200">
                  <CardContent className="p-4 sm:p-6">
                    <CountdownTimer 
                      key={searchedTracking.trackingNumber}
                      targetDate={searchedTracking.estimatedDelivery}
                      label="Delivery scheduled in"
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-amber-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg sm:text-xl text-amber-900">Delivery Timeline</CardTitle>
                  <CardDescription className="text-amber-700">
                    Follow your message's journey
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-4 sm:space-y-6">
                    {searchedTracking.updates.map((update, index) => (
                      <motion.div 
                        key={update.id} 
                        className="relative flex items-start gap-3 sm:gap-4"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 + (index * 0.2), duration: 0.5 }}
                      >
                        {/* Timeline line */}
                        {index < searchedTracking.updates.length - 1 && (
                          <motion.div 
                            className="absolute left-4 sm:left-6 top-10 sm:top-12 w-px h-12 sm:h-16 bg-gradient-to-b from-amber-300 to-transparent"
                            initial={{ height: 0 }}
                            animate={{ height: "3rem" }}
                            transition={{ delay: 1.2 + (index * 0.2), duration: 0.4 }}
                          />
                        )}
                        
                        {/* Timeline dot */}
                        <motion.div 
                          className="flex-shrink-0 w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white text-lg sm:text-xl shadow-lg"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 1.1 + (index * 0.2), type: "spring", stiffness: 200 }}
                        >
                          {update.emoji}
                        </motion.div>
                        
                        {/* Timeline content */}
                        <div className="flex-grow bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-3 sm:p-4 shadow-md min-w-0">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                            <h4 className="font-semibold text-amber-900 text-base sm:text-lg">{update.status}</h4>
                            <Badge variant="outline" className="text-xs border-amber-300 text-amber-700 self-start">
                              {update.timestamp.toLocaleString()}
                            </Badge>
                          </div>
                          <p className="text-gray-700 mb-2 text-sm sm:text-base break-words">{update.description}</p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-amber-600">
                            <span className="flex items-center gap-1 break-words">
                              <MapPin className="h-4 w-4 flex-shrink-0" />
                              <span className="min-w-0">{update.location}</span>
                            </span>
                            {update.pigeonName && (
                              <span className="flex items-center gap-1">
                                <Package className="h-4 w-4 flex-shrink-0" />
                                Pigeon: {update.pigeonName}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Delivery Media */}
            {searchedTracking.isDelivered && (searchedTracking.deliveryImages?.length || searchedTracking.deliveryVideos?.length) && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
              >
                <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-amber-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg sm:text-xl text-amber-900">Delivery Confirmation</CardTitle>
                    <CardDescription className="text-amber-700">
                      Photos and videos from your successful delivery
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                      {searchedTracking.deliveryImages?.map((image, index) => (
                        <motion.img
                          key={index}
                          src={image}
                          alt={`Delivery confirmation ${index + 1}`}
                          className="rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer w-full h-auto"
                          onClick={() => window.open(image, '_blank')}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1.4 + (index * 0.1), duration: 0.4 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sample Tracking Numbers - Admin Only */}
      {isAdmin && (
        <motion.div 
          className="max-w-2xl mx-2 sm:mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-base sm:text-lg text-amber-900">
                🔧 Admin Demo - Try Sample Tracking Numbers
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTrackingNumber('PGN789ABC')}
                    className="border-amber-300 text-amber-700 hover:bg-amber-50 w-full sm:w-auto"
                  >
                    PGN789ABC
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTrackingNumber('PGN456DEF')}
                    className="border-amber-300 text-amber-700 hover:bg-amber-50 w-full sm:w-auto"
                  >
                    PGN456DEF
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Footer */}
      <motion.div 
        className="max-w-4xl mx-2 sm:mx-auto text-center py-6 sm:py-8 mt-8 sm:mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <Separator className="mb-4 sm:mb-6 bg-amber-200" />
        <motion.p 
          className="text-amber-600 text-sm mb-4 px-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          Reliable message delivery through traditional pigeon post since 1850
        </motion.p>
        <motion.div 
          className="mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = '/admin/login'}
              className="text-amber-600 hover:bg-amber-50"
            >
              Admin Access
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}