require('dotenv').config({ path: '.env.local' });
async function run() {
    const payload = {
        email: 'test-pref@example.com',
        name: 'Test Pref',
        is_article_updates_on: false,
        is_product_updates_on: true,
        is_service_updates_on: false
    };
    const response = await fetch('http://localhost:3000/api/subscriber', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const text = await response.text();
    console.log("Status:", response.status);
    console.log("Response:", text);
}
run();
