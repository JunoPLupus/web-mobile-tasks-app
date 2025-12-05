---
Versão: "1.0"
Data de criação: 2025-11-08T00:00:00.000Z
Data da última atualização: 2025-11-08T00:00:00.000Z
sticker: lucide//align-left
---
[[Requisitos - 1.0]]

# Diagrama de Casos de Uso
---
![[1 - Ativos/Level Me Up App/imagens/Diagrama de Casos de Uso.jpg]]


# Detalhamento de Casos de Uso
---


## <font color="#8db3e2">UC01 - Listar Tarefas</font>

| Requisitos        | RF01                                            |
| :---------------- | :---------------------------------------------- |
| **Descrição**     | O usuário pode visualizar as tarefas de um dia. |
| **Pré-condições** | Estar logado no sistema.                        |

### 1. Fluxo Principal
---
1. O sistema direciona o usuário para a tela inicial;
2. A tela inicial contém:
	- Filtro de data (`por padrão: Hoje`)
	- Filtro de tag (`por padrão: Todos`)
	- Filtro de status (`por padrão: Pendentes`)
	- Lista de tarefas de acordo com os filtros atuais aplicados
	- Opção `+` para criar nova tarefa
3. Este caso de uso pode acionar outros casos de uso como `UC02 - Interagir com a Tarefa`.


## <font color="#8db3e2">UC02 - Interagir com a Tarefa</font>

| Requisitos        | RF01                                                     |
| :---------------- | :------------------------------------------------------- |
| **Descrição**     | O usuário pode visualizar, editar ou excluir uma tarefa. |
| **Pré-condições** | Estar logado no sistema.                                 |

### 1. Fluxo Principal
---
1. Acionado pelo `UC01 (Listar Tarefas)` quando o usuário clica em uma tarefa da listagem;
2. O sistema redireciona o usuário pra tela de detalhes da tarefa que possui um modo visualização de todos os atributos visíveis para o usuário e as opções de `editar`, `excluir` e `desistir`;
3. O usuário clica no *checkbox* (`desmarcado`);
4. O sistema gera um novo registro no `TaskHistory` com o atributo `status` definido como `COMPLETED`;
5. O sistema redireciona o usuário para a tela inicial e o caso de uso é encerrado.

### 2. Fluxos Alternativos
---
- **A.01 - Editar tarefa**
	1. Ocorre após o *passo 2* do fluxo principal;
	2. O usuário clica na opção `editar`;
	3. O caso de uso `UC04 (Editar Tarefa)` é acionado.

- **A.02 - Alterar status da tarefa já concluída**
	1. Ocorre após o *passo 2* do fluxo principal;
	2. O usuário clica no *checkbox* (`marcado`);
	3. O sistema exclui o registro daquela tarefa naquele dia específico do `TaskHistory`;
	4. O caso de uso é encerrado.

- **A.03 - Excluir tarefa**
	1. Ocorre após o *passo 2* do fluxo principal;
	2. O usuário clica na opção `excluir`;
	3. O caso de uso `UC05 (Excluir Tarefa)` é acionado.

- **A.04 - Desistir da tarefa**
	1. Ocorre após o *passo 2* do fluxo principal;
	2. O usuário clica na opção `desistir`;
	3. O caso de uso `UC06 (Desistir da Tarefa)` é acionado. 


## <font color="#8db3e2">UC03 - Criar Tarefa</font>

| Requisitos        | RF01, RF02, RF03 e RF04             |
| :---------------- | :---------------------------------- |
| **Descrição**     | O usuário cadastra uma nova tarefa. |
| **Pré-condições** | Estar logado no sistema.            |

### 1. Fluxo Principal
---
1. Acionado pelo `UC01 (Listar Tarefas)` quando o usuário clica em `+` na tela inicial;
2. O sistema exibe a versão compacta/inicial do formulário com os campos:
	- Tag (`opcional`)
	- Tarefa (`nome da tarefa, obrigatório`)
	- Habilidades (`opcional, pode selecionar 1 ou mais habilidades para vincular a aquela tarefa`)
	- Prioridade (`obrigatório, por padrão: Baixa`)
	- Dificuldade (`obrigatório, por padrão: Baixa`)
	- XP Ganho (`obrigatório, por padrão: cálculo automático com base na prioridade e dificuldade`)
	- Opção "Continuar adicionando tarefas" (`opcional`)
3. O usuário preenche o campo de nome;
4. O usuário clica para confirmar;
5. O sistema valida as informações inseridas;
6. O sistema processa as informações e armazena a nova tarefa (Regra) no banco de dados.;
7. O sistema verifica que a opção "Continuar adicionando tarefas" não está marcada;
8. O usuário é redirecionado para a tela inicial.

