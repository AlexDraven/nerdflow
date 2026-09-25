"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { analyzeRelic, type RelicAnalysis } from "./actions";
import { SheikahEyeIcon } from "@/components/sheikah-eye-icon";

type ScanState =
  | { status: "idle" }
  | { status: "analyzing" }
  | { status: "result"; data: RelicAnalysis }
  | { status: "error"; message: string };

export default function Home() {
  const [state, setState] = useState<ScanState>({ status: "idle" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleEyeClick() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setState({ status: "analyzing" });
    try {
      const formData = new FormData();
      formData.append("image", file);
      const data = await analyzeRelic(formData);
      setState({ status: "result", data });
    } catch {
      setState({
        status: "error",
        message: "No se pudo analizar la reliquia. Inténtalo de nuevo.",
      });
    } finally {
      e.target.value = "";
    }
  }

  function handleReset() {
    setState({ status: "idle" });
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-sheikah-void px-6 py-12 text-sheikah-cyan">
      <BackgroundGrid />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="relative z-10 w-full max-w-sm">
        <AnimatePresence mode="wait">
          {state.status === "idle" && (
            <IdleView key="idle" onEyeClick={handleEyeClick} />
          )}
          {state.status === "analyzing" && <AnalyzingView key="analyzing" />}
          {state.status === "result" && (
            <ResultView key="result" data={state.data} onReset={handleReset} />
          )}
          {state.status === "error" && (
            <ErrorView key="error" message={state.message} onReset={handleReset} />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

function BackgroundGrid() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-20"
      style={{
        backgroundImage:
          "linear-gradient(rgba(127,231,242,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(127,231,242,0.15) 1px, transparent 1px)",
        backgroundSize: "36px 36px",
        maskImage:
          "radial-gradient(circle at center, black, transparent 75%)",
      }}
    />
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative rounded-2xl border border-sheikah-cyan/40 bg-sheikah-panel/40 p-8 text-center shadow-[0_0_35px_rgba(127,231,242,0.15)] backdrop-blur-md">
      <CornerBrackets />
      {children}
    </div>
  );
}

function CornerBrackets() {
  const base = "absolute h-4 w-4 border-sheikah-gold";
  return (
    <>
      <span className={`${base} left-2 top-2 border-l-2 border-t-2`} />
      <span className={`${base} right-2 top-2 border-r-2 border-t-2`} />
      <span className={`${base} bottom-2 left-2 border-b-2 border-l-2`} />
      <span className={`${base} bottom-2 right-2 border-b-2 border-r-2`} />
    </>
  );
}

function IdleView({ onEyeClick }: { onEyeClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35 }}
    >
      <Panel>
        <p className="mb-1 text-xs uppercase tracking-[0.3em] text-sheikah-gold">
          Tableta Sheikah
        </p>
        <h1 className="mb-8 text-2xl font-semibold uppercase tracking-wide text-sheikah-cyan">
          Escáner de Reliquias
        </h1>

        <motion.button
          type="button"
          onClick={onEyeClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{ opacity: [0.75, 1, 0.75] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border-2 border-sheikah-cyan bg-sheikah-cyan/10 text-sheikah-cyan shadow-[0_0_25px_rgba(127,231,242,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-sheikah-gold"
          aria-label="Escanear reliquia"
        >
          <SheikahEyeIcon className="h-16 w-16" />
        </motion.button>

        <p className="mt-8 text-sm tracking-wide text-sheikah-cyan/80">
          Toca el Ojo Sheikah para fotografiar un objeto y descubrir su
          historia.
        </p>
      </Panel>
    </motion.div>
  );
}

function AnalyzingView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35 }}
    >
      <Panel>
        <p className="mb-1 text-xs uppercase tracking-[0.3em] text-sheikah-gold">
          Tableta Sheikah
        </p>

        <div className="relative mx-auto mt-6 h-32 w-32">
          <div className="absolute inset-0 animate-pulse-glow rounded-full border-2 border-sheikah-cyan" />
          <div className="absolute inset-0 flex items-center justify-center text-sheikah-cyan">
            <SheikahEyeIcon className="h-16 w-16" />
          </div>
          <div className="absolute inset-0 overflow-hidden rounded-full">
            <div className="absolute left-0 right-0 h-8 animate-scan-sweep bg-gradient-to-b from-transparent via-sheikah-cyan/60 to-transparent" />
          </div>
        </div>

        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="mt-8 text-sm uppercase tracking-[0.2em] text-sheikah-cyan"
        >
          Analizando reliquia...
        </motion.p>
      </Panel>
    </motion.div>
  );
}

function ResultView({
  data,
  onReset,
}: {
  data: RelicAnalysis;
  onReset: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <Panel>
        <p className="mb-1 text-xs uppercase tracking-[0.3em] text-sheikah-gold">
          ¡Reliquia Descubierta!
        </p>
        <h2 className="mb-3 text-2xl font-semibold text-sheikah-cyan">
          {data.itemName}
        </h2>

        <CategoryBadge category={data.category} />

        <p className="mt-4 text-sm leading-relaxed text-sheikah-cyan/80">
          {data.description}
        </p>

        <div className="mt-6 flex items-center justify-center gap-2">
          <span className="text-xs uppercase tracking-[0.2em] text-sheikah-cyan/60">
            Corazones
          </span>
          <HeartsRestored hearts={data.heartsRestored} />
        </div>

        <motion.button
          type="button"
          onClick={onReset}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="mt-8 rounded-full border border-sheikah-gold px-6 py-2 text-xs uppercase tracking-[0.2em] text-sheikah-gold transition-colors hover:bg-sheikah-gold/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-sheikah-gold"
        >
          Escanear otra reliquia
        </motion.button>
      </Panel>
    </motion.div>
  );
}

function ErrorView({
  message,
  onReset,
}: {
  message: string;
  onReset: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35 }}
    >
      <Panel>
        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-sheikah-gold">
          Error de la Tableta
        </p>
        <p className="text-sm text-sheikah-cyan/80">{message}</p>
        <motion.button
          type="button"
          onClick={onReset}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="mt-8 rounded-full border border-sheikah-gold px-6 py-2 text-xs uppercase tracking-[0.2em] text-sheikah-gold transition-colors hover:bg-sheikah-gold/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-sheikah-gold"
        >
          Intentar de nuevo
        </motion.button>
      </Panel>
    </motion.div>
  );
}

