import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { startLoading } from "@/redux/loadingSlice";
import { defaultFetch } from "@/utils/fetch's/defaultFetch";

type SuggestItem = {
  id: string;
  label: string;
  subtitle?: string;
  url: string; // куда перейти по клику
  score: number; // для сортировки
  matchedRanges?: Array<[number, number]>; // для подсветки
};

const POPULAR_ITEMS = [
  "Фильтр масляный",
  "Свеча зажигания",
  "Амортизатор передний",
  "Тормозные колодки",
  "Ремень ГРМ",
];

const LS_RECENTS_KEY = "search_recents_v1";
const MAX_RECENTS = 10;
const DEBOUNCE_MS = 250;
const MIN_QUERY_LEN = 2;

// ---------------- utils: нормализация и эвристики ----------------
const normalizeBasic = (s: string) =>
  s.toLowerCase().trim().replace(/\s+/g, " ");

const stripNonAlnum = (s: string) => s.replace(/[^0-9a-zа-яё]/gi, "");

const looksLikeOEM = (s: string) => {
  const t = s.toUpperCase().replace(/[^A-Z0-9]/g, "");
  return t.length >= 4 && /[A-Z0-9]/.test(t);
};

const looksLikeVIN = (s: string) => {
  const t = s.toUpperCase().replace(/[^A-Z0-9]/g, "");
  // VIN: 17 символов, без I O Q
  return t.length === 17 && !/[IOQ]/.test(t);
};

// Переключение похожих символов для артикулов
const swapLookalikes = (s: string) =>
  s
    .replace(/o/gi, "0")
    .replace(/i/gi, "1")
    .replace(/l/gi, "1")
    .replace(/z/gi, "2");

const buildQueryVariants = (raw: string): string[] => {
  const q = normalizeBasic(raw);
  if (!q) return [];

  const variants = new Set<string>();
  variants.add(q);

  // Удаление лишних символов
  variants.add(stripNonAlnum(q));

  // Замены похожих символов
  variants.add(swapLookalikes(q));
  variants.add(stripNonAlnum(swapLookalikes(q)));

  // Для названий — токены по словам (берем первые 1-2)
  const tokens = q.split(" ").filter(Boolean);
  if (tokens.length > 1) {
    variants.add(tokens[0]);
    variants.add(tokens.slice(0, 2).join(" "));
  }

  // Для OEM — убрать дефисы/пробелы и в верхний регистр
  if (looksLikeOEM(q)) {
    const up = q.toUpperCase();
    variants.add(up);
    variants.add(up.replace(/[^A-Z0-9]/g, ""));
  }

  return Array.from(variants)
    .map((v) => v.trim())
    .filter((v) => v.length > 0)
    .slice(0, 8);
};

// Подсветка совпадений в лейбле
const markMatches = (label: string, query: string): Array<[number, number]> => {
  const q = query.trim();
  if (!q) return [];
  const idx = label.toLowerCase().indexOf(q.toLowerCase());
  return idx >= 0 ? [[idx, idx + q.length]] : [];
};

// ---------------- API-заглушки: подставьте ваши эндпоинты ----------------
// ВАЖНО: тут предполагается строгий поиск на бэке.
// Мы дергаем его разными вариантами и объединяем результаты.

async function searchStrict(
  query: string,
  signal?: AbortSignal
): Promise<SuggestItem[]> {
  const res = await defaultFetch(`/spare-parts/search/${query}?limit=6`, {
    signal,
  });
  if (!res.ok) return [];

  const data = await res.json();
  return data.items.map((x: any) => ({
    id: x.id,
    label: x.nameWithInfo,
    subtitle: x.oem
      ? `OEM: ${x.oem} • Арт.: ${x.article}`
      : `Арт.: ${x.article}`,
    url: `/product/${x.article}`,
    score: 1,
  }));
}

