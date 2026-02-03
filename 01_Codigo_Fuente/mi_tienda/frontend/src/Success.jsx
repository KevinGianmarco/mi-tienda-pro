import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

function Success({ clearCart }) {
  useEffect(() => {
    // Solo vaciamos el carrito una vez al montar el componente
    if (clearCart) {
      clearCart();
    }
    window.scrollTo(0, 0);
    // IMPORTANTE: Dejamos los corchetes vacíos [] para evitar bucles infinitos
  }, []); 

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-[3.5rem] p-16 max-w-xl w-full shadow-2xl text-center">
        <h1 className="text-6xl font-black text-gray-900 mb-6 tracking-tighter">
          ¡Pago <span className="text-blue-600">Exitoso!</span>
        </h1>
        <p className="text-gray-500 text-xl mb-12">
          Tu pedido procesado y el carrito vaciado.
        </p>

        {/* El Link ahora funcionará porque no hay errores de renderizado bloqueándolo */}
        <Link 
          to="/" 
          className="inline-block bg-black text-white py-5 px-12 rounded-2xl font-black text-xl hover:bg-gray-800 transition-all shadow-xl active:scale-95"
        >
          Volver a la Tienda
        </Link>
      </div>
    </div>
  );
}

export default Success;