import React, { useState } from 'react';
import { supabase } from '../Supabase';

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
  </svg>
);

const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

import { food_list, assets } from '../../public/assets/assets.js';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Cart State Variables
  const [cartItems, setCartItems] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (id) => {
    setCartItems((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => {
      const newCart = { ...prev };
      if (newCart[id] > 1) {
        newCart[id] -= 1;
      } else {
        delete newCart[id];
      }
      return newCart;
    });
  };

  const cartTotalQuantity = Object.values(cartItems).reduce((sum, q) => sum + q, 0);

  const handleCheckout = async () => {
    try {
      const checkoutItems = [];
      for (const item in cartItems) {
        if (cartItems[item] > 0) {
          const food = food_list.find(f => f._id === item);
          if (food) {
            checkoutItems.push({
              name: food.name,
              price: food.price,
              quantity: cartItems[item]
            });
          }
        }
      }

      const response = await fetch("http://localhost:4000/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: checkoutItems })
      });
      const data = await response.json();
      
      if (data.success) {
        window.location.replace(data.session_url);
      } else {
        alert("Checkout Error: " + data.message);
      }
    } catch (error) {
      alert("Error: Backend is not running on port 4000. Please start the backend server.");
    }
  };

  const getCartTotalAmount = () => {
    let total = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const food = food_list.find(f => f._id === item);
        if (food) total += (food.price * 10) * cartItems[item];
      }
    }
    return total;
  };
  
  // Filter based on search query
  const filteredImages = food_list.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item._id === searchQuery
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans relative">
      
      {/* Cart Sidebar Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Background Overlay */}
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)}></div>
          
          {/* Sliding Panel */}
          <div className="relative w-full max-w-md bg-zinc-900/95 h-full shadow-2xl border-l border-zinc-800 flex flex-col transform transition-transform duration-300 ease-out backdrop-blur-xl">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center sticky top-0 z-10">
              <h2 className="text-2xl font-extrabold text-emerald-500 flex items-center gap-3">
                <CartIcon /> Your Cart
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="text-zinc-400 hover:text-white transition-colors p-2 text-2xl font-bold leading-none">✕</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4 shadow-inner">
              {cartTotalQuantity === 0 ? (
                <div className="text-center text-zinc-500 mt-20 flex flex-col items-center">
                  <div className="opacity-40 mb-4 scale-150 transform">
                    <CartIcon />
                  </div>
                  <p className="text-lg">Your cart is empty.</p>
                  <p className="text-emerald-500/50 mt-2">Try adding some delicious food!</p>
                </div>
              ) : (
                food_list.map((item) => {
                  if (cartItems[item._id] > 0) {
                    return (
                      <div key={item._id} className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-zinc-800/80 hover:border-emerald-500/30 transition-colors">
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover shadow-md border border-zinc-800" />
                        <div className="flex-1">
                          <h4 className="font-bold text-white leading-tight pr-2">{item.name}</h4>
                          <span className="text-emerald-500 font-bold block mt-1">₹{item.price * 10}</span>
                        </div>
                        <div className="flex items-center gap-3 bg-zinc-900/80 rounded-full p-1 border border-zinc-700/50 shadow-inner">
                          <button onClick={() => removeFromCart(item._id)} className="w-7 h-7 rounded-full bg-zinc-800 flex justify-center items-center text-white hover:bg-rose-500 transition-colors font-bold">-</button>
                          <span className="font-bold text-sm w-4 text-center">{cartItems[item._id]}</span>
                          <button onClick={() => addToCart(item._id)} className="w-7 h-7 rounded-full bg-emerald-500 flex justify-center items-center text-black hover:bg-emerald-400 transition-colors font-bold">+</button>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })
              )}
            </div>
            
            {cartTotalQuantity > 0 && (
              <div className="p-6 bg-black/40 border-t border-zinc-800 relative z-10 backdrop-blur-md">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-zinc-400 font-medium text-lg">Total Amount</span>
                  <span className="text-4xl font-black text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">₹{getCartTotalAmount()}</span>
                </div>
                <button onClick={handleCheckout} className="w-full bg-emerald-500 text-black font-extrabold py-4 rounded-xl text-lg hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-95">
                  Proceed to Checkout + Delivery Fee
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Header Icons */}
      <div className="absolute top-0 left-0 w-full px-6 py-6 flex justify-between items-start pointer-events-none z-[40]">
        
        {/* Left Side Icon (Profile / Logout) */}
        <button onClick={() => supabase.auth.signOut()} className="text-emerald-500 hover:text-rose-500 hover:bg-rose-500/10 title-['Logout'] transition-colors p-3.5 rounded-full pointer-events-auto bg-zinc-900/50 backdrop-blur-md border border-emerald-500/20 group shadow-lg">
          <ProfileIcon />
        </button>
        
        {/* Right Side Icon (Cart) */}
        <button onClick={() => setIsCartOpen(true)} className="text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors p-3.5 rounded-full pointer-events-auto relative bg-zinc-900/50 backdrop-blur-md border border-emerald-500/20 group shadow-lg overflow-visible">
          <CartIcon />
          {cartTotalQuantity > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center min-w-[20px] h-[20px] px-1.5 text-xs font-bold leading-none text-black transform translate-x-1/3 -translate-y-1/3 bg-emerald-500 rounded-full group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(16,185,129,0.5)]">
              {cartTotalQuantity}
            </span>
          )}
        </button>

      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Centered Super-Sized Search Section */}
        <div className="flex flex-col items-center justify-center pt-14 pb-20">
          <h1 className="text-7xl font-extrabold text-emerald-500 tracking-tight mb-10 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            Tomato.
          </h1>
          
          <div className="w-full max-w-4xl relative group">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-emerald-500 group-focus-within:text-emerald-400 transition-colors">
              <img src={assets.search_icon} alt="Search" className="w-8 h-8 opacity-80" />
            </div>
            <input
              type="text"
              className="block w-full pl-20 pr-8 py-6 border-2 border-zinc-800 rounded-full leading-5 bg-zinc-900/80 text-white placeholder-zinc-500 focus:outline-none focus:bg-zinc-900/90 focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500 text-2xl transition duration-300 ease-in-out shadow-2xl backdrop-blur-sm"
              placeholder="Find all you want over here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <header className="mb-10">
          <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">
            Top dishes near you
          </h2>
          <p className="text-emerald-500 font-medium text-lg">
            Discover the finest food & drinks in your area
          </p>
        </header>

        {filteredImages.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900 rounded-3xl border border-zinc-800 shadow-inner">
            <p className="text-xl text-zinc-300 font-medium">No dishes found matching "{searchQuery}".</p>
            <p className="text-emerald-500 mt-2">Try another search term!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredImages.map((item) => (
              <div 
                key={item._id} 
                className="group bg-zinc-900 rounded-3xl overflow-hidden shadow-xl transition-all duration-300 border border-zinc-800 hover:border-emerald-500/60 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] flex flex-col hover:-translate-y-2 relative"
              >
                <div className="w-full relative h-56 overflow-hidden bg-zinc-800 cursor-pointer">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-sm font-bold text-emerald-400 flex items-center shadow-lg border border-emerald-500/20">
                    ⭐ 4.5
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-bold text-2xl text-white mb-2 group-hover:text-emerald-400 transition-colors cursor-pointer">
                    {item.name}
                  </h3>
                  <p className="text-zinc-400 text-sm mb-5">{item.category}</p>
                  
                  <div className="flex justify-between items-center mt-auto pt-5 border-t border-zinc-800/80">
                    <span className="font-extrabold text-2xl text-emerald-500">
                      ₹{item.price * 10}
                    </span>
                    
                    {!cartItems[item._id] ? (
                      <button onClick={() => addToCart(item._id)} className="text-sm bg-emerald-500/10 text-emerald-400 px-5 py-2.5 rounded-full font-bold hover:bg-emerald-500 hover:text-black transition-colors border border-emerald-500/30 hover:border-transparent active:scale-95 shadow-lg">
                        Order Now
                      </button>
                    ) : (
                      <div className="flex items-center gap-3 bg-zinc-800/80 rounded-full p-1.5 border border-zinc-700 shadow-inner">
                        <button onClick={() => removeFromCart(item._id)} className="w-8 h-8 rounded-full bg-black/60 flex justify-center items-center text-white hover:bg-rose-500 hover:text-white transition-colors font-bold active:scale-90">-</button>
                        <span className="font-bold w-5 justify-center flex text-emerald-400">{cartItems[item._id]}</span>
                        <button onClick={() => addToCart(item._id)} className="w-8 h-8 rounded-full bg-emerald-500 flex justify-center items-center text-black hover:bg-emerald-400 transition-colors font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)] active:scale-90">+</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
