
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    const { paymentMethod, email, cardDetails, productId } = await req.json();
    
    console.log('Processing payment:', { paymentMethod, email, productId });
    
    // Simulate payment processing - in real app you'd use a payment processor like Stripe
    // For now, we'll just simulate a successful payment
    
    // Generate a unique order number
    const orderNumber = `ORD-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    
    // Get the product details
    const { data: product } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    console.log('Product found:', product);
    
    // Simulate email sending - in a real app, you would integrate with an email service
    console.log(`Email sent to ${email} with order number ${orderNumber} for product ${product.name}`);
    
    // In a real system, you would store the order in a database
    
    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        orderNumber,
        message: 'Payment processed successfully',
        downloadUrl: `/api/download/${orderNumber}` // This would be a real download URL in production
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error processing payment:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
