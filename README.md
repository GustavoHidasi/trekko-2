# Trekko - Sistema de Gestão de Roteiros Turísticos

## Sobre o Projeto
O Trekko é um projeto acadêmico de uma aplicação voltada para a área de turismo. O objetivo é criar uma plataforma que centralize o planejamento de viagens, permitindo ao usuário montar roteiros, visualizar mapas e organizar passagens e hospedagens em um só lugar.

---

## 1. Tecnologias Utilizadas

* **Frontend:** HTML, CSS e JavaScript (Vanilla ou utilizando um framework como React/Vue) para a construção da interface do usuário.
* **Backend:** JavaScript ou rodando em ambiente Node.js (utilizando o framework Express) para a construção da API REST.
* **Backend:** JavaScript ou rodando em ambiente Node.js (utilizando por exemplo o framework Express) para a construção da API REST.
* **Banco de Dados:** PostgreSQL na Nuvem com Neon para armazenamento de usuários, roteiros e atividades.

---

## 2. Requisitos Funcionais (RF)

* **[RF01] Cadastro e Autenticação:** O sistema deve permitir que os usuários façam cadastro, login e logout na plataforma.
* **[RF02] Gestão de Roteiros (CRUD):** O sistema deve permitir a criação, listagem, edição e exclusão de roteiros de viagem.
* **[RF03] Gestão de Atividades:** O sistema deve permitir adicionar itens a um roteiro (ex: voo, hospedagem, passeio turístico) informando data, hora e local.
* **[RF04] Visualização em Linha do Tempo:** O sistema deve exibir as atividades do roteiro organizadas cronologicamente em uma tela.
* **[RF05] Visualização no Mapa:** O sistema deve exibir os locais das atividades cadastradas em um mapa interativo.
* **[RF06] Consulta de Serviços:** O sistema deve consumir uma API externa (ex: Google Places ou TripAdvisor) para buscar locais e pontos turísticos.

---

## 3. Requisitos Não Funcionais (RNF)

* **[RNF01] Arquitetura:** O sistema deve seguir o padrão cliente-servidor, com comunicação feita via API REST em formato JSON.
* **[RNF02] Usabilidade e Responsividade:** A interface web deve ser responsiva, adaptando-se corretamente tanto a telas de computadores quanto a dispositivos móveis (Mobile First via CSS).
* **[RNF03] Persistência:** Os dados devem ser salvos em um banco de dados relacional.
* **[RNF04] Segurança:** As senhas dos usuários devem ser armazenadas no banco de dados de forma criptografada (ex: utilizando bcrypt no Node.js).
* **[RNF05] Desempenho:** O tempo de resposta das consultas ao banco de dados não deve ultrapassar 2 segundos.

---

## 4. Regras de Negócio (RN)

* **[RN01] Acesso Restrito:** Um usuário só pode visualizar, editar ou excluir os roteiros criados por ele mesmo.
* **[RN02] Validação de Datas:** Não é possível criar uma atividade com data de término anterior à data de início.
* **[RN03] Escopo de Pagamento:** O sistema atuará apenas como organizador e vitrine; nenhuma transação financeira ou pagamento real será processado diretamente pela aplicação.
