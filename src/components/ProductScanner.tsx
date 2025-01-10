import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useProducts } from '@/contexts/ProductContext';
import { Product } from '@/lib/types';
import { pipeline } from '@huggingface/transformers';
import { Camera, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ProductScannerProps {
  onProductDetected: (product: Product) => void;
}

export const ProductScanner = ({ onProductDetected }: ProductScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const { products } = useProducts();
  const [classifier, setClassifier] = useState<any>(null);

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment' // Prefer back camera if available
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsScanning(true);

      // Initialize the image classifier
      const imageClassifier = await pipeline(
        'image-classification',
        'onnx-community/mobilenetv4_conv_small.e2400_r224_in1k',
        { device: 'webgpu' }
      );
      setClassifier(imageClassifier);
      
      console.log('Camera and classifier initialized successfully');
    } catch (error) {
      console.error('Error starting scanner:', error);
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopScanning = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const captureImage = async () => {
    if (!videoRef.current || !classifier) {
      console.error('Video ref or classifier not ready');
      return;
    }

    try {
      // Create a canvas and draw the current video frame
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        console.error('Could not get canvas context');
        return;
      }

      // Draw the current video frame to the canvas
      ctx.drawImage(videoRef.current, 0, 0);

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob(blob => {
          if (blob) resolve(blob);
        }, 'image/jpeg', 0.95);
      });

      // Create a File object from the blob
      const file = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' });
      
      console.log('Attempting to classify image...');
      const result = await classifier(file);
      console.log('Classification result:', result);

      // Find a matching product based on the classification
      const matchedProduct = products.find(product => {
        const label = result[0].label.toLowerCase();
        return (
          product.name.toLowerCase().includes(label) ||
          product.description.toLowerCase().includes(label)
        );
      });

      if (matchedProduct) {
        toast({
          title: "Product Detected",
          description: `Found: ${matchedProduct.name}`,
        });
        onProductDetected(matchedProduct);
        stopScanning();
      } else {
        toast({
          title: "No Match Found",
          description: "Could not find a matching product in inventory.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "Error",
        description: "Failed to process the image.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {!isScanning ? (
          <Button onClick={startScanning} className="w-full">
            <Camera className="w-4 h-4 mr-2" />
            Start Scanner
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={stopScanning}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <Button onClick={captureImage} className="w-full">
              Scan Product
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};