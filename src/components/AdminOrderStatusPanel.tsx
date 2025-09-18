import React, { useState } from "react";
import { defaultFetch } from "@/utils/fetch's/defaultFetch";

type Props = {
  onUpdated?: (orderNumber: number, status: string) => void;
};

const AdminOrderStatusPanel: React.FC<Props> = ({ onUpdated }) => {
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [status, setStatus] = useState<string>("Ожидается");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const STATUSES = ["Ожидается", "Выполнен", "Отменен"] as const;

  const updateStatus = async () => {
    setError(null);
    setSuccessMsg(null);

    const num = Number(orderNumber);
    if (!num || Number.isNaN(num) || num <= 0) {
      setError("Введите корректный номер заказа.");
      return;
    }
    if (!STATUSES.includes(status as (typeof STATUSES)[number])) {
      setError("Выберите корректный статус.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await defaultFetch(`/order/${num}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Ошибка ${res.status}`);
      }

      setSuccessMsg(`Статус заказа №${num} обновлен на "${status}".`);
      onUpdated?.(num, status);
    } catch (e: any) {
      setError(e?.message || "Не удалось обновить статус.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="p-6 rounded-2xl max-w-[900px] w-full md:mx-auto"
      style={{ background: "#fff", border: "1px solid #ececec" }}
    >
      <h2 className="text-2xl font-bold mb-4" style={{ color: "#474DFF" }}>
        Смена статуса заказа
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-[220px_260px_auto] gap-3 items-end">
        <div>
          <label className="block mb-2 font-semibold">Номер заказа</label>
          <input
            type="number"
            min={1}
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="Например, 100123"
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Статус</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 bg-white"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="flex md:justify-end">
          <button
            type="button"
            onClick={updateStatus}
            disabled={submitting}
            className="px-4 py-2 rounded-xl font-semibold text-white h-[42px]"
            style={{ background: submitting ? "#7b7fff" : "#474DFF" }}
          >
            {submitting ? "Обновление..." : "Обновить статус"}
          </button>
        </div>
      </div>

      {error && <p className="text-red-600 mt-4">{error}</p>}
      {successMsg && <p className="text-green-700 mt-4">{successMsg}</p>}

      <p className="text-sm text-gray-600 mt-3">
        Доступ к операции есть только у администратора. Авторизация через
        jwt-cookie.
      </p>
    </div>
  );
};

export default AdminOrderStatusPanel;
