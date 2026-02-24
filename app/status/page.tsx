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

  const isToday = (date: Date) => {
    return new Date().toDateString() === date.toDateString();
  };

  const isMorning = (date: Date) => {
    return date.getHours() < 12;
  };

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
        console.error("[fetchStatus] Error reading Firestore:", err);
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
      console.log("[button] Marking as done → updating Firestore");

      const statRef = doc(db, "status", "vary");

      await setDoc(
        statRef,
        {
          lastchange: serverTimestamp(),
        },
        { merge: true }
      );

      console.log("[button] Firestore update successful");

      setIsDone(true);
    } catch (err) {
      console.error("[button] Failed to update status:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <style>{`
          @keyframes steam {
            0%   { transform: translateY(0) scaleX(1); opacity: 0.7; }
            50%  { transform: translateY(-12px) scaleX(1.3); opacity: 0.3; }
            100% { transform: translateY(-24px) scaleX(0.8); opacity: 0; }
          }
          @keyframes bob {
            0%, 100% { transform: translateY(0); }
            50%       { transform: translateY(-4px); }
          }
          .steam-1 { animation: steam 1.4s ease-in-out infinite; }
          .steam-2 { animation: steam 1.4s ease-in-out infinite 0.3s; }
          .steam-3 { animation: steam 1.4s ease-in-out infinite 0.6s; }
          .pot     { animation: bob 1.8s ease-in-out infinite; }
        `}</style>

        {/* Rice pot illustration */}
        <div className="pot flex flex-col items-center">
          {/* Steam */}
          <div className="flex gap-3 mb-1 h-8 items-end">
            <div className="steam-1 w-1 h-6 bg-gray-300 rounded-full origin-bottom" />
            <div className="steam-2 w-1 h-8 bg-gray-300 rounded-full origin-bottom" />
            <div className="steam-3 w-1 h-6 bg-gray-300 rounded-full origin-bottom" />
          </div>

          {/* Lid */}
          <div className="w-24 h-4 bg-gray-500 rounded-t-full relative flex justify-center">
            <div className="w-4 h-3 bg-gray-400 rounded-full -mt-2" />
          </div>

          {/* Pot body */}
          <div className="w-28 h-16 bg-gray-600 rounded-b-2xl flex items-center justify-center">
            <span className="text-2xl">🍚</span>
          </div>

          {/* Handles */}
          <div className="flex justify-between w-36 -mt-10 px-0 pointer-events-none">
            <div className="w-4 h-6 bg-gray-500 rounded-l-full" />
            <div className="w-4 h-6 bg-gray-500 rounded-r-full" />
          </div>
        </div>

        <p className="text-xl font-medium text-gray-500 mt-4">
          Miandry kely ny chargement...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-10 flex flex-col gap-16">
      <header className="flex items-center justify-between">
        <span className="text-lg font-medium">👤 {userName}</span>
        <button
          onClick={async () => {
            await signOut(auth);
            window.location.href = "/";
          }}
          className="btn-red text-sm hover:bg-red-200 transition px-4 py-2 rounded"
        >
          Logout
        </button>
      </header>

      <section className="flex flex-col items-center justify-center flex-1 gap-10 text-center">
        <h1 className="text-6xl font-bold">Tsy mbola nanao vary ve?</h1>

        {isDone ? (
          <p className="text-3xl text-green-600 font-semibold">Efa nanao ✅</p>
        ) : (
          <>
            <p className="text-3xl text-yellow-600 font-semibold">
              Tsy mbola ❌
            </p>

            <button
              onClick={handleMarkAsDone}
              className="px-6 py-3 rounded-xl bg-green-600 text-white text-lg font-medium hover:bg-green-700 transition"
            >
              vo natao
            </button>
          </>
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
