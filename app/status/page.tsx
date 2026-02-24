"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import { signOut } from "firebase/auth";
import { useRequireAuth } from "../../hooks/useRequireAuth";

function StatusContent() {
  const [isDone, setIsDone] = useState(false);
  const [loading, setLoading] = useState(true);

  const userName =
    auth.currentUser?.email?.split("@")[0].charAt(0).toUpperCase() +
      auth.currentUser?.email?.split("@")[0].slice(1) || "Tompoko";

  const isToday = (date: Date) =>
    new Date().toDateString() === date.toDateString();

  const isMorning = (date: Date) => date.getHours() < 12;

  useEffect(() => {
    let isMounted = true;

    const fetchStatus = async () => {
      try {
        setLoading(true);
        const statRef = doc(db, "status", "vary");
        const info = await getDoc(statRef);

        if (!info.exists()) {
          setIsDone(false);
          return;
        }

        const data = info.data();
        const timestamp = data?.lastchange;

        if (!timestamp || typeof timestamp.toDate !== "function") {
          setIsDone(false);
          return;
        }

        const lastChange = timestamp.toDate();
        const now = new Date();

        if (!isToday(lastChange)) {
          setIsDone(false);
          return;
        }

        setIsDone(isMorning(lastChange) === isMorning(now));
      } catch (err) {
        console.error("[fetchStatus] Error:", err);
        setIsDone(false);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleMarkAsDone = async () => {
    try {
      const statRef = doc(db, "status", "vary");
      await setDoc(statRef, { lastchange: serverTimestamp() }, { merge: true });
      setIsDone(true);
    } catch (err) {
      console.error("[button] Update failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
        <style>{`
          @keyframes steam {
            0%   { transform: translateY(0) scaleX(1); opacity: 0.7; }
            50%  { transform: translateY(-12px) scaleX(1.3); opacity: 0.3; }
            100% { transform: translateY(-24px) scaleX(0.8); opacity: 0; }
          }
          @keyframes bob {
            0%, 100% { transform: translateY(0); }
            50%      { transform: translateY(-4px); }
          }
          .steam-1 { animation: steam 1.4s ease-in-out infinite; }
          .steam-2 { animation: steam 1.4s ease-in-out infinite 0.3s; }
          .steam-3 { animation: steam 1.4s ease-in-out infinite 0.6s; }
          .pot     { animation: bob 1.8s ease-in-out infinite; }
        `}</style>

        <div className="pot flex flex-col items-center scale-90 sm:scale-100">
          {/* Steam - smaller on mobile */}
          <div className="flex gap-2 sm:gap-3 mb-1 h-6 sm:h-8 items-end">
            <div className="steam-1 w-0.5 sm:w-1 h-5 sm:h-6 bg-gray-300 rounded-full origin-bottom" />
            <div className="steam-2 w-0.5 sm:w-1 h-6 sm:h-8 bg-gray-300 rounded-full origin-bottom" />
            <div className="steam-3 w-0.5 sm:w-1 h-5 sm:h-6 bg-gray-300 rounded-full origin-bottom" />
          </div>

          {/* Lid */}
          <div className="w-20 sm:w-24 h-3 sm:h-4 bg-gray-500 rounded-t-full relative flex justify-center">
            <div className="w-3 sm:w-4 h-2 sm:h-3 bg-gray-400 rounded-full -mt-1.5 sm:-mt-2" />
          </div>

          {/* Pot body */}
          <div className="w-24 sm:w-28 h-14 sm:h-16 bg-gray-600 rounded-b-2xl flex items-center justify-center">
            <span className="text-2xl sm:text-3xl">🍚</span>
          </div>

          {/* Handles */}
          <div className="flex justify-between w-32 sm:w-36 -mt-8 sm:-mt-10 px-0 pointer-events-none">
            <div className="w-3 sm:w-4 h-5 sm:h-6 bg-gray-500 rounded-l-full" />
            <div className="w-3 sm:w-4 h-5 sm:h-6 bg-gray-500 rounded-r-full" />
          </div>
        </div>

        <p className="text-lg sm:text-xl font-medium text-gray-500 mt-4">
          Miandry kely ny chargement...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-6 sm:p-10 md:p-12 lg:p-16 flex flex-col gap-10 sm:gap-16 bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between max-w-4xl mx-auto w-full">
        <span className="text-base sm:text-lg font-medium flex items-center gap-2">
          👤 {userName}
        </span>
        <button
          onClick={async () => {
            await signOut(auth);
            window.location.href = "/";
          }}
          className="
            px-4 py-2 text-sm sm:text-base
            font-medium text-white bg-red-600
            rounded-lg hover:bg-red-700
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
          "
        >
          Logout
        </button>
      </header>

      {/* Main content */}
      <section className="flex flex-col items-center justify-center flex-1 gap-6 sm:gap-10 text-center max-w-3xl mx-auto">
        <h1
          className="
          text-4xl sm:text-5xl md:text-6xl lg:text-7xl
          font-bold tracking-tight text-gray-800
        "
        >
          Tsy mbola nanao vary ve?
        </h1>

        {isDone ? (
          <p className="text-2xl sm:text-3xl md:text-4xl font-semibold text-green-600">
            Efa nanao ✅
          </p>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <p className="text-2xl sm:text-3xl md:text-4xl font-semibold text-yellow-600">
              Tsy mbola ❌
            </p>

            <button
              onClick={handleMarkAsDone}
              className="
                px-6 py-3 sm:px-8 sm:py-4
                text-base sm:text-lg md:text-xl
                font-medium text-white bg-green-600
                rounded-xl shadow-md
                hover:bg-green-700 hover:shadow-lg
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                active:scale-95
                transition-all duration-200
              "
            >
              vo natao
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default function Status() {
  const checking = useRequireAuth();
  if (checking) return null;
  return <StatusContent />;
}
