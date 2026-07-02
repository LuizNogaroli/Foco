const url = "https://rzdmnzuweyzhilfcungl.supabase.co/rest/v1/foco_drafts?select=process_id,form_data";
const apikey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6ZG1uenV3ZXl6aGlsZmN1bmdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4NTk5NTcsImV4cCI6MjA5NzQzNTk1N30.IqRxw3n2c-zNCccbgOUfh7wLy8eNnOVKJzwa8AsoSnU";

async function test() {
    const res = await fetch(url, {
        headers: {
            'apikey': apikey,
            'Authorization': `Bearer ${apikey}`,
            'Accept': 'application/json'
        }
    });
    
    const body = await res.json();
    body.forEach(row => {
        if (row.form_data && Object.keys(row.form_data).length < 5) {
            console.log("Processo com dados corrompidos/curtos:", row.process_id, JSON.stringify(row.form_data));
        }
    });
}

test();
