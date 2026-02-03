import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Store({ cart, setCart }) {
  const [products, setProducts] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCartDetail, setShowCartDetail] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [selectedProduct, setSelectedProduct] = useState(null); 
  const [loading, setLoading] = useState(true);
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const fetchProducts = () => {
    setLoading(true);
    axios.get('http://localhost:5000/api/products')
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    setCart(prevCart => [...prevCart, product]);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2000);
  };

  const clearCart = () => {
    setCart([]);
  };

  const resetStore = () => {
    setSearchTerm(""); 
    setSelectedCategory("Todas");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Todas" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const total = cart.reduce((acc, item) => acc + item.price, 0);

  const removeFromCart = (productId) => {
    setCart(prevCart => {
      const index = prevCart.findIndex(item => item._id === productId);
      if (index === -1) return prevCart;
      const newCart = [...prevCart];
      newCart.splice(index, 1);
      return newCart;
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">
      
      {/* --- 1. NAVBAR (Recuperado) --- */}
      <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md z-[100] border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <h1 onClick={resetStore} className="text-2xl font-black text-gray-800 cursor-pointer hover:opacity-80 transition-opacity">
            Mi Tienda <span className="text-blue-600">Pro</span>
          </h1>
          <div className="hidden md:flex gap-8 text-sm font-bold text-gray-500">
            <button onClick={resetStore} className="hover:text-blue-600 transition-colors">Inicio</button>
            <a href="#nosotros" className="hover:text-blue-600 transition-colors">Nosotros</a>
            <a href="#contacto" className="hover:text-blue-600 transition-colors">Contacto</a>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link to="/admin" className="bg-gray-800 text-white px-5 py-2 rounded-full text-xs font-bold shadow-md hover:bg-black">
                ⚙️ Admin
              </Link>
            )}
            <button onClick={() => setShowCartDetail(true)} className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-blue-700">
              🛒 ({cart.length})
            </button>
          </div>
        </div>
      </nav>

      <div className="h-24"></div>

      <div className="p-10">
        {/* Notificación (Recuperado) */}
        {showMessage && (
          <div className="fixed top-24 right-5 bg-green-500 text-white px-6 py-3 rounded-full shadow-2xl animate-bounce z-[60]">
            ✅ ¡Agregado!
          </div>
        )}

        {/* --- 2. BUSCADOR (Recuperado) --- */}
        <div className="max-w-md mx-auto mb-8">
          <input
            type="text"
            placeholder="🔍 Buscar productos..."
            className="w-full p-5 rounded-2xl border border-gray-200 shadow-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* --- 3. CATEGORÍAS (Recuperado) --- */}
        <div id="categorias" className="flex justify-center gap-3 mb-16 overflow-x-auto pb-2">
          {["Todas", "Electronica", "Muebles", "Audio", "Accesorios"].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full font-bold transition-all text-sm ${
                selectedCategory === cat 
                ? "bg-blue-600 text-white scale-105 shadow-blue-200" 
                : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-100"
              }`}
            >
              {cat === "Todas" ? "✨ Todas" : cat}
            </button>
          ))}
        </div>

        {/* --- 4. GRILLA DE PRODUCTOS (Recuperado) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {loading ? (
            <p className="text-center col-span-3 font-bold text-gray-400">Cargando...</p>
          ) : (
            filteredProducts.map((product) => (
              <div key={product._id} className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-gray-50 flex flex-col justify-between">
                <div>
                  <div className="h-56 overflow-hidden rounded-3xl mb-4 bg-gray-50">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
                  <span className="text-xs font-black text-blue-600 uppercase tracking-widest">{product.category}</span>
                </div>
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-50">
                  <span className="text-2xl font-black text-gray-900">S/. {product.price.toFixed(2)}</span>
                  <button onClick={() => addToCart(product)} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700">
                    Agregar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* --- 5. NOSOTROS (Recuperado) --- */}
        <section id="nosotros" className="scroll-mt-24 max-w-6xl mx-auto mt-32 p-12 bg-white rounded-[3rem] shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-black mb-6">¿Quiénes <span className="text-blue-600">Somos?</span></h2>
              <p className="text-gray-600 leading-relaxed text-lg italic">"Calidad que se siente, diseño que se ve."</p>
              <p className="text-gray-600 leading-relaxed mt-4">En Mi Tienda Pro, simplificamos tus compras con una experiencia rápida, segura y moderna.</p>
            </div>
            <div className="rounded-[2rem] overflow-hidden shadow-2xl rotate-3">
              <img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=800" alt="Nosotros" />
            </div>
          </div>
        </section>

        {/* --- 6. CONTACTO (Recuperado) --- */}
        <section id="contacto" className="scroll-mt-24 max-w-6xl mx-auto mt-32 mb-20 text-center">
          <h2 className="text-4xl font-black mb-12">Ponte en <span className="text-blue-600">Contacto</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-100">📍 Chiclayo, Perú</div>
            <div className="bg-white p-8 rounded-3xl border border-gray-100">📧 hola@mitiendapro.com</div>
            <div className="bg-white p-8 rounded-3xl border border-gray-100">📱 +51 900 000 000</div>
          </div>
        </section>

        {/* --- 7. MODAL CARRITO (Con Stripe Corregido) --- */}
        {showCartDetail && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[110] p-4">
            <div className="bg-white rounded-[3rem] p-10 max-w-lg w-full shadow-2xl relative">
              <button onClick={() => setShowCartDetail(false)} className="absolute top-8 right-8 text-gray-400 hover:text-black">✕</button>
              <h2 className="text-3xl font-black text-gray-900 mb-8">Tu Pedido 🛒</h2>
              
              <div className="max-h-[35vh] overflow-y-auto mb-8 pr-2">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-4 border-b border-gray-50">
                    <span className="font-bold text-gray-800">{item.name}</span>
                    <span className="text-blue-600 font-bold">S/. {item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-3xl p-6 mb-8 flex justify-between items-center">
                <span className="text-gray-400 font-black uppercase text-xs">Total</span>
                <span className="text-4xl font-black text-gray-900">S/. {total.toFixed(2)}</span>
              </div>

              <button 
                onClick={async () => {
                  try {
                    const response = await axios.post('http://localhost:5000/api/products/create-checkout-session', { items: cart });
                    if (response.data.url) window.location.href = response.data.url;
                  } catch (error) {
                    alert("Error al conectar con Stripe");
                  }
                }}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-blue-700"
              >
                💳 Pagar con Tarjeta
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Store;