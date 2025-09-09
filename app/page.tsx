"use client";

    import { useMemo, useRef, useState } from "react";
    import Poster, { type MatchType } from "@/components/Poster";
    import Controls from "@/components/Controls";
    import { teams } from "@/lib/teams";
    import * as htmlToImage from "html-to-image";

    export default function Page() {
      const [hostId, setHostId] = useState<string | null>("");
      const [guestId, setGuestId] = useState<string | null>("");
      const [dateISO, setDateISO] = useState<string | null>("");
      const [timeHHMM, setTimeHHMM] = useState<string | null>("");
      const [round, setRound] = useState<string | null>("");

      const [matchType, setMatchType] = useState<MatchType>("Liga");
      const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);

      const host = useMemo(() => teams.find(t => t.id === hostId) ?? null, [hostId]);
      const guest = useMemo(() => teams.find(t => t.id === guestId) ?? null, [guestId]);

      const posterRef = useRef<HTMLDivElement>(null);

async function handleDownload() {
  const node = posterRef.current;
  if (!node) return;

  // 1) Poczekaj aż obrazki się zdekodują (ważne dla Safari)
  const imgs = Array.from(node.querySelectorAll('img'));
  await Promise.all(
    imgs.map((img) =>
      // decode() jest eleganckie; fallback na load dla starszych implementacji
      (img as any).decode?.() ??
      new Promise<void>((res, rej) => {
        if (img.complete) return res();
        img.addEventListener('load', () => res(), { once: true });
        img.addEventListener('error', () => rej(new Error('Image load error')), { once: true });
      })
    )
  );

  // 2) Spróbuj najpierw BLOB (lepsza kompatybilność niż dataURL)
  try {
    const blob = await htmlToImage.toBlob(node, {
      cacheBust: true,
      pixelRatio: 1,
      width: 1200,
      height: 630,
      backgroundColor: "#000000"
    });
    if (!blob) throw new Error("Blob conversion failed");

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const hostSlug = (host?.id ?? "gospodarz").toString();
    const guestSlug = (guest?.id ?? "gosc").toString();
    link.download = `zapowiedz-${hostSlug}-vs-${guestSlug}.png`;
    link.href = url;

    // Safari/chrome-headless: lepiej chwilowo dodać do DOM
    document.body.appendChild(link);
    link.click();
    link.remove();

    // Sprzątanie URL
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  } catch (blobErr) {
    // 3) Fallback – otwórz w nowej karcie jako dataURL (np. iOS, nietypowe profile)
    try {
      const dataUrl = await htmlToImage.toPng(node, {
        cacheBust: true,
        pixelRatio: 1,
        width: 1200,
        height: 630,
        backgroundColor: "#000000"
      });
      // Na iOS pobranie może być ignorowane – pokazujemy w nowej karcie do ręcznego zapisu
      const w = window.open(dataUrl, "_blank");
      if (!w) {
        // Jeszcze jeden plan B: wymuś kliknięcie na <a>
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = "plakat.png";
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (e) {
      alert("Nie udało się wygenerować obrazu do pobrania.");
      // (opcjonalnie: wyloguj do konsoli szczegóły)
      console.error(e);
    }
  }
}


      return (
        <main className="min-h-screen w-full">
          <div className="max-w-[1440px] mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8">
            <div className="overflow-auto">
              <Poster
                containerRef={posterRef}
                backgroundUrl={backgroundUrl}
                host={host}
                guest={guest}
                dateISO={dateISO || null}
                timeHHMM={timeHHMM || null}
                round={round || null}
                matchType={matchType}
              />
            </div>

            <Controls
              hostId={hostId || ""}
              guestId={guestId || ""}
              setHostId={setHostId}
              setGuestId={setGuestId}
              dateISO={dateISO || ""}
              setDateISO={setDateISO}
              timeHHMM={timeHHMM || ""}
              setTimeHHMM={setTimeHHMM}
              round={round || ""}
              setRound={setRound}
              matchType={matchType}
              setMatchType={setMatchType}
              backgroundUrl={backgroundUrl}
              setBackgroundUrl={setBackgroundUrl}
              onDownload={handleDownload}
            />
          </div>
        </main>
      );
    }
