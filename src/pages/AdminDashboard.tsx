
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Logo from "@/components/Logo";
import { Package, UploadCloud, Edit, Trash2, LogOut, Plus, Settings, PieChart, ShoppingCart, Users, LoaderCircle } from "lucide-react";
import { useProduct } from "@/contexts/ProductContext";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { products, loading, refreshProducts, addProduct, updateProduct, deleteProduct } = useProduct();
  
  const [currentProduct, setCurrentProduct] = useState({
    id: "",
    name: "",
    description: "",
    price: 0,
    image: "",
    features: []
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("products");
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeSection, setActiveSection] = useState("products");

  // Remove authentication check
  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentProduct(prev => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value
    }));
  };

  const resetForm = () => {
    setCurrentProduct({
      id: "",
      name: "",
      description: "",
      price: 0,
      image: "",
      features: []
    });
    setIsEditing(false);
    setSelectedFile(null);
    setActiveTab("add");
  };

  const handleEditProduct = (product: any) => {
    setCurrentProduct({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      features: product.features || []
    });
    setIsEditing(true);
    setActiveTab("add");
  };

  const handleDeleteProduct = async (id: string) => { // Fix TypeScript error by ensuring id is always string
    try {
      await deleteProduct(id);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
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
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
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
        description: "Error uploading image",
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
      
      if (isEditing) {
        // Update existing product
        await updateProduct(currentProduct.id, {
          name: currentProduct.name,
          description: currentProduct.description,
          price: currentProduct.price,
          image: currentProduct.image,
          features: currentProduct.features
        });
        
        setIsEditing(false);
      } else {
        // Add new product
        if (!currentProduct.image) {
          toast({
            title: "Image required",
            description: "Please upload an image for the product",
            variant: "destructive",
          });
          return;
        }
        
        await addProduct({
          name: currentProduct.name,
          description: currentProduct.description,
          price: currentProduct.price,
          image: currentProduct.image,
          features: currentProduct.features
        });
      }
      
      resetForm();
      setActiveTab("products");
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="bg-black/20 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-6">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800/60 rounded-lg p-4 border border-gray-700">
                <h3 className="text-lg font-medium mb-2">Products</h3>
                <p className="text-3xl font-bold text-purple-400">{products.length}</p>
                <p className="text-gray-400 mt-2">Total products in store</p>
              </div>
              {/* More dashboard cards would go here */}
            </div>
          </div>
        );
      case "orders":
        return (
          <div className="bg-black/20 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-6">Orders Management</h2>
            <p className="text-gray-400">No orders found.</p>
          </div>
        );
      case "customers":
        return (
          <div className="bg-black/20 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-6">Customer Management</h2>
            <p className="text-gray-400">No customers found.</p>
          </div>
        );
      case "settings":
        return (
          <div className="bg-black/20 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-6">Admin Settings</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Account Settings</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="admin-username">Admin Username</Label>
                    <Input 
                      id="admin-username" 
                      value="admin" 
                      className="bg-gray-800/50 border-gray-700 mt-1"
                      readOnly
                    />
                  </div>
                  <div>
                    <Label htmlFor="admin-password">Change Password</Label>
                    <Input 
                      id="admin-password" 
                      type="password" 
                      placeholder="Enter new password" 
                      className="bg-gray-800/50 border-gray-700 mt-1"
                    />
                  </div>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Update Settings
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      case "products":
      default:
        return (
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-gray-800 border border-gray-700 mb-6">
              <TabsTrigger value="products">Product Management</TabsTrigger>
              <TabsTrigger value="add">Add/Edit Product</TabsTrigger>
            </TabsList>
            
            <TabsContent value="products" className="bg-black/20 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Product List</h2>
                <Button onClick={resetForm} className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="mr-2 h-5 w-5" /> Add New Product
                </Button>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center p-10">
                  <LoaderCircle className="h-10 w-10 animate-spin text-purple-500" />
                </div>
              ) : (
                <div className="rounded-md border border-gray-700 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-gray-800">
                      <TableRow>
                        <TableHead className="text-white">Image</TableHead>
                        <TableHead className="text-white">Name</TableHead>
                        <TableHead className="text-white">Price</TableHead>
                        <TableHead className="text-white">Description</TableHead>
                        <TableHead className="text-white">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.length > 0 ? (
                        products.map(product => (
                          <TableRow key={product.id} className="border-gray-700 hover:bg-gray-800/60">
                            <TableCell>
                              <img 
                                src={product.image} 
                                alt={product.name} 
                                className="w-12 h-12 object-cover rounded" 
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/48?text=Product";
                                }}
                              />
                            </TableCell>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</TableCell>
                            <TableCell className="text-sm text-gray-400 truncate max-w-xs">
                              {product.description}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-red-400 hover:text-red-300 hover:bg-red-950 border-red-900" 
                                  onClick={() => handleDeleteProduct(product.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6 text-gray-400">
                            No products found. Click 'Add New Product' to create one.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="add" className="bg-black/20 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-6">
                {isEditing ? "Edit Product" : "Add New Product"}
              </h2>
              
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
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="image">Product Image</Label>
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-2">
                      <Input
                        id="image"
                        name="image"
                        value={currentProduct.image}
                        onChange={handleInputChange}
                        className="bg-gray-800/50 border-gray-700 flex-1"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="file-upload">Or upload a new image:</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="file-upload"
                          type="file"
                          accept="image/*"
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
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Sidebar */}
      <div className="flex h-screen">
        <div className="w-64 bg-black/40 backdrop-blur-md border-r border-gray-700 p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-8">
            <Logo />
            <span className="text-sm text-purple-400 font-semibold">Admin</span>
          </div>
          
          <nav className="flex flex-col space-y-1 flex-1">
            <Button 
              variant="ghost" 
              className={`justify-start ${activeSection === 'dashboard' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
              onClick={() => setActiveSection('dashboard')}
            >
              <PieChart className="mr-2 h-5 w-5" /> Dashboard
            </Button>
            <Button 
              variant="ghost" 
              className={`justify-start ${activeSection === 'products' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
              onClick={() => setActiveSection('products')}
            >
              <Package className="mr-2 h-5 w-5" /> Products
            </Button>
            <Button 
              variant="ghost" 
              className={`justify-start ${activeSection === 'orders' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
              onClick={() => setActiveSection('orders')}
            >
              <ShoppingCart className="mr-2 h-5 w-5" /> Orders
            </Button>
            <Button 
              variant="ghost" 
              className={`justify-start ${activeSection === 'customers' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
              onClick={() => setActiveSection('customers')}
            >
              <Users className="mr-2 h-5 w-5" /> Customers
            </Button>
            <Button 
              variant="ghost" 
              className={`justify-start ${activeSection === 'settings' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
              onClick={() => setActiveSection('settings')}
            >
              <Settings className="mr-2 h-5 w-5" /> Settings
            </Button>
          </nav>
          
          <Button variant="outline" className="mt-auto text-red-400 hover:text-red-300 hover:bg-red-950 border-red-900" onClick={handleLogout}>
            <LogOut className="mr-2 h-5 w-5" /> Logout
          </Button>
        </div>
        
        <div className="flex-1 overflow-auto">
          <header className="bg-black/30 backdrop-blur-md p-4 border-b border-gray-700 sticky top-0 z-10">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
              <Button variant="outline" onClick={() => navigate("/")} className="text-sm">
                View Site
              </Button>
            </div>
          </header>
          
          <main className="p-6">
            {activeSection === "dashboard" && (
              <div className="bg-black/20 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
                <h2 className="text-xl font-semibold mb-6">Dashboard Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-800/60 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-lg font-medium mb-2">Products</h3>
                    <p className="text-3xl font-bold text-purple-400">{products.length}</p>
                    <p className="text-gray-400 mt-2">Total products in store</p>
                  </div>
                  {/* More dashboard cards would go here */}
                </div>
              </div>
            )}
            
            {activeSection === "orders" && (
              <div className="bg-black/20 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
                <h2 className="text-xl font-semibold mb-6">Orders Management</h2>
                <p className="text-gray-400">No orders found.</p>
              </div>
            )}
            
            {activeSection === "customers" && (
              <div className="bg-black/20 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
                <h2 className="text-xl font-semibold mb-6">Customer Management</h2>
                <p className="text-gray-400">No customers found.</p>
              </div>
            )}
            
            {activeSection === "settings" && (
              <div className="bg-black/20 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
                <h2 className="text-xl font-semibold mb-6">Admin Settings</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Account Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="admin-username">Admin Username</Label>
                        <Input 
                          id="admin-username" 
                          value="admin" 
                          className="bg-gray-800/50 border-gray-700 mt-1"
                          readOnly
                        />
                      </div>
                      <div>
                        <Label htmlFor="admin-password">Change Password</Label>
                        <Input 
                          id="admin-password" 
                          type="password" 
                          placeholder="Enter new password" 
                          className="bg-gray-800/50 border-gray-700 mt-1"
                        />
                      </div>
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        Update Settings
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeSection === "products" && (
              <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-gray-800 border border-gray-700 mb-6">
                  <TabsTrigger value="products">Product Management</TabsTrigger>
                  <TabsTrigger value="add">Add/Edit Product</TabsTrigger>
                </TabsList>
                
                <TabsContent value="products" className="bg-black/20 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Product List</h2>
                    <Button onClick={() => {
                      resetForm();
                      setActiveTab("add");
                    }} className="bg-purple-600 hover:bg-purple-700">
                      <Plus className="mr-2 h-5 w-5" /> Add New Product
                    </Button>
                  </div>
                  
                  {loading ? (
                    <div className="flex justify-center items-center p-10">
                      <LoaderCircle className="h-10 w-10 animate-spin text-purple-500" />
                    </div>
                  ) : (
                    <div className="rounded-md border border-gray-700 overflow-hidden">
                      <Table>
                        <TableHeader className="bg-gray-800">
                          <TableRow>
                            <TableHead className="text-white">Image</TableHead>
                            <TableHead className="text-white">Name</TableHead>
                            <TableHead className="text-white">Price</TableHead>
                            <TableHead className="text-white">Description</TableHead>
                            <TableHead className="text-white">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {products.length > 0 ? (
                            products.map(product => (
                              <TableRow key={product.id} className="border-gray-700 hover:bg-gray-800/60">
                                <TableCell>
                                  <img 
                                    src={product.image} 
                                    alt={product.name} 
                                    className="w-12 h-12 object-cover rounded" 
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/48?text=Product";
                                    }}
                                  />
                                </TableCell>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</TableCell>
                                <TableCell className="text-sm text-gray-400 truncate max-w-xs">
                                  {product.description}
                                </TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="text-red-400 hover:text-red-300 hover:bg-red-950 border-red-900" 
                                      onClick={() => handleDeleteProduct(String(product.id))}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-6 text-gray-400">
                                No products found. Click 'Add New Product' to create one.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="add" className="bg-black/20 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
                  <h2 className="text-xl font-semibold mb-6">
                    {isEditing ? "Edit Product" : "Add New Product"}
                  </h2>
                  
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
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="image">Product Image</Label>
                      <div className="flex flex-col gap-4">
                        <div className="flex gap-2">
                          <Input
                            id="image"
                            name="image"
                            value={currentProduct.image}
                            onChange={handleInputChange}
                            className="bg-gray-800/50 border-gray-700 flex-1"
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="file-upload">Or upload a new image:</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="file-upload"
                              type="file"
                              accept="image/*"
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
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
