import React, { useState } from 'react';
import { ArrowLeft, Plus, Package, User, MapPin, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTracking } from '@/context/TrackingContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import PigeonLogo from '@/components/PigeonLogo';

interface CreateTrackingFormProps {
  onBack: () => void;
}

export default function CreateTrackingForm({ onBack }: CreateTrackingFormProps) {
  const [formData, setFormData] = useState({
    senderName: '',
    senderAddress: '',
    recipientName: '',
    recipientAddress: '',
    messageContent: '',
    estimatedDelivery: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addTracking } = useTracking();

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
      const estimatedDelivery = formData.estimatedDelivery 
        ? new Date(formData.estimatedDelivery)
        : new Date(Date.now() + 24 * 60 * 60 * 1000); // Default: 24 hours from now

      const trackingNumber = await addTracking({
        senderName: formData.senderName,
        senderAddress: formData.senderAddress,
        recipientName: formData.recipientName,
        recipientAddress: formData.recipientAddress,
        messageContent: formData.messageContent || undefined,
        estimatedDelivery,
        currentStatus: 'processing',
        isDelivered: false,
        sender: formData.senderName,
        recipient: formData.recipientName,
        message: formData.messageContent || '',
        status: 'processing'
      });

      toast.success(`Tracking created successfully! Number: ${trackingNumber}`);
      
      // Reset form
      setFormData({
        senderName: '',
        senderAddress: '',
        recipientName: '',
        recipientAddress: '',
        messageContent: '',
        estimatedDelivery: ''
      });
      
      onBack();
    } catch (error) {
      toast.error('Failed to create tracking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-2 sm:p-4 overflow-x-hidden">
      <motion.div 
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="border-amber-300 text-amber-700 hover:bg-amber-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-amber-900 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <PigeonLogo size={32} className="sm:w-8 sm:h-8" />
              Create New Delivery
            </h1>
            <p className="text-amber-700 mt-1 text-sm sm:text-base">Set up a new message delivery</p>
          </motion.div>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-amber-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl text-amber-900 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <Package className="h-6 w-6" />
                Delivery Details
              </CardTitle>
              <CardDescription className="text-amber-700">
                Fill in the information for your new message delivery
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* Sender Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-amber-900 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Sender Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="senderName" className="text-amber-900">
                      Sender Name *
                    </Label>
                    <Input
                      id="senderName"
                      value={formData.senderName}
                      onChange={(e) => handleInputChange('senderName', e.target.value)}
                      placeholder="Enter sender's full name"
                      className="border-amber-300 focus:border-amber-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="senderAddress" className="text-amber-900">
                      Sender Address *
                    </Label>
                    <Input
                      id="senderAddress"
                      value={formData.senderAddress}
                      onChange={(e) => handleInputChange('senderAddress', e.target.value)}
                      placeholder="Enter sender's address"
                      className="border-amber-300 focus:border-amber-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Recipient Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-amber-900 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Recipient Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipientName" className="text-amber-900">
                      Recipient Name *
                    </Label>
                    <Input
                      id="recipientName"
                      value={formData.recipientName}
                      onChange={(e) => handleInputChange('recipientName', e.target.value)}
                      placeholder="Enter recipient's full name"
                      className="border-amber-300 focus:border-amber-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipientAddress" className="text-amber-900">
                      Recipient Address *
                    </Label>
                    <Input
                      id="recipientAddress"
                      value={formData.recipientAddress}
                      onChange={(e) => handleInputChange('recipientAddress', e.target.value)}
                      placeholder="Enter recipient's address"
                      className="border-amber-300 focus:border-amber-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-amber-900 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Message Details
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="messageContent" className="text-amber-900">
                      Message Content (Optional)
                    </Label>
                    <Textarea
                      id="messageContent"
                      value={formData.messageContent}
                      onChange={(e) => handleInputChange('messageContent', e.target.value)}
                      placeholder="Enter the message content that will be delivered..."
                      className="border-amber-300 focus:border-amber-500 min-h-24"
                      rows={4}
                    />
                    <p className="text-sm text-amber-600">
                      This message will be viewable by the recipient once delivered
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimatedDelivery" className="text-amber-900">
                      Estimated Delivery Date
                    </Label>
                    <Input
                      id="estimatedDelivery"
                      type="datetime-local"
                      value={formData.estimatedDelivery}
                      onChange={(e) => handleInputChange('estimatedDelivery', e.target.value)}
                      className="border-amber-300 focus:border-amber-500"
                      min={new Date().toISOString().slice(0, 10) + 'T00:00'}
                    />
                    <p className="text-sm text-amber-600">
                      Leave empty to set default delivery time (24 hours from now)
                    </p>
                  </div>
                </div>
              </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-amber-200">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onBack}
                      className="border-amber-300 text-amber-700 hover:bg-amber-50 w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg px-6 sm:px-8 w-full sm:w-auto"
                    >
                      {isSubmitting ? (
                        <>Creating...</>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Tracking
                        </>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}