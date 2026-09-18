const fs = require("fs");
const path = require("path");

const envContent = fs.readFileSync(path.join(process.cwd(), ".env"), "utf8");
const env = {};
envContent.split("\n").forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
  if (match) {
    env[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, "");
  }
});

async function run() {
  const key = env.GROQ_API_KEY;
  const res = await fetch("https://api.groq.com/openai/v1/models", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${key}`
    }
  });
  const data = await res.json();
  console.log("Models:");
  data.data.forEach(m => {
    if (m.id.includes("whisper") || m.id.includes("distil")) {
      console.log(`  ${m.id}`);
    }
  });
}
run();
