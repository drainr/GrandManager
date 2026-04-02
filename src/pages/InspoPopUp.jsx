import { useState, useEffect, useCallback } from "react";
import BlueButton from "../components/BlueButton.jsx";
import RedButton from "../components/RedButton.jsx";

const INSPIRATIONAL_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=800&fit=crop",
    quote: "Welcome Back! Let's make today amazing together.",
  },
  {
    src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=800&fit=crop",
    quote: "Believe you can and you're halfway there.",
  },
  {
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=800&fit=crop",
    quote: "Every moment is a fresh beginning.",
  },
  {
    src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=800&fit=crop",
    quote: "Stars can't shine without darkness.",
  },
  {
    src: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=600&h=800&fit=crop",
    quote: "Growth is a process, not an event.",
  },
  {
    src: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=600&h=800&fit=crop",
    quote: "Find joy in every moment.",
  },
  {
    src: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&h=800&fit=crop",
    quote: "Connect with loved ones, cherish every moment.",
  }
];

// Index 0 is always the welcome-back message
const WELCOME_INDEX = 0;

// Min/max seconds between random popups (~5 minutes)
const MIN_INTERVAL = 270;
const MAX_INTERVAL = 330;

export default function InspirationalPopup() {
  const [isOpen, setIsOpen] = useState(true);
  const [currentImage, setCurrentImage] = useState(INSPIRATIONAL_IMAGES[WELCOME_INDEX]);

  const getRandomInterval = () =>
    (Math.floor(Math.random() * (MAX_INTERVAL - MIN_INTERVAL + 1)) + MIN_INTERVAL) * 1000;

  const showPopup = useCallback(() => {
    const others = INSPIRATIONAL_IMAGES.filter((_, i) => i !== WELCOME_INDEX);
    const randomIndex = Math.floor(Math.random() * others.length);
    setCurrentImage(others[randomIndex]);
    setIsOpen(true);
  }, []);

  const closePopup = () => {
    setIsOpen(false);
    setCurrentImage(null);
  };

  // Random interval timer — starts after welcome is shown
  useEffect(() => {
    let timeoutId;

    const scheduleNext = () => {
      const delay = getRandomInterval();
      timeoutId = setTimeout(() => {
        showPopup(false);
        scheduleNext();
      }, delay);
    };

    scheduleNext();
    return () => clearTimeout(timeoutId);
  }, [showPopup]);

  if (!isOpen || !currentImage) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      {/* Modal card */}
      <div className="card bg-[#4d2c72] shadow-2xl w-full max-w-sm animate-[fadeSlideUp_0.3s_ease-out] relative">
        <div className="absolute top-0 right-0 z-10 scale-65">
          <RedButton text={'✕'} onClick={closePopup} />
        </div>
        <figure className="relative">
          <img
            src={currentImage.src}
            alt="Inspirational"
            className="w-full h-64 object-cover"
          />
        </figure>
        <div className="card-body items-center text-center py-5 px-6 text-white">
          <p className="text-lg font-semibold italic leading-relaxed">
            &ldquo;{currentImage.quote}&rdquo;
          </p>
          <div className="card-actions mt-3">
            <BlueButton text={'Thanks!'} onClick={closePopup} />
          </div>
        </div>
      </div>
    </div>
  );
}