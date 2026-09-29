// API Test - Copy and paste this in browser console
// Open http://localhost:5173 and press F12

async function testAPI() {
    console.log('🔗 Testing API Connection...');
    
    try {
        // Test 1: Health Check
        const health = await fetch('/api/health/');
        console.log('✅ Health Check:', await health.json());
    } catch (e) {
        console.log('⚠️ Health Check Failed:', e.message);
    }
    
    try {
        // Test 2: Stock Movements
        const stock = await fetch('/api/stock-movements/');
        console.log('✅ Stock Movements:', await stock.json());
    } catch (e) {
        console.log('⚠️ Stock Movements Failed:', e.message);
    }
    
    try {
        // Test 3: Dashboard Stats
        const stats = await fetch('/api/stock-movements/dashboard_stats/');
        console.log('✅ Dashboard Stats:', await stats.json());
    } catch (e) {
        console.log('⚠️ Dashboard Stats Failed:', e.message);
    }
    
    console.log('📊 API Test Complete!');
}

testAPI();
