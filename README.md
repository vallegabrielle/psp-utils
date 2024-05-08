# PSP Utils

## Descrição

Serviços utilitários para atividades da PSP.

## Instalação

1. Clone este repositório:

   ```bash
   git clone https://github.com/phmachado/psp-utils.git
   ```

2. Navegue até o diretório do projeto:

   ```bash
   cd psp-utils
   ```

3. Instale as dependências:

   ```bash
   yarn
   ```

4. Inicie o servidor:

   ```bash
   yarn start
   ```

## Usos

### 1. Listagem de serviços por secretaria

Fazer uma requisição GET para `localhost:3000/list-servicos-from-all-secretarias?site={URL}`

A requisição irá retornar uma resposta da seguinte forma:

```bash
[
   {
      "secretaria": "Casa Civil",
      "url": "https://www.prefeitura.sp.gov.br/cidade/secretarias/casa_civil/",
      "servicos": [
         {
            "url": "http://transparencia.prefeitura.sp.gov.br/funcionalismo/",
            "img": {
               "src": "https://www.prefeitura.sp.gov.br/cidade/secretarias/upload/chamadas/whatsapp_image_2023-04-28_at_12_1682706045.51",
               "alt": "Fundo azul com imagem transparente, à frente os dizeres Portal da Transparência e logo da Prefeitura de São Paulo acima"
            },
            "titulo": "FUNCIONALISMO",
            "descricao": "Página com dados sobre os funcionários da Prefeitura extraídos do SIGPEC (Sistema Integrado de Gestão de Pessoas e Competências) e que têm como referência o mês anterior ao corrente"
         },
         ...
      ]
   },
   ...
]
```

### 2. Verificar se existe carrossel no site da PSP mas ainda não no atual

Fazer uma requisição GET para `localhost:3000/has-carrossel`

O serviço verifica os portais listados no arquivo `src/json/sites.json`

A requisição irá retornar uma resposta da seguinte forma:

```bash
[
    {
        "id": 1,
        "infoDaPagina": "Controladoria Geral do Municipio - Home",
        "temCarrosselNaPrefeitura": true,
        "temCarrosselNoAtual": true,
        "temNaPrefeituraMasNaoTemNoAtual": false
    },
   ...
]
```

### 3. Listar informações sobre os serviços de uma página

Fazer uma requisição GET para `localhost:3000/get-carrossel-info?site={URL}`

A requisição irá retornar uma resposta da seguinte forma:

```bash
[
   {
      "id": 1,
      "href": "https://www.prefeitura.sp.gov.br/cidade/secretarias/upload/Imgens%20portal%202%20semestre/portaria_sms_G%202427-%2012_12_2013.pdf",
      "imgSrc": "https://www.prefeitura.sp.gov.br/cidade/secretarias/upload/chamadas/Botao_comite_etica_em_pesquisa_2_1646321997.png",
      "imgAlt": "Fundo branco e detalhe nas laterais formando uma moldura na cor verde. No canto superior esquerdo está escrito em letras verdes Comitê de Ética em Pesquisa. À direita, logo da área Comitê de Ética em Pesquisa.",
      "titulo": "",
      "descricao": ""
   },
   ...
]
```

### 4. Listar informações sobre os carrosséis de uma página

Fazer uma requisição GET para `localhost:3000/get-servicos-info?site={URL}`

A requisição irá retornar uma resposta da seguinte forma:

```bash
[
   {
      "id": 1,
      "url": "http://www.prefeitura.sp.gov.br/cidade/secretarias/saude/noticias/?p=166187",
      "img": {
         "src": "",
         "alt": ""
      },
      "titulo": "Chá verde faz bem para a saúde",
      "descricao": "É conhecido por ajudar na queima de gordura corporal"
   },
   ...
]
```

### 5. Fazer upload das imagens dos serviços de uma página

Fazer uma requisição POST para `http://localhost:3000/upload-servicos-images?site={SITE}&folderId={FOLDER_ID}&login={LOGIN}&password={SENHA}`

- `{SITE}`: URL da página que contém os serviços
- `{FOLDER_ID}`: ID da pasta em que as imagens serão salvas no 'Documentos e Mídia'
  - Para encontrar o ID, é necessário verificar a URL da pasta e procurar pelo query param que termina com `_folderId`
- `{LOGIN}`: Login de acesso ao portal
- `{SENHA}`: Senha de acesso ao portal

A requisição irá retornar uma reposta da seguinte forma: `"Images uploaded successfully"`

### 6. Fazer upload das imagens dos carrosséis de uma página

Fazer uma requisição POST para `http://localhost:3000/upload-carrossel-images?site={SITE}&folderId={FOLDER_ID}&login={LOGIN}&password={SENHA}`

- `{SITE}`: URL da página que contém os carrosséis
- `{FOLDER_ID}`: ID da pasta em que as imagens serão salvas no 'Documentos e Mídia'
  - Para encontrar o ID, é necessário verificar a URL da pasta e procurar pelo query param que termina com `_folderId`
- `{LOGIN}`: Login de acesso ao portal
- `{SENHA}`: Senha de acesso ao portal

A requisição irá retornar uma reposta da seguinte forma: `"Images uploaded successfully"`

### 7. Gerar arquivo txt com queries para atualizar informações sobre os cards

Fazer uma requisição POST para `localhost:3000/create-cards-queries-file`

O serviço varre as páginas listadas no arquivo `src/json/cards.json`

A requisição irá retornar uma resposta da seguinte forma: `"File created successfully"`

Um arquivo com todas as queries será criado em `./queries.txt`

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request.
