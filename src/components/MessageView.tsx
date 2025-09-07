import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, FileText, Calendar, MapPin, User, Package } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useTracking, TrackingItem } from '@/context/TrackingContext';
import { toast } from 'sonner';

export default function MessageView() {
  const { trackingNumber } = useParams();
  const navigate = useNavigate();
  const { getTracking } = useTracking();
  const [tracking, setTracking] = useState<TrackingItem | null>(null);

  useEffect(() => {
    if (trackingNumber) {
      const foundTracking = getTracking(trackingNumber.toUpperCase());
      if (foundTracking) {
        if (foundTracking.isDelivered && foundTracking.messageContent) {
          setTracking(foundTracking);
        } else if (!foundTracking.isDelivered) {
          toast.error('This message is not yet delivered');
          navigate('/');
        } else {
          toast.error('No message content available for this delivery');
          navigate('/');
        }
      } else {
        toast.error('Tracking number not found');
        navigate('/');
      }
    }
  }, [trackingNumber, getTracking, navigate]);

  if (!tracking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-amber-900">Loading message...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center py-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Mail className="h-12 w-12 text-amber-700" />
            <h1 className="text-5xl font-bold text-amber-900 tracking-tight font-serif">
              Pigeon Post Service
            </h1>
          </div>
          <p className="text-xl text-amber-700 mb-8 font-medium">
            Message Delivery Confirmation
          </p>
        </div>

        {/* Message Card */}
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-amber-200 relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-4 right-4 text-8xl">📮</div>
            <div className="absolute bottom-4 left-4 text-6xl">🕊️</div>
          </div>

          <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100 relative">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl text-amber-900 mb-2 font-serif flex items-center gap-3">
                  <FileText className="h-8 w-8 text-amber-600" />
                  A Message for You
                </CardTitle>
                <CardDescription className="text-amber-700 text-lg">
                  Delivered by pigeon post • Tracking #{tracking.trackingNumber}
                </CardDescription>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200 text-sm px-3 py-1">
                ✨ Delivered
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-8 relative">
            {/* Delivery Information */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-amber-600 mt-1" />
                  <div>
                    <p className="font-semibold text-amber-900">From:</p>
                    <p className="text-gray-700 text-lg">{tracking.senderName}</p>
                    <p className="text-sm text-gray-600">{tracking.senderAddress}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-amber-600 mt-1" />
                  <div>
                    <p className="font-semibold text-amber-900">To:</p>
                    <p className="text-gray-700 text-lg">{tracking.recipientName}</p>
                    <p className="text-sm text-gray-600">{tracking.recipientAddress}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-amber-600 mt-1" />
                  <div>
                    <p className="font-semibold text-amber-900">Sent:</p>
                    <p className="text-gray-700">{tracking.createdAt.toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600">{tracking.createdAt.toLocaleTimeString()}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Package className="h-5 w-5 text-amber-600 mt-1" />
                  <div>
                    <p className="font-semibold text-amber-900">Delivery Details:</p>
                    <p className="text-gray-700">{tracking.updates.length} status updates</p>
                    <p className="text-sm text-gray-600">Journey completed successfully</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="mb-8 bg-amber-200" />

            {/* Message Content */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 border-l-4 border-amber-400">
              <h3 className="text-xl font-semibold text-amber-900 mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Your Message
              </h3>
              
              <div className="prose prose-amber max-w-none">
                <p className="text-gray-800 leading-relaxed text-lg whitespace-pre-wrap font-light">
                  {tracking.messageContent}
                </p>
              </div>
              
              <div className="mt-6 text-right">
                <p className="text-amber-700 font-medium italic">
                  — From {tracking.senderName}
                </p>
              </div>
            </div>

            {/* Delivery Photos */}
            {tracking.deliveryImages && tracking.deliveryImages.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-amber-900 mb-4">
                  Delivery Confirmation Photos
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {tracking.deliveryImages.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Delivery confirmation ${index + 1}`}
                      className="rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => window.open(image, '_blank')}
                    />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer Actions */}
        <div className="text-center mt-8 space-y-4">
          <Button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg px-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Tracking
          </Button>
          
          <div className="text-amber-600 text-sm italic">
            <p>"Every message tells a story, every delivery creates a memory"</p>
          </div>
        </div>
      </div>
    </div>
  );
}