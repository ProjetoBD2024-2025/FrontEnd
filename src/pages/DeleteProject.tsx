import React from "react";
import { X, Trash2 } from "lucide-react"; // Ícones para estilo

interface DeleteProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  projectName: string;
}

const DeleteProjectModal: React.FC<DeleteProjectModalProps> = ({ isOpen, onClose, onConfirm, projectName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
        <div className="flex justify-center mb-4">
          <Trash2 className="w-12 h-12 text-red-500" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 text-center">
          Tem certeza que deseja excluir <br></br> <span className="font-bold text-red-600">{projectName}</span>?
        </h2>

        <p className="text-gray-600 text-center mt-2">
          Essa ação não pode ser desfeita. O projeto será removido permanentemente.
        </p>
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
          >
            Deletar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProjectModal;
