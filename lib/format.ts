export function formatFullDatePL(dateISO: string | null): string {
      if (!dateISO) return "—";
      const [y, m, d] = dateISO.split("-").map(Number);
      if (!y || !m || !d) return "—";
      const date = new Date(Date.UTC(y, m - 1, d));
      const formatter = new Intl.DateTimeFormat("pl-PL", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Europe/Warsaw"
      });
      const s = formatter.format(date);
      return s.charAt(0).toUpperCase() + s.slice(1);
    }

    export function safeTimeHHMM(time: string | null): string {
      if (!time) return "—";
      return time;
    }
