import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { Pencil, Trash2 } from "lucide-react"; // Ícones
import EditProject from "./EditProject";
import DeleteProjectModal from "./DeleteProject";
import AddProjectModal from "./AdicionarProjeto";

// Função para formatar datas
 export const formatarData = (data: string) => { 
  if (!data) return "-";

  try {
    // Criar data UTC sem ajuste de fuso horário
    const date = new Date(Date.parse(data));

    // Formatar corretamente sem alteração do dia
    return format(
      new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()), 
      "dd 'de' MMMM 'de' yyyy", 
      { locale: ptBR }
    );
  } catch {
    return "-";
  }
};


// Função para formatar moeda
const formatarMoeda = (valor: number) => {
  if (!valor || isNaN(valor)) return "-";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
};

interface Projeto {
  ID_Projeto: number;
  Nome: string;
  Descricao: string;
  Data_Inicio: string;
  Data_Fim_Prev: string;
  Status: string;
  Orcamento_previsto: number;
  Cliente_Nome: string;
  Cliente_Telefone: number;
  Cliente_Email: string;
  Cliente_Endereco: string;
  Equipe_Nome: string;
  Equipe_Supervisor: number;
  Supervisor_Nome: string;
}

const Home = () => {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Projeto | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  const openModal = (id: number) => {
    setSelectedProjectId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProjectId(null);
  };

  const openDeleteModal = (projeto: Projeto) => {
    setSelectedProject(projeto);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedProject(null);
  };

  const fetchProjects = () => {
    axios
      .get("http://localhost:5000/projetos")
      .then((response) => {
        setProjetos(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar projetos:", error);
        setError("Não foi possível carregar os projetos.");
      });
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = () => {
    if (selectedProject) {
      axios
        .delete(`http://localhost:5000/projetos/${selectedProject.ID_Projeto}`)
        .then(() => {
          setProjetos(projetos.filter((projeto) => projeto.ID_Projeto !== selectedProject.ID_Projeto));
          closeDeleteModal();
        })
        .catch((error) => {
          console.error("Erro ao deletar projeto:", error);
          alert("Erro ao deletar o projeto.");
        });
    }
  };

  const handleProjectClick = (id: number) => {
    navigate(`/projeto/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Projetos</h1>
        {error && (
          <p className="text-red-500 text-center bg-red-100 p-2 rounded w-full md:w-auto mt-4 md:mt-0">
            {error}
          </p>
        )}
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition mt-4 md:mt-0"
          onClick={() => setIsAddModalOpen(true)}
        >
          Adicionar Projeto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projetos.map((projeto) => (
          <div key={projeto.ID_Projeto} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition">
            <div className="flex justify-between items-center mb-2">
              <h2
                onClick={() => handleProjectClick(projeto.ID_Projeto)}
                className="text-xl font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition"
              >
                {projeto.Nome}
              </h2>
              <div className="flex gap-2">
                {/* Botão de Editar */}
                <button
                  onClick={() => openModal(projeto.ID_Projeto)}
                  className="p-1 bg-gray-200 rounded-md hover:bg-blue-300 transition"
                >
                  <Pencil className="text-black w-4 h-4" />
                </button>

                {/* Botão de Deletar */}
                <button
                  onClick={() => openDeleteModal(projeto)}
                  className="p-1 bg-gray-200 rounded-md hover:bg-red-300 transition"
                >
                  <Trash2 className="text-red-600 w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-gray-600 mt-3"><strong>Descrição:</strong> {projeto.Descricao}</p>
            <p className="text-gray-600 mt-3"><strong>Data Início:</strong> {formatarData(projeto.Data_Inicio)}</p>
            <p className="text-gray-600 mt-3"><strong>Data Fim Previsto:</strong> {formatarData(projeto.Data_Fim_Prev)}</p>

            {/* Status com cores diferentes */}
            <p className="text-gray-600 mt-3">
              <strong>Status:</strong>{" "}
              <span
                className={`px-2 py-1 rounded text-white ${
                  projeto.Status === "Concluído"
                    ? "bg-green-500"
                    : projeto.Status === "Em andamento"
                    ? "bg-blue-500"
                    : "bg-yellow-500"
                }`}
              >
                {projeto.Status}
              </span>
            </p>

            <p className="text-gray-600 mt-3"><strong>Orçamento Previsto:</strong> {formatarMoeda(projeto.Orcamento_previsto)}</p>
            <p className="text-gray-600 mt-3"><strong>Contratante:</strong> {projeto.Cliente_Nome}</p>
            <p className="text-gray-600 mt-3"><strong>Equipe:</strong> {projeto.Equipe_Nome}</p>
            <p className="text-gray-600 mt-3"><strong>Supervisor:</strong> {projeto.Supervisor_Nome}</p>
          </div>
        ))}
      </div>

      {/* Modal de Edição */}
      <EditProject isOpen={isModalOpen} onClose={closeModal} projetoId={selectedProjectId} onSave={fetchProjects} />

      {/* Modal de Exclusão */}
      <DeleteProjectModal 
        isOpen={isDeleteModalOpen} 
        onClose={closeDeleteModal} 
        onConfirm={handleDelete} 
        projectName={selectedProject?.Nome || ""}
      />

      <AddProjectModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={fetchProjects} />
    </div>
  );
};

export default Home;