// По VIN: если будете поддерживать
async function searchByVIN(
  vin: string,
  signal?: AbortSignal
): Promise<SuggestItem[]> {
  // Подставьте ваш эндпоинт для VIN (если есть). Заглушка:
  return [
    {
      id: `vin-${vin}`,
      label: `Показать детали и совместимые запчасти по VIN ${vin}`,
      subtitle: "Подбор по VIN",
      url: `/vin/${vin}`,
      score: 10,
    },
  ];
}

export const SearchInput: React.FC = () => {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggests, setSuggests] = useState<SuggestItem[]>([]);
  const [highlighted, setHighlighted] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const cacheRef = useRef<Map<string, SuggestItem[]>>(new Map());

  // Недавние из localStorage
  const recents = useMemo<string[]>(() => {
    try {
      const raw = localStorage.getItem(LS_RECENTS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, [open]); // перечитываем при открытии

  // Закрытие по клику вне
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Дебаунс поиска
  useEffect(() => {
    if (!open) return;

    const raw = value.trim();
    if (!raw) {
      setSuggests([]);
      return;
    }

    if (raw.length < MIN_QUERY_LEN) {
      setSuggests([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const t = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const variants = buildQueryVariants(raw);

        // Кеш
        const fromCache: SuggestItem[] = [];
        const toFetch: string[] = [];
        for (const v of variants) {
          const cached = cacheRef.current.get(v);
          if (cached) fromCache.push(...cached);
          else toFetch.push(v);
        }

        let results: SuggestItem[] = [...fromCache];

        // VIN приоритетом
        if (looksLikeVIN(raw)) {
          const vinItems = await searchByVIN(raw, controller.signal);
          results = [...vinItems, ...results];
        }

        // Выполняем строгий поиск для оставшихся вариантов
        const fetchedArrays = await Promise.all(
          toFetch.map((v) => searchStrict(v, controller.signal).catch(() => []))
        );

        fetchedArrays.forEach((arr, i) => {
          cacheRef.current.set(toFetch[i], arr);
        });

        for (const arr of fetchedArrays) results.push(...arr);

        // Объединяем по id/url, ранжируем простыми баллами
        const seen = new Set<string>();
        const merged: SuggestItem[] = [];
        for (const item of results) {
          const key = item.id || item.url;
          if (seen.has(key)) continue;
          seen.add(key);

          // Чуть повышаем оценку за точное совпадение артикула/OEM в label
          let score = item.score || 0;
          const labelNorm = item.label.toLowerCase();
          if (labelNorm.includes(raw.toLowerCase())) score += 2;
          merged.push({ ...item, score });
        }

        // Сортировка: по score, затем по длине лейбла
        merged.sort(
          (a, b) => b.score - a.score || a.label.length - b.label.length
        );

        // Подсветка
        const withMarks = merged.map((m) => ({
          ...m,
          matchedRanges: markMatches(m.label, raw),
        }));

        setSuggests(withMarks.slice(0, 12));
        setHighlighted(0);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(t);
  }, [value, open]);

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, Math.max(0, suggests.length - 1)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      if (value.trim().length < MIN_QUERY_LEN) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      const item = suggests[highlighted];
      if (item) handleSelect(item);
      else if (value.trim()) {
        // Если нет подсказок, перейти на общую страницу поиска
        window.location.href = `/search?q=${encodeURIComponent(value.trim())}`;
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const saveRecent = (q: string) => {
    try {
      const raw = localStorage.getItem(LS_RECENTS_KEY);
      const arr: string[] = raw ? JSON.parse(raw) : [];
      const next = [q, ...arr.filter((x) => x !== q)].slice(0, MAX_RECENTS);
      localStorage.setItem(LS_RECENTS_KEY, JSON.stringify(next));
    } catch {}
  };

  const handleSelect = (item: SuggestItem) => {
    saveRecent(value.trim());
    window.location.href = item.url;
  };

  const renderHighlighted = (
    label: string,
    ranges?: Array<[number, number]>
  ) => {
    if (!ranges || ranges.length === 0) return label;
    const parts: React.ReactNode[] = [];
    let last = 0;
    ranges.forEach(([s, e], idx) => {
      if (s > last)
        parts.push(
          <span key={`t-${idx}-${last}`}>{label.slice(last, s)}</span>
        );
      parts.push(
        <mark key={`m-${idx}-${s}`} className="bg-yellow-200">
          {label.slice(s, e)}
        </mark>
      );
      last = e;
    });
    if (last < label.length)
      parts.push(<span key={`t-end`}>{label.slice(last)}</span>);
    return parts;
  };

  return (
    <div className="relative w-full mx-auto" ref={containerRef}>
      <div className="flex items-center rounded-[10px] border bg-blue_main pl-[2px] lg:p-[2px] overflow-hidden">
        <input
          type="text"
          placeholder="Введите OEM, артикул или название"
          className="w-full p-[5px] lg:p-[10px] pl-3 outline-none rounded-lg"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          aria-autocomplete="list"
          aria-expanded={open}
          aria-activedescendant={open ? `opt-${highlighted}` : undefined}
        />
        <button
          className="text-white px-5 py-[9px] lg:py-[13px]"
          onClick={() => {
            if (value.trim()) {
              saveRecent(value.trim());
              window.location.href = `/search?q=${encodeURIComponent(
                value.trim()
              )}`;
            } else {
              setOpen((o) => !o);
            }
          }}
          aria-label="Найти"
          disabled={value.trim().length < MIN_QUERY_LEN}
        >
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
            <path
              d="M19 19L15 15M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div
        className={`absolute left-0 w-full mt-2 bg-white rounded-lg shadow-lg transition-all duration-200 ease-in-out z-50
          ${
            open
              ? "opacity-100 scale-100 visible"
              : "opacity-0 scale-95 invisible"
          }`}
        role="listbox"
      >
        {!value.trim() && (
          <>
            <p className="px-4 pt-4 text-sm text-gray-500">Часто ищут</p>
            <ul className="p-2">
              {POPULAR_ITEMS.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setValue(item);
                    setOpen(true);
                  }}
                  role="option"
                >
                  <svg
                    className="w-4 h-4 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M19 19L15 15M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {recents.length > 0 && (
              <>
                <p className="px-4 pt-2 text-sm text-gray-500">Недавние</p>
                <ul className="p-2">
                  {recents.map((q) => (
                    <li
                      key={q}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setValue(q);
                        setOpen(true);
                      }}
                      role="option"
                    >
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </>
        )}

        {value.trim() && value.trim().length < MIN_QUERY_LEN && (
          <div className="px-4 py-3 text-sm text-gray-500">
            Введите минимум 2 символа для поиска.
          </div>
        )}

        {value.trim().length >= MIN_QUERY_LEN && (
          <>
            {loading && (
              <div className="px-4 py-3 text-sm text-gray-500">Поиск…</div>
            )}

            {!loading && suggests.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-500">
                Ничего не найдено. Попробуйте другой запрос.
              </div>
            )}

            {!loading && suggests.length > 0 && (
              <ul className="py-2">
                {suggests.map((s, idx) => (
                  <li
                    id={`opt-${idx}`}
                    key={s.id || s.url}
                    className={`px-4 py-2 cursor-pointer ${
                      idx === highlighted ? "bg-gray-100" : "hover:bg-gray-50"
                    }`}
                    onMouseEnter={() => setHighlighted(idx)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelect(s)}
                    role="option"
                    aria-selected={idx === highlighted}
                  >
                    <div className="text-sm text-gray-900">
                      {renderHighlighted(s.label, s.matchedRanges)}
                    </div>
                    {s.subtitle && (
                      <div className="text-xs text-gray-500 mt-0.5">
                        {s.subtitle}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}

            <div className="px-4 py-2 border-t text-right">
              <Link
                href={`/search?q=${encodeURIComponent(value.trim())}`}
                onClick={() => dispatch(startLoading())}
                className="text-sm text-blue-600 hover:underline"
              >
                Открыть все результаты
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
