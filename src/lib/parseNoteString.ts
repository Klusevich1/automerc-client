import { NoteField } from "@/interfaces/NoteField";

export function parseNoteString(input: string): NoteField[] {
  if (!input) return [];

  const segments = input
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s);

  return segments
    .map((segment) => {
      // Разделяем только по первому двоеточию
      const [label, ...valueParts] = segment.split(":");
      const value = valueParts.join(":").trim();

      return {
        label: label.trim(),
        value: value,
      };
    })
    .filter((item) => item.label && item.value)
    .filter((item) => item.label.toLowerCase() !== "гарантия") // Пропускаем гарантию
    .map((item) => ({
      ...item,
      label: capitalizeFirstLetter(item.label), // Первая буква заглавная
    }));
}

// Вспомогательная функция для заглавной первой буквы
function capitalizeFirstLetter(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}
