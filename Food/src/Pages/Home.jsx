import React from 'react';

const Home = () => {
  // Generate an array of 25 image paths
  const images = Array.from({ length: 25 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 mb-4 tracking-tight">
          Delicious Finds
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Explore our curated collection of culinary masterpieces.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {images.map((num) => {
          // Some files might be webp instead of avif based on earlier logs (e.g. image14.webp)
          const ext = num === 14 ? 'webp' : 'avif'; 
          return (
            <div 
              key={num} 
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-orange-500/20 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer bg-gray-800"
            >
              <div className="aspect-w-1 aspect-h-1 w-full relative h-64">
                <img
                  src={`/src/assets/image${num}.${ext}`}
                  alt={`Food ${num}`}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                  <span className="text-white font-semibold text-lg drop-shadow-md">
                    Dish #{num}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
