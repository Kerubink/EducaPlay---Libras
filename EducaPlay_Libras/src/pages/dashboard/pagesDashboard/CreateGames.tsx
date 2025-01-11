import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GameSinal from "../../../components/Dashboard_components/FormsGames/gameSinal/gameSinal";

const CreateGames = () => {
  const handleSaveGame = (gameData) => {
    const blob = new Blob([JSON.stringify(gameData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${gameData.name}.json`;
    link.click();

    URL.revokeObjectURL(url);
    alert("Jogo salvo com sucesso!");
  };

  return (
    <div className="flex flex-col w-full p-5">
      <h1 className="text-2xl font-bold mb-4">Criar Jogos</h1>
      <Tabs defaultValue="sinais" className="w-full flex flex-col flex-1">
        <TabsList className="bg-black/45">
          <TabsTrigger value="sinais">Jogo de Sinais</TabsTrigger>
          <TabsTrigger value="alfabetizacao">Jogo de Letras</TabsTrigger>
          <TabsTrigger value="historias">Jogo de Histórias</TabsTrigger>
        </TabsList>
        <TabsContent value="sinais">
          <GameSinal onSave={handleSaveGame} />
        </TabsContent>
        <TabsContent value="alfabetizacao">
          <p>Funcionalidade para o jogo de alfabetização será implementada aqui.</p>
        </TabsContent>
        <TabsContent value="historias">
          <p>Funcionalidade para o jogo de histórias será implementada aqui.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreateGames;
