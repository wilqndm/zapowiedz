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
  matchType: MatchType;
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

  const competitionLogo =
    matchType === "Liga"
      ? "/competitions/liga.png"
      : "/competitions/puchar.png";

  return (
    <div className="select-none">
      <div
        ref={containerRef}
        id="poster"
        className="relative w-[1240px] h-[1754px] ring-1 ring-white/10 shadow-2xl bg-black"
        style={{ aspectRatio: "1240/1754" }}
      >
        {/* TŁO */}
        <div className="absolute inset-0">
          {isDataUrl ? (
            <img
              src={backgroundUrl || ""}
              alt="Tło"
              className="w-full h-full object-cover"
              draggable={false}
            />
          ) : (
            <Image
              src={backgroundUrl || "/background/example.jpg"}
              alt="Tło"
              fill
              priority
              sizes="1240px"
              className="object-cover"
              unoptimized
            />
          )}
        </div>

        {/* LOGO ROZGRYWEK */}
        <div
          className="absolute z-[60]"
          style={{ top: 30, left: 30 }}
          aria-hidden="true"
        >
          <img
            src={competitionLogo}
            alt=""
            className="block h-[300px] w-auto"
            draggable={false}
          />
        </div>

        {/* PASEK GÓRNY */}
        <div
          className="absolute"
          style={{
            left: 230,
            top: 170,
            height: 100,
            width: 'auto',
            zIndex: 30,
          }}
        >
          <div
            className={clsx(
              "h-full flex items-center justify-center font-sans uppercase"
            )}
            style={{
              color: "#d60000",
              fontSize: 100,
              textShadow: "6px 0 0 #222",
              fontWeight: 700,
              letterSpacing: "0.03em",
            }}
          >
            {round?.trim() ? round : "—"}
          </div>
        </div>

        {/* TREŚĆ: HERBY + VS + NAZWY */}
        <div className="absolute inset-0 pt-32 pb-48 px-12">
          <div className="h-full grid grid-cols-[1fr_auto_1fr] mt-[110px]">
            {/* GOSPODARZ */}
            <div className="flex flex-col items-center justify-center gap-12">
              <div className="relative w-[340px] h-[340px]">
                {host?.logo ? (
                  <Image
                    src={host.logo}
                    alt={host.name}
                    fill
                    sizes="340px"
                    className="object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.95)] [filter:drop-shadow(0_0_24px_rgba(255,255,255,0.7))]"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-white/10 ring-1 ring-white/20" />
                )}
              </div>
              <div className="text-center mt-4">
                <div className="text-5xl font-bold text-shadow-lg">{host?.name?.toUpperCase() ?? "—"}</div>
                <div className="mt-2 text-white/60 text-2xl uppercase tracking-wide">Gospodarz</div>
              </div>
            </div>

            {/* VS */}
            <div className="flex items-center justify-center px-6 mt-4">
              <div
                className="
                  select-none
                  uppercase
                  font-black
                  leading-none
                  text-white/85
                  text-shadow-lg
                  tracking-[-0.05em]
                "
                style={{ fontSize: 110, letterSpacing: "-0.07em" }}
                aria-hidden="true"
                title="Pojedynek"
              >
                VS
              </div>
            </div>

            {/* GOŚĆ */}
            <div className="flex flex-col items-center justify-center gap-12">
              <div className="relative w-[340px] h-[340px]">
                {guest?.logo ? (
                  <Image
                    src={guest.logo}
                    alt={guest.name}
                    fill
                    sizes="340px"
                    className="object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.95)] [filter:drop-shadow(0_0_24px_rgba(255,255,255,0.7))]"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-white/10 ring-1 ring-white/20" />
                )}
              </div>
              <div className="text-center mt-4">
                <div className="text-5xl font-bold text-shadow-lg">{guest?.name?.toUpperCase() ?? "—"}</div>
                <div className="mt-2 text-white/60 text-2xl uppercase tracking-wide">Gość</div>
              </div>
            </div>
          </div>
        </div>

        {/* DÓŁ: ADRES + DATA + GODZINA */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="px-12 py-16 bg-black/50 backdrop-blur-md">
            <div className="flex items-center justify-center gap-16 flex-wrap text-center">
              {/* Adres stadionu gospodarza */}
              <div className="flex items-center gap-4 min-w-0">
                <MapPinIcon className="w-12 h-12 opacity-95" />
                <span className="text-4xl font-normal text-white drop-shadow-md truncate max-w-[50vw]">{address}</span>
              </div>
              {/* Data */}
              <div className="flex items-center gap-4">
                <CalendarIcon className="w-12 h-12 opacity-95" />
                <span className="text-4xl font-normal text-white drop-shadow-md">{dateStr}</span>
              </div>
              {/* Godzina */}
              <div className="flex items-center gap-4">
                <ClockIcon className="w-12 h-12 opacity-95" />
                <span className="text-4xl font-normal text-white drop-shadow-md">{timeStr}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
