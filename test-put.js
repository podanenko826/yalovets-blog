require('dotenv').config({ path: '.env.local' });
async function run() {
    const payload = {
        id: 2,
        email: 'test-pref@example.com',
        name: 'Test Pref',
        subscribed_at: '2026-09-03T16:57:01.568+00:00',
        is_active: true,
        is_article_updates_on: true,
        is_product_updates_on: false,
        is_service_updates_on: true
    };
    const response = await fetch('http://localhost:3000/api/subscriber', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const text = await response.text();
    console.log("Status:", response.status);
    console.log("Response:", text);
}
run();
