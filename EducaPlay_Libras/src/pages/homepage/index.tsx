import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Função para abrir o IndexedDB
const openDatabase = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = window.indexedDB.open("gameDatabase", 1);

    request.onerror = () => {
      reject("Error opening database");
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("games")) {
        db.createObjectStore("games", { keyPath: "name" });
      }
    };
  });
};

// Função para armazenar os arquivos no IndexedDB
const storeFilesInDatabase = (files: File[]) => {
  openDatabase()
    .then((db) => {
      const transaction = db.transaction("games", "readwrite");
      const store = transaction.objectStore("games");

      files.forEach((file) => {
        const fileData = {
          name: file.name,
          file: file,
        };

        store.put(fileData); // Armazena o arquivo no IndexedDB
      });

      transaction.oncomplete = () => {
        console.log("Arquivos armazenados no IndexedDB com sucesso!");
      };

      transaction.onerror = (event) => {
        console.error("Erro ao armazenar arquivos:", event);
      };
    })
    .catch((error) => {
      console.error("Erro ao abrir o banco de dados:", error);
    });
};

// Função para ler arquivos do IndexedDB
const getFilesFromDatabase = () => {
  return new Promise<any[]>((resolve, reject) => {
    openDatabase()
      .then((db) => {
        const transaction = db.transaction("games", "readonly");
        const store = transaction.objectStore("games");
        const request = store.getAll(); // Recupera todos os arquivos

        request.onsuccess = () => {
          resolve(request.result); // Retorna todos os jogos armazenados
        };

        request.onerror = () => {
          reject("Erro ao recuperar arquivos");
        };
      })
      .catch((error) => {
        reject("Erro ao abrir o banco de dados");
      });
  });
};

const Homepage = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [games, setGames] = useState<any[]>([]); // Para armazenar a lista de jogos
  const [selectedGame, setSelectedGame] = useState<any | null>(null); // Jogo selecionado
  const navigate = useNavigate(); // Para navegação para a página do jogo

  // Função para lidar com a seleção de arquivos
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setSelectedFiles(files); // Atualiza a lista de arquivos selecionados
      storeFilesInDatabase(files); // Armazena os arquivos no IndexedDB
    }
  };

  // Carregar a lista de jogos ao carregar a página
  useEffect(() => {
    getFilesFromDatabase()
      .then((games) => {
        setGames(games); // Armazena os jogos no estado
      })
      .catch((error) => {
        console.error("Erro ao carregar os jogos:", error);
      });
  }, []); // A lista de jogos é carregada uma vez, quando a página é montada

  // Função para selecionar o jogo
  const handleGameSelect = (game: any) => {
    setSelectedGame(game); // Define o jogo selecionado
    console.log("Jogo selecionado:", game.name);
    // Navega para a página do jogo
    navigate(`/game/${game.name}`);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-4">Upload e Seleção de Jogos</h1>

      {/* Input para selecionar arquivos e armazená-los */}
      <div className="mb-4">
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="border border-gray-300 p-2"
        />
      </div>

      {/* Lista de arquivos selecionados */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Arquivos Selecionados:</h2>
        {selectedFiles.length === 0 ? (
          <p className="text-gray-600">Nenhum arquivo selecionado.</p>
        ) : (
          <ul>
            {selectedFiles.map((file, index) => (
              <li key={index} className="text-gray-800">{file.name}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Lista de jogos armazenados no IndexedDB */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Jogos Disponíveis:</h2>
        {games.length === 0 ? (
          <p className="text-gray-600">Nenhum jogo encontrado.</p>
        ) : (
          <ul>
            {games.map((game, index) => (
              <li
                key={index}
                className="text-gray-800 cursor-pointer"
                onClick={() => handleGameSelect(game)} // Ao clicar no jogo, ele será selecionado
              >
                {game.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Homepage;
