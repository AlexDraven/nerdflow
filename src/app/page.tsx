"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { analyzeRelic, type RelicAnalysis } from "./actions";
import { SheikahEmblemIcon } from "@/components/sheikah-emblem-icon";

type ScanState =
  | { status: "idle" }
  | { status: "camera" }
  | { status: "analyzing" }
  | { status: "result"; data: RelicAnalysis }
  | { status: "error"; message: string };

export default function Home() {
  const [state, setState] = useState<ScanState>({ status: "idle" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleEyeClick() {
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.mediaDevices?.getUserMedia === "function"
    ) {
      setState({ status: "camera" });
    } else {
      fileInputRef.current?.click();
    }
  }

  async function analyzeFile(file: File) {
    setState({ status: "analyzing" });
    try {
      const formData = new FormData();
      formData.append("image", await downscaleImage(file));
      const data = await analyzeRelic(formData);
      setState({ status: "result", data });
    } catch {
      setState({
        status: "error",
        message: "No se pudo analizar la reliquia. Inténtalo de nuevo.",
      });
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    await analyzeFile(file);
    e.target.value = "";
  }

  function handleReset() {
    setState({ status: "idle" });
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-sheikah-void px-6 py-12 text-sheikah-cyan">
      <SheikahBackground />

      <DesktopNotice />

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
          {state.status === "camera" && (
            <CameraView
              key="camera"
              onCapture={analyzeFile}
              onCancel={handleReset}
              onFallbackToFile={() => fileInputRef.current?.click()}
            />
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

// Los Server Actions aceptan hasta 1 MB por defecto; una foto de celular pesa varios.
async function downscaleImage(file: File, maxSide = 1024): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.8),
  );
  if (!blob) throw new Error("No se pudo procesar la imagen.");
  return new File([blob], "reliquia.jpg", { type: "image/jpeg" });
}

function SheikahBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* resplandor central para dar profundidad detrás del panel */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(0,221,255,0.10),transparent_55%)]" />

      {/* grilla de motivos rúnicos + runas dispersas, en deriva lenta */}
      <svg className="absolute -inset-[10%] h-[120%] w-[120%] animate-drift opacity-70">
        <defs>
          <pattern id="sheikah-motif" width="56" height="56" patternUnits="userSpaceOnUse">
            <circle cx="28" cy="28" r="7" fill="none" stroke="rgba(0,221,255,0.14)" strokeWidth="1" />
            <circle cx="28" cy="28" r="2" fill="rgba(0,221,255,0.1)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#sheikah-motif)" />

        {/* runas dispersas, angulares e irregulares */}
        <g stroke="rgba(0,221,255,0.16)" strokeWidth="1.2" fill="none">
          <path d="M120,90 l10,-14 l10,4 M125,90 v16" />
          <path d="M540,220 l8,-10 M540,220 l8,6 M540,220 v-14" />
          <path d="M260,420 h16 M268,412 v16 M260,428 l16,-16" />
          <path d="M620,480 l-6,-12 l12,-2 l-2,14 Z" />
          <path d="M90,560 h14 M97,552 v16" />
          <path d="M460,60 l10,10 M470,60 l-10,10" />
          <path d="M320,650 h18 M329,642 v18" />
        </g>
      </svg>

      {/* textura fina de líneas verticales */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(0,221,255,0.05) 0px, transparent 1px, transparent 3px)",
        }}
      />

      {/* barras de brillo en los bordes */}
      <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-sheikah-cyan/50 to-transparent blur-[2px]" />
      <div className="absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-sheikah-cyan/50 to-transparent blur-[2px]" />

      {/* viñeta hacia los bordes para dar profundidad cinematográfica */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_35%,rgba(0,0,0,0.55)_100%)]" />
    </div>
  );
}

function DesktopNotice() {
  return (
    <div className="fixed inset-x-0 top-0 z-20 hidden justify-center px-4 py-3 md:flex">
      <div className="flex items-center gap-2 rounded-full border border-sheikah-gold/50 bg-sheikah-panel/80 px-4 py-2 text-xs uppercase tracking-[0.15em] text-sheikah-gold shadow-sheikah backdrop-blur-md">
        Para la mejor experiencia, abre la Tableta Sheikah desde tu celular
      </div>
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative rounded-2xl border border-sheikah-cyan/40 bg-sheikah-panel/40 p-8 text-center shadow-sheikah backdrop-blur-md">
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
          className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-sheikah-cyan/10 text-sheikah-cyan shadow-sheikah focus:outline-none focus-visible:ring-2 focus-visible:ring-sheikah-gold"
          aria-label="Escanear reliquia"
        >
          <SheikahEmblemIcon className="h-28 w-28 drop-shadow-[0_0_6px_rgba(0,221,255,0.8)]" />
        </motion.button>

        <p className="mt-8 text-sm tracking-wide text-sheikah-cyan/80">
          Toca el Ojo Sheikah para fotografiar un objeto y descubrir su
          historia.
        </p>
      </Panel>
    </motion.div>
  );
}

