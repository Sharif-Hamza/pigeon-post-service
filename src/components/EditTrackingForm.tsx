import React, { useState } from 'react';
import { ArrowLeft, Save, Plus, Upload, X, MapPin, Clock, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useTracking, TrackingItem } from '@/context/TrackingContext';
import { toast } from 'sonner';
import QRCode from '@/components/QRCode';

interface EditTrackingFormProps {
  tracking: TrackingItem;
  onBack: () => void;
}

const statusOptions = [
  { value: 'Message Received', emoji: '📝' },
  { value: 'Pigeon Departed', emoji: '🕊️' },
  { value: 'En Route', emoji: '🌊' },
  { value: 'Approaching Destination', emoji: '🎯' },
  { value: 'Delivered', emoji: '✨' },
  { value: 'Delayed', emoji: '⏰' },
  { value: 'Lost in Transit', emoji: '🔍' },
  { value: 'Weather Delay', emoji: '🌧️' },
  { value: 'Rest Stop', emoji: '🏠' }
];

const pigeonNames = [
  'Winston', 'Duchess', 'Maximilian', 'Isabella', 'Theodore', 'Penelope',
  'Chester', 'Beatrice', 'Reginald', 'Cordelia', 'Bartholomew', 'Genevieve'
];

export default function EditTrackingForm({ tracking, onBack }: EditTrackingFormProps) {
  const [newUpdate, setNewUpdate] = useState({
    location: '',
    status: '',
    description: '',
    emoji: '',
    pigeonName: ''
  });
  const [deliveryImages, setDeliveryImages] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateTrackingStatus, addDeliveryMedia } = useTracking();

  const handleStatusChange = (status: string) => {
    const selectedStatus = statusOptions.find(opt => opt.value === status);
    setNewUpdate(prev => ({
      ...prev,
      status,
      emoji: selectedStatus?.emoji || ''
    }));
  };

  const handleAddUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUpdate.location || !newUpdate.status || !newUpdate.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      updateTrackingStatus(tracking.trackingNumber, {
        location: newUpdate.location,
        status: newUpdate.status,
        description: newUpdate.description,
        emoji: newUpdate.emoji,
        pigeonName: newUpdate.pigeonName || undefined
      });

      // If delivered and has images, add them
      if (newUpdate.status === 'Delivered' && deliveryImages.length > 0) {
        addDeliveryMedia(tracking.trackingNumber, deliveryImages);
      }

      toast.success('Status update added successfully!');
      
      // Reset form
      setNewUpdate({
        location: '',
        status: '',
        description: '',
        emoji: '',
        pigeonName: ''
      });
      setDeliveryImages([]);
      setImageUrl('');
      
    } catch (error) {
      toast.error('Failed to add update. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addImageUrl = () => {
    if (imageUrl.trim() && !deliveryImages.includes(imageUrl.trim())) {
      setDeliveryImages(prev => [...prev, imageUrl.trim()]);
      setImageUrl('');
      toast.success('Image added successfully');
    }
  };

  const removeImage = (index: number) => {
    setDeliveryImages(prev => prev.filter((_, i) => i !== index));
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="border-amber-300 text-amber-700 hover:bg-amber-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-amber-900">
                Edit Tracking: {tracking.trackingNumber}
              </h1>
              <p className="text-amber-700 mt-1">Manage status updates and delivery information</p>
            </div>
          </div>
          <QRCode value={`${window.location.origin}?track=${tracking.trackingNumber}`} size={100} />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Current Status */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-amber-200">
            <CardHeader>
              <CardTitle className="text-xl text-amber-900">Current Status</CardTitle>
              <CardDescription className="text-amber-700">
                Overview of this delivery
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-amber-900 font-medium">Status:</span>
                <Badge className={`${getStatusColor(tracking.currentStatus)}`}>
                  {tracking.currentStatus}
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-amber-600 mt-1" />
                  <div>
                    <p className="font-semibold text-amber-900">From:</p>
                    <p className="text-gray-700">{tracking.senderName}</p>
                    <p className="text-sm text-gray-600">{tracking.senderAddress}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-amber-600 mt-1" />
                  <div>
                    <p className="font-semibold text-amber-900">To:</p>
                    <p className="text-gray-700">{tracking.recipientName}</p>
                    <p className="text-sm text-gray-600">{tracking.recipientAddress}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-amber-600 mt-1" />
                  <div>
                    <p className="font-semibold text-amber-900">Estimated Delivery:</p>
                    <p className="text-gray-700">{tracking.estimatedDelivery.toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600">{tracking.estimatedDelivery.toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>

              <Separator className="bg-amber-200" />

              <div>
                <h4 className="font-semibold text-amber-900 mb-3">Timeline ({tracking.updates.length} updates)</h4>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {tracking.updates.slice().reverse().map((update) => (
                    <div key={update.id} className="flex items-start gap-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg">
                      <span className="text-xl">{update.emoji}</span>
                      <div className="flex-1">
                        <p className="font-medium text-amber-900">{update.status}</p>
                        <p className="text-sm text-gray-600">{update.description}</p>
                        <p className="text-xs text-amber-600 mt-1">
                          {update.location} • {update.timestamp.toLocaleString()}
                          {update.pigeonName && ` • ${update.pigeonName}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add New Update */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-amber-200">
            <CardHeader>
              <CardTitle className="text-xl text-amber-900 flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Status Update
              </CardTitle>
              <CardDescription className="text-amber-700">
                Create a new update for this delivery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddUpdate} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-amber-900">
                      Status *
                    </Label>
                    <Select 
                      value={newUpdate.status} 
                      onValueChange={handleStatusChange}
                      required
                    >
                      <SelectTrigger className="border-amber-300 focus:border-amber-500">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.emoji} {option.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pigeonName" className="text-amber-900">
                      Pigeon Name
                    </Label>
                    <Select 
                      value={newUpdate.pigeonName} 
                      onValueChange={(value) => setNewUpdate(prev => ({ ...prev, pigeonName: value }))}
                    >
                      <SelectTrigger className="border-amber-300 focus:border-amber-500">
                        <SelectValue placeholder="Select pigeon" />
                      </SelectTrigger>
                      <SelectContent>
                        {pigeonNames.map(name => (
                          <SelectItem key={name} value={name}>{name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-amber-900">
                    Location *
                  </Label>
                  <Input
                    id="location"
                    value={newUpdate.location}
                    onChange={(e) => setNewUpdate(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Enter current location"
                    className="border-amber-300 focus:border-amber-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-amber-900">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    value={newUpdate.description}
                    onChange={(e) => setNewUpdate(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what's happening with this delivery..."
                    className="border-amber-300 focus:border-amber-500 min-h-20"
                    required
                  />
                </div>

                {/* Delivery Images (only for Delivered status) */}
                {newUpdate.status === 'Delivered' && (
                  <div className="space-y-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                    <h4 className="font-semibold text-amber-900 flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Delivery Photos
                    </h4>
                    <div className="flex gap-2">
                      <Input
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Enter image URL (from Pexels, Unsplash, etc.)"
                        className="border-amber-300 focus:border-amber-500"
                      />
                      <Button
                        type="button"
                        onClick={addImageUrl}
                        variant="outline"
                        className="border-amber-300 text-amber-700 hover:bg-amber-50"
                      >
                        Add
                      </Button>
                    </div>
                    
                    {deliveryImages.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {deliveryImages.map((url, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={url}
                              alt={`Delivery confirmation ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg"
                            />
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg"
                >
                  {isSubmitting ? (
                    <>Adding Update...</>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Add Update
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}