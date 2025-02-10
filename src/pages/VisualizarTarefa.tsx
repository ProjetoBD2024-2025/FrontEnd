import React from "react";
import { X } from "lucide-react";
import { formatarData } from "./Home";

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tarefa: {
    ID_Tarefa: number;
    Nome: string;
    Descricao: string;
    Data_Inicio: string;
    Data_Fim_Prev: string;
    Status: "Pendente" | "Em andamento" | "Concluído";
  } | null;
}

const statusColors = {
  "Pendente": "bg-yellow-300",
  "Em andamento": "bg-blue-300",
  "Concluído": "bg-green-300",
};

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ isOpen, onClose, tarefa }) => {
  if (!isOpen || !tarefa) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg relative">
        
        {/* Botão de Fechar */}
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-4">Detalhes da Tarefa</h2>

        <div className="space-y-3">
          <p className="text-lg font-semibold text-gray-700">{tarefa.Nome}</p>
          <p className="text-gray-600"><strong>Descrição:</strong> {tarefa.Descricao}</p>
          <p className="text-gray-600"><strong>Data de Início:</strong> {formatarData(tarefa.Data_Inicio)}</p>
          <p className="text-gray-600"><strong>Data Fim Previsto:</strong> {formatarData(tarefa.Data_Fim_Prev)}</p>
          
          <p className="text-gray-600 flex items-center">
            <strong>Status:</strong> 
            <span className={`ml-2 px-3 py-1 rounded text-white text-sm ${statusColors[tarefa.Status]}`}>
              {tarefa.Status}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
