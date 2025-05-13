"use client";

import { useState } from "react";
import Player from "@vimeo/player";

const VideoPlayer = () => {
  const [currentVideo, setCurrentVideo] = useState<number>(0);

  const videos = [
    {
      id: 1,
      title: "Hoofdstuk 1",
      url: "https://player.vimeo.com/video/VIDEO_ID_1",
      duration: "42:01",
    },
    {
      id: 2,
      title: "Hoofdstuk 2",
      url: "https://player.vimeo.com/video/VIDEO_ID_2",
      duration: "37:45",
    },
    {
      id: 3,
      title: "Hoofdstuk 3",
      url: "https://player.vimeo.com/video/VIDEO_ID_3",
      duration: "50:23",
    },
  ];

  const handleVideoChange = (index: number) => {
    setCurrentVideo(index);
  };

  const handleNext = () => {
    if (currentVideo < videos.length - 1) {
      setCurrentVideo(currentVideo + 1);
    }
  };

  const handlePrevious = () => {
    if (currentVideo > 0) {
      setCurrentVideo(currentVideo - 1);
    }
  };

  return (
    <div className="flex flex-col min-h-screen pt-6">
      {/* Top Section with Video and Playlist */}
      <div className="flex justify-between">
        {/* Video Section */}
        <div className="w-full bg-black aspect-video rounded-lg overflow-hidden shadow-md">
          <iframe
            src={videos[currentVideo].url}
            width="100%"
            height="100%"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={videos[currentVideo].title}
          ></iframe>
        </div>

        {/* Playlist Section */}
        <div className="w-2/5 border-2 rounded-xl p-4 space-y-4 col-span-1 ml-4">
          <h2 className="text-lg font-semibold mb-4">Inhoudsopgave</h2>
          <ul>
            {videos.map((video, index) => (
              <li
                key={video.id}
                className={`p-3 mb-2 rounded-md cursor-pointer transition ${
                  currentVideo === index
                    ? "bg-blue-100 font-bold"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => handleVideoChange(index)}
              >
                <div className="flex justify-between items-center">
                  <span>{video.title}</span>
                  <span className="text-sm text-gray-500">{video.duration}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Controls Section */}
      <div className="flex justify-between items-center mt-6">
        {/* Current Chapter Info */}
        <h3 className="text-xl font-semibold">{videos[currentVideo].title}</h3>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentVideo === 0}
            className={`px-4 py-2 rounded-md font-medium ${
              currentVideo === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Vorige les
          </button>
          <button
            onClick={handleNext}
            disabled={currentVideo === videos.length - 1}
            className={`px-4 py-2 rounded-md font-medium ${
              currentVideo === videos.length - 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Volgende les
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
