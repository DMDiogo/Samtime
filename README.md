# Samtime - Sistema de Gestão de Funcionários

Este aplicativo permite gerenciar funcionários, com recursos para cadastrar funcionários, registrar assinaturas digitais e mais.

## Requisitos

- XAMPP (Apache e MySQL)
- Node.js (versão 14+) e npm
- Expo CLI (versão 6+)

## Tecnologias Utilizadas

### Frontend
- **React Native** (v0.76.8): Framework para desenvolvimento mobile multiplataforma
- **Expo** (v52.0.42): Plataforma para desenvolvimento React Native com ferramentas simplificadas
- **TypeScript** (v5.3.3): Superset tipado de JavaScript

### Componentes e Navegação
- **React Navigation** (v7.x): Navegação entre telas
  - @react-navigation/native
  - @react-navigation/stack
  - @react-navigation/bottom-tabs
- **Expo Vector Icons** (v14.0.4): Biblioteca de ícones
- **React Native Gesture Handler** (v2.25.0): Gestos touchscreen avançados
- **React Native Reanimated** (v3.17.2): Animações fluidas
- **React Native Screens** (v4.10.0): Otimização de renderização de telas
- **React Native Safe Area Context** (v5.3.0): Gerenciamento de área segura em diferentes dispositivos

### Armazenamento e Estado
- **Async Storage** (v2.1.2): Armazenamento local
- **Formik** (v2.4.6): Gerenciamento de formulários
- **Yup** (v1.6.1): Validação de esquemas para formulários

### UI/UX e Interatividade
- **Expo Haptics** (v14.0.1): Feedback tátil
- **Expo Linear Gradient** (v14.0.2): Gradientes na interface
- **Expo Status Bar** (v2.0.1): Personalização da barra de status
- **Expo Localization** (v16.0.1): Internacionalização
- **React Native SVG** (v15.11.2): Renderização de gráficos vetoriais

### Autenticação e Segurança
- **Expo Local Authentication** (v15.0.2): Autenticação biométrica
- **React Native Fingerprint Scanner** (v6.0.0): Suporte a scanner de impressão digital

### Backend
- **PHP**: API para comunicação com o banco de dados
- **MySQL**: Banco de dados relacional
- **Axios** (v1.8.4): Cliente HTTP para requisições à API

## Configuração do Banco de Dados