function CameraView({
  onCapture,
  onCancel,
  onFallbackToFile,
}: {
  onCapture: (file: File) => void;
  onCancel: () => void;
  onFallbackToFile: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setReady(false);
    setError(null);

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(() => {
        if (!cancelled) setError("Sin acceso a la cámara.");
      });

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [attempt]);

  function handleCapture() {
    const video = videoRef.current;
    if (!video || !ready) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (blob) onCapture(new File([blob], "reliquia.jpg", { type: "image/jpeg" }));
      },
      "image/jpeg",
      0.9,
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35 }}
    >
      <Panel>
        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-sheikah-gold">
          Tableta Sheikah
        </p>

        {error ? (
          <div className="flex flex-col items-center gap-4 py-6">
            <p className="text-sm text-sheikah-cyan/80">{error}</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setAttempt((a) => a + 1)}
                className="rounded-full border border-sheikah-cyan/60 px-4 py-2 text-xs uppercase tracking-[0.2em] text-sheikah-cyan hover:bg-sheikah-cyan/10"
              >
                Reintentar
              </button>
              <button
                type="button"
                onClick={onFallbackToFile}
                className="rounded-full border border-sheikah-gold px-4 py-2 text-xs uppercase tracking-[0.2em] text-sheikah-gold hover:bg-sheikah-gold/10"
              >
                Usar selector de archivos
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="relative mx-auto aspect-[3/4] w-full max-w-[280px] overflow-hidden rounded-xl border border-sheikah-cyan/60 bg-black shadow-sheikah">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                onLoadedMetadata={() => setReady(true)}
                className="h-full w-full object-cover"
              />
              <CornerBrackets />
              {ready && (
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  <div className="absolute left-0 right-0 h-10 animate-scan-sweep bg-gradient-to-b from-transparent via-sheikah-cyan/50 to-transparent" />
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-center gap-6">
              <button
                type="button"
                onClick={onCancel}
                className="text-xs uppercase tracking-[0.2em] text-sheikah-cyan/60 hover:text-sheikah-cyan"
              >
                Cancelar
              </button>
              <motion.button
                type="button"
                onClick={handleCapture}
                disabled={!ready}
                whileHover={ready ? { scale: 1.05 } : undefined}
                whileTap={ready ? { scale: 0.95 } : undefined}
                aria-label="Capturar reliquia"
                className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-sheikah-cyan bg-sheikah-cyan/10 shadow-sheikah disabled:opacity-40"
              >
                <span className="h-10 w-10 rounded-full bg-sheikah-cyan" />
              </motion.button>
              <span className="w-[42px]" aria-hidden />
            </div>
          </>
        )}
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
          <div className="absolute inset-0 animate-pulse-glow rounded-full bg-sheikah-cyan/10 blur-md" />
          <div className="absolute inset-0 flex items-center justify-center text-sheikah-cyan">
            <SheikahEmblemIcon className="h-28 w-28 drop-shadow-[0_0_6px_rgba(0,221,255,0.8)]" />
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
          Compendio Nº {String(data.compendiumNumber).padStart(3, "0")}
        </p>
        <h2 className="mb-3 text-2xl font-semibold text-sheikah-cyan">
          {data.itemName}
        </h2>

        <CategoryBadge category={data.category} />

        <p className="mt-4 text-sm leading-relaxed text-sheikah-cyan/80">
          {data.description}
        </p>

        {data.heartsRestored > 0 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <span className="text-xs uppercase tracking-[0.2em] text-sheikah-cyan/60">
              Corazones
            </span>
            <HeartsRestored hearts={data.heartsRestored} />
          </div>
        )}

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
  const hasHalf = hearts % 1 > 0;

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
    return <span className="text-lg leading-none text-sheikah-inactive">♥</span>;
  }
  if (variant === "half") {
    return (
      <span className="relative inline-block text-lg leading-none">
        <span className="text-sheikah-inactive">♥</span>
        <span
          className="absolute inset-0 overflow-hidden text-sheikah-cyan drop-shadow-[0_0_4px_rgba(0,221,255,0.7)]"
          style={{ clipPath: "inset(0 50% 0 0)" }}
        >
          ♥
        </span>
      </span>
    );
  }
  return (
    <span className="text-lg leading-none text-sheikah-cyan drop-shadow-[0_0_4px_rgba(0,221,255,0.7)]">
      ♥
    </span>
  );
}
