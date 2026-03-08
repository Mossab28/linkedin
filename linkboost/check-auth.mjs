const url = "https://raiudvofwcdgvmuwcczj.supabase.co/auth/v1/settings";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhaXVkdm9md2NkZ3ZtdXdjY3pqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMDY3NzUsImV4cCI6MjA4ODU4Mjc3NX0.ZHkd_fyuMhLfROnyBw4cmnywIsaZraGbXxKLY1hSSZM";

const res = await fetch(url, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
const data = await res.json();
console.log("Google enabled:", data.external?.google);
console.log("All external providers:", JSON.stringify(data.external, null, 2));
