
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { LoaderCircle, UploadCloud, FileImage, FileAudio, FileVideo, FileArchive } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/contexts/ProductContext";

interface AdminProductFormProps {
  initialProduct: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    features: string[];
  };
  isEditing: boolean;
  onSubmit: (product: Omit<Product, "id">) => Promise<void>;
  onCancel: () => void;
}

const AdminProductForm: React.FC<AdminProductFormProps> = ({ 
  initialProduct, 
  isEditing, 
  onSubmit, 
  onCancel
}) => {
  const [currentProduct, setCurrentProduct] = useState({...initialProduct});
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileTypeIcon, setFileTypeIcon] = useState<React.ReactNode>(null);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentProduct(prev => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Set the appropriate icon based on file type
      if (file.type.startsWith('image/')) {
        setFileTypeIcon(<FileImage className="h-5 w-5 text-blue-400" />);
      } else if (file.type.startsWith('audio/')) {
        setFileTypeIcon(<FileAudio className="h-5 w-5 text-green-400" />);
      } else if (file.type.startsWith('video/')) {
        setFileTypeIcon(<FileVideo className="h-5 w-5 text-purple-400" />);
      } else if (file.type === 'application/zip' || file.type === 'application/x-zip-compressed') {
        setFileTypeIcon(<FileArchive className="h-5 w-5 text-amber-400" />);
      } else {
        setFileTypeIcon(null);
      }
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return null;
    }

    try {
      setUploading(true);
      
      // Create a unique file name
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Check if the file type is supported
      const supportedTypes = ['image/jpeg', 'image/png', 'image/gif', 'audio/mpeg', 'audio/mp3', 'video/mp4', 'application/zip', 'application/x-zip-compressed'];
      if (!supportedTypes.includes(selectedFile.type)) {
        toast({
          title: "Unsupported file type",
          description: "Please upload an image (JPG, PNG, GIF), audio (MP3), video (MP4), or ZIP file",
          variant: "destructive",
        });
        setUploading(false);
        return null;
      }
      
      // Create storage bucket if it doesn't exist
      try {
        const { data: bucketExists } = await supabase.storage
          .getBucket('product-images');
          
        if (!bucketExists) {
          const { error: bucketError } = await supabase.storage
            .createBucket('product-images', {
              public: true,
              fileSizeLimit: 52428800 // 50MB
            });
            
          if (bucketError) {
            console.error("Error creating storage bucket:", bucketError);
            throw bucketError;
          }
        }
      } catch (err) {
        console.log("Error checking bucket, attempting to create:", err);
        const { error: bucketError } = await supabase.storage
          .createBucket('product-images', {
            public: true,
            fileSizeLimit: 52428800 // 50MB
          });
          
        if (bucketError && !bucketError.message.includes('already exists')) {
          console.error("Error creating storage bucket:", bucketError);
          throw bucketError;
        }
      }
      
      // Upload the file to Supabase storage
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) throw error;
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);
      
      console.log("File uploaded successfully:", publicUrlData);
      
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
      
      setCurrentProduct(prev => ({
        ...prev,
        image: publicUrlData.publicUrl
      }));
      
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: `Error uploading file: ${error.message || 'Unknown error'}`,
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Upload image if a file is selected
      if (selectedFile) {
        const imageUrl = await handleImageUpload();
        if (!imageUrl) return; // Stop if image upload failed
      }
      
      if (!isEditing && !currentProduct.image && !selectedFile) {
        toast({
          title: "Image Required",
          description: "Please upload an image or provide an image URL for the product",
          variant: "destructive",
        });
        return;
      }

      // Proceed with form submission
      await onSubmit({
        name: currentProduct.name,
        description: currentProduct.description,
        price: currentProduct.price,
        image: currentProduct.image,
        features: currentProduct.features
      });
      
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Error saving product. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name</Label>
        <Input 
          id="name" 
          name="name" 
          value={currentProduct.name} 
          onChange={handleInputChange} 
          className="bg-gray-800/50 border-gray-700"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          name="description" 
          value={currentProduct.description} 
          onChange={handleInputChange} 
          className="bg-gray-800/50 border-gray-700"
          rows={4}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="price">Price ($)</Label>
        <Input 
          id="price" 
          name="price" 
          type="number" 
          step="0.01" 
          min="0"
          value={currentProduct.price} 
          onChange={handleInputChange} 
          className="bg-gray-800/50 border-gray-700"
          required
        />
        <p className="text-xs text-gray-400">Enter 0 for free products</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="image">Product File/Image</Label>
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Input
              id="image"
              name="image"
              value={currentProduct.image}
              onChange={handleInputChange}
              className="bg-gray-800/50 border-gray-700 flex-1"
              placeholder="https://example.com/image.jpg (Optional if uploading a file)"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <Label htmlFor="file-upload" className="flex items-center gap-2">
              Upload digital product:
              {fileTypeIcon && <span className="ml-2">{fileTypeIcon}</span>}
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="file-upload"
                type="file"
                accept=".jpg,.jpeg,.png,.gif,.mp3,.mp4,.zip"
                onChange={handleFileChange}
                className="bg-gray-800/50 border-gray-700"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleImageUpload}
                disabled={!selectedFile || uploading}
                className="flex-shrink-0"
              >
                {uploading ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <UploadCloud className="h-5 w-5" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-400">
              Supported formats: JPG, PNG, GIF, MP3, MP4, ZIP (Max size: 50MB)
            </p>
          </div>
          
          {currentProduct.image && (
            <div className="mt-2">
              <p className="text-sm text-gray-400 mb-1">Preview:</p>
              <img
                src={currentProduct.image}
                alt="Preview"
                className="w-24 h-24 object-cover rounded border border-gray-700"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/150";
                }}
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="flex gap-3 pt-4">
        <Button 
          type="submit" 
          className="bg-purple-600 hover:bg-purple-700"
          disabled={uploading}
        >
          {uploading ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            isEditing ? "Update Product" : "Add Product"
          )}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default AdminProductForm;
