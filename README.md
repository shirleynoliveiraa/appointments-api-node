# appointments-api-node

API para agendamento de consultas com profissionais da saúde.

## Descrição

A appointments-api-node permite que os usuários agendem consultas com profissionais cadastrados na plataforma. Os usuários podem visualizar a disponibilidade de horários dos profissionais e agendar consultas. Os profissionais podem visualizar a disponibilidade, incluir novas datas, alterar as existentes e se excluir da agenda.

## Instalação e Configuração

Certifique-se de ter o Node.js e o Mongodb (compass) instalado em sua máquina. Clone este repositório e execute o seguinte comando para instalar todas as dependências:

1. Renomeie o arquivo `.env.example` para `.env`.
2. Adicione suas credenciais do MongoDB ao arquivo `.env`:

```plaintext
DB_USER=seuUsuario
DB_PASS=suaSenha
```

```bash
npm install
```
O MongoDB não cria um banco de dados automaticamente até que você insira algum dado nele. Por isso, será necessário criar o banco de dados `zenklub-appointments` com alguma coleção de teste inicial.

Após a instalação das dependências e a criação do banco de dados, você pode iniciar o servidor localmente com o comando:
```bash
npm run dev
```

O servidor estará disponível em http://localhost:5000 por padrão.

Você consegue testar os endpoints a partir da documentação do Swagger em: http://localhost:5000/api-docs

## Endpoints
### GET /api/professionals/:professionalId
Retorna informações sobre um profissional específico, incluindo sua disponibilidade de horários.

#### Parâmetros de Consulta
- startDate: Data de início para a busca de disponibilidade (formato: AAAA-MM-DD).
- endDate: Data de término para a busca de disponibilidade (formato: AAAA-MM-DD).
#### Exemplo de Requisição
```bash
GET /api/professionals/6649555fc49aa2b0e27caf39?startDate=2024-05-20&endDate=2024-05-22
```
#### Exemplo de Resposta

```bash
{
    "Monday": [
        "08:00",
        "08:30",
        "09:00",
        "10:00"
    ],
    "Tuesday": [
        "08:00",
        "08:30"
    ]
}
```
### POST /api/appointments
Agenda uma consulta com um profissional.
#### Corpo da Requisição
```bash
{
  "professionalId": "6649555fc49aa2b0e27caf39",
  "client": "Maria Oliveira",
  "startTime": "08:00",
  "date": "2024-05-20"
}
```

### POST /api/professionals
Inclui um profissional na agenda.
#### Corpo da Requisição
```bash
{
  "name": "Dr. Jane Doe",
  "availability": [
    {
      "day": "Monday",
      "slots": [
        "08:00",
        "08:30",
        "09:00",
        "09:30",
        "10:00",
        "11:00"
        ]
    }
  ]
}
```

### PUT /api/professionals/:professionalId
Altera a agenda de um profissional, adiciona dias de atendimento remove horários de atendimento.
#### Corpo da Requisição
```bash
{
  "name": "Dr. Jane Doe",
  "availability": [
    {
      "day": "Tuesday",
      "slots": [
        "08:00",
        "11:00"
        ]
    }
  ]
}
```

### DELETE /api/appointments/:professionalId
Deleta um profissional

#### Exemplo de Requisição
```bash
DELETE /api/appointments/6649555fc49aa2b0e27caf39
```
#### Exemplo de Resposta

```bash
{
  "message": "Professional deleted successfully"
}
```
