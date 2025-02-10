import React, { useEffect, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import { toast } from "react-toastify";

interface Tarefa {
  ID_Tarefa: number;
  Nome: string;
  Descricao: string;
  Data_Inicio: string;
  Data_Fim_Prev: string;
  Status: string;
}

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  tarefaId: number | null;
  onSave: () => void;
}

const statusOptions = ["Pendente", "Em andamento", "Concluído"];

const EditarTarefa: React.FC<EditTaskModalProps> = ({ isOpen, onClose, tarefaId, onSave }) => {
  const [tarefa, setTarefa] = useState<Tarefa | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Formatar data para input (YYYY-MM-DD)
  const formatarDataParaInput = (data: string) => {
    if (!data) return "";
    return new Date(data).toISOString().split("T")[0];
  };

  useEffect(() => {
    if (tarefaId) {
      setIsLoading(true);
      axios
        .get(`http://localhost:5000/tarefas/${tarefaId}`)
        .then((response) => {
          setTarefa(response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Erro ao buscar tarefa:", error);
          setError("Não foi possível carregar os dados da tarefa.");
          setIsLoading(false);
        });
    }
  }, [tarefaId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (tarefa) {
      setTarefa({
        ...tarefa,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (tarefa && tarefaId) {
      const tarefaFormatada = {
        ...tarefa,
        Data_Inicio: formatarDataParaInput(tarefa.Data_Inicio),
        Data_Fim_Prev: formatarDataParaInput(tarefa.Data_Fim_Prev),
      };

      axios
        .put(`http://localhost:5000/tarefas/edit/${tarefaId}`, tarefaFormatada)
        .then(() => {
          console.log("Tarefa atualizada com sucesso!");
          toast.success("Tarefa atualizada com sucesso!");
          onSave();
          onClose();
        })
        .catch((error) => {
          console.error("Erro ao salvar tarefa:", error);
          toast.error("Erro ao salvar a tarefa.");
          alert("Erro ao salvar a tarefa.");
        });
    } else {
      console.error("Erro: Tarefa ou ID da tarefa não encontrados.");
      alert("Erro ao processar os dados da tarefa.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl relative">
        {/* Botão de fechar */}
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-bold text-gray-800 text-center mb-4">Editar Tarefa</h2>

        {isLoading ? (
          <p className="text-center">Carregando...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          tarefa && (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium">Nome da Tarefa</label>
                <input
                  type="text"
                  name="Nome"
                  value={tarefa.Nome}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium">Descrição</label>
                <textarea
                  name="Descricao"
                  value={tarefa.Descricao}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium">Data de Início</label>
                  <input
                    type="date"
                    name="Data_Inicio"
                    value={tarefa.Data_Inicio ? formatarDataParaInput(tarefa.Data_Inicio) : ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium">Data de Fim Previsto</label>
                  <input
                    type="date"
                    name="Data_Fim_Prev"
                    value={tarefa.Data_Fim_Prev ? formatarDataParaInput(tarefa.Data_Fim_Prev) : ""}
                    onChange={handleInputChange}
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
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-400"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-2">
                <button onClick={onClose} className="bg-gray-300 text-white px-4 py-2 rounded-md hover:bg-gray-600">
                  Cancelar
                </button>
                <button type="submit" className="text-white px-4 py-2 rounded-md hover:bg-blue-700" style={{ backgroundColor: "rgb(28 93 173)" }}>
                  Salvar
                </button>
              </div>
            </form>
          )
        )}
      </div>
    </div>
  );
};

export default EditarTarefa;
