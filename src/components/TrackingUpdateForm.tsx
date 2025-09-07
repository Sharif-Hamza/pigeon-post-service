import React, { useState } from 'react';
import { Plus, MapPin, MessageSquare, Smile } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { trackingAPI } from '@/services/api';

interface TrackingUpdateFormProps {
  trackingNumber: string;
  onUpdate: () => void;
  onClose: () => void;
}

const statusOptions = [
  { value: 'processing', label: 'Processing', emoji: '📝' },
  { value: 'assigned', label: 'Pigeon Assigned', emoji: '🕊️' },
  { value: 'in-transit', label: 'In Transit', emoji: '✈️' },
  { value: 'approaching', label: 'Approaching Destination', emoji: '🎯' },
  { value: 'delivered', label: 'Delivered', emoji: '✅' },
  { value: 'delayed', label: 'Delayed', emoji: '⏰' },
  { value: 'issue', label: 'Issue', emoji: '⚠️' }
];

const emojiOptions = [
  '📝', '🕊️', '✈️', '🎯', '✅', '⏰', '⚠️', '📦', '🚀', '🌟', '💌', '🏠', '🌍', '⛅', '🌧️', '☀️'
];

export default function TrackingUpdateForm({ trackingNumber, onUpdate, onClose }: TrackingUpdateFormProps) {
  const [formData, setFormData] = useState({
    status: '',
    location: '',
    description: '',
    emoji: '📦',
    pigeonName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await trackingAPI.addUpdate(trackingNumber, formData);
      toast.success('Tracking update added successfully!');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error adding update:', error);
      toast.error('Failed to add tracking update');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <Card className="w-full max-w-2xl bg-white shadow-2xl">
        <CardHeader>
          <CardTitle className="text-xl text-amber-900 flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Tracking Update
          </CardTitle>
          <CardDescription className="text-amber-700">
            Add a new status update for tracking #{trackingNumber}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Status Selection */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-amber-900">
                Status *
              </Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger className="border-amber-300 focus:border-amber-500">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.emoji} {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="text-amber-900 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location *
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., Brooklyn Bridge, NYC"
                className="border-amber-300 focus:border-amber-500"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-amber-900 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Description *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe what's happening with this delivery..."
                className="border-amber-300 focus:border-amber-500 min-h-[100px]"
                required
              />
            </div>

            {/* Emoji and Pigeon Name Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emoji" className="text-amber-900 flex items-center gap-2">
                  <Smile className="h-4 w-4" />
                  Emoji
                </Label>
                <Select value={formData.emoji} onValueChange={(value) => handleInputChange('emoji', value)}>
                  <SelectTrigger className="border-amber-300 focus:border-amber-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {emojiOptions.map((emoji) => (
                      <SelectItem key={emoji} value={emoji}>
                        {emoji} {emoji}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pigeonName" className="text-amber-900">
                  Pigeon Name (Optional)
                </Label>
                <Input
                  id="pigeonName"
                  value={formData.pigeonName}
                  onChange={(e) => handleInputChange('pigeonName', e.target.value)}
                  placeholder="e.g., Winston, Duchess"
                  className="border-amber-300 focus:border-amber-500"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.status || !formData.location || !formData.description}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white"
                >
                  {isSubmitting ? 'Adding Update...' : 'Add Update'}
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="w-full border-amber-300 text-amber-700 hover:bg-amber-50"
                >
                  Cancel
                </Button>
              </motion.div>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
