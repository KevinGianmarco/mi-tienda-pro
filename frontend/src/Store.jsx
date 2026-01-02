import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Store() {
  const [products, setProducts] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCartDetail, setShowCartDetail] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [selectedProduct, setSelectedProduct] = useState(null); 
  const [loading, setLoading] = useState(true);
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart_items');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart_items', JSON.stringify(cart));
  }, [cart]);

  // Función para traer productos actualizados
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

// Cargar al iniciar la página
useEffect(() => {
  fetchProducts();
}, []);

  const addToCart = (product) => {
    setCart(prevCart => [...prevCart, product]);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2000);
  };

  const clearCart = () => setCart([]);

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

  return (
    <div className="min-h-screen bg-gray-100 relative">
      
      {/* --- 1. NAVBAR --- */}
      <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md z-[100] border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <h1 onClick={resetStore} className="text-2xl font-black text-gray-800 cursor-pointer hover:opacity-80 transition-opacity">
            Mi Tienda <span className="text-blue-600">Pro</span>
          </h1>
          <div className="hidden md:flex gap-8 text-sm font-bold text-gray-500">
            <button onClick={resetStore} className="hover:text-blue-600 transition-colors">Inicio</button>
            <a href="#nosotros" className="hover:text-blue-600 transition-colors">Nosotros</a>
            <a href="#contacto" className="hover:text-blue-600 transition-colors">Contacto</a>
            <a href="#categorias" className="hover:text-blue-600 transition-colors">Categorías</a>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link to="/admin" className="bg-gray-800 text-white px-5 py-2 rounded-full text-xs font-bold shadow-md hover:bg-black transition-all">
                ⚙️ Ir al Panel
              </Link>
            )}
            <button onClick={() => setShowCartDetail(true)} className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-blue-700 transition-colors">
              🛒 ({cart.length})
            </button>
          </div>
        </div>
      </nav>

      <div className="h-24"></div>

      <div className="p-10">
        {/* Notificación */}
        {showMessage && (
          <div className="fixed top-24 right-5 bg-green-500 text-white px-6 py-3 rounded-full shadow-2xl animate-bounce z-[60]">
            ✅ ¡Agregado!
          </div>
        )}

        {/* Modal Carrito */}
        {showCartDetail && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
              <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-black">Tu Compra 🛒</h2>
                <button onClick={() => setShowCartDetail(false)} className="text-gray-400 hover:text-black text-xl">✕</button>
              </div>
              <div className="max-h-60 overflow-y-auto mb-4 text-sm">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between py-2 border-b">
                    <span>{item.name}</span>
                    <span className="font-bold">S/. {item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-2xl font-black border-t pt-4">
                <span>Total:</span>
                <span>S/. {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* BUSCADOR */}
        <div className="max-w-md mx-auto mb-8">
          <input
            type="text"
            placeholder="🔍 Buscar productos..."
            className="w-full p-5 rounded-2xl border border-gray-200 shadow-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* CATEGORÍAS */}
        {/* CATEGORÍAS ACTUALIZADAS */}
          <div id="categorias" className="scroll-mt-28 flex justify-center gap-3 mb-16 overflow-x-auto pb-2">
            {["Todas", "Electronica", "Muebles", "Audio", "Accesorios"].map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  fetchProducts(); // <--- Esto traerá los cambios del Admin al instante
                }}
                className={`px-6 py-2 rounded-full font-bold transition-all text-sm shadow-sm ${
                  selectedCategory === cat 
                  ? "bg-blue-600 text-white scale-105 shadow-blue-200" 
                  : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-100"
                }`}
              >
                {cat === "Todas" ? "✨ Todas" : cat}
              </button>
            ))}
          </div>

        {/* GRILLA DE PRODUCTOS O SKELETONS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {loading ? (
            [1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white p-6 rounded-[2.5rem] shadow-sm animate-pulse border border-gray-50">
                <div className="h-56 bg-gray-200 rounded-3xl mb-4"></div>
                <div className="h-6 bg-gray-200 rounded-full w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-100 rounded-full w-1/2 mb-8"></div>
                <div className="flex justify-between items-center">
                  <div className="h-8 bg-gray-200 rounded-xl w-24"></div>
                  <div className="h-10 bg-gray-200 rounded-xl w-32"></div>
                </div>
              </div>
            ))
          ) : (
            filteredProducts.map((product) => (
              <div key={product._id} className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-gray-50 group hover:shadow-2xl transition-all duration-300 relative flex flex-col justify-between h-full animate-in fade-in slide-in-from-bottom-6 duration-700">
                <div className="absolute top-8 right-8 z-20">
                  <span className="bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest shadow-lg">
                    {product.category}
                  </span>
                </div>
                <div>
                  <div onClick={() => setSelectedProduct(product)} className="h-56 overflow-hidden rounded-3xl mb-4 bg-gray-50 flex items-center justify-center relative cursor-pointer group">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-bold bg-black/50 px-4 py-2 rounded-full text-xs">Ver detalle 🔍</span>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 leading-tight">{product.name}</h2>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`flex h-2 w-2 rounded-full ${product.stock > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${product.stock < 5 && product.stock > 0 ? 'text-orange-500' : 'text-gray-400'}`}>
                      {product.stock > 0 ? (product.stock < 5 ? `¡Casi agotado! (${product.stock})` : `${product.stock} en stock`) : "Agotado"}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-50">
                  <span className="text-2xl font-black text-gray-900">S/. {product.price.toFixed(2)}</span>
                  <button disabled={product.stock === 0} onClick={() => addToCart(product)} className={`px-6 py-3 rounded-2xl font-bold transition-all shadow-md ${product.stock > 0 ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}>
                    {product.stock > 0 ? "Agregar" : "Agotado"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* MODAL DE DETALLE */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[150] p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[3rem] max-w-4xl w-full overflow-hidden shadow-2xl relative flex flex-col md:flex-row">
              <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 z-10 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors">✕</button>
              <div className="md:w-1/2 h-80 md:h-auto bg-gray-50">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
              </div>
              <div className="md:w-1/2 p-10 flex flex-col justify-center">
                <span className="text-xs font-black text-blue-600 uppercase mb-2 tracking-widest">{selectedProduct.category}</span>
                <h2 className="text-4xl font-black text-gray-900 mb-4">{selectedProduct.name}</h2>
                <p className="text-gray-500 text-lg mb-8">{selectedProduct.description}</p>
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-3xl font-black">S/. {selectedProduct.price.toFixed(2)}</span>
                  <span className="text-sm font-bold text-green-500 bg-green-50 px-3 py-1 rounded-lg">Stock: {selectedProduct.stock}</span>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 shadow-lg transition-all">Agregar al Carrito</button>
                  <a href={`https://wa.me/51965232758?text=Consulta sobre: ${selectedProduct.name}`} target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white p-4 rounded-2xl hover:scale-105 transition-transform shadow-lg"><svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.06 3.973L0 16l4.104-1.076a7.863 7.863 0 0 0 3.888 1.029h.003c4.365 0 7.923-3.559 7.927-7.93a7.9 7.9 0 0 0-2.321-5.697zM7.994 14.52a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/></svg></a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NOSOTROS */}
        <section id="nosotros" className="scroll-mt-24 max-w-6xl mx-auto mt-32 p-12 bg-white rounded-[3rem] shadow-xl border border-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-black mb-6">¿Quiénes <span className="text-blue-600">Somos?</span></h2>
              <p className="text-gray-600 leading-relaxed text-lg italic">"Calidad que se siente, diseño que se ve."</p>
              <p className="text-gray-600 leading-relaxed mt-4">En <strong>Mi Tienda Pro</strong>, simplificamos tus compras con una experiencia rápida, segura y moderna.</p>
            </div>
            <div className="rounded-[2rem] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
              <img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=800" alt="Nosotros" />
            </div>
          </div>
        </section>

        {/* CONTACTO */}
        <section id="contacto" className="scroll-mt-24 max-w-6xl mx-auto mt-32 mb-20 text-center">
          <h2 className="text-4xl font-black mb-12">Ponte en <span className="text-blue-600">Contacto</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">📍 Chiclayo, Perú</div>
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">📧 hola@mitiendapro.com</div>
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">📱 +51 900 000 000</div>
          </div>
        </section>

        <footer className="mt-20 py-10 text-center border-t border-gray-200">
          <p className="text-gray-400 text-sm">© 2026 Mi Tienda Pro</p>
          <Link to="/login" className="text-gray-100 select-none">.</Link> 
        </footer>
      </div>

      {/* WHATSAPP FLOTANTE */}
      <a href="https://wa.me/51965232758?text=Hola! Quiero información" target="_blank" className="fixed bottom-8 right-8 bg-[#25D366] text-white p-4 rounded-full shadow-2xl z-[200] group flex items-center">
        <svg width="32" height="32" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.06 3.973L0 16l4.104-1.076a7.863 7.863 0 0 0 3.888 1.029h.003c4.365 0 7.923-3.559 7.927-7.93a7.9 7.9 0 0 0-2.321-5.697zM7.994 14.52a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/></svg>
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap font-bold">
          <span className="pl-2">¿Dudas? Chatea con nosotros</span>
        </span>
      </a>
    </div>
  );
}

export default Store;