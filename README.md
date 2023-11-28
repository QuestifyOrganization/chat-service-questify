# Questify Application

## Pré-requisitos

Antes de começar, certifique-se de que você tenha o Docker e o Docker Compose instalados em seu sistema. Se você ainda não os tem instalados, você pode baixá-los e instalá-los nos seguintes links:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Rodando a Aplicação

### 1. Criar a Rede Docker

   - Antes de iniciar a aplicação, é necessário criar uma rede Docker. Execute o seguinte comando no terminal:

     ```bash
     docker network create questify-network
     ```

### 2. Configurar o arquivo .env

   - Copie a pasta `.env.example` para um novo arquivo chamado `.env`:

     ```bash
     cp -r .env.example .env
     ```

     Ou, se você estiver em um sistema operacional Windows, pode simplesmente copiar manualmente a pasta `.env.example` e renomeá-la para `.env`.
   
   - Edite o arquivo `.env` com suas configurações específicas, como as credenciais do banco de dados, chaves de API, etc.

### 3. Iniciar a Aplicação com Docker Compose

   - Execute o seguinte comando para construir e iniciar os contêineres usando o Docker Compose:

     ```bash
     docker-compose up -d
     ```

     Este comando iniciará a aplicação em segundo plano. Para visualizar os logs da aplicação em tempo real, você pode usar:

     ```bash
     docker-compose logs -f
     ```

     A aplicação estará disponível em `http://localhost:PORTA`, onde PORTA é a porta configurada no arquivo `.env`.

### 4. Parar a Aplicação

   - Para parar a aplicação e os contêineres associados, execute:

     ```bash
     docker-compose down
     ```

Isso encerrará os contêineres e removerá a rede Docker criada.
