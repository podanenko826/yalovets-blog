require('dotenv').config({ path: '.env.local' });
async function run() {
    const response = await fetch('http://localhost:3000/api/subscriber?email=podanenko826@gmail.com');
    const data = await response.json();
    console.log("Subscriber:", data);
}
run();
