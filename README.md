Nomes:                              Nºs. USP:
Nathan Henrique Imamura             7964436
Loys Henrique Saccomano Gibertoni   8532377
Sady Sell Neto                      8532418

Observações:
1)
  Para uma empresa, os dados constituem sua principal fonte de poder. A
informação por si só o signfica.
  Assim, com o intuito de ter um projeto ótimo debanco de dados, não foi
possível usar o mapeamento do ORM/ODM Waterline. O principal caso em que tal
mapeamento ficou impossibilitado foi uma relação originada de uma agregação no
modelo conceitual. Portanto, o projeto do esquema da base de dados foi feito
manualmente. Por esquema, entende-se tabelas (relações) e funções de manipulação
(procedimentos armazenados).
  Os arquivos SQL que montam o mencionado esquema encontram-se no diretório (a
partir da raiz do projeto do Sails): "/misc/SQL". Com o intuito de facilitar a
execução daqueles, é recomendada a execução do arquivo "global.sql", localizado
no supracitado diretório.

2)
  O formato de exportação de dados proposto pela turma não prevê um modelo de
dados elaborado. Contudo, simplificar tal modelo contradiria a ideia exposta na
observação de número 1). Logo, a importação não foi implementada em sua
totalidade devido a essa incompatibildade, a qual só foi percebida em uma etapa
avançada e irreversível de desenvolvimento. Várias funcionalidades que dependem
diretamente da importação estarão comprometidas. Contudo, elas podem ser
acessadas pela url: "caminho_do_sails/import", onde caminho_do_sails costuma
ser: "localhost:1337".

3)
  O projeto que consegue executar com sucesso será disponibilizado no GitHub,
mais precisamente, na URL descrita na descrição de submissão do tidia-ae.
Ela não corresponde à principal forma de entrega do trabalho, sendo essa o
arquivo comprimido, mas, tem unicamente o propósito de solucionar possíveis
falhas nas conexões do chamados anzóis (hooks) do Sails.
  O arquivo em formato zip anteriormente mencionado incluirá apenas as partes
vitais que não podem ser obtidas via programas internos (tendo o "bower" e o
"npm" como principais exemplos). Sugere-se fortemente que os primeiros passos do
tutorial escrito pelo estagiário PAE, Paulo, sejam seguidos; em particular, os
que dizem respeito aos comandos "npm install" e "bower install".

4)
  As páginas foram projetadas segundo princípios de design, usabilidade e
acessibilidade, tendo como principais fontes de referência, Nielsen e Norman,
conforme aprendido na disciplina SCC260 - Interação Usuário-computador, esse
semestre lecionada pela professora doutora Renata Pontim de Mattos Fortes, cujo
conteúdo possui intersecção com a disciplina deste trabalho, principalmente
no princípio de design CRAP.
