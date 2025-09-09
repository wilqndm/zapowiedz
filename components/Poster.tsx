"use client";

import Image from "next/image";
import { Team } from "@/lib/teams";
import { CalendarIcon, ClockIcon, MapPinIcon } from "./Icons";
import { formatFullDatePL, safeTimeHHMM } from "@/lib/format";
import clsx from "clsx";
import React from "react";

export type MatchType = "Liga" | "Puchar";

type Props = {
  containerRef: React.RefObject<HTMLDivElement>;
  backgroundUrl?: string | null;
  host: Team | null;
  guest: Team | null;
  dateISO: string | null;  // YYYY-MM-DD
  timeHHMM: string | null; // HH:MM
  round: string | null;    // np. "7"
  matchType: MatchType;    // wpływa na kolor paska u góry
};

export default function Poster({
  containerRef,
  backgroundUrl,
  host,
  guest,
  dateISO,
  timeHHMM,
  round,
  matchType
}: Props) {
  const topBarColor = matchType === "Liga" ? "bg-liga" : "bg-puchar";
  const address = host?.address?.trim() ? host!.address! : "—";
  const dateStr = formatFullDatePL(dateISO);
  const timeStr = safeTimeHHMM(timeHHMM);

  const isDataUrl = !!backgroundUrl?.startsWith("data:");

  return (
    <div className="select-none">
      <div
        ref={containerRef}
        id="poster"
        className="relative w-[1200px] h-[630px] overflow-hidden rounded-xl ring-1 ring-white/10 shadow-2xl bg-black"
        style={{ aspectRatio: "1200/630" }}
      >
        {/* TŁO */}
        <div className="absolute inset-0">
          {isDataUrl ? (
            // Używamy zwykłego <img> dla data: URL (stabilniejsze przy generowaniu obrazu do pobrania)
            <img
              src={backgroundUrl || ""}
              alt="Tło"
              className="w-full h-full object-cover"
              draggable={false}
            />
          ) : (
            // Pozostałe przypadki: next/image (z unoptimized, aby nie kolidować z przechwytywaniem)
            <Image
              src={backgroundUrl || "/background/example.jpg"}
              alt="Tło"
              fill
              priority
              sizes="1200px"
              className="object-cover"
              unoptimized
            />
          )}
          {/* Przyciemnienie dla czytelności */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80" />
        </div>

        {/* PASEK GÓRNY: KOLEJKA + TYP */}
        <div className={clsx("absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-8", topBarColor)}>
          <div className="text-white/80 uppercase tracking-wide text-sm">{matchType}</div>
          <div className="text-2xl font-semibold">Kolejka {round?.trim() ? round : "—"}</div>
          <div className="opacity-0">.</div>
        </div>

        {/* TREŚĆ: HERBY + „VS” + NAZWY */}
        <div className="absolute inset-0 pt-16 pb-28 px-8">
          {/* 3-kolumnowa siatka: gospodarz | VS | gość */}
          <div className="h-full grid grid-cols-[1fr_auto_1fr]">
            {/* GOSPODARZ */}
            <div className="flex flex-col items-center justify-center gap-6">
              <div className="relative w-56 h-56">
                {host?.logo ? (
                  // Biała poświata dzięki cieniom
                  <Image
                    src={host.logo}
                    alt={host.name}
                    fill
                    sizes="224px"
                    className="object-contain drop-shadow-[0_0_6px_rgba(255,255,255,0.95)] [filter:drop-shadow(0_0_12px_rgba(255,255,255,0.7))]"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-white/10 ring-1 ring-white/20" />
                )}
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-shadow-lg">{host?.name ?? "—"}</div>
                <div className="mt-1 text-white/60 text-sm uppercase tracking-wide">Gospodarz</div>
              </div>
            </div>

            {/* VS */}
            <div className="flex items-center justify-center px-4">
              <div
                className="
                  select-none
                  uppercase
                  font-black
                  leading-none
                  tracking-[0.2em]
                  bg-gradient-to-b from-white to-white/70
                  text-transparent bg-clip-text
                  text-shadow-lg
                "
                // duży tytuł na płótnie 1200x630
                style={{ fontSize: 120 }}
                aria-hidden="true"
              >
                VS
              </div>
            </div>

            {/* GOŚĆ */}
            <div className="flex flex-col items-center justify-center gap-6">
              <div className="relative w-56 h-56">
                {guest?.logo ? (
                  <Image
                    src={guest.logo}
                    alt={guest.name}
                    fill
                    sizes="224px"
                    className="object-contain drop-shadow-[0_0_6px_rgba(255,255,255,0.95)] [filter:drop-shadow(0_0_12px_rgba(255,255,255,0.7))]"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-white/10 ring-1 ring-white/20" />
                )}
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-shadow-lg">{guest?.name ?? "—"}</div>
                <div className="mt-1 text-white/60 text-sm uppercase tracking-wide">Gość</div>
              </div>
            </div>
          </div>
        </div>

        {/* DÓŁ: ADRES + DATA + GODZINA */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="px-8 py-5 flex items-center justify-between gap-4 bg-black/35 backdrop-blur-md">
            {/* Adres stadionu gospodarza */}
            <div className="flex items-center gap-3 min-w-0">
              <MapPinIcon className="w-6 h-6 opacity-90" />
              <div className="text-lg truncate">{address}</div>
            </div>
            {/* Data */}
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-6 h-6 opacity-90" />
              <div className="text-lg">{dateStr}</div>
            </div>
            {/* Godzina */}
            <div className="flex items-center gap-3">
              <ClockIcon className="w-6 h-6 opacity-90" />
              <div className="text-lg">{timeStr}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
