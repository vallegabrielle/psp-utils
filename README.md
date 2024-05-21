# PSP Utils

## Descrição

Serviços utilitários para atividades da PSP.

## Pré-requisitos

- [Node.js](https://nodejs.org/en/download/package-manager/current) (preferencialmente v18.20.2+)
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable) (preferencialmente v1.22.19+)

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

- [1. Listagem de serviços por secretaria](#1-listagem-de-serviços-por-secretaria)
- [2. Verificar se existe carrossel no site da PSP mas ainda não no atual](#2-verificar-se-existe-carrossel-no-site-da-psp-mas-ainda-não-no-atual)
- [3. Listar informações sobre os serviços de uma página](#3-listar-informações-sobre-os-serviços-de-uma-página)
- [4. Listar informações sobre os carrosséis de uma página](#4-listar-informações-sobre-os-carrosséis-de-uma-página)
- [5. Fazer upload das imagens dos serviços de uma página](#5-fazer-upload-das-imagens-dos-serviços-de-uma-página)
- [6. Fazer upload das imagens dos carrosséis de uma página](#6-fazer-upload-das-imagens-dos-carrosséis-de-uma-página)
- [7. Gerar arquivo txt com queries para atualizar informações sobre os cards](#7-gerar-arquivo-txt-com-queries-para-atualizar-informações-sobre-os-cards)
- [8. Gerar arquivo txt com os tipos de cada site de uma secretaria](#8-gerar-arquivo-txt-com-os-tipos-de-cada-site-de-uma-secretaria)
- [9. Gerar arquivo txt com informações sobre serviços, notícias e acesso rápido de uma secretaria](#9-gerar-arquivo-txt-com-informações-sobre-serviços-notícias-e-acesso-rápido-de-uma-secretaria)
- [10. Listar informações sobre serviços, notícias e acesso rápido de uma secretaria](#10-listar-informações-sobre-serviços-notícias-e-acesso-rápido-de-uma-secretaria)

### 1. Listagem de serviços por secretaria

Fazer uma requisição GET para `localhost:3000/list-servicos-from-all-secretarias?site={URL}`

- `{URL}`: URL da página que contém a lista com todas as secretarias

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

- `{URL}`: URL da página que contém os carrosséis

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

- `{URL}`: URL da página que contém os serviços

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

Fazer uma requisição POST para `http://localhost:3000/upload-servicos-images?site={URL}&folderId={FOLDER_ID}&login={LOGIN}&password={SENHA}`

- `{URL}`: URL da página que contém os serviços
- `{FOLDER_ID}`: ID da pasta em que as imagens serão salvas no 'Documentos e Mídia'
  - Para encontrar o ID, é necessário verificar a URL da pasta e procurar pelo query param que termina com `_folderId` (usar o [freeformatter](https://www.freeformatter.com/url-parser-query-string-splitter.html) pode facilitar essa procura)
- `{LOGIN}`: Login de acesso ao portal
- `{SENHA}`: Senha de acesso ao portal

A requisição irá retornar uma reposta da seguinte forma: `"Images uploaded successfully"`

### 6. Fazer upload das imagens dos carrosséis de uma página

Fazer uma requisição POST para `http://localhost:3000/upload-carrossel-images?site={URL}&folderId={FOLDER_ID}&login={LOGIN}&password={SENHA}`

- `{URL}`: URL da página que contém os carrosséis
- `{FOLDER_ID}`: ID da pasta em que as imagens serão salvas no 'Documentos e Mídia'
  - Para encontrar o ID, é necessário verificar a URL da pasta e procurar pelo query param que termina com `_folderId` (usar o [freeformatter](https://www.freeformatter.com/url-parser-query-string-splitter.html) pode facilitar essa procura)
- `{LOGIN}`: Login de acesso ao portal
- `{SENHA}`: Senha de acesso ao portal

A requisição irá retornar uma reposta da seguinte forma: `"Images uploaded successfully"`

### 7. Gerar arquivo txt com queries para atualizar informações sobre os cards

Fazer uma requisição POST para `localhost:3000/create-cards-queries-file`

O serviço varre as páginas listadas no arquivo `src/json/cards.json`

A requisição irá retornar uma resposta da seguinte forma: `"File created successfully"`

Um arquivo com todas as queries será criado em `./queries.txt`

### 8. Gerar arquivo txt com os tipos de cada site de uma secretaria

Fazer uma requisição POST para `localhost:3000/create-site-types-file`

O serviço varre as páginas listadas no arquivo `src/files/txt/urls-da-secretaria.txt`

A requisição irá retornar uma resposta da seguinte forma:

```bash
[
    {
        "url": "https://www.prefeitura.sp.gov.br/cidade/secretarias/mobilidade/",
        "hasCarrossel": true,
        "hasServicos": true,
        "isNoticia": false,
        "isCard": true,
        "isConteudo": false
    },
    ...
]
```

Um arquivo com todos os tipos será criado em `./secretaria-site-types.txt`

### 9. Gerar arquivo txt com informações sobre serviços, notícias e acesso rápido de uma secretaria

Fazer uma requisição POST para `localhost:3000/create-home-data-file`

O serviço varre as páginas listadas no arquivo `src/files/txt/urls-da-secretaria.txt`

A requisição irá retornar uma resposta da seguinte forma:

```bash
[
    "343648; serviços; mobilidade/; false; ;",
    "348172; serviços; mobilidade/; false; ;",
    "; serviços; mobilidade/; true; https://meuveiculo.prefeitura.sp.gov.br;",
    "; serviços; mobilidade/; false; ;",
    "315674; serviços; mobilidade/; false; ;",
    "; serviços; mobilidade/; true; http://mobilidadesegura.prefeitura.sp.gov.br/;",
    "; serviços; mobilidade/; false; ;",
    "346780; notícias; mobilidade/; false; ;",
    "326366; notícias; mobilidade/; false; ;",
    "316531; notícias; mobilidade/; false; ;",
    ...
]
```

### 10. Listar informações sobre serviços, notícias e acesso rápido de uma secretaria

Fazer uma requisição GET para `localhost:3000/get-home-data`

O serviço varre as páginas listadas no arquivo `src/files/txt/urls-da-secretaria.txt`, inclua aqui as urls que deseja listar as informações (1 url por linha)

A requisição irá retornar uma resposta da seguinte forma:

```bash
[
    {
        "idWaram": "",
        "sessao": "cards-heading",
        "titulo": "Acesso à Informação",
        "descricao": "Esta seção reúne e divulga, de forma espontânea, dados da Casa Civil do Gabinete do Prefeito que são de interesse coletivo ou geral com o objetivo de facilitar o acesso à informação pública, conforme determinação da Lei Federal nº 12.527, de 18/11/2011 (LAI), e o Decreto Municipal nº 53.623/2012. Na Casa Civil do Gabinete do Prefeito a autoridade de monitoramento da LAI pode ser contatada no endereço eletrônico: casacivil@prefeitura.sp.gov.br. Informações adicionais podem ser obtidas no Portal da Transparência.",
        "urlImg": "https://www.prefeitura.sp.gov.br/cidade/secretarias/upload/chamadas/acesso_informacao_1510324640.png",
        "altImg": "Imagem com um balão e uma letra i dentro, onde o fundo é a cidade. Está escrito do lado inferior esquerdo Acesso à informação.",
        "path": "casa_civil/acesso_a_informacao/",
        "isLinkExterno": false,
        "link": "",
        "tipoLink": "link"
    },
    ...
]
```

- `idWaram`: o id presente na url ('?p=244486')
- `sessao`: a sessão da página, valores possíveis --> "acesso-rapido", "servicos", "noticias", "saiba-mais", "banners", "carrosseis", "cards" ou "cards-heading"
- `titulo`: o titulo do conteúdo
- `descricao`: a descrição do conteúdo
- `urlImg`: a url da imagem
- `altImg`: o alt da imagem
- `path`: o caminho referente ao conteúdo, extraído da url da página
- `isLinkExterno`: boolean indicando se é ou não um link externo
- `link`: o link do conteúdo
- `tipoLink`: o tipo do link do conteúdo, valores possíveis --> "imagem", "documento" ou "link"

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request.
