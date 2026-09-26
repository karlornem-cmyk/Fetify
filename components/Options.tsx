import { DEPARTMENTS, EVENTS, TRADES } from "@/lib/constants";

export function DepartmentOptions() {
  return DEPARTMENTS.map((d) => (
    <option key={d} value={d}>
      {d}
    </option>
  ));
}

export function TradeOptions() {
  return TRADES.map((t) => (
    <option key={t} value={t}>
      {t}
    </option>
  ));
}

export function EventOptions() {
  return EVENTS.map((e) => (
    <option key={e} value={e}>
      {e}
    </option>
  ));
}
