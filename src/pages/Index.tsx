import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

type Tab = "home" | "settings" | "logs";

interface CheckItem {
  label: string;
  status: "pending" | "checking" | "ok" | "error";
}

const Index = () => {
  const [tab, setTab] = useState<Tab>("home");
  const [checks, setChecks] = useState<CheckItem[]>([
    { label: "Проверка файлов чита", status: "pending" },
    { label: "Подключение к серверу", status: "pending" },
    { label: "Проверка обновлений", status: "pending" },
    { label: "Инициализация модулей", status: "pending" },
  ]);
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchProgress, setLaunchProgress] = useState(0);
  const [launchReady, setLaunchReady] = useState(false);
  const [logs, setLogs] = useState<{ time: string; type: "info" | "success" | "warn" | "error"; msg: string }[]>([
    { time: "00:00:00", type: "info", msg: "[SYS] Sp1rtExternal Loader v2.4.1 initialized" },
    { time: "00:00:01", type: "info", msg: "[SYS] Waiting for user action..." },
  ]);
  const [settings, setSettings] = useState({
    autoInject: true,
    hideOverlay: false,
    bypassAC: true,
    debugMode: false,
  });

  const addLog = (type: "info" | "success" | "warn" | "error", msg: string) => {
    const now = new Date();
    const time = [now.getHours(), now.getMinutes(), now.getSeconds()]
      .map((v) => String(v).padStart(2, "0"))
      .join(":");
    setLogs((prev) => [...prev, { time, type, msg }]);
  };

  const runChecks = () => {
    setIsLaunching(true);
    setLaunchReady(false);
    setLaunchProgress(0);
    addLog("info", "[LAUNCH] Starting pre-launch checks...");

    const newChecks: CheckItem[] = checks.map((c) => ({
      ...c,
      status: "pending" as const,
    }));
    setChecks(newChecks);

    const logMessages = [
      { start: "[CHECK] Scanning cheat files...", end: "[CHECK] Files integrity OK — 47 modules loaded" },
      { start: "[NET] Connecting to relay server...", end: "[NET] Connected to sp1rt-relay-eu-1 (ping: 24ms)" },
      { start: "[UPD] Checking for updates...", end: "[UPD] Version 2.4.1 is up to date" },
      { start: "[INIT] Initializing injection modules...", end: "[INIT] All modules ready — ESP, AIM, MISC" },
    ];

    newChecks.forEach((_, i) => {
      setTimeout(() => {
        addLog("info", logMessages[i].start);
        setChecks((prev) =>
          prev.map((c, idx) =>
            idx === i ? { ...c, status: "checking" } : c
          )
        );

        setTimeout(() => {
          addLog("success", logMessages[i].end);
          setChecks((prev) =>
            prev.map((c, idx) =>
              idx === i ? { ...c, status: "ok" } : c
            )
          );
          setLaunchProgress(((i + 1) / newChecks.length) * 100);

          if (i === newChecks.length - 1) {
            setTimeout(() => {
              addLog("success", "[SYS] All checks passed — ready to inject");
              setLaunchReady(true);
            }, 400);
          }
        }, 600 + Math.random() * 400);
      }, i * 900);
    });
  };

  const handleLaunch = () => {
    addLog("warn", "[INJECT] Injecting into Standoff 2 process...");
    setTimeout(() => {
      addLog("success", "[INJECT] Successfully injected! PID: 18472");
      addLog("info", "[GAME] Launching Standoff 2...");
      setTimeout(() => {
        addLog("success", "[GAME] Game launched — overlay active");
        addLog("info", "[SYS] Waiting for user action...");
        setIsLaunching(false);
        setLaunchReady(false);
        setLaunchProgress(0);
        setChecks(checks.map((c) => ({ ...c, status: "pending" })));
      }, 800);
    }, 600);
  };

  useEffect(() => {
    const interval = setInterval(() => {}, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background grid-bg scanline relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[hsl(142_70%_45%/0.06)] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-xl mx-auto px-4 py-8 min-h-screen flex flex-col">
        <header className="flex items-center justify-between mb-8 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg border border-primary/30 neon-border flex items-center justify-center bg-card">
              <Icon name="Crosshair" size={20} className="text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold font-mono neon-text tracking-wider">
                Sp1rtExternal
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                v2.4.1 • Standoff 2
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse-neon" />
            <span className="text-xs text-primary/70 font-mono">ONLINE</span>
          </div>
        </header>

        <nav className="flex gap-1 mb-6 p-1 bg-card/50 rounded-lg border border-border animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <button
            onClick={() => setTab("home")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-mono transition-all ${
              tab === "home"
                ? "bg-primary/10 text-primary neon-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon name="Home" size={16} />
            Главная
          </button>
          <button
            onClick={() => setTab("logs")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-mono transition-all ${
              tab === "logs"
                ? "bg-primary/10 text-primary neon-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon name="Terminal" size={16} />
            Логи
          </button>
          <button
            onClick={() => setTab("settings")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-mono transition-all ${
              tab === "settings"
                ? "bg-primary/10 text-primary neon-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon name="Settings" size={16} />
            Настройки
          </button>
        </nav>

        <main className="flex-1 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          {tab === "home" && (
            <div className="space-y-5">
              <div className="p-5 rounded-xl border border-border bg-card/60 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Icon name="Gamepad2" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold font-mono text-foreground">
                      Standoff 2
                    </h2>
                    <p className="text-xs text-muted-foreground font-mono">
                      Запуск с инжектом Sp1rtExternal
                    </p>
                  </div>
                </div>

                {!isLaunching && !launchReady && (
                  <Button
                    onClick={runChecks}
                    className="w-full neon-btn bg-primary text-primary-foreground font-mono font-bold tracking-wider h-12 text-base"
                  >
                    <Icon name="Play" size={18} className="mr-2" />
                    ЗАПУСТИТЬ
                  </Button>
                )}

                {isLaunching && !launchReady && (
                  <div className="space-y-3">
                    <Progress value={launchProgress} className="h-2 bg-secondary [&>div]:bg-primary [&>div]:transition-all [&>div]:duration-500" />
                    <p className="text-xs text-muted-foreground font-mono text-center">
                      Проверка... {Math.round(launchProgress)}%
                    </p>
                  </div>
                )}

                {launchReady && (
                  <Button
                    onClick={handleLaunch}
                    className="w-full neon-btn bg-primary text-primary-foreground font-mono font-bold tracking-wider h-12 text-base neon-border-strong"
                  >
                    <Icon name="Rocket" size={18} className="mr-2" />
                    INJECT & PLAY
                  </Button>
                )}
              </div>

              <div className="p-5 rounded-xl border border-border bg-card/60 backdrop-blur-sm">
                <h3 className="text-sm font-bold font-mono text-foreground mb-4 flex items-center gap-2">
                  <Icon name="ShieldCheck" size={16} className="text-primary" />
                  Проверка системы
                </h3>
                <div className="space-y-3">
                  {checks.map((check, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 px-3 rounded-lg bg-secondary/30 border border-border/50"
                    >
                      <span className="text-sm font-mono text-foreground/80">
                        {check.label}
                      </span>
                      <CheckStatus status={check.status} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <StatCard icon="Users" label="Онлайн" value="1,247" />
                <StatCard icon="Shield" label="Статус" value="Актив" />
                <StatCard icon="Clock" label="Аптайм" value="99.8%" />
              </div>
            </div>
          )}

          {tab === "logs" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-border bg-card/60 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold font-mono text-foreground flex items-center gap-2">
                    <Icon name="Terminal" size={16} className="text-primary" />
                    Консоль
                  </h3>
                  <button
                    onClick={() => setLogs([])}
                    className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded border border-border/50 hover:border-primary/30"
                  >
                    Очистить
                  </button>
                </div>
                <div className="bg-[hsl(160_12%_5%)] rounded-lg border border-border/50 p-3 max-h-[420px] overflow-y-auto font-mono text-xs space-y-1 scrollbar-thin">
                  {logs.length === 0 && (
                    <p className="text-muted-foreground/40 text-center py-8">Логи пусты</p>
                  )}
                  {logs.map((log, i) => (
                    <div key={i} className="flex gap-2 leading-relaxed">
                      <span className="text-muted-foreground/40 shrink-0">{log.time}</span>
                      <span
                        className={
                          log.type === "success"
                            ? "text-primary"
                            : log.type === "warn"
                            ? "text-yellow-400"
                            : log.type === "error"
                            ? "text-red-400"
                            : "text-foreground/60"
                        }
                      >
                        {log.msg}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center gap-1 pt-1">
                    <span className="text-primary animate-pulse-neon">▊</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === "settings" && (
            <div className="space-y-5">
              <div className="p-5 rounded-xl border border-border bg-card/60 backdrop-blur-sm">
                <h3 className="text-sm font-bold font-mono text-foreground mb-4 flex items-center gap-2">
                  <Icon name="Cpu" size={16} className="text-primary" />
                  Параметры инжекта
                </h3>
                <div className="space-y-4">
                  <SettingToggle
                    label="Авто-инжект"
                    description="Автоматический инжект при запуске"
                    checked={settings.autoInject}
                    onChange={(v) => setSettings({ ...settings, autoInject: v })}
                  />
                  <SettingToggle
                    label="Скрыть оверлей"
                    description="Скрывает оверлей при стриме"
                    checked={settings.hideOverlay}
                    onChange={(v) => setSettings({ ...settings, hideOverlay: v })}
                  />
                  <SettingToggle
                    label="Bypass AC"
                    description="Обход античита при инжекте"
                    checked={settings.bypassAC}
                    onChange={(v) => setSettings({ ...settings, bypassAC: v })}
                  />
                  <SettingToggle
                    label="Debug режим"
                    description="Логирование в консоль"
                    checked={settings.debugMode}
                    onChange={(v) => setSettings({ ...settings, debugMode: v })}
                  />
                </div>
              </div>

              <div className="p-5 rounded-xl border border-border bg-card/60 backdrop-blur-sm">
                <h3 className="text-sm font-bold font-mono text-foreground mb-4 flex items-center gap-2">
                  <Icon name="Info" size={16} className="text-primary" />
                  Информация
                </h3>
                <div className="space-y-2 text-sm font-mono">
                  <InfoRow label="Версия" value="2.4.1" />
                  <InfoRow label="Билд" value="#1847" />
                  <InfoRow label="Игра" value="Standoff 2" />
                  <InfoRow label="Статус" value="Undetected" valueClass="text-primary" />
                </div>
              </div>
            </div>
          )}
        </main>

        <footer className="mt-6 pt-4 border-t border-border/50 text-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <p className="text-xs text-muted-foreground/50 font-mono">
            Sp1rtExternal © 2026 • Standoff 2
          </p>
        </footer>
      </div>
    </div>
  );
};

const CheckStatus = ({ status }: { status: string }) => {
  if (status === "pending")
    return (
      <span className="w-5 h-5 rounded-full border border-border/80 flex items-center justify-center">
        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
      </span>
    );
  if (status === "checking")
    return (
      <span className="w-5 h-5 rounded-full border border-primary/50 flex items-center justify-center animate-pulse-neon">
        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
      </span>
    );
  if (status === "ok")
    return (
      <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
        <Icon name="Check" size={12} className="text-primary" />
      </span>
    );
  return (
    <span className="w-5 h-5 rounded-full bg-destructive/20 flex items-center justify-center">
      <Icon name="X" size={12} className="text-destructive" />
    </span>
  );
};

const StatCard = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) => (
  <div className="p-3 rounded-xl border border-border bg-card/60 text-center">
    <Icon name={icon} size={18} className="text-primary mx-auto mb-1.5" />
    <p className="text-sm font-bold font-mono text-foreground">{value}</p>
    <p className="text-[10px] text-muted-foreground font-mono">{label}</p>
  </div>
);

const SettingToggle = ({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <div
    className="flex items-center justify-between py-2 px-3 rounded-lg bg-secondary/30 border border-border/50 cursor-pointer hover:bg-secondary/50 transition-colors"
    onClick={() => onChange(!checked)}
  >
    <div>
      <p className="text-sm font-mono text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground/70 font-mono">{description}</p>
    </div>
    <div
      className={`w-10 h-5 rounded-full transition-all relative ${
        checked ? "bg-primary/30 neon-border" : "bg-secondary"
      }`}
    >
      <div
        className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${
          checked ? "left-[22px] bg-primary" : "left-0.5 bg-muted-foreground/50"
        }`}
      />
    </div>
  </div>
);

const InfoRow = ({
  label,
  value,
  valueClass = "text-foreground/70",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) => (
  <div className="flex justify-between items-center py-1.5">
    <span className="text-muted-foreground/60">{label}</span>
    <span className={valueClass}>{value}</span>
  </div>
);

export default Index;