#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ADMIN_ROOT = "D:/Cursor/Grand/huanqiu-admin";
const OWNER = "luqite-ux";
const REPO = "xiaohongrongpin";
const PROJECT = "xiaohongrongpin";

const env = {};
for (const file of [
  path.join(ADMIN_ROOT, "_migrate-batch", ".env"),
  path.join(ADMIN_ROOT, ".env"),
  path.join(ADMIN_ROOT, ".env.local")
]) {
  if (!fs.existsSync(file)) continue;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (match && !env[match[1]]) env[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, "");
  }
}

const token = env.VERCEL_TOKEN;
const team = env.VERCEL_TEAM_ID || "team_v0pxRIIzSUGJleUTRNSz6GS4";
if (!token) throw new Error("Missing VERCEL_TOKEN");

async function api(method, endpoint, body, ok = []) {
  const join = endpoint.includes("?") ? "&" : "?";
  const response = await fetch(`https://api.vercel.com${endpoint}${join}teamId=${team}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await response.text();
  if (!response.ok && !ok.includes(response.status)) {
    throw new Error(`${method} ${endpoint}: HTTP ${response.status} ${text.slice(0, 500)}`);
  }
  return { status: response.status, data: text ? JSON.parse(text) : null };
}

let project = await api("GET", `/v9/projects/${PROJECT}`, undefined, [404]);
if (project.status === 404) {
  project = await api("POST", "/v10/projects", {
    name: PROJECT,
    framework: "nextjs",
    gitRepository: { type: "github", repo: `${OWNER}/${REPO}` }
  });
  console.log(`project_created=${project.data.name} id=${project.data.id}`);
} else {
  console.log(`project_exists=${project.data.name} id=${project.data.id}`);
  await api("POST", `/v13/projects/${project.data.id}/link`, { type: "github", repo: `${OWNER}/${REPO}` }, [400, 409]);
}

const projectId = project.data.id;
const projectData = (await api("GET", `/v9/projects/${projectId}`)).data;
const repoId = projectData.link?.repoId;
console.log(`repo_link=${projectData.link?.repo || "none"} repoId=${repoId || "none"}`);
if (!repoId) throw new Error("Vercel project is not linked to a GitHub repoId");

const deployment = await api("POST", "/v13/deployments?skipAutoDetectionConfirmation=1", {
  name: PROJECT,
  project: projectId,
  target: "production",
  gitSource: {
    type: "github",
    repoId,
    ref: "main"
  },
  projectSettings: {
    framework: "nextjs"
  }
});

let current = deployment.data;
const deadline = Date.now() + 10 * 60 * 1000;
while (Date.now() < deadline && !["READY", "ERROR", "CANCELED"].includes(current.readyState)) {
  await new Promise((resolve) => setTimeout(resolve, 10_000));
  current = (await api("GET", `/v13/deployments/${deployment.data.id}`)).data;
  console.log(`deployment_status=${current.readyState}`);
}

if (current.readyState !== "READY") {
  throw new Error(`Deployment did not become READY: ${current.readyState}`);
}

console.log(JSON.stringify({
  projectId,
  projectName: PROJECT,
  deploymentId: current.id,
  url: `https://${current.url}`,
  readyState: current.readyState
}, null, 2));
