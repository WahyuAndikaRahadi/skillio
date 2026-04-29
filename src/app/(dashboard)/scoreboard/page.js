import React from "react";
import prisma from "@/lib/prisma";
import { Trophy, Star, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import ScoreboardShell from "../../../components/scoreboard/Scoreboardshell";

export const dynamic = "force-dynamic";

function XpBadge({ value, large = false }) {
  return (
    <div className={cn("flex items-center gap-1", large ? "gap-1.5" : "gap-1")}>
      <div
        className={cn(
          "rounded-full flex items-center justify-center font-black text-white bg-primary-blue shrink-0",
          large ? "w-5 h-5 text-[8px]" : "w-4 h-4 text-[7px]"
        )}
      >
        XP
      </div>
      <span
        className={cn(
          "font-black tabular-nums text-dark-blue",
          large ? "text-lg" : "text-sm"
        )}
      >
        {value.toLocaleString()}
      </span>
    </div>
  );
}

function Avatar({ user, size = "md" }) {
  const s = {
    sm: "w-9 h-9 text-sm",
    md: "w-12 h-12 text-base",
    lg: "w-16 h-16 text-xl",
  }[size];

  return (
    <div
      className={cn(
        s,
        "rounded-2xl overflow-hidden shrink-0 flex items-center justify-center font-black",
        "bg-skillio-100 text-primary-blue border border-skillio-200"
      )}
    >
      {user.image ? (
        <img
          src={user.image}
          alt={user.name ?? "avatar"}
          className="w-full h-full object-cover"
        />
      ) : (
        (user.name?.[0] ?? "U").toUpperCase()
      )}
    </div>
  );
}

function PodiumCard({ user, rank, platformH }) {
  const isFirst = rank === 1;
  const medal = {
    1: {
      emoji: "🥇",
      ring: "ring-yellow-300",
      platform: "bg-yellow-50/80 border-yellow-200/60",
      label: "bg-yellow-100 text-yellow-700",
    },
    2: {
      emoji: "🥈",
      ring: "ring-slate-300",
      platform: "bg-slate-50/80 border-slate-200/60",
      label: "bg-slate-100 text-slate-600",
    },
    3: {
      emoji: "🥉",
      ring: "ring-orange-300",
      platform: "bg-orange-50/80 border-orange-200/60",
      label: "bg-orange-100 text-orange-700",
    },
  }[rank];

  const animationDelay = {
    2: "0ms",
    1: "120ms",
    3: "240ms",
  }[rank];

  return (
    <div
      className="flex flex-col items-center gap-2"
      style={{
        animation: "podiumRiseUp 700ms cubic-bezier(0.34, 1.56, 0.64, 1) both",
        animationDelay: animationDelay,
      }}
    >
      <span className={cn("leading-none", isFirst ? "text-3xl" : "text-2xl")}>
        {medal.emoji}
      </span>

      <div className={cn("rounded-2xl ring-2", medal.ring)}>
        <Avatar user={user} size={isFirst ? "lg" : "md"} />
      </div>

      <p
        className={cn(
          "font-bold tracking-tight text-white text-center leading-tight max-w-[110px] break-words",
          isFirst ? "text-sm" : "text-xs"
        )}
      >
        {user.name ?? "Anonim"}
      </p>

      <div className="flex items-center gap-1">
        <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[7px] font-black text-white">
          XP
        </div>
        <span
          className={cn(
            "font-black tabular-nums text-white",
            isFirst ? "text-base" : "text-sm"
          )}
        >
          {user.xp.toLocaleString()}
        </span>
      </div>

      <span
        className={cn(
          "text-[10px] font-black rounded-full px-2.5 py-0.5 uppercase tracking-widest",
          medal.label
        )}
      >
        #{rank}
      </span>

      <div
        className={cn("w-full rounded-t-xl border-t border-x", medal.platform)}
        style={{ height: platformH }}
      />
    </div>
  );
}

function TableRow({ user, index }) {
  const rankStyle =
    index === 0
      ? "text-yellow-600 bg-yellow-50"
      : index === 1
        ? "text-slate-500 bg-slate-100"
        : index === 2
          ? "text-orange-600 bg-orange-50"
          : "text-skillio-500 bg-skillio-50";

  return (
    <tr className="border-b border-skillio-100 hover:bg-skillio-50/60 transition-colors duration-100">
      <td className="py-3 pl-6 pr-3 w-14 text-center">
        <span
          className={cn(
            "text-xs font-black w-7 h-7 rounded-full inline-flex items-center justify-center",
            rankStyle
          )}
        >
          {index + 1}
        </span>
      </td>

      <td className="py-3 pr-4">
        <div className="flex items-center gap-3">
          <Avatar user={user} size="sm" />
          <div>
            <p className="font-bold text-sm text-dark-blue leading-tight flex items-center gap-1.5">
              {user.name ?? "Anonim"}
              {index === 0 && (
                <Star size={11} className="text-yellow-500 fill-yellow-400" />
              )}
            </p>
            <p className="text-[11px] text-skillio-400 font-medium mt-0.5">
              Member
            </p>
          </div>
        </div>
      </td>

      <td className="py-3 pr-4 text-center">
        <div className="inline-flex items-center gap-1 bg-orange-50 text-orange-600 rounded-full px-2.5 py-0.5">
          <Flame size={11} className="fill-orange-400 text-orange-400" />
          <span className="text-xs font-bold tabular-nums">{user.streak ?? 0}</span>
        </div>
      </td>

      <td className="py-3 pr-6 text-right">
        <XpBadge value={user.xp} />
      </td>
    </tr>
  );
}

export default async function ScoreboardPage() {
  const rawUsers = await prisma.user.findMany({
    where: { role: { not: "admin" } },
    orderBy: { xp: "desc" },
    take: 10,
    include: {
      streak: { select: { current_streak: true } },
    },
  });

  const topUsers = rawUsers.map((u) => ({
    id: u.id,
    name: u.name,
    image: u.image,
    xp: u.xp,
    role: u.role,
    streak: u.streak?.current_streak ?? 0,
  }));

  const [first, second, third] = topUsers;
  const podium = [
    { user: second, rank: 2, platformH: 52 },
    { user: first, rank: 1, platformH: 80 },
    { user: third, rank: 3, platformH: 36 },
  ].filter((p) => p.user);

  const banner = (
    <div
      className="relative w-full px-8 pt-10 pb-16 overflow-hidden"
      style={{
        background: "linear-gradient(to bottom right, #3b82f6, #1d4ed8, #1e40af)",
        minHeight: "440px",
      }}
    >
      {}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-400/20 blur-[120px] rounded-full translate-x-1/4 translate-y-1/4" />
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4 bg-white/10 backdrop-blur-md border border-white/20 w-fit px-4 py-1.5 rounded-full">
          <Trophy size={14} className="text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.5)]" />
          <span className="text-[9px] font-black tracking-[0.3em] uppercase text-white">
            Top 10 Global
          </span>
        </div>

        <h1
          className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2 leading-tight font-outfit"
        >
          Papan Skor <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-100 via-white to-blue-200 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            Skillio
          </span>
        </h1>
        <p className="text-white/60 text-sm font-medium mb-12 max-w-md">
          Terus kumpulkan XP dari kuis dan tantangan harian untuk naik ke puncak!
        </p>

        {podium.length > 0 && (
          <div className="flex items-end justify-center gap-4 md:gap-10 max-w-lg mx-auto relative">
             {}
             <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white/10 to-transparent blur-2xl rounded-full" />

            {podium.map(({ user, rank, platformH }) => (
              <div key={user.id} className="flex-1 relative z-10">
                <PodiumCard user={user} rank={rank} platformH={platformH} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const table = (
    <>
      {}
      <div className="flex justify-center pt-3 pb-1">
        <div className="w-10 h-1 rounded-full bg-skillio-200" />
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-skillio-100">
            {[
              { label: "Rank", extra: "pl-6 pr-3 w-14 text-center" },
              { label: "Player", extra: "pr-4" },
              { label: "Streak", extra: "pr-4 text-center" },
              { label: "XP", extra: "pr-6 text-right" },
            ].map(({ label, extra }) => (
              <th
                key={label}
                className={cn(
                  "py-3 text-[10px] font-black tracking-[0.18em] uppercase text-skillio-300",
                  extra
                )}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {topUsers.map((user, index) => (
            <TableRow key={user.id} user={user} index={index} />
          ))}
          {topUsers.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="py-20 text-center text-skillio-300 font-medium text-sm"
              >
                Belum ada data pengguna. Jadilah yang pertama mendapatkan XP!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );

  return <ScoreboardShell banner={banner} table={table} />;
}