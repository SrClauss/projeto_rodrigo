export function maskCpfCnpj(cpfCnpj) {
    if (cpfCnpj.length <= 11) {
        return cpfCnpj.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

    }
    return cpfCnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    
}
export function maskTelefone(telefone) {
    if (telefone.length === 10){

        return telefone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
    if (telefone.length === 11){
        return telefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    return telefone
}
export function maskCep(cep) {
    return cep.replace(/(\d{5})(\d{3})/, "$1-$2");
}

export function maskUUID(uuid) {
    return uuid.replace(/(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})/, "$1-$2-$3-$4-$5");
}

export function formatStrings(str){
    if (str.length === 11){
        //formate como cpf

        return str.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    }
    //cnpj 

    if (str.length === 14){
        return str.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
    }


    return str
}





export function formatMoeda(valor){
    return valor?.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
}

export function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}