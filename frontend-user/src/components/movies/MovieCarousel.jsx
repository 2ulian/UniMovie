import { useState, useRef } from "react";
import MovieCard from "./MovieCard";

function MovieCarousel({ title, movies }) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;
    const newScrollPosition =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollPosition,
      behavior: "smooth",
    });

    // Mettre à jour les boutons après le scroll
    setTimeout(updateScrollButtons, 300);
  };

  return (
    <section className="py-8 relative group/carousel">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 px-4">{title}</h2>

      {/* Bouton Gauche */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black p-2 rounded-r opacity-0 group-hover/carousel:opacity-100 transition-opacity"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      {/* Container scrollable */}
      <div
        ref={scrollContainerRef}
        onScroll={updateScrollButtons}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-4"
        style={{ scrollbarWidth: "none" }}
      >
        {movies.map((movie) => (
          <div key={movie.id} className="shrink-0 w-48 group/card">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>

      {/* Bouton Droite */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black p-2 rounded-l opacity-0 group-hover/carousel:opacity-100 transition-opacity"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}
    </section>
  );
}

export default MovieCarousel;
