"use client";
import Game from "./game";
import News from "./news";
import Graph from "./graph";
import FullscreenButton from "@/components/fullscreen"

const GamePage = () => {
  return (
    <div className="flex flex-col items-center min-h-screen max-h-screen gap-2 p-2">
      <div className="flex w-full justify-center border-white border-2 p-2">
        <h1 className="text-2xl font-bold">{"{Player Name}"}</h1>
      </div>
      <div className="flex flex-grow justify-center min-w-full gap-2">
        <div className="flex flex-col flex-grow gap-2">
          <div className="border-white border-2"><Game /></div>
          <div className="flex-grow border-white border-2 p-10"><Graph /></div>
        </div>

        <div className="border-white border-2"><News /></div>
      </div>
    </div>
  );
};

export default GamePage;
