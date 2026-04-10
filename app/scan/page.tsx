"use client";
import Header from "@/components/Header";
import FacultyRingAvatar from "@/components/FacultyRingAvatar";
import { usePresentUsers } from "@/context/PresentUsersContext";
import { useCurrentUser, toPresentUser } from "@/context/CurrentUserContext";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type ScanStatus = "idle" | "scanning" | "selectLeaveTime" | "entrance" | "exit" | "error";

const MINUTE_OPTIONS = [0, 15, 30, 45];
const CLOSE_HOUR = 22;

function getDefaultLeaveTime(): { hour: number; minute: number } {
  const d = new Date(Date.now() + 2 * 60 * 60 * 1000);
  const h = Math.min(d.getHours(), CLOSE_HOUR);
  const m = h === CLOSE_HOUR ? 0 : Math.floor(d.getMinutes() / 15) * 15;
  return { hour: h, minute: m };
}

function parseQR(raw: string): "entrance" | "exit" | null {
  if (raw === "CLUB-CHECKIN:entrance") return "entrance";
  if (raw === "CLUB-CHECKIN:exit") return "exit";
  return null;
}

export default function ScanPage() {
  const { addUser, checkOutUser } = usePresentUsers();
  const { profile } = useCurrentUser();
  const router = useRouter();
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<import("html5-qrcode").Html5Qrcode | null>(null);

  const def = getDefaultLeaveTime();
  const [leaveHour, setLeaveHour] = useState(def.hour);
  const [leaveMinute, setLeaveMinute] = useState(def.minute);

  const stopScan = async () => {
    try { await scannerRef.current?.stop(); } catch {}
    scannerRef.current = null;
  };

  const startScan = async () => {
    setError(null);
    setStatus("scanning");
    const { Html5Qrcode } = await import("html5-qrcode");
    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;
    try {
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (decodedText) => {
          const type = parseQR(decodedText);
          stopScan().then(() => {
            if (type === "entrance") {
              // リセットしてデフォルト時刻を再計算
              const d = getDefaultLeaveTime();
              setLeaveHour(d.hour);
              setLeaveMinute(d.minute);
              setStatus("selectLeaveTime");
            } else if (type === "exit") {
              const me = toPresentUser(profile);
              checkOutUser(me);
              setStatus("exit");
              setTimeout(() => router.push("/"), 2000);
            } else {
              setError("無効なQRコードです");
              setStatus("error");
            }
          });
        },
        undefined
      );
    } catch {
      setError("カメラへのアクセスが拒否されました");
      setStatus("error");
    }
  };

  const handleCheckIn = () => {
    const leaveTimeStr = `${String(leaveHour).padStart(2, "0")}:${String(leaveMinute).padStart(2, "0")}`;
    const me = { ...toPresentUser(profile), leaveTime: leaveTimeStr };
    addUser(me);
    setStatus("entrance");
    setTimeout(() => router.push("/"), 2000);
  };

  const reset = () => {
    setError(null);
    setStatus("idle");
  };

  useEffect(() => {
    return () => { stopScan(); };
  }, []);

  return (
    <>
      <Header title="QRスキャン" />
      <main className="flex-1 flex flex-col items-center gap-6 px-4 py-6">

        <div
          id="qr-reader"
          className={`w-full max-w-sm rounded-2xl overflow-hidden ${status === "scanning" ? "block" : "hidden"}`}
        />

        {status === "idle" && (
          <button
            onClick={startScan}
            className="mt-10 px-8 py-4 bg-blue-600 text-white rounded-xl text-lg font-bold hover:bg-blue-700 transition"
          >
            カメラを起動する
          </button>
        )}

        {status === "scanning" && (
          <button
            onClick={() => stopScan().then(reset)}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium"
          >
            キャンセル
          </button>
        )}

        {/* 入店チェックイン：退店時刻選択 */}
        {status === "selectLeaveTime" && (
          <div className="w-full max-w-sm flex flex-col items-center gap-6 mt-6">
            <FacultyRingAvatar
              avatarUrl={profile.avatarImage}
              faculty={profile.dept}
              name={profile.name}
              size={72}
              ringWidth={4}
            />
            <div className="text-center">
              <p className="text-lg font-bold text-gray-800">入店チェックイン完了！</p>
              <p className="text-gray-500 mt-1">{profile.name} さん、ようこそ！</p>
            </div>

            {/* 時刻選択 */}
            <div className="w-full bg-gray-50 rounded-2xl px-6 py-5">
              <p className="text-sm font-medium text-gray-600 mb-4 text-center">本日の滞在時間は？</p>
              <div className="flex items-center justify-center gap-3">
                {/* 時 */}
                <select
                  value={leaveHour}
                  onChange={(e) => {
                    const h = Number(e.target.value);
                    setLeaveHour(h);
                    if (h === CLOSE_HOUR) setLeaveMinute(0);
                  }}
                  className="w-20 text-center text-2xl font-bold text-gray-800 bg-white border border-gray-200 rounded-xl py-3 focus:outline-none focus:border-blue-400 appearance-none"
                >
                  {Array.from({ length: CLOSE_HOUR + 1 }, (_, i) => (
                    <option key={i} value={i}>{String(i).padStart(2, "0")}</option>
                  ))}
                </select>
                <span className="text-2xl font-bold text-gray-400">:</span>
                {/* 分（22時は00のみ） */}
                <select
                  value={leaveMinute}
                  onChange={(e) => setLeaveMinute(Number(e.target.value))}
                  disabled={leaveHour === CLOSE_HOUR}
                  className="w-20 text-center text-2xl font-bold text-gray-800 bg-white border border-gray-200 rounded-xl py-3 focus:outline-none focus:border-blue-400 appearance-none disabled:opacity-50"
                >
                  {(leaveHour === CLOSE_HOUR ? [0] : MINUTE_OPTIONS).map((m) => (
                    <option key={m} value={m}>{String(m).padStart(2, "0")}</option>
                  ))}
                </select>
                <span className="text-sm text-gray-500 ml-1">まで滞在</span>
              </div>
            </div>

            <button
              onClick={handleCheckIn}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-base hover:bg-blue-700 transition"
            >
              チェックインする
            </button>
          </div>
        )}

        {status === "entrance" && (
          <div className="flex flex-col items-center gap-4 mt-10">
            <FacultyRingAvatar
              avatarUrl={profile.avatarImage}
              faculty={profile.dept}
              name={profile.name}
              size={72}
              ringWidth={4}
            />
            <p className="text-lg font-bold text-gray-800">チェックイン完了！</p>
            <p className="text-gray-500">{profile.name} さん、ようこそ</p>
          </div>
        )}

        {status === "exit" && (
          <div className="flex flex-col items-center gap-4 mt-10">
            <div className="text-5xl">👋</div>
            <p className="text-lg font-bold text-gray-800">退出しました</p>
            <p className="text-gray-500">{profile.name} さん、またお越しください</p>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4 mt-10">
            <p className="text-red-500">{error}</p>
            <button onClick={reset} className="px-6 py-3 bg-gray-200 rounded-xl">
              もう一度スキャン
            </button>
          </div>
        )}

      </main>
    </>
  );
}
