"use client";
import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import { VIOLET, CORAL } from "./ui";

/**
 * TextToSpeech — working tool, no backend, no API key.
 * Uses the browser's built-in speechSynthesis API.
 */
export default function TextToSpeech() {
  const [voices, setVoices] = useState([]);
  const [voiceIdx, setVoiceIdx] = useState(0);
  const [rate, setRate] = useState(1);
  const [text, setText] = useState(
    "Tomorrow's lab starts with the safety sheet on page 42. Bring your goggles, and the pre-lab questions are due at the start of class."
  );
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (!window.speechSynthesis) {
      setSupported(false);
      return;
    }
    const load = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length) setVoices(v);
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  function speak() {
    if (!text.trim()) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (voices[voiceIdx]) u.voice = voices[voiceIdx];
    u.rate = rate;
    window.speechSynthesis.speak(u);
  }

  return (
    <section className="rounded-2xl border border-[#ECEAF5] bg-white p-5">
      <div className="flex items-center gap-2 text-sm font-medium">
        <MessageSquare size={16} className="text-[#6D4AFF]" />
        Text-to-speech
      </div>
      <p className="mt-1 text-xs text-[#8B8A80]">
        Reads written content aloud — runs offline, built into the browser.
      </p>

      {!supported && (
        <div className="mt-3 rounded-lg bg-[#FFE8E1] p-3 text-sm text-[#C7502F]">
          This browser doesn&apos;t support speech synthesis.
        </div>
      )}

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="mt-3 min-h-[90px] w-full rounded-xl border border-[#ECEAF5] bg-[#FAF9FF] p-3 text-sm outline-none focus:border-[#D8D2FF]"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <select
          value={voiceIdx}
          onChange={(e) => setVoiceIdx(Number(e.target.value))}
          className="rounded-lg border border-[#ECEAF5] bg-[#FAF9FF] px-2.5 py-2 text-sm"
        >
          {voices.length === 0 && <option>Loading voices…</option>}
          {voices.map((v, i) => (
            <option key={i} value={i}>{v.name} ({v.lang})</option>
          ))}
        </select>

        <select
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          className="rounded-lg border border-[#ECEAF5] bg-[#FAF9FF] px-2.5 py-2 text-sm"
        >
          <option value={0.8}>Slower</option>
          <option value={1}>Normal speed</option>
          <option value={1.2}>Faster</option>
        </select>

        <button
          onClick={speak}
          disabled={!supported}
          className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-transform active:scale-95 hover:brightness-110 disabled:opacity-50"
          style={{ backgroundImage: `linear-gradient(90deg, ${VIOLET}, ${CORAL})` }}
        >
          Speak
        </button>

        <button
          onClick={() => window.speechSynthesis?.cancel()}
          className="rounded-lg border border-[#ECEAF5] bg-[#FAF9FF] px-3 py-2 text-sm text-[#3A392F] transition-transform active:scale-95 hover:bg-[#F1ECFF]"
        >
          Stop
        </button>
      </div>
    </section>
  );
}
