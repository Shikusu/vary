"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";

export default function Signin() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("iza") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    try {
      const fakeEmail = `${name.toLowerCase()}@antrano.app`;
      console.log(
        "Trying to sign in with email:",
        fakeEmail,
        "and password:",
        password
      );
      await signInWithEmailAndPassword(auth, fakeEmail, password);
      router.push("/status");
    } catch {
      setError("Nisy diso ô!");
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-4xl mb-10 font-bold">
        Tena olona ato antrano ve nefa io
      </h1>
      <form
        onSubmit={handleSubmit}
        className="card flex flex-col gap-4 w-80 border-3 rounded-lg p-6"
      >
        <label htmlFor="iza">Anarana tompoko</label>
        <input
          className="input"
          type="text"
          id="iza"
          name="iza"
          placeholder="Iza io"
          required
        />

        <label htmlFor="password">Mot de passe</label>
        <input
          className="input"
          type="password"
          id="password"
          name="password"
          placeholder="••••••••"
          required
        />

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button className="btn-primary" type="submit">
          Connexion
        </button>
        <p>mot de passe oublié ? mampalahelo</p>
      </form>
    </div>
  );
}
