import { useEffect, useState } from "react";
import axios from "axios";
import { Edit, Trash2, Plus } from "lucide-react";
import { toast } from "react-toastify";
import DeleteProjectModal from "./DeleteProject";

interface Contratante {
  CPF_CNPJ: string;
  Nome: string;
  Telefone: string;
  Email: string;
  Endereco: string;
  Senha: string;
}

const formatarCPF_CNPJ = (value: string) => {
    const cleanedValue = value.replace(/\D/g, "");
    if (cleanedValue.length <= 11) {
      return cleanedValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } else {
      return cleanedValue.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    }
  };

const formatarTelefone = (value: string) => {
    const cleanedValue = value.replace(/\D/g, "");
    if (cleanedValue.length <= 10) {
        return cleanedValue.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else {
        return cleanedValue.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    }
};

const ContratantesPage = () => {
  const [contratantes, setContratantes] = useState<Contratante[]>([]);
  const [filteredContratantes, setFilteredContratantes] = useState<Contratante[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingContratante, setEditingContratante] = useState<Contratante | null>(null);
  const [selectedContratante, setSelectedContratante] = useState<Contratante | null>(null);

  useEffect(() => {
    fetchContratantes();
  }, []);

  const fetchContratantes = () => {
    axios
      .get("http://localhost:5000/clientes")
      .then((response) => {
        setContratantes(response.data);
        setFilteredContratantes(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar contratantes:", error);
      });
  };

  useEffect(() => {
    const lowerCaseSearch = searchTerm.toLowerCase();
    const filtered = contratantes.filter((c) =>
      c.Nome.toLowerCase().includes(lowerCaseSearch) ||
      c.Email.toLowerCase().includes(lowerCaseSearch) ||
      c.Telefone.includes(lowerCaseSearch)
    );
    setFilteredContratantes(filtered);
  }, [searchTerm, contratantes]);

  const handleAddOrEditContratante = (contratante: Contratante) => {
    const sanitizedCPF_CNPJ = contratante.CPF_CNPJ.replace(/\D/g, "");
    const sanitizedTelefone = contratante.Telefone.replace(/\D/g, "");
  
    const contratanteFormatado = {
      ...contratante,
      CPF_CNPJ: sanitizedCPF_CNPJ,
      Telefone: sanitizedTelefone,
    };
  
    if (editingContratante) {
      axios.put(`http://localhost:5000/clientes/${sanitizedCPF_CNPJ}`, contratanteFormatado)
        .then(() => {
          toast.success("Contratante atualizado com sucesso!");
          fetchContratantes();
        })
        .catch(() => toast.error("Erro ao atualizar contratante."));
    } else {
      axios.post("http://localhost:5000/clientes", contratanteFormatado)
        .then(() => {
          toast.success("Contratante adicionado com sucesso!");
          fetchContratantes();
        })
        .catch(() => toast.error("Erro ao adicionar contratante."));
    }
  
    setModalOpen(false);
    setEditingContratante(null);
  };

  const handleDeleteContratante = () => {
    if (selectedContratante) {
      axios.delete(`http://localhost:5000/clientes/${selectedContratante.CPF_CNPJ}`)
        .then(() => {
          toast.success("Contratante removido com sucesso!");
          fetchContratantes();
        })
        .catch(() => toast.error("Erro ao remover contratante."));
    }
    setDeleteModalOpen(false);
    setSelectedContratante(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Lista de Contratantes</h1>
      <div className="flex justify-between w-full max-w-4xl mb-4">
        <input
          type="text"
          placeholder="Pesquisar contratante..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
        />
        <button
          className="ml-2 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
          style={{ backgroundColor: "rgb(28 93 173)" }}
          onClick={() => {
            setEditingContratante(null);
            setModalOpen(true);
          }}
        >
          <Plus className="w-5 h-5 mr-1" /> Novo
        </button>
      </div>
      <div className="w-full max-w-4xl bg-white p-4 rounded-lg shadow">
        {filteredContratantes.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {filteredContratantes.map((c) => (
              <li key={c.CPF_CNPJ} className="p-4 flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold text-gray-800">{c.Nome}</p>
                  <p className="text-gray-600 text-sm">{formatarCPF_CNPJ(c.CPF_CNPJ)}</p>
                  <p className="text-gray-600 text-sm">{c.Email}</p>
                  <p className="text-gray-600 text-sm">{formatarTelefone(c.Telefone)}</p>
                  <p className="text-gray-500 text-sm">{c.Endereco}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => {
                      setEditingContratante(c);
                      setModalOpen(true);
                    }}
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => {
                      setSelectedContratante(c);
                      setDeleteModalOpen(true);
                    }}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 text-center">Nenhum contratante encontrado.</p>
        )}
      </div>
      {isModalOpen && (
        <ModalContratante
          contratante={editingContratante}
          onSave={handleAddOrEditContratante}
          onClose={() => setModalOpen(false)}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteProjectModal
          projectName={selectedContratante?.Nome || ""}
          onConfirm={handleDeleteContratante}
          onClose={() => setDeleteModalOpen(false)}
          isOpen={isDeleteModalOpen}
        />
      )}
    </div>
  );
};

interface ModalContratanteProps {
    contratante: Contratante | null;
    onSave: (contratante: Contratante) => void;
    onClose: () => void;
}

const ModalContratante = ({ contratante, onSave, onClose }: ModalContratanteProps) => {
    const [form, setForm] = useState<Contratante>(
      contratante || { CPF_CNPJ: "", Nome: "", Telefone: "", Email: "", Endereco: "", Senha: "" }
    );
  
    const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-bold mb-4">{contratante ? "Editar Contratante" : "Novo Contratante"}</h2>
          <input
            name="CPF_CNPJ"
            value={formatarCPF_CNPJ(form.CPF_CNPJ)}
            onChange={handleChange}
            className="w-full p-2 mb-2 border rounded"
            placeholder="CPF/CNPJ"
            maxLength={18}
          />
          <input name="Nome" value={form.Nome} onChange={handleChange} className="w-full p-2 mb-2 border rounded" placeholder="Nome" />
          <input name="Email" value={form.Email} onChange={handleChange} className="w-full p-2 mb-2 border rounded" placeholder="Email" />
          <input name="Telefone" value={formatarTelefone(form.Telefone)} onChange={handleChange} className="w-full p-2 mb-2 border rounded" placeholder="Telefone" />
          <input name="Endereco" value={form.Endereco} onChange={handleChange} className="w-full p-2 mb-4 border rounded" placeholder="Endereço" />
          <input
            name="Senha"
            value={contratante ? "••••••••" : form.Senha}
            onChange={handleChange}
            className="w-full p-2 mb-4 border rounded"
            placeholder="Senha"
            disabled={!!contratante}
          />
          <button onClick={() => onSave(form)} className="text-white px-4 py-2 rounded" style={{ backgroundColor: "rgb(28 93 173)" }}>Salvar</button>
          <button onClick={onClose} className="ml-2 text-gray-600">Cancelar</button>
        </div>
      </div>
    );
};
  
export default ContratantesPage;
