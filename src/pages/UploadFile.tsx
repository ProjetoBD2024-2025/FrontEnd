import { useState } from "react";
import axios from "axios";

interface UploadFileProps {
    handleUpload: () => void;
    file: File | null;
    setFile: (file: File) => void;
}

const UploadFile: React.FC<UploadFileProps> = ({ handleUpload, file, setFile }) => {
  const [dragging, setDragging] = useState(false);

  // Função para lidar com a seleção manual do arquivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // Lógica de Drag & Drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="mt-6 p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">Anexar Documento</h3>

      {/* Área de Drag & Drop */}
      <div
        className={`border-2 border-dashed p-6 rounded-md text-center cursor-pointer transition ${
          dragging ? "border-blue-600 bg-blue-100" : "border-gray-400 bg-white"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <p className="text-gray-600">Arraste um arquivo aqui ou clique para selecionar</p>
        <input type="file" onChange={handleFileChange} className="hidden" />
      </div>

      {/* Nome do arquivo selecionado */}
      {file && (
        <p className="mt-2 text-gray-800 font-medium">{file.name}</p>
      )}

      {/* Botão de Enviar */}
      <button
        onClick={handleUpload}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Enviar Documento
      </button>
    </div>
  );
};

export default UploadFile;
