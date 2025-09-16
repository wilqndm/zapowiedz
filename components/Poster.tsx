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
  const address = host?.address?.trim() ? host!.address! : "—";
  const dateStr = formatFullDatePL(dateISO);
  const timeStr = safeTimeHHMM(timeHHMM);

  const isDataUrl = !!backgroundUrl?.startsWith("data:");

  // Ścieżka do logotypu rozgrywek (pliki w /public/competitions/)
  const competitionLogo =
    matchType === "Liga"
      ? "/competitions/liga.png"
      : "/competitions/puchar.png";

  return (
    <div className="select-none">
      <div
        ref={containerRef}
        id="poster"
        className="relative w-[940px] h-[810px] overflow-hidden ring-1 ring-white/10 shadow-2xl bg-black"
        style={{ aspectRatio: "940/810" }}
      >
        {/* TŁO */}
        <div className="absolute inset-0">
          {isDataUrl ? (
            // Dla data: zwykły <img> (stabilniejsze dla html-to-image)
            <img
              src={backgroundUrl || ""}
              alt="Tło"
              className="w-full h-full object-cover"
              draggable={false}
            />
          ) : (
            // Pozostałe: next/image z unoptimized
            <Image
              src={backgroundUrl || "/background/example.jpg"}
              alt="Tło"
              fill
              priority
              sizes="940px"
              className="object-cover"
              unoptimized
            />
          )}
          {/* Usunięte przyciemnienie dla czytelności */}
          {/* <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80" /> */}
        </div>

        {/* NAKŁADKA: LOGO ROZGRYWEK (5px, 5px) — bez rozciągania (h=32px, w=auto) */}
        <div
          className="absolute z-[60]"
          style={{ top: 5, left: 5 }}
          aria-hidden="true"
        >
          <img
            src={competitionLogo}
            alt=""
            className="block h-[128px] w-auto"
            draggable={false}
          />
        </div>

        {/* PASEK GÓRNY: tylko tekst, bez koloru tła */}
        <div className="absolute left-0 top-[15px] h-[48px]" style={{ width: '90%' }}>
          <div
            className={clsx(
              "h-full flex items-center justify-center text-white text-xl font-semibold"
            )}
            style={{
              // Usunięty kolor tła i clipPath
            }}
          >
            Kolejka {round?.trim() ? round : "—"}
          </div>
        </div>

        {/* TREŚĆ: HERBY + „VS” + NAZWY */}
        <div className="absolute inset-0 pt-16 pb-28 px-8">
          {/* 3‑kolumnowa siatka: gospodarz | VS | gość */}
          <div className="h-full grid grid-cols-[1fr_auto_1fr] mt-[30px]">
            {/* GOSPODARZ */}
            <div className="flex flex-col items-center justify-center gap-6">
              <div className="relative w-56 h-56">
                {host?.logo ? (
                  // Delikatna biała poświata
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

            {/* VS – białe z lekką przezroczystością */}
            <div className="flex items-center justify-center px-4">
              <div
                className="
                  select-none
                  uppercase
                  font-black
                  leading-none
                  tracking-[0.2em]
                  text-white/85
                  text-shadow-lg
                "
                style={{ fontSize: 100 }}
                aria-hidden="true"
                title="Pojedynek"
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

        {/* DÓŁ: ADRES + DATA + GODZINA (wyśrodkowane) */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="px-8 py-5 bg-black/35 backdrop-blur-md">
            <div className="flex items-center justify-center gap-8 flex-wrap text-center">
              {/* Adres stadionu gospodarza */}
              <div className="flex items-center gap-2 min-w-0">
                <MapPinIcon className="w-6 h-6 opacity-90" />
                <span className="text-lg truncate max-w-[40vw]">{address}</span>
              </div>

              {/* separator (kropka) – ukryty na bardzo wąskich ekranach */}
              <span className="hidden sm:inline text-white/50">•</span>

              {/* Data */}
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-6 h-6 opacity-90" />
                <span className="text-lg">{dateStr}</span>
              </div>

              <span className="hidden sm:inline text-white/50">•</span>

              {/* Godzina */}
              <div className="flex items-center gap-2">
                <ClockIcon className="w-6 h-6 opacity-90" />
                <span className="text-lg">{timeStr}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
