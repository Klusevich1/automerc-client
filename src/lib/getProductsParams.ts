import { NoteField } from "@/interfaces/NoteField";
import { parseNoteString } from "./parseNoteString";
import { parseNoteToFields } from "./parseNoteFields";

export function getProductParams(product: any): NoteField[] {
  if (!product) return [];

  const result: NoteField[] = [];
  
  const note = product.SparePart?.note;
  if (note && typeof note === "string" && note.trim()) {
    const parsedNote = parseNoteToFields(note);
    result.push(...parsedNote);
  }

  const articleCriteria = product.TecDocDetailInfo?.articleCriteria;
  if (
    articleCriteria &&
    typeof articleCriteria === "string" &&
    articleCriteria.trim()
  ) {
    const parsedArticle = parseNoteString(articleCriteria);
    result.push(...parsedArticle);
  }


  return result;
}
