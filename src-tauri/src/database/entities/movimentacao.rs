#![allow(dead_code)]
use crate::database::entities::{item_produto::ItemProduto, produto::Produto};
use crate::database::traits::crudable::{Crudable, Privilege};
use async_trait::async_trait;
use mongodb::bson::{oid::ObjectId, DateTime};
use serde::{Deserialize, Serialize};
#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum TipoMovimentacao {
    EntradaPorCompra,
    EntradaExtraordinaria,
    SaidaPorVenda,
    SaidaExtraordinaria,
}
#[derive(Debug, Serialize, Deserialize, Clone)]
struct Movimentacao {
    #[serde(rename = "_id")]
    id: ObjectId,
    itens_produto_id: ObjectId,
    quantidade: i32,
    tipo: TipoMovimentacao,
    data: DateTime,
    log: String,
}

impl Movimentacao {
    pub fn new(
        itens_produto_id: ObjectId,
        quantidade: i32,
        tipo: TipoMovimentacao,
        data: DateTime,
    ) -> Self {
        Movimentacao {
            id: ObjectId::new(),
            itens_produto_id,
            quantidade,
            tipo,
            data,
            log: "".to_string(),
        }
    }
    pub async fn incremetar_quantidade(&mut self, quantidade: i32) -> Result<(), String> {
        let produto = Produto::find_element_by_child_id("itens", self.itens_produto_id).await;
        if produto.is_err() {
            return Err("Produto não encontrado".to_string());
        }
        let mut produto = produto.unwrap();
        let item = produto
            .itens
            .iter_mut()
            .find(|item| item.id == self.itens_produto_id)
            .unwrap();

        item.quantidade += quantidade;

        let upd = produto.update(Privilege::Admin).await;
        if upd.is_err() {
            return Err("Erro ao incrementar quantidade".to_string());
        }
        self.log = format!(
            "Incremento de {} unidades do produto {}",
            quantidade, produto.nome
        );
        let upd = self.update(Privilege::Admin).await;
        if upd.is_err() {
            return Err("Erro ao incrementar quantidade".to_string());
        }
        Ok(())
    }

    pub async fn novo_item(&mut self, item_produto: ItemProduto) -> Result<(), String> {
        let produto = Produto::read(item_produto.id.to_hex().as_str()).await;
        if produto.is_err() {
            return Err("Produto não encontrado".to_string());
        }
        let mut produto = produto.unwrap();
        produto.itens.push(item_produto);
        let upd = produto.update(Privilege::Admin).await;
        if upd.is_err() {
            return Err("Erro ao adicionar novo item".to_string());
        }

        self.log = format!("Adicionado novo item ao produto {}", produto.nome);
        let upt = self.update(Privilege::Admin).await;
        if upt.is_err() {
            return Err("Erro ao adicionar novo item".to_string());
        }
        Ok(())
    }
    pub async fn saida_estoque(
        quantidade: i32,
        data: DateTime,
        produto: &mut Produto,
    ) -> Result<(Self, i32), String> {
        let mut movimentacao = Movimentacao::new(
            produto.id,
            quantidade,
            TipoMovimentacao::SaidaPorVenda,
            data,
        );

        let produto =
            Produto::find_element_by_child_id("itens", movimentacao.itens_produto_id).await;
        if produto.is_err() {
            return Err("Produto não encontrado".to_string());
        }
        let mut produto = produto.unwrap();
        let mut sobra = 0;
        let item = produto
            .itens
            .iter_mut()
            .find(|item| item.id == movimentacao.itens_produto_id)
            .unwrap();
        if item.quantidade < quantidade {
            item.quantidade = 0;
            sobra = quantidade - item.quantidade;
        } else {
            item.quantidade -= quantidade;
        }

        let upd = produto.update(Privilege::Admin).await;
        if upd.is_err() {
            return Err("Erro ao decrementar quantidade".to_string());
        }

        movimentacao.log = format!(
            "Saida de {} unidades do produto {}",
            quantidade, produto.nome
        );
        Ok((movimentacao.create(Privilege::Admin).await?, sobra))
    }

    pub async fn saida_automatica_estoque(
        produto: &mut Produto,
        quantidade: i32,
        data: DateTime,
    ) -> Result<Vec<Self>, String> {
        produto
            .itens
            .sort_by(|a, b| a.data_validade.cmp(&b.data_validade));
        let produto = produto.update(Privilege::Admin).await;
        if produto.is_err() {
            return Err("Produto não encontrado".to_string());
        }
        let mut produto = produto.unwrap();
        let mut movimentacoes = Vec::new();
        let mut quantidade = quantidade;
        for item in produto.clone().itens.iter_mut() {
            if item.quantidade < quantidade {
                let movimentacao = Movimentacao::saida_estoque(item.quantidade, data, &mut produto)
                    .await
                    .unwrap();
                movimentacoes.push(movimentacao.0);
                quantidade -= movimentacao.1;
            } else {
                let movimentacao = Movimentacao::saida_estoque(quantidade, data, &mut produto)
                    .await
                    .unwrap();
                movimentacoes.push(movimentacao.0);
                break;
            }
        }
        Ok(movimentacoes)
    }
}
#[async_trait]
impl Crudable for Movimentacao {
    fn collection_name() -> &'static str {
        "movimentacoes"
    }

    fn id(&self) -> String {
        self.id.to_hex()
    }
}
