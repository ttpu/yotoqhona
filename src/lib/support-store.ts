import { promises as fs } from "fs";
import path from "path";

export type SupportMessage = {
  id: string;
  userId?: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

const dataDir = path.join(process.cwd(), "data");
const messagesFile = path.join(dataDir, "support-messages.json");

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(messagesFile);
  } catch {
    await fs.writeFile(messagesFile, "[]", "utf8");
  }
}

export async function createSupportMessage(input: {
  userId?: string;
  name: string;
  email: string;
  message: string;
}): Promise<SupportMessage> {
  await ensureStore();
  const raw = await fs.readFile(messagesFile, "utf8");
  const messages = JSON.parse(raw) as SupportMessage[];

  const entry: SupportMessage = {
    id: crypto.randomUUID(),
    ...input,
    createdAt: new Date().toISOString()
  };

  messages.push(entry);
  await fs.writeFile(messagesFile, JSON.stringify(messages, null, 2), "utf8");
  return entry;
}
