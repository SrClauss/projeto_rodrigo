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