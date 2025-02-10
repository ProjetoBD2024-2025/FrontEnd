import { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import { toast } from "react-toastify";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  projetoId: number;
}

const statusOptions = ["Pendente", "Em andamento", "Concluído"];

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onSave, projetoId }) => {
  const [tarefa, setTarefa] = useState({
    Nome: "",
    Descricao: "",
    Data_Inicio: "",
    Data_Fim_Prev: "",
    Status: "Pendente",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setTarefa({ ...tarefa, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tarefa.Nome || !tarefa.Descricao || !tarefa.Data_Inicio || !tarefa.Data_Fim_Prev) {
      toast.warn("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      await axios.post(`http://localhost:5000/projetos/${projetoId}/tarefas`, tarefa);
      toast.success("Tarefa adicionada com sucesso!");
      onSave();
      onClose();
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
      toast.error("Erro ao adicionar a tarefa.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md relative">
        {/* Botão Fechar */}
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-bold text-gray-800 text-center mb-4">Adicionar Nova Tarefa</h2>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Nome</label>
            <input
              type="text"
              name="Nome"
              value={tarefa.Nome}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Descrição</label>
            <textarea
              name="Descricao"
              value={tarefa.Descricao}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium">Data de Início</label>
              <input
                type="date"
                name="Data_Inicio"
                value={tarefa.Data_Inicio}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Data de Fim Prevista</label>
              <input
                type="date"
                name="Data_Fim_Prev"
                value={tarefa.Data_Fim_Prev}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Status</label>
            <select
              name="Status"
              value={tarefa.Status}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 bg-white"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-2">
            <button onClick={onClose} type="button" className="bg-gray-300 text-white px-4 py-2 rounded-md hover:bg-gray-600">
              Cancelar
            </button>
            <button type="submit" className="text-white px-6 py-2 rounded-md hover:bg-blue-300" style={{ backgroundColor: "rgb(28 93 173)" }}>
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
