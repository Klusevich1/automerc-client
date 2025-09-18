import { defaultFetch } from "@/utils/fetch's/defaultFetch";
import React, { useState, useRef } from "react";

type Props = {
  onCreated?: (createdId: number) => void;
  onDeleted?: (createdId: number) => void;
};

const AdminPromoForm: React.FC<Props> = ({ onCreated, onDeleted }) => {
  // создание
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // удаление
  const [deleteId, setDeleteId] = useState<string>("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming || incoming.length === 0) return;
    const list = Array.from(incoming).filter((f) =>
      f.type.startsWith("image/")
    );
    setFiles((prev) => [...prev, ...list]);
  };

  const removeAt = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title.trim() || !description.trim() || files.length === 0) {
      setError("Заполните название, описание и выберите изображения.");
      return;
    }

    const form = new FormData();
    form.append("title", title);
    form.append("description", description);
    files.forEach((f) => form.append("images", f));

    setSubmitting(true);
    try {
      const res = await defaultFetch(`/promos`, {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Ошибка ${res.status}`);
      }
      const data = await res.json();
      onCreated?.(data.id);
      setTitle("");
      setDescription("");
      setFiles([]);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const deletePromo = async () => {
    setDeleteError(null);
    const idNum = Number(deleteId);
    if (!idNum || Number.isNaN(idNum) || idNum <= 0) {
      setDeleteError("Введите корректный ID для удаления.");
      return;
    }
    const confirmed = window.confirm(
      `Удалить промо с ID ${idNum}? Действие необратимо.`
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      const res = await defaultFetch(`/promos/${idNum}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Ошибка ${res.status}`);
      }
      onDeleted?.(idNum);
      setDeleteId("");
    } catch (e: any) {
      setDeleteError(e.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-[900px] mx-auto grid gap-8">
      <form
        onSubmit={submit}
        className="p-6 rounded-2xl"
        style={{ background: "#fff", border: "1px solid #ececec" }}
      >
        <h2 className="text-2xl font-bold mb-4" style={{ color: "#474DFF" }}>
          Создание промо-карточки
        </h2>

        <label className="block mb-2 font-semibold">Название</label>
        <input
          className="w-full border rounded-lg px-3 py-2 mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Введите название"
        />

        <label className="block mb-2 font-semibold">Описание</label>
        <textarea
          className="w-full border rounded-lg px-3 py-2 mb-4"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Краткое описание"
        />

        <label className="block mb-2 font-semibold">Изображения</label>
        <input
          className="mb-3"
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
        />

        {files.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {files.map((f, i) => {
              const url = URL.createObjectURL(f);
              return (
                <div key={i} className="relative border rounded-lg p-2">
                  <img
                    src={url}
                    alt={f.name}
                    className="max-h-[140px] w-full object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeAt(i)}
                    className="absolute top-2 right-2 text-white px-2 py-1 rounded"
                    style={{ background: "#474DFF" }}
                  >
                    Удалить
                  </button>
                  <div className="mt-2 text-xs text-gray-600 truncate">
                    {f.name}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 rounded-xl font-semibold text-white"
          style={{ background: submitting ? "#7b7fff" : "#474DFF" }}
        >
          {submitting ? "Отправка..." : "Создать"}
        </button>
      </form>
      <div
        className="p-6 rounded-2xl"
        style={{ background: "#fff", border: "1px solid #ececec" }}
      >
        <h2 className="text-2xl font-bold mb-4" style={{ color: "#D22" }}>
          Удалить промо по ID
        </h2>

        <div className="flex gap-3 items-center mb-3">
          <input
            type="number"
            min={1}
            value={deleteId}
            onChange={(e) => setDeleteId(e.target.value)}
            placeholder="Введите ID"
            className="border rounded-lg px-3 py-2 w-[220px]"
          />
          <button
            type="button"
            onClick={deletePromo}
            disabled={deleting}
            className="px-4 py-2 rounded-xl font-semibold text-white"
            style={{ background: deleting ? "#f08" : "#D22" }}
          >
            {deleting ? "Удаление..." : "Удалить"}
          </button>
        </div>

        {deleteError && <p className="text-red-600">{deleteError}</p>}
        <p className="text-sm text-gray-600">
          Внимание. Удаление полностью удалит запись и связанные изображения.
        </p>
      </div>
    </div>
  );
};

export default AdminPromoForm;
