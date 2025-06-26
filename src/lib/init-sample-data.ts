import { getPayload } from 'payload';
import config from '../../payload.config';

export async function initSampleData() {
  console.log('🚀 Sample data initialization temporarily disabled for clean deployment');
  console.log('✅ Core admin panel and API are ready to use!');
  console.log('📦 You can now add products through the admin panel interface');
  
  // TODO: Re-enable sample data creation after fixing TypeScript enum issues
  /* 
  try {
    const payload = await getPayloadHMR({ config });
    
    // All sample data creation code commented out for now
    
  } catch (error) {
    console.error('❌ Error in sample data initialization:', error);
    throw error;
  }
  */
}

// Helper function to clear existing data (use with caution!)
export async function clearSampleData() {
  try {
    const payload = await getPayload({ config });
    
    console.log('🗑️ Clearing existing sample data...');
    
    // Clear in reverse dependency order
    await payload.delete({
      collection: 'analytics',
      where: {}
    });
    
    await payload.delete({
      collection: 'orders',
      where: {}
    });
    
    await payload.delete({
      collection: 'products',
      where: {}
    });
    
    console.log('✅ Sample data cleared successfully');
    
  } catch (error) {
    console.error('❌ Error clearing sample data:', error);
    throw error;
  }
} 