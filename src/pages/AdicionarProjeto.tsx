import React, { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";

// Lista de status disponíveis
const statusOptions = ["Planejado", "Em andamento", "Concluído"];

// Função para formatar valores monetários no formato BRL (R$)
const formatarMoeda = (valor: number | string) => {
  if (!valor || isNaN(Number(valor))) return "";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(Number(valor));
};

// Função para formatar data para input (YYYY-MM-DD)
const formatarDataParaInput = (data: string) => {
  if (!data) return "";
  return data.split("T")[0]; // Remove a parte do horário
};

interface Cliente {
  CPF_CNPJ: string;
  Nome: string;
}

interface Equipe {
  ID_Equipe: number;
  Nome: string;
}

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const AddProjectModal: React.FC<AddProjectModalProps> = ({ isOpen, onClose, onSave }) => {
  const [projeto, setProjeto] = useState({
    Nome: "",
    Descricao: "",
    Data_Inicio: "",
    Data_Fim_Prev: "",
    Status: "Planejado",
    Orcamento_previsto: "",
    Contratante: 0,
    Equipe_Resp: 0,
  });

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [equipes, setEquipes] = useState<Equipe[]>([]);

  // Buscar clientes e equipes da API ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      axios
        .get("http://localhost:5000/clientes")
        .then((response) => setClientes(response.data))
        .catch((error) => console.error("Erro ao buscar clientes:", error));

      axios
        .get("http://localhost:5000/equipes")
        .then((response) => setEquipes(response.data))
        .catch((error) => console.error("Erro ao buscar equipes:", error));
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let value = e.target.value;

    if (e.target.name === "Orcamento_previsto") {
      value = value.replace(/\D/g, ""); // Remove tudo que não for número
      value = (Number(value) / 100).toFixed(2); // Ajusta casas decimais
    }

    setProjeto({
      ...projeto,
      [e.target.name]: value,
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const projetoFormatado = {
      ...projeto,
      Data_Inicio: formatarDataParaInput(projeto.Data_Inicio),
      Data_Fim_Prev: formatarDataParaInput(projeto.Data_Fim_Prev),
      Orcamento_previsto: Number(projeto.Orcamento_previsto), // Garante que seja um número
    };

    axios
      .post("http://localhost:5000/projetos", projetoFormatado)
      .then(() => {
        onSave(); // Atualiza a lista de projetos
        onClose(); // Fecha o modal
      })
      .catch((error) => {
        console.error("Erro ao adicionar projeto:", error);
        alert("Erro ao adicionar o projeto.");
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl relative">
        {/* Botão de Fechar */}
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
          <X className="w-6 h-6" />
        </button>

        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Adicionar Novo Projeto</h1>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Nome do Projeto</label>
            <input
              type="text"
              name="Nome"
              value={projeto.Nome}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
              required
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
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium">Data de Início</label>
              <input
                type="date"
                name="Data_Inicio"
                value={projeto.Data_Inicio}
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
                value={projeto.Data_Fim_Prev}
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
            <label className="block text-gray-700 font-medium">Contratante</label>
            <select
              name="Contratante"
              value={projeto.Contratante}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">Selecione um cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.CPF_CNPJ} value={cliente.CPF_CNPJ}>
                  {cliente.Nome}
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
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Equipe Responsável</label>
            <select
              name="Equipe_Resp"
              value={projeto.Equipe_Resp}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">Selecione uma equipe</option>
              {equipes.map((equipe) => (
                <option key={equipe.ID_Equipe} value={equipe.ID_Equipe}>
                  {equipe.Nome}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
            Salvar Projeto
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal;
