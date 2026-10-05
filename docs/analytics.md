# Eventos da landing page

Os eventos são emitidos em `document` e não são armazenados nem transmitidos. A página não registra leads ou mensagens enviadas. Para relatórios agregados, conectar um serviço confirmado e revisar a descrição de privacidade antes de ativar a transmissão. Não há token, endpoint ou ferramenta de analytics configurados neste repositório.

## Contratos

O contrato existente `dartalla:cta_click` é preservado: `{ placement, intent: "request_demo" }`.

`dartalla:interaction` contém somente `{ action, section, control }`:

| action          | section                   | control                                     | Significado                                            |
| --------------- | ------------------------- | ------------------------------------------- | ------------------------------------------------------ |
| section_view    | ID da seção               | section                                     | Seção visível; uma vez por carregamento, limiar de 15% |
| contact_intent  | ID da seção ou navigation | header, hero, contact ou floating           | Clique no WhatsApp; não comprova mensagem ou lead      |
| gallery_change  | telas                     | 1, 2 ou 3                                   | Slide selecionado                                      |
| screenshot_open | home ou telas             | overview, transactions, fiscal ou customers | Captura ampliada                                       |
| screenshot_zoom | telas                     | actual_size ou fit                          | Modo de visualização                                   |
| faq_open        | faq                       | 1 a 6                                       | Resposta aberta                                        |

Não incluir nome, telefone, mensagem, cookies, identificadores de sessão, URL, query string ou texto livre. O listener de integração deve mapear apenas os três campos documentados; não encaminhar automaticamente propriedades do DOM ou eventos do navegador.

## Leitura correta

Visibilidade de seção é um sinal de exposição, não prova de leitura. Cliques em WhatsApp medem intenção. Um lead exige um registro comercial confirmado; uma mensagem enviada exige evidência do canal. Comparar resultados por origem e seção somente depois de conectar e validar a ferramenta em produção.
