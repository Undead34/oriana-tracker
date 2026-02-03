import { useState, useEffect } from "react";
import {
  Heart,
  Sparkles,
  Send,
  Clock,
  Crown,
  Terminal,
  Smartphone,
} from "lucide-react";

// --- DATOS INICIALES (Siempre visibles) ---
const INITIAL_DATA = [
  {
    id: 1,
    text: "Llegó a NetReady a las 9:34 AM... ¡Increíble!",
    tag: "Nuevo Récord",
    icon: "office",
    timestamp: "9:34 AM",
    date: "Hoy",
  },
  {
    id: 2,
    text: "Estaba en el Gym a las 10:00 AM y llegó a la ofi a las 11.",
    tag: "Fitness Queen",
    icon: "gym",
    timestamp: "11:00 AM",
    date: "Ayer",
  },
  {
    id: 3,
    text: "Confirmado: A Ori solo le gustan los hombres guapos, inteligentes, papuchos, con plata y coreanos. ¡Mis fuentes no mienten!",
    tag: "Gossip",
    icon: "star",
    timestamp: "10:47 PM",
    date: "Ayer",
  },
];

// --- ADAPTER SEGURO (Previene Pantalla Blanca) ---
const StorageAdapter = {
  KEY: "oriana_tracker_v1",

  // Memoria temporal por si falla localStorage
  memoryStore: [...INITIAL_DATA],

  isAvailable: () => {
    try {
      const test = "__storage_test__";
      window.localStorage.setItem(test, test);
      window.localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  },

  read: () => {
    try {
      if (StorageAdapter.isAvailable()) {
        const stored = window.localStorage.getItem(StorageAdapter.KEY);
        return stored ? JSON.parse(stored) : INITIAL_DATA;
      }
    } catch (e) {
      console.warn("Usando memoria temporal por seguridad");
    }
    return StorageAdapter.memoryStore;
  },

  write: (data) => {
    StorageAdapter.memoryStore = data; // Siempre actualiza memoria
    try {
      if (StorageAdapter.isAvailable()) {
        window.localStorage.setItem(StorageAdapter.KEY, JSON.stringify(data));
      }
    } catch (e) {
      // Si falla, no rompemos la app, solo seguimos en memoria
      console.warn("No se pudo guardar en disco, usando memoria");
    }
  },
};

const TrackerRepository = {
  getAllRecords: async () => {
    return new Promise((resolve) => {
      // Simulamos delay mínimo pero devolvemos datos seguros
      const data = StorageAdapter.read();
      setTimeout(() => resolve(data), 100);
    });
  },

  addRecord: async (newRecord, currentRecords) => {
    return new Promise((resolve) => {
      const updatedList = [newRecord, ...currentRecords];
      StorageAdapter.write(updatedList);
      resolve(updatedList);
    });
  },
};

// --- COMPONENTE PRINCIPAL ---

const App = () => {
  // Inicializamos con INITIAL_DATA para que NUNCA esté blanco al inicio
  const [records, setRecords] = useState(INITIAL_DATA);
  const [isLoading, setIsLoading] = useState(false); // Cambiado a false inicial para ver contenido

  const [inputText, setInputText] = useState("");
  const [selectedTag, setSelectedTag] = useState("Nuevo Récord");
  const [typingEffect, setTypingEffect] = useState("");
  const welcomeText = "console.log('Hello Oriana!');";

  // Intentar cargar datos guardados (si existen)
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await TrackerRepository.getAllRecords();
        if (data && data.length > 0) {
          setRecords(data);
        }
      } catch (error) {
        console.error("Error cargando datos, manteniendo iniciales");
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypingEffect(welcomeText.slice(0, i + 1));
      i++;
      if (i > welcomeText.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleAddRecord = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsLoading(true); // Solo mostramos carga al guardar

    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const todayString = now.toLocaleDateString([], {
      day: "numeric",
      month: "short",
    });

    const newRecord = {
      id: Date.now(),
      text: inputText,
      tag: selectedTag,
      icon: selectedTag === "Fitness Queen" ? "gym" : "star",
      timestamp: timeString,
      date: todayString,
    };

    try {
      const updatedRecords = await TrackerRepository.addRecord(
        newRecord,
        records,
      );
      setRecords(updatedRecords);
      setInputText("");
    } catch (e) {
      console.error("Error guardando");
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "office":
        return <Terminal size={18} className="text-pink-500" />;
      case "gym":
        return <Heart size={18} className="text-rose-500" />;
      default:
        return <Sparkles size={18} className="text-fuchsia-500" />;
    }
  };

  const buttonBaseClass =
    "font-bold transition-all transform active:scale-95 flex items-center justify-center gap-2";
  const cardBaseClass =
    "bg-white rounded-2xl p-5 shadow-sm border border-pink-50 hover:shadow-xl hover:shadow-pink-100/50 transition-all";

  return (
    <div className="min-h-screen bg-pink-50 font-sans selection:bg-pink-200 overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');
        
        body {
          font-family: 'Quicksand', sans-serif;
        }
        
        .font-code {
          font-family: 'Space Mono', monospace;
        }

        .glass-panel {
          background: rgba(255, 255, 255, 0.65);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.6);
        }
      `}</style>

      {/* Decorative Background Blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-[20%] right-[-5%] w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-80 h-80 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
        {/* Header Section */}
        <header className="text-center mb-8 md:mb-10">
          <div className="inline-flex items-center justify-center py-2 px-6 bg-white/60 backdrop-blur-sm rounded-full shadow-sm mb-4 md:mb-6 border border-pink-100">
            <span className="font-code text-pink-600 text-xs md:text-sm font-bold">
              {typingEffect}
              <span className="animate-pulse">_</span>
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-pink-900 mb-3 drop-shadow-sm flex items-center justify-center gap-2 md:gap-4 flex-wrap">
            <Crown className="text-yellow-400 fill-yellow-200 drop-shadow-sm w-8 h-8 md:w-10 md:h-10" />
            <span className="text-center">Oriana's Board</span>
            <Crown className="text-yellow-400 fill-yellow-200 drop-shadow-sm w-8 h-8 md:w-10 md:h-10" />
          </h1>
          <p className="text-pink-600 font-medium text-sm md:text-lg opacity-90 px-4">
            Keeping up with the Icon ✨ | NetReady's Main Character
          </p>
        </header>

        {/* Main Content Layout */}
        <main className="grid md:grid-cols-12 gap-6 md:gap-8">
          {/* Left Column: Input Area */}
          <div className="md:col-span-5 order-1 md:order-1">
            <div
              className={`glass-panel rounded-3xl p-5 md:p-6 shadow-xl shadow-pink-100/40 relative md:sticky md:top-6 flex flex-col gap-5 md:gap-6 transition-all`}
            >
              <h2 className="text-lg md:text-xl font-bold text-pink-800 flex items-center gap-2 pb-2 border-b border-pink-100/50">
                <Sparkles className="text-pink-500 fill-pink-200" size={20} />
                Nuevo Update
              </h2>

              <form
                onSubmit={handleAddRecord}
                className="flex flex-col gap-4 md:gap-5"
              >
                <div className="space-y-2">
                  <label className="text-xs font-bold text-pink-500 uppercase tracking-wider ml-1">
                    ¿Qué hizo Ori hoy?
                  </label>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Eje: Llegó temprano (milagro)..."
                    className="w-full p-4 rounded-2xl bg-white/80 border border-pink-100 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 focus:outline-none transition-all resize-none h-28 md:h-32 text-pink-800 placeholder:text-pink-300 text-sm shadow-inner"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-pink-500 uppercase tracking-wider ml-1">
                    Tipo de Evento
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["Nuevo Récord", "Gossip", "Slay", "Drama"].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setSelectedTag(tag)}
                        className={`px-3 py-2 md:px-4 md:py-2 rounded-xl text-xs font-bold transition-all border flex-grow md:flex-grow-0 ${
                          selectedTag === tag
                            ? "bg-pink-500 border-pink-500 text-white shadow-lg shadow-pink-500/30 transform scale-105"
                            : "bg-white border-pink-100 text-pink-400 hover:border-pink-300 hover:text-pink-500 hover:bg-pink-50"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg shadow-pink-500/30 hover:shadow-pink-500/40 hover:-translate-y-0.5 ${buttonBaseClass} ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  <Send size={18} />
                  {isLoading ? "Guardando..." : "Publicar en el Board"}
                </button>
              </form>

              {/* Mini Stats */}
              <div className="pt-4 border-t border-pink-100/50">
                <div className="flex justify-between items-center text-pink-700 bg-white/50 p-3 rounded-xl border border-pink-50">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Status Actual
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                    </span>
                    <span className="text-xs font-bold text-green-600">
                      Online
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: The Feed */}
          <div className="md:col-span-7 flex flex-col gap-4 order-2 md:order-2 pb-10">
            {records.map((record) => (
              <div
                key={record.id}
                className={`${cardBaseClass} hover:-translate-y-1 group`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                          record.tag === "Nuevo Récord"
                            ? "bg-yellow-50 text-yellow-600 border-yellow-100"
                            : record.tag === "Slay"
                              ? "bg-purple-50 text-purple-600 border-purple-100"
                              : "bg-pink-50 text-pink-600 border-pink-100"
                        }`}
                      >
                        {record.tag}
                      </span>
                    </div>
                    <span className="text-gray-400 text-[10px] font-code flex items-center gap-1.5 pl-1">
                      <Clock size={10} /> {record.date} • {record.timestamp}
                    </span>
                  </div>
                  <div className="p-2.5 bg-pink-50 rounded-xl text-pink-400 group-hover:bg-pink-100 group-hover:text-pink-500 transition-colors">
                    {getIcon(record.icon)}
                  </div>
                </div>

                <p className="text-gray-600 font-medium leading-relaxed text-sm md:text-base pl-1">
                  {record.text}
                </p>

                <div className="mt-4 flex gap-2 border-t border-gray-50 pt-3">
                  <button className="flex-1 py-2 md:py-1.5 rounded-lg text-xs font-bold text-gray-400 hover:text-pink-500 hover:bg-pink-50 flex items-center justify-center gap-1.5 transition-all">
                    <Heart
                      size={14}
                      className="group-hover:fill-pink-500 transition-colors"
                    />{" "}
                    Like
                  </button>
                  <button className="flex-1 py-2 md:py-1.5 rounded-lg text-xs font-bold text-gray-400 hover:text-pink-500 hover:bg-pink-50 flex items-center justify-center gap-1.5 transition-all">
                    Reply
                  </button>
                </div>
              </div>
            ))}

            {records.length === 0 && !isLoading && (
              <div className="text-center py-12 glass-panel rounded-3xl flex flex-col items-center justify-center">
                <div className="bg-pink-100 p-4 rounded-full mb-3 animate-bounce">
                  <Sparkles className="text-pink-400" size={32} />
                </div>
                <p className="text-pink-400 font-bold">
                  Aún no hay updates de la reina...
                </p>
                <p className="text-pink-300 text-sm mt-1">
                  ¡Sé la primera en escribir!
                </p>
              </div>
            )}

            {/* Cute Footer in the feed */}
            <div className="text-center py-4 md:py-8">
              <p className="text-pink-300 text-[10px] font-code uppercase tracking-widest opacity-70 hover:opacity-100 transition-opacity cursor-default flex items-center justify-center gap-2">
                &lt; Made for Oriana with 💖 /&gt;
                <span className="md:hidden inline-block">
                  <Smartphone size={10} />
                </span>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
