
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Logo from "@/components/Logo";
import { Package, UploadCloud, Edit, Trash2, LogOut, Plus, Settings, PieChart, ShoppingCart, Users } from "lucide-react";

// Mock data for products
const initialProducts = [
  {
    id: 1,
    name: "Premium UI Component Library",
    description: "Complete set of customizable UI components for modern web applications",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format"
  },
  {
    id: 2,
    name: "Developer Toolkit Pro",
    description: "Essential tools and utilities for web development workflow",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=600&auto=format"
  },
  {
    id: 3,
    name: "Code Editor Plus",
    description: "Advanced code editor with syntax highlighting and AI suggestions",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&auto=format"
  },
  {
    id: 4,
    name: "Web Analytics Dashboard",
    description: "Comprehensive analytics solution for tracking website performance",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&auto=format"
  }
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = React.useState(initialProducts);
  const [currentProduct, setCurrentProduct] = React.useState({
    id: 0,
    name: "",
    description: "",
    price: 0,
    image: ""
  });
  const [isEditing, setIsEditing] = React.useState(false);

  // Check if user is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/admin-login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/admin-login");
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
      id: 0,
      name: "",
      description: "",
      price: 0,
      image: ""
    });
    setIsEditing(false);
  };

  const handleEditProduct = (product: typeof currentProduct) => {
    setCurrentProduct(product);
    setIsEditing(true);
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(product => product.id !== id));
    toast({
      title: "Product deleted",
      description: "The product has been deleted successfully",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing) {
      // Update existing product
      setProducts(products.map(product => 
        product.id === currentProduct.id ? currentProduct : product
      ));
      toast({
        title: "Product updated",
        description: "The product has been updated successfully",
      });
    } else {
      // Add new product
      const newProduct = {
        ...currentProduct,
        id: Math.max(0, ...products.map(p => p.id)) + 1
      };
      setProducts([...products, newProduct]);
      toast({
        title: "Product added",
        description: "The new product has been added successfully",
      });
    }
    
    resetForm();
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
            <Button variant="ghost" className="justify-start text-purple-300 hover:bg-gray-800">
              <PieChart className="mr-2 h-5 w-5" /> Dashboard
            </Button>
            <Button variant="ghost" className="justify-start bg-gray-800 text-white">
              <Package className="mr-2 h-5 w-5" /> Products
            </Button>
            <Button variant="ghost" className="justify-start text-gray-400 hover:bg-gray-800">
              <ShoppingCart className="mr-2 h-5 w-5" /> Orders
            </Button>
            <Button variant="ghost" className="justify-start text-gray-400 hover:bg-gray-800">
              <Users className="mr-2 h-5 w-5" /> Customers
            </Button>
            <Button variant="ghost" className="justify-start text-gray-400 hover:bg-gray-800">
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
            <Tabs defaultValue="products">
              <TabsList className="bg-gray-800 border border-gray-700 mb-6">
                <TabsTrigger value="products">Product Management</TabsTrigger>
                <TabsTrigger value="add">Add/Edit Product</TabsTrigger>
              </TabsList>
              
              <TabsContent value="products" className="bg-black/20 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Product List</h2>
                  <Button onClick={() => resetForm()} className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="mr-2 h-5 w-5" /> Add New Product
                  </Button>
                </div>
                
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
                      {products.map(product => (
                        <TableRow key={product.id} className="border-gray-700 hover:bg-gray-800/60">
                          <TableCell>
                            <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                          </TableCell>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>${product.price.toFixed(2)}</TableCell>
                          <TableCell className="text-sm text-gray-400 truncate max-w-xs">
                            {product.description}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-950 border-red-900" onClick={() => handleDeleteProduct(product.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
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
                    <Label htmlFor="image">Image URL</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="image" 
                        name="image" 
                        value={currentProduct.image} 
                        onChange={handleInputChange} 
                        className="bg-gray-800/50 border-gray-700 flex-1"
                        placeholder="https://example.com/image.jpg"
                        required
                      />
                      <Button type="button" variant="outline" className="flex-shrink-0">
                        <UploadCloud className="h-5 w-5" />
                      </Button>
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
                  
                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                      {isEditing ? "Update Product" : "Add Product"}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
