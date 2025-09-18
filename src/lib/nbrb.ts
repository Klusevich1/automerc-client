// Курсы НБРБ: BYN за Cur_Scale единиц валюты
type NbrbRate = {
  Cur_Scale: number;
  Cur_OfficialRate: number;
  Cur_Abbreviation: string; // "USD", "RUB" и т.д.
};

async function fetchNbrbRate(code: "usd" | "rub"): Promise<NbrbRate> {
  const res = await fetch(
    `https://api.nbrb.by/exrates/rates/${code}?parammode=2`,
    {
      cache: "no-cache",
      headers: { Accept: "application/json" },
    }
  );
  if (!res.ok) throw new Error(`NBRB ${code} failed: ${res.status}`);
  return res.json();
}

let cachedRates: null | {
  rub: NbrbRate;
  usd: NbrbRate;
  date: string; // YYYY-MM-DD
} = null;

export async function getNbrbRates(): Promise<{
  rub: NbrbRate;
  usd: NbrbRate;
}> {
  const today = new Date().toISOString().slice(0, 10); // "2025-08-14"

  // 1) Пробуем из памяти
  if (cachedRates && cachedRates.date === today) {
    return { rub: cachedRates.rub, usd: cachedRates.usd };
  }

  // 2) Пробуем из localStorage
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("nbrbRates");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.date === today) {
          cachedRates = parsed;
          return { rub: parsed.rub, usd: parsed.usd };
        }
      } catch {}
    }
  }

  // 3) Если нет — берём с API и сохраняем
  const [rub, usd] = await Promise.all([
    fetchNbrbRate("rub"),
    fetchNbrbRate("usd"),
  ]);
  cachedRates = { rub, usd, date: today };

  if (typeof window !== "undefined") {
    localStorage.setItem("nbrbRates", JSON.stringify(cachedRates));
  }

  return { rub, usd };
}

// Конвертация
export function rubToByn(rubAmount: number, rub: NbrbRate): number {
  return (rubAmount / rub.Cur_Scale) * rub.Cur_OfficialRate;
}

export function bynToUsd(bynAmount: number, usd: NbrbRate): number {
  return bynAmount / (usd.Cur_OfficialRate / usd.Cur_Scale);
}

export function bynToRub(bynAmount: number, rub: NbrbRate): number {
  if (!Number.isFinite(bynAmount) || bynAmount <= 0) return 0;
  return bynAmount * (rub.Cur_Scale / rub.Cur_OfficialRate);
}

export function formatMoney(n: number, fractionDigits = 2): string {
  return n.toLocaleString("ru-RU", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}