### 2. Fluxos Alternativos
---
- **A.01 - Preencher todas as informações**
	1. Ocorre após o *passo 2* do fluxo principal;
	2. O usuário clica em "Ver mais configurações";
	3. O sistema exibe campos extras: 
		- Observações (`opcional`)
		- Início (`data/horário, por padrão: hoje`)
		- Término (`data/horário, por padrão: indefinido`)
		- Frequência de Repetição (`por padrão: Nenhuma`)
	4. O usuário preenche todas os campos;
	5. O caso de uso prossegue a partir do *passo 4* do fluxo principal.

- **A.02 - Ajustar gamificação com xp automático**
	1. Ocorre após o *passo 3* do fluxo principal;
	2. O usuário ajusta manualmente a prioridade e/ou a dificuldade;
	3. O sistema recalcula o xp automaticamente com base na prioridade e dificuldade definidas;
	4. O caso de uso prossegue a partir do *passo 4* do fluxo principal.

- **A.03 - Inserir XP Manualmente**
	1. Ocorre após o *passo 3* do fluxo principal;
	2. O usuário clica em "Xp Ganho";
	3. O sistema abre um pop-up com:
		- Cálculo automático (`checkbox, selecionado por padrão`)
		- XP (`campo de texto, com o valor do cálculo automático, podendo ser alterado`)
	4. O usuário altera manualmente o campo de xp;
	5. O usuário confirma a alteração;
	6. O sistema fecha o pop-up;
	7. O caso de uso prossegue a partir do *passo 4* do fluxo principal.

- **A.04 - Continuar Adicionando Tarefas**
	1. Ocorre após o _passo 6_ do fluxo principal (Armazenamento da Regra);
	2. O sistema exibe uma notificação de sucesso ("Tarefa salva com sucesso");
	3. O sistema **limpa todos os campos de texto** e retorna os selects e sliders para o padrão;
	4. O sistema mantém selecionada a `Tag` que foi utilizada na tarefa anterior;
	5. O caso de uso retorna ao _passo 3_ do fluxo principal (Pronto para o usuário preencher os campos da próxima tarefa).

- **A.05 - Definir Repetição da Tarefa**
	1. Ocorre após o _passo 3_ do fluxo principal (ou a partir do _passo 3_ do *A.01*);
	2. O usuário define uma `Frequência de Repetição` diferente de "Nenhuma";
	3. O sistema torna o campo **`Fim do Primeiro Ciclo`** visível e **obrigatório** (`por padrão definido no mesmo dia que a data de início, porém às 23:59`);
	4. O sistema confirma a `Data de Início` já definida e a utiliza como ponto inicial da série de repetição;
	5. O caso de uso prossegue a partir do _passo 4_ do fluxo principal.

- **A.06 - Filtro 'Data' diferente de 'Hoje' na tela inicial**
	1. Ocorre durante o *passo 2* do fluxo principal;
	2. O sistema define automaticamente a data de início para a data que estava selecionada no filtro da tela inicial;
	3. O caso de uso prossegue a partir do *passo 3* do fluxo principal.

- **A.07 - Filtro 'Tag' diferente de 'Todos' na tela inicial
	1. Ocorre durante o *passo 2* do fluxo principal;
	2. O sistema define automaticamente a tag para a tag que estava selecionada no filtro da tela inicial;
	3. O caso de uso prossegue a partir do *passo 3* do fluxo principal.

- **A.08 - Cancelar criação de tarefa**
	1. Ocorre após o *passo 2* do fluxo principal;
	2. O usuário clica em `<` para voltar para a tela inicial;
	3. O sistema redireciona o usuário de volta para a tela inicial e o caso de uso é encerrado.


### 3. Fluxos de Exceção
---
- **E01 - Dados insuficientes**
	1. Ocorre durante o *passo 5* do fluxo principal;
	2. O sistema destaca os campos obrigatórios e avisa o usuário do problema;
	3. O usuário preenche os dados obrigatórios que estavam faltando;
	4. O caso de uso prossegue a partir do *passo 5* do fluxo principal.

- **E02 - Dados inválidos**
	1. Ocorre durante o *passo 5* do fluxo principal;
	2. O sistema destaca os campos inválidos e avisa o usuário do problema;
	3. O usuário preenche os campos com informações válidas;
	4. O caso de uso prossegue a partir do *passo 5* do fluxo principal.

