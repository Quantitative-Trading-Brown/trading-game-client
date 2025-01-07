"use client";

const FullscreenButton = () => {
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen().catch(console.error);
    }
  };
  return (
    <button
      onClick={toggleFullScreen}
      className="fixed top-4 right-4 p-2 bg-gray-700 text-white 
      shadow-lg hover:bg-gray-600 hover:shadow-xl transition-all"
    >
      Full Screen
    </button>
  );
};

export default FullscreenButton;
