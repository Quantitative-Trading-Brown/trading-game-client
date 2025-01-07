"use client";
import Game from "./game";
import News from "./news";
import Graph from "./graph";
import axios from "axios";

const AdminPage = () => {
  const code = localStorage.getItem('admin_code');
  const token = localStorage.getItem('admin_token');

  if (!code || !token) {
    window.location.href = "/";
  }

  try {
    f
  } catch {
    window.location.href = "/";
  }

  return (
    <div className="flex flex-col items-center gap-2 p-2 h-screen">
      <div className="flex flex-none w-full h-[3em] justify-center items-center border-white border-2 p-2">
        <h1 className="text-2xl font-bold">Game Code: {code}</h1>
      </div>
      <div className="flex flex-auto justify-center min-w-full gap-2 overflow-scroll">
        <div className="flex flex-col flex-grow gap-2">
          <div className="border-white border-2"><Game /></div>
          <div className="flex-grow border-white border-2 p-10"><Graph /></div>
        </div>

        <div className="border-white border-2 overflow-scroll overscroll-contain"><News /></div>
      </div>
    </div>
  );
};

export default AdminPage;
