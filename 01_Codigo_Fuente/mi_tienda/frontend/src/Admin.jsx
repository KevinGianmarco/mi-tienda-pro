import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

function Admin() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', image: '', category: '', stock: ''
  });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();
  const API_URL = 'http://localhost:5000/api/products';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_URL);
      setProducts(res.data);
    } catch (err) {
      console.error("Error al cargar:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const prepareEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      stock: product.stock
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category) return toast.error("Por favor selecciona una categoría");

    try {
      const dataToSend = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock)
      };

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, dataToSend);
        toast.success("¡Producto actualizado!");
      } else {
        await axios.post(API_URL, dataToSend);
        toast.success("¡Producto guardado con éxito!");
      }
      
      setEditingId(null);
      setFormData({ name: '', description: '', price: '', image: '', category: '', stock: '' });
      fetchProducts();
    } catch (err) {
      toast.error("Hubo un error al procesar la solicitud");
      console.error(err);
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("¿Deseas eliminar este producto?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        toast.success("Producto eliminado");
        fetchProducts();
      } catch (err) {
        toast.error("Error al borrar");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black">Panel de Administración ⚙️</h1>
          <button onClick={handleLogout} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all shadow-sm">
            Cerrar Sesión 🔒
          </button>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm mb-12 border border-gray-100">
          <h2 className="text-xl font-bold mb-6 text-blue-600">
            {editingId ? "Editando Producto" : "Agregar Nuevo Producto"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* SELECT CORREGIDO: Usa formData y handleChange */}
            <select 
              name="category"
              value={formData.category} 
              onChange={handleChange}
              className="p-3 border rounded-xl bg-white"
              required
            >
              <option value="">Seleccionar Categoría</option>
              <option value="Electronica">Electrónica</option>
              <option value="Muebles">Muebles</option>
              <option value="Accesorios">Accesorios</option>
              <option value="Audio">Audio</option>
            </select>

            <input name="name" placeholder="Nombre" value={formData.name} onChange={handleChange} className="p-3 border rounded-xl" required />
            <input name="price" type="number" placeholder="Precio" value={formData.price} onChange={handleChange} className="p-3 border rounded-xl" required />
            <input name="stock" type="number" placeholder="Stock" value={formData.stock} onChange={handleChange} className="p-3 border rounded-xl" required />
            <input name="image" placeholder="URL Imagen" value={formData.image} onChange={handleChange} className="p-3 border rounded-xl" required />
            <textarea name="description" placeholder="Descripción" value={formData.description} onChange={handleChange} className="p-3 border rounded-xl md:col-span-3" required />
            
            <button type="submit" className={`md:col-span-3 text-white py-3 rounded-xl font-bold transition-colors ${editingId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {editingId ? "Actualizar Cambios" : "Guardar Producto"}
            </button>

            {editingId && (
              <button type="button" onClick={() => {setEditingId(null); setFormData({name:'',description:'',price:'',image:'',category:'',stock:''})}} className="md:col-span-3 text-gray-500 underline">
                Cancelar Edición
              </button>
            )}
          </form>
        </div>

        {/* TABLA DE PRODUCTOS */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-sm">
              <tr>
                <th className="p-5">PRODUCTO</th>
                <th className="p-5">CATEGORÍA</th>
                <th className="p-5 text-center">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="p-5 font-bold">{p.name}</td>
                  <td className="p-5 text-sm text-gray-500">{p.category}</td>
                  <td className="p-5 text-center flex justify-center gap-4">
                    <button onClick={() => prepareEdit(p)} className="text-blue-500 font-bold hover:underline">
                      Editar
                    </button>
                    <button onClick={() => deleteProduct(p._id)} className="text-red-500 font-bold hover:underline">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Admin;