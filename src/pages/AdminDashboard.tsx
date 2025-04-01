
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import Logo from "@/components/Logo";
import { Package, LogOut, Settings, PieChart, ShoppingCart, Users, ArrowLeft, LoaderCircle } from "lucide-react";
import { useProduct } from "@/contexts/ProductContext";
import AdminProductList from "@/components/admin/AdminProductList";
import AdminProductForm from "@/components/admin/AdminProductForm";

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
  const [activeSection, setActiveSection] = useState("products");

  useEffect(() => {
    // Refresh products when dashboard mounts
    refreshProducts();
  }, [refreshProducts]);

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/admin-login");
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

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleSubmit = async (product: any) => {
    try {
      if (isEditing) {
        // Update existing product
        await updateProduct(currentProduct.id, product);
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        // Add new product
        await addProduct(product);
        toast({
          title: "Success",
          description: "Product added successfully",
        });
      }
      
      resetForm();
      setActiveTab("products");
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: `Error ${isEditing ? 'updating' : 'adding'} product: ${error.message || "Unknown error"}`,
        variant: "destructive",
      });
    }
  };

  const goBack = () => {
    navigate(-1);
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
                      value="admin@digitalio.com" 
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
              <AdminProductList 
                products={products}
                loading={loading}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                onAddNew={resetForm}
              />
            </TabsContent>
            
            <TabsContent value="add" className="bg-black/20 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-6">
                {isEditing ? "Edit Product" : "Add New Product"}
              </h2>
              
              <AdminProductForm
                initialProduct={currentProduct}
                isEditing={isEditing}
                onSubmit={handleSubmit}
                onCancel={() => {
                  resetForm();
                  setActiveTab("products");
                }}
              />
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
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  onClick={goBack}
                  className="mr-2 text-white hover:bg-gray-800"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
              </div>
              <Button variant="outline" onClick={() => navigate("/")} className="text-sm">
                View Site
              </Button>
            </div>
          </header>
          
          <main className="p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