- **E03 - Conflito de Repetição/Duração**
	1. Ocorre durante o _passo 5_ do fluxo principal (Validação), **se** a `Frequência de Repetição` for ativada (Fluxo *A.01*).
	2. O sistema calcula se o `Fim do Primeiro Ciclo`  excede o intervalo da `Frequência de Repetição` (Ex: Duração > 24 horas para uma repetição Diária).
	3. Se a duração for maior que o intervalo, o sistema destaca o campo `Frequência de Repetição` e `Duração da Instância` e informa ao usuário: "A duração da tarefa excede o intervalo de repetição. Diminua a duração ou selecione uma frequência mais longa."
	4. O usuário ajusta as configurações.
	5. O caso de uso prossegue a partir do _passo 5_ do fluxo principal.



## <font color="#8db3e2">UC04 - Editar Tarefa</font>

| Requisitos        | RF01, RF02, RF03 e RF04                            |
| :---------------- | :------------------------------------------------- |
| **Descrição**     | O usuário edita os campos de uma tarefa existente. |
| **Pré-condições** | Estar logado no sistema.                           |

### 1. Fluxo Principal
---
1. Acionado pelo `UC02 (Interagir com a Tarefa)` quando o usuário clica na opção `editar`;
2. O sistema exibe o formulário completo/expandido com as informações atuais da tarefa preenchidas nos campos;
3. O usuário edita um ou mais campos;
4. O usuário clica em "Concluir" para aplicar as alterações;
5. O sistema valida as informações inseridas;
6. O sistema processa as informações e atualiza o banco de dados;
7. O sistema redireciona o usuário de volta para a tela de detalhes da tarefa e o caso de uso é encerrado.

### 2. Fluxos Alternativos
---
- **A.01 - Tarefa do tipo Ocorrência editada**
	1. Ocorre após o *passo 7* do fluxo principal, caso a tarefa editada for uma ocorrência de uma tarefa(regra) com repetição ativa;
	2. O sistema exibe um pop-up com a pergunta `Aplicar alterações apenas nesta tarefa ou nas próximas também?`;
	3. O caso de uso prossegue para o fluxo alternativo *A.01.1* ou *A.01.2* dependendo da opção escolhida pelo usuário.

- **A.01.1 - Aplicar alterações apenas na tarefa atual**
	1. Ocorre durante o *passo 3* do fluxo *A.01*, caso o usuário tenha escolhido `Apenas nesta tarefa`;
	2. O sistema processa as informações e cria uma tarefa na tabela de exceções no banco de dados;
	3. O caso de uso prossegue a partir do *passo 9* do fluxo principal.

- **A.01.2 - Aplicar alterações nesta tarefa e nas próximas**
	1. Ocorre durante o *passo 3* do fluxo *A.01*, caso o usuário tenha escolhido `Nesta e nas próximas tarefas`;
	2. - O sistema define a `Data de Término` da **Regra Original** para "Ontem" (`relativo a data da ocorrência, não do calendário real atual`);
	3. O sistema cria uma **Nova Regra** com os dados editados no banco de dados;
	4. O caso de uso prossegue a partir do *passo 9* do fluxo principal.

- **A.02 - Cancelar edição sem alterações realizadas**
	1. Ocorre após o *passo 4* do fluxo principal;
	2. O usuário clica em `<`;
	3. O sistema verifica que não houve alterações nos campos da tarefa;
	4. O sistema redireciona o usuário para a tela de detalhes da tarefa e o caso de uso é encerrado.

- **A.03 - Cancelar edição com alterações realizadas**
	1. Ocorre após o *passo 4* do fluxo principal;
	2. O usuário clica em `<`;
	3. O sistema verifica que houve alterações em pelo menos um dos campos da tarefa;
	4. O sistema exibe um pop-up com a pergunta `Descartar alterações feitas?`;
	5. O caso de uso prossegue para o fluxo alternativo A.03.1 ou A.03.2 dependendo da opção escolhida pelo usuário.

- **A.03.1 - Descartar alterações feitas**
	1. Ocorre durante o *passo 5* do fluxo *A.03*, caso o usuário tenha escolhido `Sim`;
	2. O sistema redireciona o usuário para a tela de detalhes da tarefa e o caso de uso é encerrado.

- **A.03.2 - Não descartar alterações feitas**
	1. Ocorre durante o *passo 5* do fluxo *A.03*, caso o usuário tenha escolhido `Não`;
	2. O sistema apenas fecha o pop-up e permanece na tela de edição;
	3. O caso de uso prossegue a partir do *passo 5* do fluxo principal.



### 3. Fluxos de Exceção
---
- **E01 - Dados insuficientes**
	1. Ocorre durante o *passo 7* do fluxo principal;
	2. O sistema destaca os campos obrigatórios e avisa o usuário do problema;
	3. O usuário preenche os dados obrigatórios que estavam faltando;
	4. O caso de uso prossegue a partir do *passo 7* do fluxo principal.

