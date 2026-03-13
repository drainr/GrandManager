import { useState, useEffect, useCallback } from "react";
import BlueButton from "../components/BlueButton.jsx";
import RedButton from "../components/RedButton.jsx";

const INSPIRATIONAL_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=800&fit=crop",
    quote: "Believe you can and you're halfway there.",
  },
  {
    src: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&h=800&fit=crop",
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
];

// Min/max seconds between random popups
const MIN_INTERVAL = 5;
const MAX_INTERVAL = 10;

export default function InspirationalPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  const getRandomInterval = () =>
    (Math.floor(Math.random() * (MAX_INTERVAL - MIN_INTERVAL + 1)) + MIN_INTERVAL) * 1000;

  const showPopup = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * INSPIRATIONAL_IMAGES.length);
    setCurrentImage(INSPIRATIONAL_IMAGES[randomIndex]);
    setIsOpen(true);
  }, []);

  const closePopup = () => {
    setIsOpen(false);
    setCurrentImage(null);
  };

  // Random interval timer
  useEffect(() => {
    let timeoutId;

    const scheduleNext = () => {
      const delay = getRandomInterval();
      timeoutId = setTimeout(() => {
        showPopup();
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
      <div className="card bg-base-100 shadow-2xl w-full max-w-sm animate-[fadeSlideUp_0.3s_ease-out] relative">
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
        <div className="card-body items-center text-center py-5 px-6">
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