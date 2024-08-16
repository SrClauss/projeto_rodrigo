import { invoke } from "@tauri-apps/api"
import CadastroCliente from "../../modals/CadastroCliente";

export default function ListClients({ clientes, onDeleteCliente }) {
    const handleDeleteCliente = (id) => {
        invoke("delete_cliente", { id: id })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
            onDeleteCliente();
    }
    const handleEditCliente = (cliente) => {
        onEditCliente(<CadastroCliente initialData={cliente}/>)
    }

    return (
        <div className="list-clientes">
            {clientes.map((cliente) => (
                <CardClientes key={cliente.id} cliente={cliente} onDeleteCliente={handleDeleteCliente} onEditCliente={handleEditCliente} />
            ))}
        </div>
    )
}


