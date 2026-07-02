const url = "https://rzdmnzuweyzhilfcungl.supabase.co/rest/v1/foco_final";
const apikey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6ZG1uenV3ZXl6aGlsZmN1bmdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4NTk5NTcsImV4cCI6MjA5NzQzNTk1N30.IqRxw3n2c-zNCccbgOUfh7wLy8eNnOVKJzwa8AsoSnU";

async function test() {
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'apikey': apikey,
            'Authorization': `Bearer ${apikey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            process_id: "test-insert",
            form_data: { foo: "bar" },
            updated_at: new Date().toISOString()
        })
    });
    
    console.log("Status:", res.status);
    const body = await res.text();
    console.log("Body:", body);
}

test();