- **E02 - Dados inválidos**
	1. Ocorre durante o *passo 7* do fluxo principal;
	2. O sistema destaca os campos inválidos e avisa o usuário do problema;
	3. O usuário preenche os campos com informações válidas;
	4. O caso de uso prossegue a partir do *passo 7* do fluxo principal.

- **E03 - Conflito de Repetição/Duração**
	1. Ocorre durante o _passo 7_ do fluxo principal, **se** a `Frequência de Repetição` estiver ativada e houve alteração em algum dos campos de data (`Início ou Fim do Primeiro Ciclo`).
	2. O sistema calcula se o `Fim do Primeiro Ciclo`  excede o intervalo da `Frequência de Repetição` (Ex: Duração > 24 horas para uma repetição Diária).
	3. Se a duração for maior que o intervalo, o sistema destaca o campo `Frequência de Repetição` e `Duração da Instância` e informa ao usuário: "A duração da tarefa excede o intervalo de repetição. Diminua a duração ou selecione uma frequência mais longa."
	4. O usuário ajusta as configurações.
	5. O caso de uso prossegue a partir do _passo 7_ do fluxo principal.



## <font color="#8db3e2">UC05 - Excluir Tarefa</font>

| Requisitos        | RF01                                   |
| :---------------- | :------------------------------------- |
| **Descrição**     | O usuário exclui uma tarefa existente. |
| **Pré-condições** | Estar logado no sistema.               |

### 1. Fluxo Principal
---
1. Acionado pelo `UC02 (Interagir com a Tarefa)` quando o usuário clica na opção `excluir`;
2. O sistema verifica se há repetição ativa naquela tarefa;
3. O sistema identifica que não possui repetição;
4. O sistema exibe um pop-up perguntando `Excluir esta tarefa? (Esta ação é irreversível)`;
5. O usuário clica em `Excluir`;
6. O sistema altera o atributo da `TaskRule.isDeleted` para `true`;
7. O sistema redireciona o usuário para a tela inicial e o caso de uso é encerrado.

### 2. Fluxos Alternativos
---
- **A.01 - Exclusão cancelada**
	1. Ocorre após o *passo 6* do fluxo principal ou *passo 2* do fluxo *A.02*;
	2. O usuário clica no `X` para fechar o pop-up;
	3. O sistema fecha o pop-up e o caso de uso é encerrado.

- **A.02 - Excluir tarefa com repetição ativa**
	1. Ocorre após o *passo 4* após identificar que a tarefa possui repetição ativa;
	2. O sistema exibe um pop-up perguntando `Excluir apenas esta tarefa ou todas as ocorrências futuras dela? (Esta ação é irreversível)`;
	3. O caso de uso continua no fluxo *A.02.1* ou *A.02.2* dependendo da opção selecionada;

- **A.02.1 - Excluir apenas esta tarefa**
	1. Ocorre durante o *passo 3* do fluxo *A.02* ao selecionar `Excluir apenas esta tarefa`;
	2. O sistema gera uma exceção (`TaskException`);
	3. O sistema altera o atributo da `TaskException.isDeleted` para `true`;
	4. O caso de uso prossegue no *passo 9* do fluxo principal.

- **A.02.2 - Excluir esta e as próximas ocorrências**
	1.  Ocorre durante o *passo 3* do fluxo *A.02* ao selecionar `Excluir todas as ocorrências futuras`;
	2.  Se houver Exceções futuras já criadas, o sistema as marca como `TaskException.isDeleted = true`;
	3. O sistema define a `TaskRule.endDate` para a data anterior à ocorrência atual;
	4. O caso de uso prossegue a partir do *passo 9* do fluxo principal.


## <font color="#8db3e2">UC06 - Desistir da Tarefa</font>

| Requisitos        | RF01                               |
| :---------------- | :--------------------------------- |
| **Descrição**     | O usuário desiste da tarefa atual. |
| **Pré-condições** | Estar logado no sistema.           |

### 1. Fluxo Principal
---
1. Acionado pelo `UC02 (Interagir com a Tarefa)` quando o usuário clica na opção `desistir`;
2. O sistema exibe um pop-up perguntando `Você quer mesmo desistir desta tarefa?`;
3. O usuário clica em `Sim`;
4. O sistema gera um novo registro no `TaskHistory` com o atributo `status` definido como `SKIPPED`;
5. O sistema redireciona o usuário para a tela inicial e o caso de uso é encerrado.


### 2. Fluxos Alternativos
---
- **A.01 - Cancelar desistência**
	1. Ocorre após o *passo 2* do fluxo principal;
	2. O usuário clica em `Não`;
	3. O sistema fecha o pop-up e o caso de uso é encerrado.