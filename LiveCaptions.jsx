"use client";
import { useEffect, useRef, useState } from "react";
import { Mic, RotateCcw, Volume2, Trash2 } from "lucide-react";
import { VIOLET, CORAL } from "./ui";

/**
 * LiveCaptions — a genuinely working tool, no backend required.
 *
 * Uses two browser APIs that need no API key and no server:
 *   - SpeechRecognition   (speech -> text)   Chrome/Edge only
 *   - speechSynthesis     (text -> speech)   all modern browsers
 *
 * TODO when Supabase is wired up:
 *   - persist `finalText` to a `transcripts` table so students can review later
 *   - replace the local `missedLines` array with an insert into a `flags` table,
 *     then use Supabase Realtime to notify the teacher's dashboard live
 */
export default function LiveCaptions() {
  const [listening, setListening] = useState(false);
  const [finalText, setFinalText] = useState("");
  const [interim, setInterim] = useState("");
  const [missedLines, setMissedLines] = useState([]);
  const [flash, setFlash] = useState(false);
  const [error, setError] = useState("");
  const [supported, setSupported] = useState(true);

  const recogRef = useRef(null);
  const listeningRef = useRef(false);
  const stageRef = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setSupported(false);
      return;
    }
    const recog = new SR();
    recog.continuous = true;
    recog.interimResults = true;
    recog.lang = "en-US";

    recog.onresult = (e) => {
      let interimChunk = "";
      let finalChunk = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const txt = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalChunk += txt.trim() + " ";
        else interimChunk += txt;
      }
      if (finalChunk) setFinalText((prev) => prev + finalChunk);
      setInterim(interimChunk);
    };

    recog.onerror = (e) => {
      setError(
        e.error === "not-allowed"
          ? "Microphone access was blocked. Allow the mic for this page, then press Start again."
          : `Speech recognition error: ${e.error}`
      );
      listeningRef.current = false;
      setListening(false);
    };

    // Chrome stops after a pause — restart so captioning stays continuous
    recog.onend = () => {
      if (listeningRef.current) {
        try { recog.start(); } catch (_) {}
      }
    };

    recogRef.current = recog;
    return () => {
      listeningRef.current = false;
      try { recog.stop(); } catch (_) {}
    };
  }, []);

  useEffect(() => {
    if (stageRef.current) stageRef.current.scrollTop = stageRef.current.scrollHeight;
  }, [finalText, interim]);

  function start() {
    setError("");
    listeningRef.current = true;
    setListening(true);
    try { recogRef.current.start(); } catch (_) {}
  }

  function stop() {
    listeningRef.current = false;
    setListening(false);
    try { recogRef.current.stop(); } catch (_) {}
  }

  function flagMissed() {
    const words = finalText.trim().split(/\s+/).filter(Boolean);
    if (!words.length) return;
    const snippet = words.slice(-14).join(" ");
    setMissedLines((m) => [...m, snippet]);
    setFlash(true);
    setTimeout(() => setFlash(false), 2600);
    // TODO: await supabase.from("flags").insert({ student_id, class_name, snippet })
  }

  function speak(text) {
    if (!text.trim() || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  }

  function clearAll() {
    setFinalText("");
    setInterim("");
    setMissedLines([]);
  }

  return (
    <section className="rounded-2xl border border-[#ECEAF5] bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Mic size={16} className="text-[#6D4AFF]" />
          Live captioning
        </div>
        <div className="flex items-center gap-2 text-xs text-[#6B6A78]">
          <span
            className={`h-2 w-2 rounded-full ${listening ? "live-dot" : ""}`}
            style={{ backgroundColor: listening ? CORAL : "#9A98A8" }}
          />
          {listening ? "Listening…" : "Not listening"}
        </div>
      </div>

      <p className="mt-1 text-xs text-[#8B8A80]">
        Converts classroom speech to real-time text. Allow microphone access when prompted.
      </p>

      {!supported && (
        <div className="mt-3 rounded-lg bg-[#FFE8E1] p-3 text-sm text-[#C7502F]">
          This browser doesn&apos;t support the Web Speech API. Live captioning works in Chrome
          and Edge — open this page there to try it.
        </div>
      )}
      {error && (
        <div className="mt-3 rounded-lg bg-[#FFE8E1] p-3 text-sm text-[#C7502F]">{error}</div>
      )}

      <div
        ref={stageRef}
        className="mt-3 max-h-64 min-h-[140px] overflow-y-auto rounded-xl border border-[#ECEAF5] bg-[#FAF9FF] p-4 text-[17px] leading-relaxed"
      >
        {finalText || interim ? (
          <>
            {finalText}
            <span className="text-[#9A98A8]">{interim}</span>
          </>
        ) : (
          <span className="text-sm text-[#9A98A8]">
            Transcript will appear here once you start listening.
          </span>
        )}
      </div>

      {flash && (
        <div className="mt-2 rounded-lg bg-[#FFE8E1] px-3 py-2 text-sm font-medium text-[#C7502F]">
          Flagged “I missed that” — saved for review.
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          onClick={listening ? stop : start}
          disabled={!supported}
          className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-transform active:scale-95 hover:brightness-110 disabled:opacity-50"
          style={{ backgroundImage: `linear-gradient(90deg, ${VIOLET}, ${CORAL})` }}
        >
          {listening ? "Stop listening" : "Start listening"}
        </button>

        <button
          onClick={flagMissed}
          disabled={!finalText}
          className="flex items-center gap-1.5 rounded-lg border border-[#ECEAF5] bg-[#FAF9FF] px-3 py-2 text-sm text-[#3A392F] transition-transform active:scale-95 hover:bg-[#F1ECFF] disabled:opacity-50"
        >
          <RotateCcw size={14} /> I missed that
        </button>

        <button
          onClick={() => speak(finalText)}
          disabled={!finalText}
          className="flex items-center gap-1.5 rounded-lg border border-[#ECEAF5] bg-[#FAF9FF] px-3 py-2 text-sm text-[#3A392F] transition-transform active:scale-95 hover:bg-[#F1ECFF] disabled:opacity-50"
        >
          <Volume2 size={14} /> Read aloud
        </button>

        <button
          onClick={clearAll}
          className="flex items-center gap-1.5 rounded-lg border border-[#ECEAF5] bg-[#FAF9FF] px-3 py-2 text-sm text-[#3A392F] transition-transform active:scale-95 hover:bg-[#F1ECFF]"
        >
          <Trash2 size={14} /> Clear
        </button>
      </div>

      {missedLines.length > 0 && (
        <div className="mt-4 rounded-xl bg-[#FAF9FF] p-3">
          <div className="text-xs font-medium text-[#6B6A78]">
            Flagged moments ({missedLines.length})
          </div>
          <ul className="mt-2 space-y-1.5">
            {missedLines.map((m, i) => (
              <li key={i} className="text-sm text-[#3A392F]">
                “{m}”
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
