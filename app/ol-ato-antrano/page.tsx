"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";

export default function Signin() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (
      form.elements.namedItem("iza") as HTMLInputElement
    ).value.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    try {
      const fakeEmail = `${name.toLowerCase()}@antrano.app`;
      console.log("Trying to sign in with:", fakeEmail, password);
      await signInWithEmailAndPassword(auth, fakeEmail, password);
      router.push("/status");
    } catch (err: any) {
      console.error("Sign-in error:", err.code, err.message);
      setError("Nisy diso ô! Andramo indray ny anarana sy ny tenimiafina.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            Tena olona ato antrano ve nefa io?
          </h1>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            Miditra amin'ny anaranao sy ny tenimiafina
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white shadow-md rounded-xl px-6 py-8 sm:px-10 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name / Anarana */}
            <div>
              <label
                htmlFor="iza"
                className="block text-sm font-medium text-gray-700"
              >
                Anarana tompoko
              </label>
              <div className="mt-1">
                <input
                  id="iza"
                  name="iza"
                  type="text"
                  autoComplete="username"
                  required
                  placeholder="Iza io"
                  className="
                    block w-full rounded-lg border border-gray-300
                    px-4 py-3 text-gray-900 placeholder-gray-400
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                    sm:text-sm
                  "
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Tenimiafina
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="
                    block w-full rounded-lg border border-gray-700
                    px-4 py-3 text-gray-900 placeholder-gray-400
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                    sm:text-sm
                  "
                />
              </div>
            </div>

            {/* Error message */}
            {error && (
              <p className="text-red-600 text-sm text-center font-medium">
                {error}
              </p>
            )}

            {/* Submit button */}
            <button
              type="submit"
              className="
                w-full flex justify-center rounded-lg
                bg-blue-600 px-4 py-3 text-base font-medium text-white
                hover:bg-blue-700 focus:outline-none focus:ring-2
                focus:ring-blue-500 focus:ring-offset-2
                transition-colors duration-200
                sm:text-lg
              "
            >
              Connexion
            </button>
          </form>

          {/* Forgot password */}
          <div className="mt-6 text-center text-sm text-gray-500">
            Mot de passe oublié ?{" "}
            <span className="text-gray-400 cursor-not-allowed">
              mampalahelo...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