function CategoryBadge({ category }: { category: RelicAnalysis["category"] }) {
  return (
    <span className="inline-block rounded-full border border-sheikah-gold/60 bg-sheikah-gold/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-sheikah-gold">
      {category}
    </span>
  );
}

function HeartsRestored({ hearts }: { hearts: number }) {
  const fullHearts = Math.floor(hearts);
  const hasHalf = hearts % 1 >= 0.5 && hearts % 1 < 1;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: fullHearts }).map((_, i) => (
        <HeartIcon key={`full-${i}`} variant="full" />
      ))}
      {hasHalf && <HeartIcon variant="half" />}
      {fullHearts === 0 && !hasHalf && <HeartIcon variant="empty" />}
    </div>
  );
}

function HeartIcon({ variant }: { variant: "full" | "half" | "empty" }) {
  if (variant === "empty") {
    return <span className="text-lg text-sheikah-cyan/30">♥</span>;
  }
  if (variant === "half") {
    return (
      <span className="relative inline-block text-lg leading-none">
        <span className="text-sheikah-cyan/30">♥</span>
        <span
          className="absolute inset-0 overflow-hidden text-red-400"
          style={{ clipPath: "inset(0 50% 0 0)" }}
        >
          ♥
        </span>
      </span>
    );
  }
  return <span className="text-lg leading-none text-red-400">♥</span>;
}
