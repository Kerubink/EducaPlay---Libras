import React, { useState } from "react";

const GameSinal = ({ onSave }) => {
  const [signals, setSignals] = useState([]);
  const [currentSignalImage, setCurrentSignalImage] = useState(null);
  const [currentRepresentationImage, setCurrentRepresentationImage] =
    useState(null);
  const [currentText, setCurrentText] = useState("");
  const [gameName, setGameName] = useState("");
  const [timeLimit, setTimeLimit] = useState(60); // Default: 60 seconds
  const [maxAttempts, setMaxAttempts] = useState(3); // Default: 3 attempts
  const [rewardsPoints, setRewardsPoints] = useState(10); // Default points
  const [bonusPoints, setBonusPoints] = useState(50); // Default bonus
  const [difficulty, setDifficulty] = useState("easy"); // Default difficulty

  const handleImageUpload = (e, setImage) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSignal = () => {
    if (currentSignalImage && currentRepresentationImage && currentText) {
      setSignals([
        ...signals,
        {
          signalImage: currentSignalImage,
          representationImage: currentRepresentationImage,
          text: currentText,
        },
      ]);
      setCurrentSignalImage(null);
      setCurrentRepresentationImage(null);
      setCurrentText("");
    } else {
      alert("Por favor, preencha todos os campos antes de adicionar um sinal.");
    }
  };

  const handleSaveGame = () => {
    if (!gameName.trim()) {
      alert("Por favor, insira o nome do jogo.");
      return;
    }

    if (signals.length === 0) {
      alert("Por favor, adicione pelo menos um sinal antes de salvar o jogo.");
      return;
    }

    const gameData = {
      name: gameName,
      type: "signals", // Automatically added
      difficulty,
      description: `Jogo de sinais criado para ensinar sinais específicos em Libras.`,
      timeLimit,
      maxAttempts,
      rewards: {
        points: rewardsPoints,
        bonus: bonusPoints,
      },
      penalties: {
        wrongAnswer: -5, // Fixed penalty
      },
      signals,
    };

    onSave(gameData);

    setSignals([]);
    setGameName("");
  };

  return (
    <form className="flex flex-col gap-4 overflow-auto">
      <label>
        Nome do jogo:
        <input
          type="text"
          placeholder="Digite o nome do jogo"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </label>

      <div className="flex">
      <div>
        <label>
          Dificuldade:
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="easy">Fácil</option>
            <option value="medium">Médio</option>
            <option value="hard">Difícil</option>
          </select>
        </label>

        <label>
          Limite de tempo (segundos):
          <input
            type="number"
            value={timeLimit}
            onChange={(e) => setTimeLimit(Number(e.target.value))}
            className="border p-2 rounded w-full"
          />
        </label>

        <label>
          Máximo de tentativas:
          <input
            type="number"
            value={maxAttempts}
            onChange={(e) => setMaxAttempts(Number(e.target.value))}
            className="border p-2 rounded w-full"
          />
        </label>

        <label>
          Pontos por acerto:
          <input
            type="number"
            value={rewardsPoints}
            onChange={(e) => setRewardsPoints(Number(e.target.value))}
            className="border p-2 rounded w-full"
          />
        </label>

        <label>
          Bônus por completar o jogo:
          <input
            type="number"
            value={bonusPoints}
            onChange={(e) => setBonusPoints(Number(e.target.value))}
            className="border p-2 rounded w-full"
          />
        </label>
      </div>

      <div>
        <label>
          Imagem do sinal:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, setCurrentSignalImage)}
            className="border p-2 rounded w-full"
          />
        </label>
        {currentSignalImage && (
          <img src={currentSignalImage} alt="Sinal" className="w-32 h-32" />
        )}

        <label>
          Imagem da representação:
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleImageUpload(e, setCurrentRepresentationImage)
            }
            className="border p-2 rounded w-full"
          />
        </label>
        {currentRepresentationImage && (
          <img
            src={currentRepresentationImage}
            alt="Representação"
            className="w-32 h-32"
          />
        )}

        <label>
          Significado do sinal:
          <input
            type="text"
            placeholder="Digite o significado"
            value={currentText}
            onChange={(e) => setCurrentText(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </label>

        <button
          type="button"
          onClick={handleAddSignal}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-500"
        >
          Adicionar Sinal
        </button>

        <div>
          <h2 className="text-xl font-bold">Sinais Adicionados:</h2>
          <ul className="space-y-2">
            {signals.map((signal, index) => (
              <li
                key={index}
                className="flex items-center gap-4 border p-2 rounded"
              >
                <img
                  src={signal.signalImage}
                  alt={`Sinal ${index}`}
                  className="w-16 h-16"
                />
                <img
                  src={signal.representationImage}
                  alt={`Representação ${index}`}
                  className="w-16 h-16"
                />
                <span>{signal.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      </div>

      <button
        type="button"
        onClick={handleSaveGame}
        className="mt-6 bg-green-600 text-white p-2 rounded hover:bg-green-500"
      >
        Salvar Jogo
      </button>
    </form>
  );
};

export default GameSinal;
