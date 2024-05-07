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

### 1. Listagem de serviços

Para gerar o JSON com a lista de serviços, é necessário fazer uma requisição GET para `localhost:3000/?site={URL}`

`{URL}` deve ser substituída pela página de secretarias

Exemplo: `localhost:3000/?site=https://www.prefeitura.sp.gov.br/cidade/secretarias/comunicacao/organizacao/index.php?p=192643`

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

Em que:

- `secretaria`: Título da secretaria
- `url`: Link para a home da secretaria
- `servicos`: Array com informações sobre cada serviço da secretaria
- `servicos.url`: Link para a página do serviço
- `servicos.img`: Objeto com informações da imagem
- `servicos.img.src`: Link da imagem
- `servicos.img.alt`: Texto alternativo da imagem
- `servicos.titulo`: Título do serviço
- `servicos.descricao`: Descrição do serviço

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request.
