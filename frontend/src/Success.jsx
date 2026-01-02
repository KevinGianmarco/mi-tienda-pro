import { Link } from 'react-router-dom';
import { useEffect } from 'react';

function Success() {
  // Opcional: Podrías lanzar confeti aquí con una librería externa
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-[3.5rem] p-12 max-w-2xl w-full shadow-2xl text-center animate-in zoom-in duration-500">
        
        {/* Icono de Éxito Animado */}
        <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tighter">
          ¡Pago <span className="text-blue-600">Exitoso!</span>
        </h1>
        
        <p className="text-gray-500 text-lg mb-10 leading-relaxed">
          Tu pedido ha sido procesado correctamente. Hemos enviado un correo con los detalles de tu compra y el número de seguimiento.
        </p>

        {/* Tarjeta de Resumen Rápido */}
        <div className="bg-blue-50 rounded-[2rem] p-8 mb-10 text-left">
          <h3 className="font-bold text-blue-800 uppercase tracking-widest text-xs mb-4">Próximos pasos</h3>
          <ul className="space-y-3 text-blue-900 font-medium">
            <li className="flex gap-2">📦 Prepararemos tu paquete en 24h.</li>
            <li className="flex gap-2">🚚 Recibirás un SMS cuando esté en camino.</li>
            <li className="flex gap-2">📧 Revisa tu bandeja de entrada para la factura.</li>
          </ul>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <Link 
            to="/" 
            className="flex-1 bg-gray-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-black transition-all shadow-xl"
          >
            Volver a la Tienda
          </Link>
          <a 
            href="https://wa.me/51965232758" 
            target="_blank" 
            className="flex-1 bg-[#25D366] text-white py-5 rounded-2xl font-black text-lg hover:bg-[#20ba5a] transition-all shadow-xl flex items-center justify-center gap-2"
          >
            ¿Necesitas ayuda?
          </a>
        </div>
      </div>
    </div>
  );
}

export default Success;