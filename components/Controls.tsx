"use client";

    import { teams } from "@/lib/teams";
    import { useId, useRef } from "react";

    type Props = {
      hostId: string | null;
      guestId: string | null;
      setHostId: (id: string | null) => void;
      setGuestId: (id: string | null) => void;
      dateISO: string | null;
      setDateISO: (d: string | null) => void;
      timeHHMM: string | null;
      setTimeHHMM: (t: string | null) => void;
      round: string | null;
      setRound: (r: string | null) => void;
      matchType: "Liga" | "Puchar";
      setMatchType: (t: "Liga" | "Puchar") => void;
      backgroundUrl: string | null;
      setBackgroundUrl: (url: string | null) => void;
      onDownload: () => Promise<void>;
    };

    export default function Controls({
      hostId, guestId, setHostId, setGuestId,
      dateISO, setDateISO, timeHHMM, setTimeHHMM,
      round, setRound, matchType, setMatchType,
      backgroundUrl, setBackgroundUrl,
      onDownload
    }: Props) {
      const bgInputId = useId();
      const fileRef = useRef<HTMLInputElement>(null);

      function onBgChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          setBackgroundUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }

      return (
        <aside className="w-full max-w-md bg-white/5 border border-white/10 rounded-xl p-5 grid gap-4">
          <div className="text-lg font-semibold">Ustawienia</div>

          {/* Gospodarz */}
          <label className="grid gap-1">
            <span className="text-sm text-white/70">Gospodarz</span>
            <select
              value={hostId ?? ""}
              onChange={(e) => setHostId(e.target.value || null)}
              className="bg-neutral-900 border border-white/10 rounded-lg px-3 py-2"
            >
              <option value="">— wybierz —</option>
              {teams.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </label>

          {/* Gość */}
          <label className="grid gap-1">
            <span className="text-sm text-white/70">Gość</span>
            <select
              value={guestId ?? ""}
              onChange={(e) => setGuestId(e.target.value || null)}
              className="bg-neutral-900 border border-white/10 rounded-lg px-3 py-2"
            >
              <option value="">— wybierz —</option>
              {teams.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-4">
            {/* Data */}
            <label className="grid gap-1">
              <span className="text-sm text-white/70">Data</span>
              <input
                type="date"
                value={dateISO ?? ""}
                onChange={(e) => setDateISO(e.target.value || null)}
                className="bg-neutral-900 border border-white/10 rounded-lg px-3 py-2"
              />
            </label>

            {/* Godzina */}
            <label className="grid gap-1">
              <span className="text-sm text-white/70">Godzina</span>
              <input
                type="time"
                value={timeHHMM ?? ""}
                onChange={(e) => setTimeHHMM(e.target.value || null)}
                className="bg-neutral-900 border border-white/10 rounded-lg px-3 py-2"
              />
            </label>
          </div>

          {/* Kolejka */}
          <label className="grid gap-1">
            <span className="text-sm text-white/70">Kolejka</span>
            <input
              type="text"
              placeholder="np. 7"
              value={round ?? ""}
              onChange={(e) => setRound(e.target.value)}
              className="bg-neutral-900 border border-white/10 rounded-lg px-3 py-2"
            />
          </label>

          {/* Typ meczu (kolor paska) */}
          <label className="grid gap-1">
            <span className="text-sm text-white/70">Typ meczu (kolor paska)</span>
            <select
              value={matchType}
              onChange={(e) => setMatchType(e.target.value as any)}
              className="bg-neutral-900 border border-white/10 rounded-lg px-3 py-2"
            >
              <option value="Liga">Liga (czerwony)</option>
              <option value="Puchar">Puchar (zielony)</option>
            </select>
          </label>

          {/* Tło */}
          <div className="grid gap-2">
            <div className="text-sm text-white/70">Tło plakatu (1200×630)</div>
            <div className="flex gap-2">
              <input
                id={bgInputId}
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={onBgChange}
                className="hidden"
              />
              <button
                onClick={() => fileRef.current?.click()}
                className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10"
              >
                Wgraj plik…
              </button>
              {backgroundUrl && (
                <button
                  onClick={() => setBackgroundUrl(null)}
                  className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10"
                >
                  Wyczyść
                </button>
              )}
            </div>
          </div>

          {/* Pobierz PNG */}
          <button
            onClick={onDownload}
            className="mt-2 py-2.5 rounded-lg bg-white text-neutral-900 font-semibold hover:bg-white/90"
          >
            Pobierz PNG (1200×630)
          </button>

          <div className="text-xs text-white/50 leading-relaxed">
            <p>Herby PNG umieść w <code>/public/logos</code> i upewnij się, że nazwy plików odpowiadają <em>slugom</em> w <code>lib/teams.ts</code>.</p>
            <p>Adres stadionu gospodarza możesz uzupełnić w pliku <code>lib/teams.ts</code> – wtedy pojawi się automatycznie na plakacie.</p>
          </div>
        </aside>
      );
    }
