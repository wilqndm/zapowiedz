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

        const dataUrl = await htmlToImage.toPng(node, {
          cacheBust: true,
          pixelRatio: 1,
          width: 1200,
          height: 630,
          backgroundColor: "#000000"
        });

        const link = document.createElement("a");
        const hostSlug = host?.id ?? "gospodarz";
        const guestSlug = guest?.id ?? "gosc";
        const base = `zapowiedz-${hostSlug}-vs-${guestSlug}`;
        link.download = `${base}.png`;
        link.href = dataUrl;
        link.click();
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
