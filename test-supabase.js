const url = "https://rzdmnzuweyzhilfcungl.supabase.co/rest/v1/foco_drafts?process_id=eq.2401&select=form_data";
const apikey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6ZG1uenV3ZXl6aGlsZmN1bmdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4NTk5NTcsImV4cCI6MjA5NzQzNTk1N30.IqRxw3n2c-zNCccbgOUfh7wLy8eNnOVKJzwa8AsoSnU";

async function test() {
    const res = await fetch(url, {
        headers: {
            'apikey': apikey,
            'Authorization': `Bearer ${apikey}`,
            'Accept': 'application/vnd.pgrst.object+json' // Simulate .single()
        }
    });
    
    console.log("Status:", res.status);
    const body = await res.text();
    console.log("Body:", body);
}

test();
