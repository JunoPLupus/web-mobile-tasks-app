---
Versão: "1.0"
Data de criação: 2025-11-08T00:00:00.000Z
Data da última atualização: 2025-12-05T08:29:00
---
## Requisitos Funcionais (RFs)
---

1. O usuário deve poder criar/ler/atualizar/deletar (CRUD) "Tarefas".
	
2. Ao criar/editar uma tarefa, o usuário deve poder associá-la a uma ou mais Habilidades.
	
3. Ao criar/editar uma tarefa, o usuário deve poder associá-la a uma etiqueta (tag).
	
4. Ao criar/editar uma tarefa, o usuário deve poder definir uma frequência de repetição.
	
5. O usuário deve poder criar/ler/atualizar/deletar (CRUD) "Tags".
	
6. O usuário deve poder criar/ler/atualizar/deletar (CRUD) "Habilidades" (ex.: "Engenharia de Software").
	
7. O usuário deve poder definir uma configuração global de "Níveis" (ex.: quanto XP é necessário para cada nível), que se aplica a todas as habilidades.
	
8. O usuário deve poder visualizar suas habilidades com os níveis atuais de cada uma.
	
9. O usuário deve poder se cadastrar e fazer login.




## Requisitos Não Funcionais (RNFs)
---

1. A aplicação deve ser desenvolvida usando Angular e TypeScript (Front-end) e Firebase (Back-end as a Service).
	
2. Os dados do usuário (tarefas, habilidades, progresso) devem ser persistidos na nuvem (Firestore).
	
3. A aplicação deve ter um design responsivo, com foco "Mobile-First".
	
4. A aplicação deve ser leve e ter um tempo de carregamento rápido em dispositivos móveis.
	
5. O acesso aos dados de um usuário deve ser restrito apenas ao próprio usuário autenticado.
	
6. O usuário deve poder fazer login/cadastro com conta do google.

