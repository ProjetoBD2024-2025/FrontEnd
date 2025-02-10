import React, { useEffect, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import { toast } from "react-toastify";

interface Projeto {
  ID_Projeto: number;
  Nome: string;
  Descricao: string;
  Data_Inicio: string;
  Data_Fim_Prev: string;
  Status: string;
  Orcamento_previsto: number;
  Contratante: {
    Cliente_ID: string;
    Cliente_Nome: string;
    Cliente_Telefone: string;
    Cliente_Email: string;
    Cliente_Endereco: string;
  }
  Equipe_Resp: {
    ID_Equipe: string;
    Nome: string;
    Supervisor: string;
    Supervisor_Nome: string;
  };
}

// Lista de status permitidos
const statusOptions = ["Planejado", "Em andamento", "Concluído"];

// Interfaces para os dropdowns
interface Cliente {
  CPF_CNPJ: string;
  Nome: string;
}

interface Equipe {
  ID_Equipe: number;
  Nome: string;
}

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projetoId: number | null;
  onSave: () => void;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({ isOpen, onClose, projetoId, onSave }) => {
  const [projeto, setProjeto] = useState<Projeto | null>({
    ID_Projeto: 0,
    Nome: "",
    Descricao: "",
    Data_Inicio: "",
    Data_Fim_Prev: "",
    Status: "",
    Orcamento_previsto: 0,
    Contratante: {
      Cliente_ID: "",
      Cliente_Nome: "",
      Cliente_Telefone: "",
      Cliente_Email: "",
      Cliente_Endereco: "",
    },
    Equipe_Resp: {
      ID_Equipe: "",
      Nome: "",
      Supervisor: "",
      Supervisor_Nome: "",
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [equipes, setEquipes] = useState<Equipe[]>([]);

  const formatarDataParaInput = (data: string) => {
    if (!data) return "";
    
    // Converter string para objeto Date
    const date = new Date(Date.parse(data));
    
    // Garantir que a data seja válida
    if (isNaN(date.getTime())) return "";

    const ano = date.getUTCFullYear();
    const mes = String(date.getUTCMonth() + 1).padStart(2, "0");
    const dia = String(date.getUTCDate()).padStart(2, "0");
    
    return `${ano}-${mes}-${dia}`;
  };
  
  const formatarDataParaEnvio = (data: string) => {
    if (!data) return null;
    return new Date(data).toISOString().split("T")[0];
  };

  const formatarMoeda = (valor: number | string) => {
    if (!valor || isNaN(Number(valor))) return "";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(Number(valor));
  };

  useEffect(() => {
    if (projetoId) {
      setIsLoading(true);
      axios
        .get(`http://localhost:5000/projetos/${projetoId}`)
        .then((response) => {
          const projetoComDatasFormatadas = {
            ...response.data,
            Data_Inicio: formatarDataParaInput(response.data.Data_Inicio),
            Data_Fim_Prev: formatarDataParaInput(response.data.Data_Fim_Prev),
          };
  
          setProjeto(projetoComDatasFormatadas);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Erro ao buscar projeto:", error);
          setError("Não foi possível carregar os dados do projeto.");
          setIsLoading(false);
        });

      axios
        .get("http://localhost:5000/clientes")
        .then((response) => setClientes(response.data))
        .catch((error) => console.error("Erro ao buscar clientes:", error));

      axios
        .get("http://localhost:5000/equipes")
        .then((response) => setEquipes(response.data))
        .catch((error) => console.error("Erro ao buscar equipes:", error));
    }
  }, [projetoId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (projeto) {
      const { name, value } = e.target;
  
      if (name === "Orcamento_previsto") {
        const formattedValue = value.replace(/\D/g, "");
        setProjeto({
          ...projeto,
          [name]: Number((Number(formattedValue) / 100).toFixed(2)),
        });
      } else if (name === "Contratante") {
        setProjeto({
          ...projeto,
          Contratante: {
            ...projeto.Contratante,
            Cliente_ID: value,
          },
        });
      } else if (name === "Equipe_Resp") {
        setProjeto({
          ...projeto,
          Equipe_Resp: {
            ...projeto.Equipe_Resp,
            ID_Equipe: value,
          },
        });
      } else {
        setProjeto({
          ...projeto,
          [name]: value,
        });
      }
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (projeto && projetoId) {
      const projetoFormatado = {
        ...projeto,
        Contratante: projeto.Contratante ? projeto.Contratante.Cliente_ID : null,
        Equipe_Resp: projeto.Equipe_Resp ? projeto.Equipe_Resp.ID_Equipe : null,
        Data_Inicio: formatarDataParaEnvio(projeto.Data_Inicio),
        Data_Fim_Prev: formatarDataParaEnvio(projeto.Data_Fim_Prev),
        Orcamento_previsto: Number(projeto.Orcamento_previsto),
      };
  
      axios
        .put(`http://localhost:5000/projetos/edit/${projetoId}`, projetoFormatado)
        .then(() => {
          toast.success("Projeto atualizado com sucesso!");
          onSave();
          onClose();
        })
        .catch((error) => {
          console.error("Erro ao salvar projeto:", error);
          alert("Erro ao salvar o projeto.");
        });
    } else {
      console.error("Erro: Projeto ou ID do projeto não encontrados.");
      alert("Erro ao processar os dados do projeto.");
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl relative">

        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-bold text-gray-800 text-center mb-4">Editar Projeto</h2>

        {isLoading ? (
          <p className="text-center">Carregando...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          projeto && (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium">Nome</label>
                <input
                  type="text"
                  name="Nome"
                  value={projeto.Nome}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium">Descrição</label>
                <input
                  type="text"
                  name="Descricao"
                  value={projeto.Descricao}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium">Data de Início</label>
                  <input
                    type="date"
                    name="Data_Inicio"
                    value={projeto.Data_Inicio ? formatarDataParaInput(projeto.Data_Inicio) : ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium">Data de Fim Previsto</label>
                  <input
                    type="date"
                    name="Data_Fim_Prev"
                    value={projeto.Data_Fim_Prev ? formatarDataParaInput(projeto.Data_Fim_Prev) : ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium">Status</label>
                <select
                  name="Status"
                  value={projeto.Status}
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

              <div>
                <label className="block text-gray-700 font-medium">Orçamento Previsto</label>
                <input
                  type="text"
                  name="Orcamento_previsto"
                  value={formatarMoeda(projeto.Orcamento_previsto)}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                />
              </div>


              <div>
                <label className="block text-gray-700 font-medium">Contratante</label>
                <select name="Contratante" value={projeto.Contratante.Cliente_ID} onChange={handleInputChange} className="w-full p-2 border rounded-md">
                  {clientes.map((cliente) => (
                    <option key={cliente.CPF_CNPJ} value={cliente.CPF_CNPJ}>{cliente.Nome}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium">Equipe Responsável</label>
                <select name="Equipe_Resp" value={projeto.Equipe_Resp.ID_Equipe} onChange={handleInputChange} className="w-full p-2 border rounded-md">
                  {equipes.map((equipe) => (
                    <option key={equipe.ID_Equipe} value={equipe.ID_Equipe}>{equipe.Nome}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="text-white px-6 py-2 rounded-md hover:bg-blue-700" style={{ backgroundColor: "rgb(28 93 173)" }}>
                Salvar
              </button>
            </form>
          )
        )}
      </div>
    </div>
  );
};

export default EditProjectModal;