1. Inicie o XAMPP Control Panel e ative os módulos Apache e MySQL
2. Abra o phpMyAdmin (http://localhost/phpmyadmin)
3. Crie um novo banco de dados chamado `app_empresas` ou importe o arquivo `create_database.sql` fornecido
4. Coloque o arquivo `api_employees.php` no diretório `htdocs` do XAMPP (geralmente em `C:\xampp\htdocs\`)

## Configuração da API

1. Verifique seu endereço IP local (pode ser obtido com `ipconfig` no Windows)
2. No código do aplicativo, certifique-se de que as URLs da API estão configuradas para seu IP local:
   - Em `app.json`: Atualize o valor de `apiUrl` em `expo.extra`
   - Em `src/screens/EmployeesScreen.tsx`: Atualize a URL na função `fetchEmployees`
   - Exemplo: `http://192.168.1.57/api_employees.php` (substitua pelo seu IP)
3. Garanta que o firewall não esteja bloqueando as conexões para o servidor Apache

## Estrutura do Banco de Dados

O banco de dados `app_empresas` contém a seguinte tabela:

### Tabela `employees`

| Campo           | Tipo         | Descrição                          |
|-----------------|--------------|-----------------------------------|
| id              | VARCHAR(10)  | ID único para cada funcionário (ex: EMP001) |
| name            | VARCHAR(100) | Nome completo do funcionário      |
| position        | VARCHAR(100) | Cargo do funcionário              |
| department      | VARCHAR(100) | Departamento do funcionário       |
| digital_signature | BOOLEAN      | Flag indicando se a assinatura digital está registrada |

## Instalação e Execução do App

```bash
# Instalar Expo CLI globalmente (se ainda não tiver)
npm install -g expo-cli

# Clonar o repositório (se aplicável)
git clone <url-do-repositório>
cd samtime

# Instalar dependências
npm install

# Iniciar o app
npx expo start
```

## Estrutura do Projeto

```
samtime/
├── assets/                # Imagens, fontes e outros assets
├── src/
│   ├── components/        # Componentes reutilizáveis
│   ├── context/           # Contextos React (tema, autenticação)
│   ├── global/            # Configurações globais
│   ├── navigation/        # Configuração de rotas e navegação
│   ├── pages/             # Páginas alternativas
│   ├── screens/           # Telas principais
│   ├── services/          # Serviços (API, autenticação)
│   ├── theme/             # Temas e estilos
│   ├── types/             # Definições de tipos TypeScript
│   └── utils/             # Funções utilitárias
├── App.tsx                # Componente raiz
├── app.json               # Configuração Expo
├── api_employees.php      # API backend (mover para o servidor)
├── create_database.sql    # Script de criação do banco de dados
├── package.json           # Dependências e scripts
└── tsconfig.json          # Configuração TypeScript
```

## Funcionalidades

1. **Listagem de Funcionários**
   - Visualize todos os funcionários cadastrados
   - Interface responsiva para diferentes tamanhos de tela
   
2. **Cadastro de Funcionários**
   - Adicione novos funcionários com nome, cargo e departamento
   - Opção para registrar assinatura digital (não obrigatória)
   - Validação de formulários com Formik e Yup
   
3. **Gerenciamento de Funcionários**
   - Visualize detalhes dos funcionários
   - Edite informações de funcionários
   - Remova funcionários
   - Adicione ou atualize assinaturas digitais

4. **Tema**
   - Suporte a tema claro/escuro
   - Sistema de tema customizável via ThemeContext

## Suporte à Biometria

O aplicativo utiliza o módulo `expo-local-authentication` para interagir com as funcionalidades biométricas do dispositivo. A funcionalidade biométrica:

- Verifica a disponibilidade de hardware biométrico no dispositivo
- Permite registrar a assinatura digital do funcionário
- É uma funcionalidade opcional - funcionários podem ser cadastrados sem assinatura digital

## Conexão com o Banco de Dados

O aplicativo se conecta ao MySQL via API PHP. Certifique-se de que o XAMPP está em execução antes de usar o aplicativo.

## Ambiente de Desenvolvimento

- **Expo Go**: Para testar o aplicativo em dispositivos físicos
- **Android Studio/Xcode**: Para emuladores (opcional)
- **Visual Studio Code**: IDE recomendada para desenvolvimento
  - Extensões recomendadas:
    - ESLint
    - Prettier
    - React Native Tools
    - TypeScript React code snippets

## Solução de Problemas

- **Erro "JSON Parse error"**: Verifique se o servidor PHP está retornando JSON válido e se o IP do servidor está correto
- **"Sensor biométrico não disponível"**: Alguns dispositivos ou emuladores não suportam biometria
- **Problemas de conexão**: Certifique-se de que o dispositivo e o servidor estão na mesma rede
- **Erros de JSX/TSX**: Verifique se todas as dependências estão instaladas corretamente

## Observações

- As IDs dos funcionários são geradas automaticamente no formato EMP001, EMP002, etc.
- A assinatura digital é opcional durante o cadastro e pode ser adicionada posteriormente
- O app utiliza uma API PHP para comunicação com o banco de dados
<<<<<<< HEAD
- Interface adaptativa para diferentes tamanhos de tela (responsiva) 
=======
- Interface adaptativa para diferentes tamanhos de tela (responsiva)
>>>>>>> 7e198123c84cf7dc3c712fb2547caa75fdbe7a36
