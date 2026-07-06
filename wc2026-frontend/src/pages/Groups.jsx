import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Users, Plus, Key } from 'lucide-react';
import { getMyGroupsService, createGroupService, joinGroupService } from '../services/groups.service';

const createGroupSchema = z.object({ name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres') });
const joinGroupSchema = z.object({ inviteCode: z.string().min(1, 'Ingresa un código válido') });

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState({ text: '', type: '' });

  const formCreate = useForm({ resolver: zodResolver(createGroupSchema) });
  const formJoin = useForm({ resolver: zodResolver(joinGroupSchema) });

  const fetchGroups = async () => {
    try {
      const response = await getMyGroupsService();
      setGroups(response.data || []);
    } catch (error) {
      console.error('Error al actualizar grupos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    async function getGroupsInit() {
      try {
        const response = await getMyGroupsService();
        if (isMounted) setGroups(response.data || []);
      } catch (error) {
        console.error('Error al inicializar grupos:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    getGroupsInit();
    return () => { isMounted = false; };
  }, []);

  const onCreateSubmit = async (data) => {
    setActionMessage({ text: '', type: '' });
    try {
      await createGroupService(data.name);
      setActionMessage({ text: '¡Grupo creado exitosamente!', type: 'success' });
      formCreate.reset();
      fetchGroups();
    } catch (error) {
      setActionMessage({ text: error.response?.data?.message || 'Error al crear', type: 'error' });
    }
  };

  const onJoinSubmit = async (data) => {
    setActionMessage({ text: '', type: '' });
    try {
      await joinGroupService(data.inviteCode);
      setActionMessage({ text: '¡Te has unido al grupo!', type: 'success' });
      formJoin.reset();
      fetchGroups();
    } catch (error) {
      setActionMessage({ text: error.response?.data?.message || 'Error al unirse', type: 'error' });
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Cargando grupos...</div>;

  return (
    <div className="max-w-6xl p-6 mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Mis Grupos</h1>

      {actionMessage.text && (
        <div className={`p-4 text-sm rounded-md ${actionMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {actionMessage.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex items-center mb-4 text-blue-600"><Plus size={24} className="mr-2" /><h2 className="text-xl font-bold text-gray-800">Crear Nuevo Grupo</h2></div>
          <form onSubmit={formCreate.handleSubmit(onCreateSubmit)} className="space-y-4">
            <input type="text" {...formCreate.register('name')} placeholder="Nombre del grupo" className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {formCreate.formState.errors.name && <p className="text-xs text-red-500">{formCreate.formState.errors.name.message}</p>}
            <button type="submit" disabled={formCreate.formState.isSubmitting} className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300">Crear Grupo</button>
          </form>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex items-center mb-4 text-green-600"><Key size={24} className="mr-2" /><h2 className="text-xl font-bold text-gray-800">Unirse con Código</h2></div>
          <form onSubmit={formJoin.handleSubmit(onJoinSubmit)} className="space-y-4">
            <input type="text" {...formJoin.register('inviteCode')} placeholder="Ej: A1B2C3" className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase" />
            {formJoin.formState.errors.inviteCode && <p className="text-xs text-red-500">{formJoin.formState.errors.inviteCode.message}</p>}
            <button type="submit" disabled={formJoin.formState.isSubmitting} className="w-full py-2 text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-green-300">Unirse al Grupo</button>
          </form>
        </div>
      </div>

      <div className="pt-6">
        <h2 className="mb-4 text-xl font-bold text-gray-800">Grupos a los que pertenezco</h2>
        {groups.length === 0 ? (
          <p className="text-gray-500">Aún no perteneces a ningún grupo.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <Link key={group.id} to={`/groups/${group.id}`} className="block p-5 transition-shadow bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-800 truncate">{group.name}</h3>
                  <Users className="text-blue-500" size={20} />
                </div>
                <p className="text-sm text-gray-500">Código: <span className="font-mono font-semibold text-gray-800">{group.inviteCode}</span></p>
                <div className="mt-4 text-sm font-medium text-blue-600 hover:underline">Ver clasificación &rarr;</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Groups;