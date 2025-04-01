
import React from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Plus, LoaderCircle } from "lucide-react";
import { Product } from "@/contexts/ProductContext";

interface AdminProductListProps {
  products: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}

const AdminProductList: React.FC<AdminProductListProps> = ({ 
  products, 
  loading, 
  onEdit, 
  onDelete, 
  onAddNew 
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Product List</h2>
        <Button onClick={onAddNew} className="bg-purple-600 hover:bg-purple-700">
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
                        <Button variant="outline" size="sm" onClick={() => onEdit(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-400 hover:text-red-300 hover:bg-red-950 border-red-900" 
                          onClick={() => onDelete(String(product.id))}
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
    </div>
  );
};

export default AdminProductList;
