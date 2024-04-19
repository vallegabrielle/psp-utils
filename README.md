# Services List

## Descrição

Web scraper que lista os serviços de cada secretaria.

## Instalação

1. Clone este repositório:

   ```bash
   git clone https://github.com/phmachado/services-list.git
   ```

2. Navegue até o diretório do projeto:

   ```bash
   cd services-list
   ```

3. Instale as dependências:

   ```bash
   yarn
   ```

4. Inicie o servidor:

   ```bash
   yarn start
   ```

## Uso

Para gerar o JSON com a lista de serviços, é necessário fazer uma requisição GET para `localhost:3000/?site={URL}`

`{URL}` deve ser substituída pela página de secretarias

Exemplo: `localhost:3000/?site=https://www.prefeitura.sp.gov.br/cidade/secretarias/comunicacao/organizacao/index.php?p=192643`

A requisição irá retornar uma resposta da seguinte forma:

```bash
[
   {
      "secretaria": "Casa Civil",
      "link": "https://www.prefeitura.sp.gov.br/cidade/secretarias/casa_civil/",
      "servicos": [
         "http://transparencia.prefeitura.sp.gov.br/funcionalismo/",
         "https://diariooficial.prefeitura.sp.gov.br/md_epubli_controlador.php?acao=inicio",
         "https://orcamento.sf.prefeitura.sp.gov.br/orcamento/index.php",
         "https://www.prefeitura.sp.gov.br/cidade/secretarias/governo/utilidade_publica/index.php?p=450"
      ]
   },
   ...
]
```

Em que:

- `secretaria`: Título da secretaria
- `link`: Link para home da secretaria
- `servicos`: Array com os links para os serviços da secretaria

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request.
