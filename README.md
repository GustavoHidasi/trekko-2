# Trekko - Sistema de Gestão de Roteiros Turísticos

## 1. Apresentação do Projeto

O **Trekko** é um projeto acadêmico desenvolvido como parte dos requisitos práticos de avaliação em Engenharia de Software. Trata-se de uma aplicação web voltada para o setor de turismo, com o objetivo principal de atuar como um assistente pessoal de viagens. A plataforma propõe centralizar o planejamento logístico, permitindo ao usuário montar roteiros, visualizar mapas, e organizar passagens, hospedagens e atividades em um único ambiente integrado.

## 2. Objetivos

### 2.1 Objetivo Geral
Desenvolver uma plataforma web responsiva para a gestão e organização centralizada de roteiros turísticos, facilitando o planejamento de viagens através de uma interface unificada e integração com serviços de geolocalização.

### 2.2 Objetivos Específicos
* Implementar um sistema de autenticação seguro para controle de acesso individual.
* Desenvolver um módulo de CRUD (Create, Read, Update, Delete) para gestão completa de roteiros e atividades.
* Construir uma interface de linha do tempo (timeline) para ordenação cronológica do planejamento.
* Integrar mapas interativos para visualização espacial das atividades cadastradas.
* Aplicar conceitos de modelagem relacional de banco de dados para garantir a integridade dos dados e relacionamentos corretos entre os usuários e seus roteiros.

## 3. Arquitetura e Tecnologias

O sistema foi projetado seguindo o padrão arquitetural Cliente-Servidor, garantindo a separação de responsabilidades (SoC - Separation of Concerns), o que facilita a manutenção e possibilita a evolução independente das camadas da aplicação.

### 3.1 Frontend (Camada de Apresentação)
* **HTML5 e CSS3:** Estruturação semântica e estilização da interface, adotando o conceito de *Mobile First* para garantir total responsividade e adaptação a diferentes tamanhos de tela.
* **JavaScript (Vanilla):** Implementação da lógica de interação no lado do cliente, manipulação do DOM e consumo assíncrono da API REST (via Fetch API).

### 3.2 Backend (Camada de Negócios e Serviços)
* **Node.js e Express.js:** Construção de uma API RESTful para o processamento das requisições HTTP, roteamento e aplicação estrita das regras de negócio.

### 3.3 Banco de Dados (Camada de Persistência)
* **PostgreSQL (Plataforma Neon):** Sistema de Gerenciamento de Banco de Dados Relacional (SGBDR) hospedado na nuvem. Escolhido pela sua robustez em garantir integridade referencial e conformidade ACID nas transações que envolvem usuários, viagens e atividades.

## 4. Engenharia de Requisitos

Abaixo estão descritos os requisitos elicitados para o sistema, estruturados de acordo com as melhores práticas do Ciclo de Vida de Desenvolvimento de Software (SDLC), divididos entre funcionais e não funcionais.

### 4.1 Requisitos Funcionais (RF)
* **[RF01] Autenticação e Autorização:** O sistema deve permitir o cadastro de novos usuários, bem como a realização de login e logout com gestão de sessão segura.
* **[RF02] Gestão de Roteiros:** O sistema deve fornecer operações completas de criação, leitura, atualização e exclusão (CRUD) para os roteiros de viagem.
* **[RF03] Inserção de Atividades:** Deve ser possível vincular atividades específicas (ex: voos, hospedagens, traslados, passeios) a um roteiro, devendo o usuário fornecer dados de data, horário e localização exata.
* **[RF04] Renderização Cronológica:** O sistema deve organizar e exibir os dados das atividades de um roteiro em formato de linha do tempo contínua.
* **[RF05] Integração Geoespacial:** O sistema deve renderizar as coordenadas dos locais cadastrados em uma interface de mapa iterativo.
* **[RF06] Consumo de API Externa:** O sistema deve estabelecer comunicação com APIs de terceiros (ex: Google Places) para enriquecimento de dados e busca de pontos turísticos.

### 4.2 Requisitos Não Funcionais (RNF)
* **[RNF01] Interoperabilidade:** A troca de dados entre a aplicação cliente e o servidor deve ocorrer exclusivamente em formato JSON através de requisições REST.
* **[RNF02] Usabilidade:** A interface de usuário (UI) deve ser intuitiva e seguir princípios de heurísticas de usabilidade, mantendo o layout funcional em ambientes desktop e mobile.
* **[RNF03] Segurança de Dados:** As senhas dos usuários devem ser submetidas a um processo de hash criptográfico unidirecional (utilizando bibliotecas como bcrypt) antes da persistência no banco de dados.
* **[RNF04] Desempenho e Latência:** As operações de consulta e escrita no banco de dados devem ser otimizadas para responder à requisição do cliente em um tempo máximo de 2 segundos.

## 5. Regras de Negócio (RN)

* **[RN01] Isolamento de Dados por Usuário:** Um usuário previamente autenticado possui permissão de leitura, edição e exclusão estritamente sobre os roteiros e informações vinculadas à sua própria chave primária no sistema.
* **[RN02] Consistência Temporal:** O backend deve validar e rejeitar a criação de qualquer atividade cuja data e hora de término informadas sejam anteriores à data e hora de início.
* **[RN03] Escopo Não-Transacional:** A plataforma opera unicamente como uma ferramenta para organização logística. O escopo atual isenta o sistema de gateways de pagamento; logo, nenhuma transação financeira ou reserva de serviços reais ocorrerá dentro da aplicação.
