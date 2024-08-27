export function maskCpfCnpj(cpfCnpj) {
    if (cpfCnpj.length <= 11) {
        return cpfCnpj.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

    }
    return cpfCnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    
}
export function maskTelefone(telefone) {
    return telefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
}
export function maskCep(cep) {
    return cep.replace(/(\d{5})(\d{3})/, "$1-$2");
}

export function maskUUID(uuid) {
    return uuid.replace(/(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})/, "$1-$2-$3-$4-$5");
}