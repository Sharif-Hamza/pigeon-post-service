import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Plus, 
  Edit3, 
  Eye, 
  LogOut, 
  MapPin, 
  Clock, 
  User,
  Calendar,
  Search,
  Filter,
  BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';
import PigeonLogo from '@/components/PigeonLogo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTracking, TrackingItem } from '@/context/TrackingContext';
import CreateTrackingForm from '@/components/CreateTrackingForm';
import EditTrackingForm from '@/components/EditTrackingForm';
import TrackingUpdateForm from '@/components/TrackingUpdateForm';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTracking, setSelectedTracking] = useState<TrackingItem | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const { trackings, logout, clearAllData, forceStatusUpdate, isBackendAvailable } = useTracking();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const filteredTrackings = trackings.filter(tracking =>
    tracking.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tracking.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tracking.recipientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'en route': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delayed': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'lost in transit': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const stats = {
    total: trackings.length,
    delivered: trackings.filter(t => t.isDelivered).length,
    inTransit: trackings.filter(t => !t.isDelivered && t.currentStatus === 'En Route').length,
    delayed: trackings.filter(t => t.currentStatus === 'Delayed').length
  };

  if (showCreateForm) {
    return <CreateTrackingForm onBack={() => setShowCreateForm(false)} />;
  }

  if (showEditForm && selectedTracking) {
    return (
      <EditTrackingForm 
        tracking={selectedTracking} 
        onBack={() => {
          setShowEditForm(false);
          setSelectedTracking(null);
        }} 
      />
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-2 sm:p-4 overflow-x-hidden">
      {/* Header */}
      <motion.div 
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 sm:mb-8 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-900 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <PigeonLogo size={40} className="sm:w-10 sm:h-10" />
              PPS Admin Dashboard
            </h1>
            <p className="text-amber-700 mt-2 text-sm sm:text-base">Pigeon Post Service Management</p>
          </motion.div>
          <motion.div 
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="border-amber-300 text-amber-700 hover:bg-amber-50 w-full sm:w-auto"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Site
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-red-300 text-red-700 hover:bg-red-50 w-full sm:w-auto"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-amber-200">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-600 text-xs sm:text-sm font-medium">Total Packages</p>
                    <p className="text-2xl sm:text-3xl font-bold text-amber-900">{stats.total}</p>
                  </div>
                  <Package className="h-6 w-6 sm:h-8 sm:w-8 text-amber-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-green-200">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-xs sm:text-sm font-medium">Delivered</p>
                    <p className="text-2xl sm:text-3xl font-bold text-green-900">{stats.delivered}</p>
                  </div>
                  <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-blue-200">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-xs sm:text-sm font-medium">In Transit</p>
                    <p className="text-2xl sm:text-3xl font-bold text-blue-900">{stats.inTransit}</p>
                  </div>
                  <MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-yellow-200">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-600 text-xs sm:text-sm font-medium">Delayed</p>
                    <p className="text-2xl sm:text-3xl font-bold text-yellow-900">{stats.delayed}</p>
                  </div>
                  <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
              <TabsList className="bg-white/80 border border-amber-200 w-full sm:w-auto">
                <TabsTrigger value="overview" className="flex-1 sm:flex-none">Overview</TabsTrigger>
                <TabsTrigger value="manage" className="flex-1 sm:flex-none">Manage Trackings</TabsTrigger>
                <TabsTrigger value="debug" className="flex-1 sm:flex-none">Debug</TabsTrigger>
              </TabsList>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Tracking
                </Button>
              </motion.div>
            </div>

          <TabsContent value="overview" className="space-y-6">
            {/* Recent Activity */}
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-amber-200">
              <CardHeader>
                <CardTitle className="text-xl text-amber-900">Recent Activity</CardTitle>
                <CardDescription className="text-amber-700">
                  Latest updates from your pigeon deliveries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trackings.slice(0, 5).map((tracking) => (
                    <div key={tracking.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-amber-200 rounded-full">
                          <Package className="h-4 w-4 text-amber-800" />
                        </div>
                        <div>
                          <p className="font-medium text-amber-900">{tracking.trackingNumber}</p>
                          <p className="text-sm text-gray-600">{tracking.senderName} → {tracking.recipientName}</p>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(tracking.currentStatus)}`}>
                        {tracking.currentStatus}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            {/* Search and Filter */}
            <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-amber-200">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 h-4 w-4" />
                    <Input
                      placeholder="Search by tracking number, sender, or recipient..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-amber-300 focus:border-amber-500"
                    />
                  </div>
                  <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Trackings List */}
            <div className="grid gap-6">
              {filteredTrackings.map((tracking) => (
                <Card key={tracking.id} className="bg-white/95 backdrop-blur-sm shadow-lg border-amber-200 hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="grid md:grid-cols-3 gap-6 flex-1">
                        <div>
                          <h3 className="text-lg font-semibold text-amber-900 mb-2">
                            {tracking.trackingNumber}
                          </h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <User className="h-4 w-4" />
                              <span>From: {tracking.senderName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin className="h-4 w-4" />
                              <span>To: {tracking.recipientName}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Current Status</p>
                          <Badge className={`${getStatusColor(tracking.currentStatus)} mb-2`}>
                            {tracking.currentStatus}
                          </Badge>
                          <div className="text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>Created: {tracking.createdAt.toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Updates</p>
                          <p className="text-2xl font-bold text-amber-900">{tracking.updates.length}</p>
                          <p className="text-sm text-gray-600">Total updates</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedTracking(tracking);
                            setShowUpdateForm(true);
                          }}
                          className="border-blue-300 text-blue-700 hover:bg-blue-50"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Update
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedTracking(tracking);
                            setShowEditForm(true);
                          }}
                          className="border-amber-300 text-amber-700 hover:bg-amber-50"
                        >
                          <Edit3 className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`/?track=${tracking.trackingNumber}`, '_blank')}
                          className="border-blue-300 text-blue-700 hover:bg-blue-50"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="debug" className="space-y-6">
            {/* Debug Panel */}
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-amber-200">
              <CardHeader>
                <CardTitle className="text-xl text-amber-900">🔧 Debug & Testing Panel</CardTitle>
                <CardDescription className="text-amber-700">
                  Tools to test the persistent storage and automatic status updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={forceStatusUpdate}
                      variant="outline"
                      className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      🔄 Force Status Update Check
                    </Button>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={clearAllData}
                      variant="outline"
                      className="w-full border-red-300 text-red-700 hover:bg-red-50"
                    >
                      🗑️ Clear All Data & Reset
                    </Button>
                  </motion.div>
                </div>
                
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h4 className="font-semibold text-amber-900 mb-2">📊 System Status</h4>
                  <div className="text-sm text-amber-700 space-y-1">
                    <p>• Total Trackings: <strong>{trackings.length}</strong></p>
                    <p>• Backend Status: <strong>{isBackendAvailable ? '✅ Connected' : '❌ Offline (using localStorage)'}</strong></p>
                    <p>• Data Storage: <strong>{isBackendAvailable ? 'SQLite Database' : 'localStorage (fallback)'}</strong></p>
                    <p>• Auto Updates: <strong>Real-time from server</strong></p>
                    <p>• Last Update: <strong>{new Date().toLocaleTimeString()}</strong></p>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">✅ How It Works</h4>
                  <div className="text-sm text-green-700 space-y-1">
                    <p>1. <strong>Create a tracking</strong> with future delivery time</p>
                    <p>2. <strong>Status updates automatically</strong> as time progresses</p>
                    <p>3. <strong>All data persists</strong> through page refreshes</p>
                    <p>4. <strong>Admin edits are saved</strong> immediately</p>
                    <p>5. <strong>Users can always track</strong> with tracking number</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </motion.div>
      </motion.div>

      {/* Tracking Update Form Overlay */}
      {showUpdateForm && selectedTracking && (
        <TrackingUpdateForm
          trackingNumber={selectedTracking.trackingNumber}
          onUpdate={() => {
            // Just close the form, don't reload the page
            setShowUpdateForm(false);
            setSelectedTracking(null);
            // The data will be refreshed automatically
          }}
          onClose={() => {
            setShowUpdateForm(false);
            setSelectedTracking(null);
          }}
        />
      )}
    </div>
  );
}