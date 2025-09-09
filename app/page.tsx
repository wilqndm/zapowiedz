"use client";

import { useMemo, useRef, useState } from "react";
import Poster, { type MatchType } from "@/components/Poster";
import Controls from "@/components/Controls";
import { teams } from "@/lib/teams";
import * as htmlToImage from "html-to-image";

const TRANSPARENT_PX =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAOOfu9kAAAAASUVORK5CYII=";

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

    // Zbieramy wszystkie obrazki z plakatu
    const imgs = Array.from(node.querySelectorAll("img")) as HTMLImageElement[];

    // a) nadaj CORS atrybut (nie szkodzi local/data:)
    for (const img of imgs) {
      img.setAttribute("crossorigin", "anonymous");
    }

    const isSameOrigin = (url: string) => {
      try {
        const u = new URL(url, location.href);
        return u.origin === location.origin || u.protocol === "data:";
      } catch {
        return true; // traktuj jako lokalny, jeśli nie parsuje się
      }
    };

    // b) poczekaj na wczytanie, zamień cross‑origin na data: (jeśli trzeba)
    await Promise.all(
      imgs.map(async (img) => {
        if (!img.complete || img.naturalWidth === 0) {
          await new Promise<void>((resolve) => {
            const done = () => resolve();
            img.addEventListener("load", done, { once: true });
            img.addEventListener("error", done, { once: true });
          });
        }
        if (isSameOrigin(img.src)) return;

        try {
          const resp = await fetch(img.src, { mode: "cors", credentials: "omit" });
          const blob = await resp.blob();
          const dataUrl: string = await new Promise((res) => {
            const r = new FileReader();
            r.onloadend = () => res(r.result as string);
            r.readAsDataURL(blob);
          });
          img.src = dataUrl;
        } catch {
          // jeśli się nie uda – zostawiamy jak jest; placeholder poratuje
        }
      })
    );

    // c) spróbuj zdekodować obrazy (Safari/iOS)
    await Promise.all(
      imgs.map((img) => (img as any).decode?.().catch(() => {}) ?? Promise.resolve())
    );

    const options = {
      cacheBust: true,
      pixelRatio: 1,
      width: 1200,
      height: 630,
      backgroundColor: "#000000",
      imagePlaceholder: TRANSPARENT_PX
    } as const;

    try {
      const blob = await htmlToImage.toBlob(node, options);
      if (!blob) throw new Error("Blob conversion returned null");

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const hostSlug = host?.id ?? "gospodarz";
      const guestSlug = guest?.id ?? "gosc";
      link.download = `zapowiedz-${hostSlug}-vs-${guestSlug}.png`;
      link.href = url;

      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    } catch (blobErr) {
      // Fallback – dataURL
      try {
        const dataUrl = await htmlToImage.toPng(node, options);
        const a = document.createElement("a");
        const hostSlug = host?.id ?? "gospodarz";
        const guestSlug = guest?.id ?? "gosc";
        a.download = `zapowiedz-${hostSlug}-vs-${guestSlug}.png`;
        a.href = dataUrl;

        document.body.appendChild(a);
        a.click();
        a.remove();
      } catch (e) {
        // Ostatnia deska ratunku: nowa karta, ręczny zapis
        try {
          const dataUrl = await htmlToImage.toPng(node, options);
          window.open(dataUrl, "_blank");
        } catch {
          alert("Nie udało się wygenerować obrazu do pobrania.");
          console.error(e || blobErr);
        }
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
