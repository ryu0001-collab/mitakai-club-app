"use client";
import Header from "@/components/Header";
import FacultyRingAvatar from "@/components/FacultyRingAvatar";
import { usePresentUsers } from "@/context/PresentUsersContext";
import { useCurrentUser, toPresentUser } from "@/context/CurrentUserContext";
import { useEffect, useRef, useState } from "react";

type ScanStatus = "idle" | "scanning" | "entrance" | "exit" | "error";

function parseQR(raw: string): "entrance" | "exit" | null {
  if (raw === "CLUB-CHECKIN:entrance") return "entrance";
  if (raw === "CLUB-CHECKIN:exit") return "exit";
  return null;
}

export default function ScanPage() {
  const { addUser, checkOutUser } = usePresentUsers();
  const { profile } = useCurrentUser();
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<import("html5-qrcode").Html5Qrcode | null>(null);

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
          const me = toPresentUser(profile);
          stopScan().then(() => {
            if (type === "entrance") {
              addUser(me);
              setStatus("entrance");
            } else if (type === "exit") {
              checkOutUser(me);
              setStatus("exit");
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

        {status === "entrance" && (
          <div className="flex flex-col items-center gap-4 mt-10">
            <FacultyRingAvatar
              avatarUrl={profile.avatarImage}
              faculty={profile.dept}
              name={profile.name}
              size={72}
              ringWidth={4}
            />
            <p className="text-lg font-bold text-gray-800">入店チェックイン完了！</p>
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
