import * as readline from "node:readline";
import * as fs from "node:fs";
import * as path from "node:path";
import { execSync } from "node:child_process";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question: string, defaultValue?: string): Promise<string> {
  const prompt = defaultValue ? `${question} [${defaultValue}]: ` : `${question}: `;
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer.trim() || defaultValue || "");
    });
  });
}

async function main() {
  console.log("\n  Webkit Setup\n");
  console.log("  Configure your new project:\n");

  const businessName = await ask("Business name", "My Business");
  const adminEmail = await ask("Admin email", "admin@webkit.local");
  const adminPassword = await ask("Admin password", "admin123");
  const whatsappNumber = await ask("WhatsApp number", "+1234567890");
  const defaultLocale = await ask("Default locale (en/ar)", "en");
  const dbUrl = await ask(
    "Database URL",
    "postgresql://webkit:webkit@db:5432/webkit"
  );

  const envContent = `# Database
DATABASE_URL=${dbUrl}

# Auth
ADMIN_EMAIL=${adminEmail}
ADMIN_PASSWORD=${adminPassword}
SESSION_SECRET=${generateSecret()}

# Site
SITE_NAME=${businessName}
SITE_URL=http://localhost:3000
WHATSAPP_NUMBER=${whatsappNumber}

# Storage
STORAGE_PROVIDER=local
UPLOAD_DIR=./uploads

# Email — Primary (Google SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=
SMTP_PASS=

# Email — Fallback (Resend)
RESEND_API_KEY=
EMAIL_FROM=noreply@example.com

# i18n
DEFAULT_LOCALE=${defaultLocale}
`;

  const envPath = path.join(process.cwd(), ".env");
  fs.writeFileSync(envPath, envContent);
  console.log("\n  .env file created");

  console.log("  Running migrations...");
  try {
    execSync("npx prisma migrate deploy --config prisma/prisma.config.ts", {
      stdio: "inherit",
    });
  } catch {
    console.log("  Migration skipped (may already be applied)");
  }

  console.log("  Seeding database...");
  try {
    execSync("npx tsx prisma/seed.ts", { stdio: "inherit" });
  } catch {
    console.log("  Seed skipped (may already exist)");
  }

  console.log("\n  Setup complete!");
  console.log(`  Admin: ${adminEmail} / ${adminPassword}`);
  console.log("  Run: docker compose -f docker-compose.dev.yml up -d\n");

  rl.close();
}

function generateSecret(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 32; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
