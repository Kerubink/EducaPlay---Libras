import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const openDatabase = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = window.indexedDB.open("gameDatabase", 1);

    request.onerror = () => reject("Erro ao abrir o banco de dados");

    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("games")) {
        db.createObjectStore("games", { keyPath: "name" });
      }
    };
  });
};

const getGameFromDatabase = (gameName: string) => {
  return new Promise<any>((resolve, reject) => {
    openDatabase()
      .then((db) => {
        const transaction = db.transaction("games", "readonly");
        const store = transaction.objectStore("games");
        const request = store.get(gameName);

        request.onsuccess = () => resolve(request.result);

        request.onerror = () => reject("Erro ao recuperar o jogo");
      })
      .catch((error) => reject("Erro ao abrir o banco de dados"));
  });
};

const GameScreen = () => {
  const { gameName } = useParams<{ gameName: string }>();
  const navigate = useNavigate();
  const [gameData, setGameData] = useState<any | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledAlternatives, setShuffledAlternatives] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [remainingAttempts, setRemainingAttempts] = useState(3);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isGameLoaded, setIsGameLoaded] = useState(false);
  const [gameType, setGameType] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [timer, setTimer] = useState(30);
  const [infiniteMode, setInfiniteMode] = useState(false);

  useEffect(() => {
    if (gameName) {
      getGameFromDatabase(gameName)
        .then((game) => {
          if (game && game.file) {
            const reader = new FileReader();
            reader.onload = () => {
              try {
                const json = JSON.parse(reader.result as string);
                setGameData(json);
                setRemainingAttempts(json.maxAttempts || 3);
                setIsGameLoaded(true);
              } catch (e) {
                console.error("Erro ao parsear o JSON:", e);
              }
            };
            reader.readAsText(game.file);
          }
        })
        .catch((error) => console.error("Erro ao carregar o jogo:", error));
    }
  }, [gameName]);

  useEffect(() => {
    if (gameData && Array.isArray(gameData.signals)) {
      setupAlternatives();
    }
  }, [gameData, currentIndex, gameType]);

  useEffect(() => {
    if (!infiniteMode && timer === 0) {
      handleAnswer("");
    }
    if (!infiniteMode) {
      const interval = setInterval(() => {
        setTimer((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, infiniteMode]);

  const setupAlternatives = () => {
    const currentSignal = gameData.signals[currentIndex];
    const alternatives = gameData.signals.map((signal: any) => {
      switch (gameType) {
        case "signalToText":
          return { type: "text", value: signal.text };
        case "objectToSignal":
        case "textToSignal":
        case "signalToObject":
        default:
          return { type: "image", value: signal.signalImage };
      }
    });

    const correctAlternative =
      gameType === "signalToText"
        ? { type: "text", value: currentSignal.text }
        : { type: "image", value: currentSignal.signalImage };

    const wrongAlternatives = alternatives
      .filter((alt: any) => alt.value !== correctAlternative.value)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    setShuffledAlternatives(
      [correctAlternative, ...wrongAlternatives].sort(() => Math.random() - 0.5)
    );
  };

  const handleAnswer = (answer: string) => {
    const currentSignal = gameData.signals[currentIndex];
    const correctAnswer =
      gameType === "signalToText"
        ? currentSignal.text
        : currentSignal.signalImage;

    const isCorrect = correctAnswer === answer;
    setFeedback(isCorrect ? "Resposta Correta!" : "Resposta Errada!");

    setTimeout(() => {
      if (isCorrect) {
        setScore((prev) => prev + (gameData.rewards.points || 0));
      } else {
        setScore((prev) =>
          Math.max(0, prev + (gameData.penalties.wrongAnswer || 0))
        );

        if (infiniteMode) {
          alert(
            "Você perdeu sua única tentativa no modo infinito. Jogo encerrado."
          );
          setGameOver(true);
          navigate("/");
          return;
        } else {
          setRemainingAttempts((prev) => prev - 1);
          if (remainingAttempts - 1 === 0) {
            alert("Você perdeu todas as tentativas. Jogo encerrado.");
            setGameOver(true);
            navigate("/");
            return;
          }
        }
      }

      if (infiniteMode) {
        setCurrentIndex(Math.floor(Math.random() * gameData.signals.length));
      } else {
        if (currentIndex === gameData.signals.length - 1) {
          alert("Parabéns! Você completou o jogo!");
          navigate("/");
        } else {
          setCurrentIndex((prev) => prev + 1);
        }
      }
      setTimer(30);
      setFeedback(null);
    }, 1000);
  };

  const randomGameType = () => {
    const gameModes = [
      "signalToText",
      "objectToSignal",
      "signalToObject",
      "textToSignal",
    ];
    return gameModes[Math.floor(Math.random() * gameModes.length)];
  };

  if (isModalOpen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-md w-96">
          <h2 className="text-lg font-bold mb-4">Selecione o Tipo de Jogo</h2>
          {[
            { type: "signalToText", label: "Sinal para Texto" },
            { type: "objectToSignal", label: "Objeto para Sinal" },
            { type: "signalToObject", label: "Sinal para Objeto" },
            { type: "textToSignal", label: "Texto para Sinal" },
          ].map(({ type, label }) => (
            <button
              key={type}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg mb-4"
              onClick={() => {
                setGameType(type);
                setIsModalOpen(false);
              }}
            >
              {label}
            </button>
          ))}
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="infiniteMode"
              className="mr-2"
              checked={infiniteMode}
              onChange={(e) => setInfiniteMode(e.target.checked)}
            />
            <label htmlFor="infiniteMode">Modo Infinito</label>
          </div>
        </div>
      </div>
    );
  }

  if (!gameData) return <div>Carregando...</div>;

  return (
    <div className="flex flex-col items-center p-4 min-h-screen bg-gray-50">
      <header className="w-full bg-blue-600 text-white py-4 shadow-md">
        <h1 className="text-2xl font-bold text-center">{gameName}</h1>
      </header>

      <main className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg mt-6 w-full max-w-lg">
        <p className="text-lg font-semibold text-gray-800 mb-4">
          Pontuação: {score}
        </p>
        <p className="text-lg font-semibold text-gray-800 mb-4">
          {infiniteMode
            ? "Tentativa única no modo infinito"
            : `Tentativas Restantes: ${remainingAttempts}`}
        </p>{" "}
        {!infiniteMode && (
          <p className="text-lg font-semibold text-gray-800 mb-4">
            Tempo Restante: {timer}s
          </p>
        )}
        {feedback && (
          <div
            className={`text-center py-2 px-4 rounded-lg mb-4 font-bold ${
              feedback === "Resposta Correta!"
                ? "bg-green-200 text-green-800"
                : "bg-red-200 text-red-800"
            }`}
          >
            {feedback}
          </div>
        )}
        <div className="flex justify-center items-center mb-6">
          {gameType === "textToSignal" && (
            <div className="mb-6 text-xl font-semibold">
              {gameData.signals[currentIndex].text}
            </div>
          )}
          {(gameType === "signalToText" ||
            gameType === "objectToSignal" ||
            gameType === "signalToObject") && (
            <img
              src={gameData.signals[currentIndex].signalImage}
              alt={`Sinal ${currentIndex + 1}`}
              className="w-64 h-64 object-cover rounded-md shadow-lg border"
            />
          )}
        </div>
        <div className="grid grid-cols-2 gap-4 w-full">
          {shuffledAlternatives.map((alt, index) => (
            <button
              key={index}
              className="py-3 px-6 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
              onClick={() => handleAnswer(alt.value)}
            >
              {alt.type === "text" ? (
                alt.value
              ) : (
                <img
                  src={alt.value}
                  alt="Alternativa"
                  className="w-20 h-20 object-cover rounded-md"
                />
              )}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default GameScreen;
