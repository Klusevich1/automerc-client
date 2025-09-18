import { NoteField } from "@/interfaces/NoteField";

export function parseNoteToFields(note: string, carName?: string): NoteField[] {
  const decoded = note
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  const text = decoded
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/p>\s*<p>/gi, "\n")
    .replace(/<\/?p>/gi, "\n")
    .replace(/-+/, "") 
    .replace(/\n{2,}/g, "\n") 
    .trim();

  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const fields: NoteField[] = [];

  for (const line of lines) {
    const match = line.match(/^([^:]+):\s*(.+)$/);
    if (match) {
      fields.push({
        label: match[1].trim(),
        value: match[2].trim(),
      });
    }
  }

  if (carName) {
    const idx = fields.findIndex((f) => f.label.toLowerCase() === "авто");
    if (idx !== -1) {
      fields[idx].value = carName;
    } else {
      fields.push({ label: "Авто", value: carName });
    }
  }

  return fields;
}
