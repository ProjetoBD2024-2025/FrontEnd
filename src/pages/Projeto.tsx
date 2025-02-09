import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { formatarData } from "./Home";
import UploadFile from "./UploadFile";
import { toast } from "react-toastify";

interface ProjetoDetalhado {
  Nome: string;
  Descricao: string;
  Data_Inicio: string;
  Data_Fim_Prev: string;
  Status: string;
  Orcamento_previsto: string;
  Contratante: {
    Cliente_ID: string;
    Cliente_Nome: string;
    Cliente_Telefone: string;
    Cliente_Email: string;
    Cliente_Endereco: string;
  };
  Equipe_Resp: {
    ID_Equipe: string;
    Nome: string;
    Supervisor: string;
    Supervisor_Nome: string;
  };
}

interface Tarefa {
  ID_Tarefa: number;
  Nome: string;
  Descricao: string;
  Status: string;
}

interface Documento {
  ID_Documento: number;
  Nome_Arquivo: string;
  Tipo_Arquivo: string;
}

const Projeto = () => {
  const { ID_Projeto } = useParams();
  const navigate = useNavigate();
  const [projeto, setProjeto] = useState<ProjetoDetalhado | null>(null);
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (ID_Projeto) {
      axios
        .get(`http://localhost:5000/projetos/${ID_Projeto}`)
        .then((response) => setProjeto(response.data))
        .catch(() => setError("Não foi possível carregar os dados do projeto."));
      axios
        .get(`http://localhost:5000/projetos/${ID_Projeto}/tarefas`)
        .then((response) => setTarefas(response.data))
        .catch(() => setError("Não foi possível carregar as tarefas do projeto."));
      axios
        .get(`http://localhost:5000/projetos/${ID_Projeto}/documentos`)
        .then((response) => setDocumentos(response.data))
        .catch(() => console.log('Projeto sem documentos'));
    }
  }, [ID_Projeto]);

  const handleUpload = async () => {
    if (!file) {
      toast.info("Selecione ou arraste um arquivo antes de enviar.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`http://localhost:5000/projetos/${ID_Projeto}/documentos`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Documento enviado com sucesso!");
      setFile(null);
      const response = await axios.get(`http://localhost:5000/projetos/${ID_Projeto}/documentos`);
      setDocumentos(response.data);
    } catch (error) {
      console.error("Erro ao enviar documento:", error);
      toast.error("Erro ao enviar o documento.");
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="flex items-center w-full max-w-xl gap-20">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-blue-600 hover:text-blue-800 transition mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar
        </button>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Detalhes do Projeto</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-full max-w-xl">
          {error}
        </div>
      )}

{projeto ? (
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-xl">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">{projeto.Nome}</h2>
          <p className="text-gray-600 mb-2"><strong>Descrição:</strong>{projeto.Descricao}</p>
          <p className="text-gray-600 mb-2"><strong>Data Início:</strong> {formatarData(projeto.Data_Inicio)}</p>
          <p className="text-gray-600 mb-2"><strong>Data Fim Previsto:</strong> {formatarData(projeto.Data_Fim_Prev)}</p>
          <p className="text-gray-600 mb-2"><strong>Status:</strong> 
            <span className={`ml-2 px-3 py-1 rounded text-white ${
              projeto.Status === "Concluído" ? "bg-green-500" : 
              projeto.Status === "Em andamento" ? "bg-blue-500" : 
              "bg-yellow-500"
            }`}>
              {projeto.Status}
            </span>
          </p>
          <p className="text-gray-600 mb-2"><strong>Orçamento Previsto:</strong> {projeto.Orcamento_previsto}</p>
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700">Contratante:</h3>
            <p className="text-gray-600 mb-2"><strong>Nome:</strong> {projeto.Contratante.Cliente_Nome}</p>
            <p className="text-gray-600 mb-2"><strong>Email:</strong> {projeto.Contratante.Cliente_Email}</p>
            <p className="text-gray-600 mb-2"><strong>Telefone:</strong> {projeto.Contratante.Cliente_Telefone}</p>
          </div>
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700">Equipe Responsável</h3>
            <p className="text-gray-600"><strong>Nome:</strong> {projeto.Equipe_Resp.Nome}</p>
            <p className="text-gray-600"><strong>Supervisor:</strong> {projeto.Equipe_Resp.Supervisor_Nome}</p>
          </div>

          {/* Seção de Tarefas */}
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Tarefas do Projeto</h3>
            {tarefas.length > 0 ? (
              <ul className="space-y-3">
                {tarefas.map((tarefa) => (
                  <li key={tarefa.ID_Tarefa} className="bg-white p-3 rounded shadow flex justify-between items-center">
                    <div>
                      <p className="text-gray-700 font-medium">{tarefa.Nome}</p>
                      <p className="text-gray-600 text-sm">{tarefa.Descricao}</p>
                    </div>
                    <span className={`px-3 py-1 rounded text-white text-sm ${
                      tarefa.Status === "Concluído" ? "bg-green-500" :
                      tarefa.Status === "Em andamento" ? "bg-blue-500" :
                      "bg-yellow-500"
                    }`}>
                      {tarefa.Status}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">Nenhuma tarefa encontrada para este projeto.</p>
            )}
          </div>

          {/* Upload de Documento */}
          <div className="mt-6 bg-gray-100 rounded-lg">
            <UploadFile file={file} setFile={setFile} handleUpload={handleUpload} />
          </div>

          {/* Seção de Documentos */}
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Documentos Anexados</h3>
            {documentos.length > 0 ? (
              <ul className="space-y-3">
                {documentos.map((doc) => (
                  <li key={doc.ID_Documento} className="bg-white p-3 rounded shadow flex justify-between items-center">
                    <span className="text-gray-700">{doc.Nome_Arquivo}</span>
                    <a
                      href={`http://localhost:5000/projetos/${ID_Projeto}/documentos/${doc.ID_Documento}`}
                      download={doc.Nome_Arquivo} // Garante o nome correto no download
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Baixar
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">Nenhum documento anexado.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="text-gray-600 text-lg">Carregando dados do projeto...</div>
      )}
    </div>
  );
};

export default Projeto;
