# Option sets e dados de referência

Todos os option sets devem ser carregados em `public.app_options`. Isso evita enums rígidos e preserva atributos extras como cor, ícone, nível e flags de menu.

## `pages` — Pages

Atributos extras: `icon`:`option.icones`, `Label`:`text`, `menu-pai`:`option.pages`, `max-nivel`:`option.perfil`, `show-menu-lateral`:`boolean`

| Key | Display | db_value | Sort | Deleted | Extras |
|---|---|---|---:|---|---|
| `bTUhd` | guia | `guia` | 15 | False | `{'icon': 'livro', 'label': 'Guia SERNISSAN', 'max_nivel': 'usu_rio', 'show_melu_lateral': True}` |
| `bTUhp` | inicio | `inicio` | 2 | False | `{'label': 'Início', 'menu_pai': 'gerenciamento', 'max_nivel': 'usu_rio', 'show_melu_lateral': True}` |
| `bTUht` | equipe | `equipe` | 3 | False | `{'label': 'Equipe', 'menu_pai': 'gerenciamento', 'max_nivel': 'area_adm', 'show_melu_lateral': True}` |
| `bTUhu` | indicadores | `indicadores` | 4 | False | `{'label': 'Indicadores', 'menu_pai': 'gerenciamento', 'max_nivel': 'area_adm', 'show_melu_lateral': True}` |
| `bTUhv` | gerenciamento | `gerenciamento` | 1 | False | `{'icon': 'dados', 'label': 'Gerenciamento', 'max_nivel': 'usu_rio', 'show_melu_lateral': True}` |
| `bTUhz` | solicitacoes | `solicitacoes` | 5 | False | `{'label': 'Solicitacoes', 'menu_pai': 'gerenciamento', 'max_nivel': 'area_adm', 'show_melu_lateral': True}` |
| `bTUiA` | placar | `placar` | 6 | False | `{'icon': 'trof_u', 'label': 'Placar de Perfomance', 'max_nivel': 'area_adm', 'show_melu_lateral': True}` |
| `bTUiB` | agenda | `agenda` | 7 | False | `{'icon': 'calend_rio', 'label': 'Agenda', 'max_nivel': 'area_adm', 'show_melu_lateral': True}` |
| `bTUiF` | reuniao-resultados | `reuniao_resultados` | 8 | False | `{'icon': 'resultado', 'label': 'Reunião de Resultados', 'max_nivel': 'gerente_do_dom_nio', 'show_melu_lateral': True}` |
| `bTUiH` | admin | `admin` | 22 | False | `{'icon': 'admin', 'label': 'Admin', 'max_nivel': 'gerente_do_dom_nio', 'show_melu_lateral': True}` |
| `bTUiL` | empresa | `empresa` | 23 | False | `{'label': 'Empresa', 'menu_pai': 'admin', 'max_nivel': 'gerente_do_dom_nio', 'show_melu_lateral': True}` |
| `bTUiM` | paises | `paises` | 24 | False | `{'label': 'Países', 'menu_pai': 'admin', 'max_nivel': 'gerente_do_dom_nio', 'show_melu_lateral': True}` |
| `bTUiN` | divisoes | `divisoes` | 25 | False | `{'label': 'Divisões', 'menu_pai': 'admin', 'max_nivel': 'gerente_do_dom_nio', 'show_melu_lateral': True}` |
| `bTUiR` | setores | `setores` | 26 | False | `{'label': 'Setores', 'menu_pai': 'admin', 'max_nivel': 'gerente_do_dom_nio', 'show_melu_lateral': True}` |
| `bTUiS` | grupos | `grupos` | 28 | False | `{'label': 'Grupos', 'menu_pai': 'admin', 'max_nivel': 'gerente_do_dom_nio', 'show_melu_lateral': True}` |
| `bTUiT` | concessionarias | `concessionarias` | 29 | False | `{'label': 'Concessionárias', 'menu_pai': 'admin', 'max_nivel': 'gerente_do_dom_nio', 'show_melu_lateral': True}` |
| `bTUiX` | usuarios | `usuarios` | 30 | False | `{'label': 'Usuários', 'menu_pai': 'admin', 'max_nivel': 'gerente_do_dom_nio', 'show_melu_lateral': True}` |
| `bTUiY` | biblioteca-indicadores | `biblioteca_indicadores` | 31 | False | `{'label': 'Biblioteca Indicadores', 'menu_pai': 'admin', 'max_nivel': 'gerente_do_dom_nio', 'show_melu_lateral': True}` |
| `bTUiZ` | areas-funcoes | `areas_funcoes` | 32 | False | `{'label': 'Áreas e funções', 'menu_pai': 'admin', 'max_nivel': 'gerente_do_dom_nio', 'show_melu_lateral': True}` |
| `bTUkR` | ajuda | `ajuda` | 33 | False | `{'show_melu_lateral': False}` |
| `bTUkV` | preferencias | `preferencias` | 34 | False | `{}` |
| `bTWJN` | rr-areas | `xr_areas` | 11 | False | `{'label': 'Áreas', 'menu_pai': 'reuniao_resultados', 'max_nivel': 'gerente_do_dom_nio', 'show_melu_lateral': True}` |
| `bTWJO` | rr-grupo-ndp | `rr_grupo_ndp` | 12 | True | `{'label': 'Grupo NDP', 'menu_pai': 'reuniao_resultados', 'max_nivel': 'gerente_do_dom_nio', 'show_melu_lateral': True}` |
| `bTWJP` | rr-indicadores | `rr_indicadores` | 13 | False | `{'label': 'Indicadores', 'menu_pai': 'reuniao_resultados', 'max_nivel': 'gerente_do_dom_nio', 'show_melu_lateral': True}` |
| `bTWJT` | rr-preliminares | `rr_preliminares` | 14 | True | `{'label': 'Preliminares', 'menu_pai': 'reuniao_resultados', 'max_nivel': 'gerente_do_dom_nio', 'show_melu_lateral': True}` |
| `bTWbz` | rr-reuniao | `rr_reuniao` | 9 | False | `{'label': 'Resultados', 'menu_pai': 'reuniao_resultados', 'max_nivel': 'gerente_do_dom_nio', 'show_melu_lateral': True}` |
| `bTWnr` | relatorios | `relatorios` | 16 | False | `{'icon': 'relatorios', 'label': 'Relatórios', 'max_nivel': 'gerente_regional', 'show_melu_lateral': True}` |
| `bTWns` | status-report | `status_report` | 17 | False | `{'label': 'Status Report', 'menu_pai': 'relatorios', 'max_nivel': 'gerente_regional', 'show_melu_lateral': True}` |
| `bTWnt` | dados-placar | `dados_placar` | 18 | False | `{'label': 'Dados Placar', 'menu_pai': 'relatorios', 'max_nivel': 'gerente_regional', 'show_melu_lateral': True}` |
| `bTWoh` | competencias | `mapa_competencias` | 19 | False | `{'icon': 'competencias', 'label': 'Competências', 'max_nivel': 'usu_rio', 'show_melu_lateral': True}` |
| `bTWoi` | mapa-competencias | `mapa_competencias0` | 20 | False | `{'label': 'Mapa', 'menu_pai': 'mapa_competencias', 'max_nivel': 'usu_rio', 'show_melu_lateral': True}` |
| `bTWoj` | calibracao-competencias | `calibracao_competencias` | 21 | False | `{'label': 'Calibração', 'menu_pai': 'mapa_competencias', 'max_nivel': 'usu_rio', 'show_melu_lateral': True}` |
| `1776670013487x202126442304030100` | visitas | `visitas` | 36 | False | `{'icon': 'calend_rio', 'label': 'Visitas', 'max_nivel': 'gerente_do_dom_nio', 'show_melu_lateral': False}` |
| `1777348564742x646318148635481500` | visitas-v2 | `visitas_v2` | 35 | True | `{'label': 'visitas-v2', 'show_melu_lateral': False}` |
| `1778644117184x609648450205255400` | habitos | `habitos` | 27 | False | `{'label': 'Hábitos', 'menu_pai': 'admin', 'max_nivel': 'gerente_do_dom_nio', 'show_melu_lateral': True}` |
| `1782358392382x682639849522307500` | pilulas | `pilulas` | 37 | False | `{'icon': 'livro', 'label': 'Pílulas de Conhecimento', 'menu_pai': 'admin', 'max_nivel': 'gerente_do_dom_nio', 'show_melu_lateral': False}` |

## `assunto_contato` — Assunto Contato

| Key | Display | db_value | Sort | Deleted | Extras |
|---|---|---|---:|---|---|
| `bTODb` | Suporte | `suporte` | 2 | False | `{}` |
| `bTODc` | Sugestão | `sugest_o` | 3 | False | `{}` |
| `bTODd` | Dúvida | `d_vida` | 4 | False | `{}` |
| `bTODh` | Ajuda | `ajuda` | 1 | False | `{}` |

## `calibracao_cores` — Calibracao Cores

Atributos extras: `hex`:`text`

| Key | Display | db_value | Sort | Deleted | Extras |
|---|---|---|---:|---|---|
| `1764663017856x672791111289683700` | >85 | `_85` | 1 | False | `{'hex': '92d050'}` |
| `1764663023574x709978639612910400` | >75 | `_75` | 2 | False | `{'hex': 'FFC000'}` |
| `1764663027983x385091769987591740` | >50 | `_50` | 3 | False | `{'hex': 'C00000'}` |
| `1764663030199x192405687132070940` | <50 | `_500` | 4 | False | `{'hex': '3F3F3F'}` |

## `calendario__dias_` — Calendario (Dias)

> Option set marcado como deletado no Bubble. Manter apenas para compatibilidade histórica.

Atributos extras: `numero`:`number`

| Key | Display | db_value | Sort | Deleted | Extras |
|---|---|---|---:|---|---|
| `1777789950516x606443036899223800` | 1 | `1_` | 1 | True | `{'numero': 1}` |
| `1777789952556x623871428549074000` | 2 | `2_` | 2 | True | `{'numero': 2}` |
| `1777789954827x785173177019800200` | 3 | `3_` | 3 | True | `{'numero': 3}` |
| `1777789956685x177391623837941730` | 4 | `4_` | 4 | True | `{'numero': 4}` |
| `1777789958867x203085491252937630` | 5 | `5_` | 5 | True | `{'numero': 5}` |
| `1777789960789x438714107902575800` | 6 | `6_` | 6 | True | `{'numero': 6}` |
| `1777789962692x403545884240955600` | 7 | `7_` | 7 | True | `{'numero': 7}` |
| `1777789964599x126159378371172420` | 8 | `8_` | 8 | True | `{'numero': 8}` |
| `1777789966364x506172866951462340` | 9 | `9_` | 9 | True | `{'numero': 9}` |
| `1777789970988x772700787047504900` | 10 | `10_` | 10 | True | `{'numero': 10}` |
| `1777789974171x643821535142601600` | 11 | `11_` | 11 | True | `{'numero': 11}` |
| `1777789977252x828875382190977400` | 12 | `12_` | 12 | True | `{'numero': 12}` |
| `1777789981837x853134226178574600` | 13 | `13_` | 13 | True | `{'numero': 13}` |
| `1777789984507x952846684411829200` | 14 | `14_` | 14 | True | `{'numero': 14}` |
| `1777789987971x752748548739876400` | 15 | `15_` | 15 | True | `{'numero': 15}` |
| `1777789990611x509181450709064200` | 16 | `16_` | 16 | True | `{'numero': 16}` |
| `1777789994858x819238207564583400` | 17 | `17_` | 17 | True | `{'numero': 17}` |
| `1777789999139x921077504997733800` | 18 | `18_` | 18 | True | `{'numero': 18}` |
| `1777790002715x788795370192219000` | 19 | `19_` | 19 | True | `{'numero': 19}` |
| `1777790005396x988148675757607200` | 20 | `20_` | 20 | True | `{'numero': 20}` |
| `1777790016908x919396139195899600` | 21 | `21_` | 21 | True | `{'numero': 21}` |
| `1777790020072x627789793610154400` | 22 | `22_` | 22 | True | `{'numero': 22}` |
| `1777790026934x915123218620397200` | 23 | `23_` | 23 | True | `{'numero': 23}` |
| `1777790030476x277700959746177820` | 24 | `24_` | 24 | True | `{'numero': 24}` |
| `1777790034219x270769021848562430` | 25 | `25_` | 25 | True | `{'numero': 25}` |
| `1777790037727x660294607335944700` | 26 | `26_` | 26 | True | `{'numero': 26}` |
| `1777790041580x195175698769994620` | 27 | `27_` | 27 | True | `{'numero': 27}` |
| `1777790046436x399968202244591040` | 28 | `28_` | 28 | True | `{'numero': 28}` |
| `1777790050093x982463956408524400` | 29 | `29_` | 29 | True | `{'numero': 29}` |
| `1777790053320x628053411825132800` | 30 | `30_` | 30 | True | `{'numero': 30}` |
| `1777790066894x238074907874434900` | 31 | `31_` | 31 | True | `{'numero': 31}` |
| `1777790071388x442746082307827100` | 32 | `32_` | 32 | True | `{}` |
| `1777790074175x536791352170238800` | 33 | `33_` | 33 | True | `{}` |
| `1777790076832x934759499659779500` | 34 | `34_` | 34 | True | `{}` |
| `1777790082045x639241737311820500` | 35 | `35_` | 35 | True | `{}` |

## `calendario__semana_` — Calendario (Semana)

Atributos extras: `ordem`:`number`, `sigla`:`text`

| Key | Display | db_value | Sort | Deleted | Extras |
|---|---|---|---:|---|---|
| `1777790266717x764602723222302200` | Domingo | `segunda` | 1 | False | `{'ordem': 1, 'sigla': 'Dom'}` |
| `1777790271868x696187665155623300` | Segunda | `ter_a` | 2 | False | `{'ordem': 2, 'sigla': 'Seg'}` |
| `1777790278467x931290330296496800` | Terça | `quarta` | 3 | False | `{'ordem': 3, 'sigla': 'Ter'}` |
| `1777790300652x804524583533005200` | Quarta | `quarta0` | 4 | False | `{'ordem': 4, 'sigla': 'Qua'}` |
| `1777790306337x301213742630093160` | Quinta | `quinta` | 5 | False | `{'ordem': 5, 'sigla': 'Qui'}` |
| `1777790310861x657184747994146800` | Sexta | `sexta` | 6 | False | `{'ordem': 6, 'sigla': 'Sex'}` |
| `1777790316692x268966797483646270` | Sábado | `sabado` | 7 | False | `{'ordem': 7, 'sigla': 'Sab'}` |

## `calibra__o_indicadores` — Calibracao Indicadores

> Option set marcado como deletado no Bubble. Manter apenas para compatibilidade histórica.

| Key | Display | db_value | Sort | Deleted | Extras |
|---|---|---|---:|---|---|

## `calibracao_indicadores` — Calibracao Indicadores

> Option set marcado como deletado no Bubble. Manter apenas para compatibilidade histórica.

| Key | Display | db_value | Sort | Deleted | Extras |
|---|---|---|---:|---|---|

## `calibracao_tipo` — Calibracao Tipo

> Option set marcado como deletado no Bubble. Manter apenas para compatibilidade histórica.

| Key | Display | db_value | Sort | Deleted | Extras |
|---|---|---|---:|---|---|
| `1762659673459x616799882873424100` | Lider | `lider` | 1 | True | `{}` |

## `calibracao_opcao` — Calibracao Opcao

Atributos extras: `Peso`:`number`

| Key | Display | db_value | Sort | Deleted | Extras |
|---|---|---|---:|---|---|
| `bTXfA` | Sim | `sim` | 1 | False | `{'value': 1}` |
| `bTXfB` | Não | `n_o` | 3 | False | `{'value': 0}` |
| `bTXfF` | Parcial | `parcial` | 2 | False | `{'value': 0.3}` |

## `calibracao_resultado` — Calibracao Resultado

> Option set marcado como deletado no Bubble. Manter apenas para compatibilidade histórica.

| Key | Display | db_value | Sort | Deleted | Extras |
|---|---|---|---:|---|---|

## `categoria_concessionaria` — Categoria Concessionaria

| Key | Display | db_value | Sort | Deleted | Extras |
|---|---|---|---:|---|---|
| `bTOie` | F | `f` | 1 | False | `{}` |
| `bTOif` | M | `m` | 2 | False | `{}` |

## `calibracao_resultado_tipo` — Calibracao Resultado Tipo

| Key | Display | db_value | Sort | Deleted | Extras |
|---|---|---|---:|---|---|
| `1762659700169x517405941602266500` | Líder | `lider` | 1 | False | `{}` |
| `1762659709441x240155736156778340` | Auto Calibração | `auto_calibra__o` | 2 | False | `{}` |
| `1762659717882x761623743870936000` | Follow-Up | `follow_up` | 3 | False | `{}` |

## `competencia` — Competencia

Atributos extras: `ID`:`text`, `peso`:`number`, `tipo`:`option.competencia_tipo`, `numero`:`number`, `pergunta`:`text`, `descricao`:`text`

| Key | Display | db_value | Sort | Deleted | Extras |
|---|---|---|---:|---|---|
| `bTXCI` | Foco no Cliente | `foco_no_cliente` | 1 | False | `{'id0': 'C1', 'peso': 1, 'tipo': 'sernissan', 'numero': 1, 'pergunta': 'Identificou e entendeu as necessidades dos Clientes, permitindo o desenvolvimento de novas oportunidades e o fortalecimento das relações já existentes?', 'descricao': 'Identificar e entender as necessidades dos Clientes, permitindo o desenvolvimento de novas oportunidades e o fortalecimento das relações já existentes.'}` |
| `bTXCJ` | Excelência | `excel_ncia` | 2 | False | `{'id0': 'C2', 'peso': 1, 'tipo': 'sernissan', 'numero': 2, 'pergunta': 'Atingiu o potencial máximo de resultados com qualidade de forma consistente em qualquer tipo de ação, considerando os recursos disponíveis no momento?', 'descricao': 'Atingir o potencial máximo de resultados com qualidade de forma consistente em qualquer tipo de ação,  considerando os recursos disponíveis no momento.'}` |
| `bTXCN` | Foco no Resultado | `foco_no_resultado` | 3 | False | `{'id0': 'C3', 'peso': 1, 'tipo': 'sernissan', 'numero': 3, 'pergunta': 'Planejou e executou todas as ações tendo o resultado como objetivo, com o menor gasto de tempo e recursos, gerando satisfação para os Clientes?', 'descricao': 'Planejar e executar todas as ações tendo o resultado como objetivo, com o menor gasto de tempo e recursos, gerando satisfação para os Clientes. '}` |
| `bTXCO` | Visão Sistêmica | `vis_o_sist_mica` | 4 | False | `{'id0': 'C4', 'peso': 1, 'tipo': 'sernissan', 'numero': 4, 'pergunta': 'Enxergou o negócio como um todo e entendeu como funcionam as interações entre processos, serviços, produtos, Clientes internos e externos?', 'descricao': 'Capacidade de "ver" o negócio como um todo e entender como funcionam as interações entre processos, serviços, produtos, Clientes internos e externos. '}` |
| `bTXCP` | Disciplina | `disciplina` | 5 | False | `{'id0': 'C5', 'peso': 1, 'tipo': 'sernissan', 'numero': 5, 'pergunta': 'Planejou e executou com responsabilidade e qualidade qualquer tipo de ação, concentrando-se nas prioridades e no cumprimento dos prazos?', 'descricao': 'Planejar e executar com responsabilidade e qualidade qualquer tipo de ação, concentrando-se nas prioridades e no cumprimento dos prazos.'}` |
| `bTXCT` | Flexibilidade | `flexibilidade` | 6 | False | `{'id0': 'C6', 'peso': 1, 'tipo': 'sernissan', 'numero': 6, 'pergunta': 'Esteve aberto a novas ideias e possibilidades, lidou com várias demandas simultaneamente sem perder o foco e a energia?', 'descricao': 'Capacidade de estar aberto a novas ideias e possibilidades, lidando com várias demandas simultaneamente sem perder o foco e a energia.'}` |
| `bTXCU` | Proatividade | `proatividade` | 7 | False | `{'id0': 'C7', 'peso': 1, 'tipo': 'sernissan', 'numero': 7, 'pergunta': 'Teve iniciativa diante das situações de forma antecipada, assumindo a responsabilidade nas tomadas de decisão com agilidade e ponderação?', 'descricao': 'Ter iniciativa diante das situações de forma antecipada, assumindo a responsabilidade nas tomadas de decisão com agilidade e ponderação.'}` |
| `bTXCV` | Execução Operacional | `execu__o_operacional` | 8 | False | `{'id0': 'C8', 'peso': 1, 'tipo': 'sernissan', 'numero': 8, 'pergunta': 'Colocou em prática as estratégias e ações planejadas pela empresa, utilizando os conhecimentos técnicos e recursos de forma otimizada?', 'descricao': 'Capacidade de colocar em prática as estratégias e ações planejadas pela empresa, utilizando os conhecimentos técnicos e recursos de forma otimizada. '}` |
| `bTXCZ` | Comunicação Escrita e Falada | `comunica__o_escrita_e_falada` | 9 | False | `{'id0': 'C9', 'peso': 1, 'tipo': 'espec_fica', 'numero': 1, 'pergunta': 'Leu e ouviu com atenção e comunicou de forma clara, efetiva e correta as ideias para os Clientes internos e externos?', 'descricao': 'Capacidade de ler e ouvir com atenção e de comunicar de forma clara, efetiva e correta as ideias para os Clientes internos e externos.   '}` |
| `bTXCa` | Gestão da Informação | `gest_o_da_informa__o` | 10 | False | `{'id0': 'C10', 'peso': 1, 'tipo': 'espec_fica', 'numero': 2, 'pergunta': 'Organizou os fluxos e garantiu a qualidade das informações estratégicas e operacionais do negócio, com o objetivo de apoiar a tomada de decisão?', 'descricao': 'Organizar os fluxos e garantir a qualidade das informações estratégicas e operacionais do negócio, com o objetivo de apoiar a tomada de decisão. '}` |
| `bTXCb` | Liderança | `lideran_a` | 11 | False | `{'id0': 'C11', 'peso': 1, 'tipo': 'espec_fica', 'numero': 3, 'pergunta': 'Inspirou pessoas influenciando de forma positiva comportamentos e modelos mentais, garantindo que objetivos da empresa fossem atingidos?', 'descricao': 'Inspirar pessoas influenciando de forma positiva comportamentos e modelos mentais, garantindo que objetivos da empresa sejam atingidos. '}` |
| `bTXCf` | Negociação | `negocia__o` | 12 | False | `{'id0': 'C12', 'peso': 1, 'tipo': 'espec_fica', 'numero': 4, 'pergunta': 'Chegou a um acordo proporcionando ganhos e vantagens para todos os envolvidos no processo?', 'descricao': 'Capacidade de chegar a um acordo proporcionando ganhos e vantagens para todos os envolvidos no processo. '}` |
| `bTXCg` | Organização e Planejamento | `organiza__o_e_planejamento` | 13 | False | `{'id0': 'C13', 'peso': 1, 'tipo': 'espec_fica', 'numero': 5, 'pergunta': 'Estruturou e projetou suas atividades e as de sua equipe, estabelecendo metas mensuráveis e atingíveis, cumprindo-as com êxito?', 'descricao': 'Capacidade de estruturar e projetar suas atividades e as de sua equipe, estabelecendo metas mensuráveis e atingíveis, cumprindo-as com êxito.'}` |
| `bTXCh` | Relacionamento Interpessoal | `relacionamento_interpessoal` | 14 | False | `{'id0': 'C14', 'peso': 1, 'tipo': 'espec_fica', 'numero': 6, 'pergunta': 'Lidou com outras pessoas de maneira empática se adequando às necessidades de cada um e de cada situação?', 'descricao': 'Capacidade de lidar com outras pessoas de maneira empática se adequando às necessidades de cada um e de cada situação.'}` |
| `bTXCl` | Trabalho em equipe | `trabalho_em_equipe` | 15 | False | `{'id0': 'C15', 'peso': 1, 'tipo': 'espec_fica', 'numero': 7, 'pergunta': 'Convivou com pessoas diferentes gerando cooperação e sinergia para atingir um propósito comum?', 'descricao': 'Capacidade de conviver com pessoas diferentes gerando cooperação e sinergia para atingir um propósito comum. '}` |
| `bTXCm` | Escuta Ativa | `escuta_ativa` | 16 | False | `{'id0': 'C16', 'peso': 1, 'tipo': 'espec_fica', 'numero': 8, 'pergunta': 'Ouviu atentamente a mensagem que outra pessoa esteja transmitindo, sem julgamentos e sem interrupções desnecessárias?', 'descricao': 'Capacidade de ouvir atentamente a mensagem que outra pessoa esteja transmitindo, sem julgamentos e sem interrupções desnecessárias.'}` |
| `bTXCn` | Capacidade de Transformar | `capacidade_de_transformar` | 17 | False | `{'id0': 'C17', 'peso': 1, 'tipo': 'espec_fica', 'numero': 9, 'pergunta': 'Provocou mudanças na forma de atuação dos envolvidos em ambientes e situações complexas e dinâmicas?', 'descricao': 'Capacidade de provocar mudanças na forma de atuação dos envolvidos em ambientes e situações complexas e dinâmicas.'}` |
| `bTXCr` | Desenvolvimento e Empoderamento | `desenvolvimento_e_empoderamento` | 18 | False | `{'id0': 'C18', 'peso': 1, 'tipo': 'espec_fica', 'numero': 10, 'pergunta': 'Delegou maior autonomia de decisão e responsabilidade às equipes, valorizando e aproveitando ao máximo os seus talentos?', 'descricao': 'Capacidade de delegar maior autonomia de decisão e responsabilidade às equipes, valorizando e aproveitando ao máximo os seus talentos.'}` |
| `bTXCs` | Inteligência Emocional | `intelig_ncia_emocional` | 19 | False | `{'id0': 'C19', 'peso': 1, 'tipo': 'espec_fica', 'numero': 11, 'pergunta': 'Identificou os nossos próprios sentimentos e os dos outros, motivou-se e geriu bem as emoções dentro de nós e nos nossos relacionamentos?', 'descricao': 'Capacidade de identificar os nossos próprios sentimentos e os dos outros, de nos motivarmos e de gerir bem as emoções dentro de nós e nos nossos relacionamentos. '}` |
| `bTXCt` | Análise de Resultados | `an_lise_de_resultados` | 20 | False | `{'id0': 'C20', 'peso': 1, 'tipo': 'espec_fica', 'numero': 12, 'pergunta': 'Analisou e interpretou os Indicadores e os impactos das ações realizadas, verificou tendências e planejou ações de melhoria?', 'descricao': 'Capacidade de analisar e interpretar os Indicadores e os impactos das ações realizadas, verificar tendências e planejar ações de melhoria.'}` |

## `classe_indicador` — Indicador Classe 

| Key | Display | db_value | Sort | Deleted | Extras |
|---|---|---|---:|---|---|
| `bTTmp` | Volume | `volume` | 1 | False | `{}` |
| `bTTmq` | Qualidade | `qualidade` | 2 | False | `{}` |

## `competencia_atitudes` — Competencia Atitude

Atributos extras: `ID - deleted`:`text`

| Key | Display | db_value | Sort | Deleted | Extras |
|---|---|---|---:|---|---|
| `bTXFD` | Cordialidade | `cordialidade` | 1 | False | `{'id0': 'CA1'}` |
| `bTXFH` | Simpatia | `simpatia` | 2 | False | `{'id0': 'CA2'}` |
| `bTXFI` | Atenção | `aten__o` | 3 | False | `{'id0': 'CA3'}` |
| `bTXFJ` | Empatia | `empatia` | 4 | False | `{'id0': 'CA4'}` |
| `bTXFN` | Iniciativa | `iniciativa` | 5 | False | `{'id0': 'CA5'}` |
| `bTXFO` | Comprometimento | `comprometimento` | 6 | False | `{'id0': 'CA6'}` |
| `bTXFP` | Entusiasmo | `entusiasmo` | 7 | False | `{'id0': 'CA7'}` |
| `bTXFT` | Dedicação | `dedica__o` | 8 | False | `{'id0': 'CA8'}` |
| `bTXFU` | Iniciativa | `iniciativa0` | 9 | True | `{}` |
| `bTXFV` | Detalhista | `detalhista` | 10 | False | `{'id0': 'CA9'}` |
| `bTXFZ` | Paciente | `paciente` | 11 | False | `{'id0': 'CA10'}` |
| `bTXFa` | Propositivo | `propositivo` | 12 | False | `{'id0': 'CA11'}` |
| `bTXFb` | Respeito | `respeito` | 13 | False | `{'id0': 'CA12'}` |
| `bTXFf` | Resiliência | `resili_ncia` | 14 | False | `{'id0': 'CA13'}` |
| `bTXFg` | Autoconfiança | `autoconfian_a` | 15 | False | `{'id0': 'CA14'}` |
| `bTXFh` | Seguir hábitos | `seguir_h_bitos` | 16 | False | `{'id0': 'CA15'}` |
| `bTXFl` | Pontualidade | `pontualidade` | 17 | False | `{'id0': 'CA16'}` |
| `bTXIx` | Aprendizado e Desenvolvimento Pessoal | `aprendizado_e_desenvolvimento_pessoal` | 18 | False | `{'id0': 'CA17'}` |

## `competencia_ferramenta` — Competencia Ferramenta

Atributos extras: `ID - deleted`:`text`

| Key | Display | db_value | Sort | Deleted | Extras |
|---|---|---|---:|---|---|
| `bTXCz` | Guia SERNISSAN | `guia_sernissan` | 1 | False | `{'id0': 'CF1'}` |
| `bTXDD` | Agenda de Gestão | `agenda_de_gest_o` | 2 | False | `{}` |
| `bTXDE` | Calibração de Competências e Hábitos | `calibra__o_de_compet_ncias_e_h_bitos` | 3 | False | `{}` |
| `bTXDF` | Guia de Uniformes_Nissan do Brasil_rev.02 | `guia_de_uniformes_nissan_do_brasil_rev_02` | 4 | False | `{}` |
| `bTXDJ` | Guia SERNISSAN \| Como realizar uma Autocalibração consciente | `guia_sernissan___como_realizar_uma_autocalibra__o_consciente` | 5 | False | `{}` |
| `bTXDK` | Guia SERNISSAN \| Plano de Transformação | `guia_sernissan___plano_de_transforma__o` | 6 | False | `{}` |
| `bTXDL` | Guia SERNISSAN \| Reunião de Resultados | `guia_sernissan___reuni_o_de_resultados` | 7 | False | `{}` |
| `bTXDP` | Mapa de competências | `mapa_de_compet_ncias` | 8 | False | `{}` |
| `bTXDQ` | Pesquisa de Clima de Trabalho NISSAN_v2 | `pesquisa_de_clima_de_trabalho_nissan_v2` | 9 | False | `{}` |
| `bTXDR` | Placar de Performance | `placar_de_performance` | 10 | False | `{}` |
| `bTXDV` | Guia SERNISSAN \| Passos da Demonstração do Veículo | `guia_sernissan___passos_da_demonstra__o_do_ve_culo` | 11 | False | `{}` |
| `bTXDW` | Mapa de competências | `mapa_de_compet_ncias0` | 12 | True | `{}` |
| `bTXDX` | Trilha de integração e desenvolvimento | `trilha_de_integra__o_e_desenvolvimento` | 13 | False | `{}` |
| `bTXDb` | Check-in de Vendas | `check_in_de_vendas` | 14 | False | `{}` |
| `bTXDc` | Check-up de Vendas | `check_up_de_vendas` | 15 | False | `{}` |
| `bTXDd` | Guia Rápido para o Armazenamento e Manuseio de Veículos Zero Km | `guia_r_pido_para_o_armazenamento_e_manuseio_de_ve_culos_zero_km` | 16 | False | `{}` |
| `bTXDh` | Manual de Manuseio do Veículo Novo_NVHM_2019 | `manual_de_manuseio_do_ve_culo_novo_nvhm_2019` | 18 | False | `{}` |
| `bTXDi` | Cartão de Apresentação do Pós-Venda | `cart_o_de_apresenta__o_do_p_s_venda` | 17 | False | `{}` |
| `bTXDj` | Cartão de Satisfação de Pós-Venda | `cart_o_de_satisfa__o_de_p_s_venda` | 19 | False | `{}` |
| `bTXDn` | Catálogo de Ferramentas e Equipamentos Nissan 05_2023 | `cat_logo_de_ferramentas_e_equipamentos_nissan_05_2023` | 20 | False | `{}` |
| `bTXDo` | Exemplo de pesquisa VOC | `exemplo_de_pesquisa_voc` | 21 | False | `{}` |
| `bTXDp` | Guia de Uniformes_Nissan do Brasil_rev.02 | `guia_de_uniformes_nissan_do_brasil_rev_020` | 22 | True | `{}` |
| `bTXDt` | Guia SERNISSAN \| Roteiro para Entrevista de Desligamento | `guia_sernissan___roteiro_para_entrevista_de_desligamento` | 23 | True | `{}` |
| `bTXDu` | Guia SERNISSAN \| Sessão Individual de Feedback e Planejamento de Performance | `guia_sernissan___sess_o_individual_de_feedback_e_planejamento_de_performance` | 24 | False | `{}` |
| `bTXDv` | Guia SERNISSAN \| PRC (Processo de Recuperação de Clientes) | `guia_sernissan__prc__processo_de_recupera__o_de_clientes_` | 25 | False | `{}` |
| `bTXHw` | Guia SERNISSAN \| Check-in de Vendas | `guia_sernissan___check_in_de_vendas` | 26 | False | `{}` |
| `bTXHx` | Painel de Monitoramento de Vendas e VD | `painel_de_monitoramento_de_vendas_e_vd` | 27 | False | `{}` |
| `bTXIB` | Preferências para a Entrega | `prefer_ncias_para_a_entrega` | 28 | False | `{}` |
| `bTXIC` | Cartão Check-out de Serviço | `cart_o_check_out_de_servi_o` | 29 | False | `{}` |
| `bTXID` | DPVN 110-23 Guia 2023 de Acessorização de Veículos para Showroom e Test Drive | `dpvn_110_23_guia_2023_de_acessoriza__o_de_ve_culos_para_showroom_e_test_drive` | 30 | False | `{}` |
| `bTXIH` | Guia SERNISSAN \| Guia para Indicações | `guia_sernissan___guia_para_indica__es` | 31 | False | `{}` |
| `bTXII` | Guia SERNISSAN \| Negociação e Fechamento | `guia_sernissan___negocia__o_e_fechamento` | 32 | False | `{}` |
| `bTXIJ` | Guia SERNISSAN \| Roteiro de Contato de Relacionamento e Indicação | `guia_sernissan___roteiro_de_contato_de_relacionamento_e_indica__o` | 33 | False | `{}` |
| `bTXIN` | Guia SERNISSAN \| Roteiro de Recuperação de Negócios | `guia_sernissan___roteiro_de_recupera__o_de_neg_cios` | 34 | False | `{}` |
| `bTXIO` | Guia SERNISSAN \| Test Drive | `guia_sernissan___test_drive` | 35 | False | `{}` |
| `bTXIP` | Check-list de Inspeção Final de Entrega | `check_list_de_inspe__o_final_de_entrega` | 36 | False | `{}` |
| `bTXIT` | Guia SERNISSAN \| Passos da Inspeção Final de Entrega | `guia_sernissan___passos_da_inspe__o_final_de_entrega` | 37 | False | `{}` |
| `bTXIU` | Guia SERNISSAN \| Roteiro de APE e APS | `guia_sernissan___roteiro_de_ape_e_aps` | 38 | False | `{}` |
| `bTXIV` | Guia SERNISSAN \| Roteiro para Entrevista de Desligamento | `guia_sernissan___roteiro_para_entrevista_de_desligamento0` | 39 | True | `{}` |
| `bTXIZ` | Revisão de Entrega 0KM | `revis_o_de_entrega_0km` | 40 | False | `{}` |
| `bTXIl` | Check-in-up-out de Serviços | `check_in_up_out_de_servi_os` | 41 | False | `{}` |
| `bTXIm` | Guia SERNISSAN \| Inventário e Estoque | `guia_sernissan___invent_rio_e_estoque` | 42 | False | `{}` |
| `bTXIn` | Guia SERNISSAN \| Painel de Monitoramento de Peças Pendentes | `guia_sernissan___painel_de_monitoramento_de_pe_as_pendentes` | 43 | False | `{}` |
| `bTXIr` | Guia SERNISSAN \| Passos da Coleta Antecipada de Peças | `guia_sernissan___passos_da_coleta_antecipada_de_pe_as` | 44 | False | `{}` |
| `bTXIs` | Painel de Monitoramento de Peças Pendentes | `painel_de_monitoramento_de_pe_as_pendentes` | 45 | False | `{}` |
| `bTXIt` | Programação de Serviços | `programa__o_de_servi_os` | 46 | False | `{}` |
| `bTXJn` | Guia SERNISSAN \| Agendamento | `guia_sernissan___agendamento` | 47 | False | `{}` |
| `bTXJo` | Guia SERNISSAN \| Roteiro de Contato de  Relacionamento e Indicação | `guia_sernissan___roteiro_de_contato_de__relacionamento_e_indica__o` | 48 | False | `{}` |
| `bTXJp` | Menu de Revisões e Serviços | `menu_de_revis_es_e_servi_os` | 49 | False | `{}` |
| `bTXJt` | Checklist 5S NISSAN | `checklist_5s_nissan` | 50 | False | `{}` |
| `bTXJu` | Guia SERNISSAN \| Certo na Primeira Vez (F1) | `guia_sernissan___certo_na_primeira_vez__f1_` | 51 | False | `{}` |
| `bTXJv` | Guia SERNISSAN \| Identificação de Veículo De Serviço | `guia_sernissan___identifica__o_de_ve_culo_de_servi_o` | 52 | False | `{}` |
| `bTXJz` | Guia SERNISSAN \| Passos da Execução de Serviços | `guia_sernissan___passos_da_execu__o_de_servi_os` | 53 | False | `{}` |
| `bTXKA` | Guia SERNISSAN \| Passos da Revisão de Serviços | `guia_sernissan___passos_da_revis_o_de_servi_os` | 54 | False | `{}` |
| `bTXKB` | Guia SERNISSAN \| Passos do Teste de Rodagem | `guia_sernissan___passos_do_teste_de_rodagem` | 55 | False | `{}` |
| `bTXKF` | Guia SERNISSAN \| Passos para o Controle de Qualidade | `guia_sernissan___passos_para_o_controle_de_qualidade` | 56 | False | `{}` |
| `bTXKG` | Guia SERNISSAN \| Programação de Serviço | `guia_sernissan___programa__o_de_servi_o` | 57 | False | `{}` |
| `bTXKH` | Detalhes do Atendimento | `detalhes_do_atendimento` | 58 | False | `{}` |
| `bTXKL` | Guia SERNISSAN \| Etiqueta de Serviço | `guia_sernissan___etiqueta_de_servi_o` | 59 | False | `{}` |
| `bTXKM` | Guia SERNISSAN \| Passos do Check-in de Serviços | `guia_sernissan___passos_do_check_in_de_servi_os` | 60 | False | `{}` |
| `bTXKN` | Guia SERNISSAN \| Passos do Check-out de Serviços | `guia_sernissan___passos_do_check_out_de_servi_os` | 61 | False | `{}` |
| `bTXKR` | DQGN 006-23 Nissan Dealer Plus – Processo de Garantia | `dqgn_006_23_nissan_dealer_plus___processo_de_garantia` | 62 | False | `{}` |
| `bTXKS` | DQGN 030-20 - Anexo - Guia de Bolso da Garantia Nissan - Atualizado | `dqgn_030_20___anexo___guia_de_bolso_da_garantia_nissan___atualizado` | 63 | False | `{}` |
| `bTXKT` | Guia SERNISSAN \| Passos da Garantia | `guia_sernissan___passos_da_garantia` | 64 | False | `{}` |
| `bTXKX` | Cartão Check-in de Serviço | `cart_o_check_in_de_servi_o` | 65 | False | `{}` |
| `bTXKY` | Cartão Check-out de Serviço | `cart_o_check_out_de_servi_o0` | 66 | False | `{}` |
| `bTXKZ` | Detalhes do Atenidmento | `detalhes_do_atenidmento` | 67 | False | `{}` |
| `bTXKd` | Guia SERNISSAN \| Retorno | `guia_sernissan___retorno` | 68 | False | `{}` |
| `bTXKe` | Guia SERNISSAN \|PRC (Processo de Recuperação de Clientes) | `guia_sernissan__prc__processo_de_recupera__o_de_clientes_0` | 69 | True | `{}` |
| `bTXKf` | Lista de Equipamentos de Lavagem | `lista_de_equipamentos_de_lavagem` | 70 | False | `{}` |
| `bTXKj` | Guia SERNISSAN \| Passos da Lavagem e Secagem | `guia_sernissan___passos_da_lavagem_e_secagem` | 71 | False | `{}` |

## `competencia_conhecimentos` — Competencia Conhecimento

Atributos extras: `ID - deleted`:`text`

| Key | Display | db_value | Sort | Deleted | Extras |
|---|---|---|---:|---|---|
| `bTXFm` | Conhecimento dos processos chave de Vendas. | `conhecimento_dos_processos_chave_de_vendas_` | 1 | False | `{'id0': 'CC1'}` |
| `bTXFn` | Desejável conhecimento de informática básica (Word e Excel). | `desej_vel_conhecimento_de_inform_tica_b_sica__word_e_excel__` | 2 | True | `{}` |
| `bTXFr` | Experiência na área comercial ou Administrativa. | `experi_ncia_na__rea_comercial_ou_administrativa_` | 3 | False | `{}` |
| `bTXFs` | Conhecimento dos processos de Vendas. | `conhecimento_dos_processos_de_vendas_` | 4 | False | `{}` |
| `bTXFt` | Conhecimento da área de geração de relatórios do sistema de gestão da concessionária. | `conhecimento_da__rea_de_gera__o_de_relat_rios_do_sistema_de_gest_o_da_concession_ria_` | 5 | False | `{}` |
| `bTXFx` | Indicadores de Gestão. | `indicadores_de_gest_o_` | 6 | False | `{}` |
| `bTXFy` | Conhecimento do SERNissan. | `conhecimento_do_sernissan_` | 7 | False | `{}` |
| `bTXFz` | Conhecimento em informática básica (Word, Exc). | `conhecimento_em_inform_tica_b_sica__word__excel__` | 8 | True | `{}` |
| `bTXGD` | Desejável conhecimento das operações financeiras. | `desej_vel_conhecimento_das_opera__es_financeiras_` | 9 | False | `{}` |
| `bTXGE` | Conhecimento dos processos de Vendas Diretas. | `conhecimento_dos_processos_de_vendas_diretas_` | 10 | False | `{}` |
| `bTXGF` | Conhecimento da área de geração de relatórios do sistema de gestão da concessionária. | `conhecimento_da__rea_de_gera__o_de_relat_rios_do_sistema_de_gest_o_da_concession_ria_0` | 11 | True | `{}` |
| `bTXGJ` | Conhecimento no mercado automobilístico. | `conhecimento_no_mercado_automobil_stico_` | 12 | False | `{}` |
| `bTXGK` | Conhecimento das principais marcas concorrentes. | `conhecimento_das_principais_marcas_concorrentes_` | 13 | False | `{}` |
| `bTXGL` | Vistoria de veículos. | `vistoria_de_ve_culos_` | 14 | False | `{}` |
| `bTXGP` | Conhecimento no mercado automotivo. | `conhecimento_no_mercado_automotivo_` | 15 | False | `{}` |
| `bTXGQ` | Conhecimento das principais marcas concorrentes. | `conhecimento_das_principais_marcas_concorrentes_0` | 16 | True | `{}` |
| `bTXGR` | Conhecimento de técnicas, acompanhamento e adminstração de redes sociais. | `conhecimento_de_t_cnicas__acompanhamento_e_adminstra__o_de_redes_sociais_` | 17 | False | `{}` |
| `bTXGV` | Conhecimento de técnicas de marketing digital e e-commerce. | `conhecimento_de_t_cnicas_de_marketing_digital_e_e_commerce_` | 18 | False | `{}` |
| `bTXGW` | Conhecimento dos processos internos de vendas da concessionária. | `conhecimento_dos_processos_internos_de_vendas_da_concession_ria_` | 19 | False | `{}` |
| `bTXGX` | Desejável conhecimento em matemática financeira. | `desej_vel_conhecimento_em_matem_tica_financeira_` | 20 | False | `{}` |
| `bTXGb` | Conhecimento dos principais produtos financeiros. | `conhecimento_dos_principais_produtos_financeiros_` | 21 | False | `{}` |
| `bTXGc` | Desejável conhecimento em matemática financeira. | `desej_vel_conhecimento_em_matem_tica_financeira_0` | 22 | True | `{}` |
| `bTXGd` | Mercado automotivo, principais marcas  e locadoras concorrentes. | `mercado_automotivo__principais_marcas__e_locadoras_concorrentes_` | 23 | False | `{}` |
| `bTXGh` | Técnicas de negociação e apresentação dos veículos Nissan (vantagens, características e atributos). | `t_cnicas_de_negocia__o_e_apresenta__o_dos_ve_culos_nissan__vantagens__caracter_sticas_e_atributos__` | 24 | False | `{}` |
| `bTXGi` | Processos internos de vendas da Concessionária. | `processos_internos_de_vendas_da_concession_ria_` | 25 | True | `{}` |
| `bTXGj` | Conhecimento no mercado automobilístico, mais especificamente na legislação que beneficia o cliente PCD. | `conhecimento_no_mercado_automobil_stico__mais_especificamente_na_legisla__o_que_beneficia_o_cliente_pdc_` | 26 | False | `{}` |
| `bTXGn` | Conhecimento das principais marcas concorrentes. | `conhecimento_das_principais_marcas_concorrentes_1` | 27 | True | `{}` |
| `bTXGo` | Experiência em vendas diretas a empresas e órgãos oficiais no ramo automobilístico. | `experi_ncia_em_vendas_diretas_a_empresas_e__rg_os_oficiais_no_ramo_automobil_stico_` | 28 | False | `{}` |
| `bTXGp` | Conhecimento do Sistema de Gestão da Concessionária. | `conhecimento_do_sistema_de_gest_o_da_concession_ria_` | 29 | True | `{}` |
| `bTXGt` | Conhecimento dos diferenciais dos acessórios genuínos Nissan frente à concorrência (paralelo). | `conhecimento_dos_diferenciais_dos_acess_rios_genu_nos_nissan_frente___concorr_ncia__paralelo__` | 30 | False | `{}` |
| `bTXGu` | Conhecimento de todo o processo de Vendas. | `conhecimento_de_todo_o_processo_de_vendas_` | 31 | False | `{}` |
| `bTXGv` | Conhecimento da utilização dos atributos do carro. | `conhecimento_da_utiliza__o_dos_atributos_do_carro_` | 32 | False | `{}` |
| `bTXGz` | Conhecimento em Vendas no segmento automobilístico. | `conhecimento_em_vendas_no_segmento_automobil_stico_` | 33 | False | `{}` |
| `bTXHA` | Conhecimentos em informática (Pacote Office e internet). | `conhecimentos_em_inform_tica__pacote_office__` | 34 | False | `{}` |
| `bTXHB` | Conhecimento em vendas diretas a empresas e órgãos oficiais no mercado automobilístico. | `conhecimento_em_vendas_diretas_a_empresas_e__rg_os_oficiais_no_mercado_automobil_stico_` | 35 | False | `{}` |
| `bTXHF` | Conhecimento de todo o processo digital de vendas da concessionária e da montadora. | `conhecimento_de_todo_o_processo_digital_de_vendas_da_concession_ria_e_da_montadora_` | 36 | False | `{}` |
| `bTXHG` | Conhecimento em controles de preparação de veículos e tempo de execução. | `conhecimento_em_controles_de_prepara__o_de_ve_culos_e_tempo_de_execu__o_` | 37 | False | `{}` |
| `bTXHH` | Desejável conhecimento de veículos. | `desej_vel_conhecimento_de_ve_culos_` | 38 | False | `{}` |
| `bTXHL` | Conhecimento em controles de recebimento e armazenamento de veículos e tempos de execução. | `conhecimento_em_controles_de_recebimento_e_armazenamento_de_ve_culos_e_tempos_de_execu__o_` | 39 | False | `{}` |
| `bTXHM` | Conhecimento dos serviços básicos da Concessionária e seus respectivos responsáveis. | `conhecimento_dos_servi_os_b_sicos_da_concession_ria_e_seus_respectivos_respons_veis_` | 40 | False | `{}` |
| `bTXHN` | Desejável experiência anterior como telefonista | `desej_vel_experi_ncia_anterior_como_telefonista` | 41 | False | `{}` |
| `bTXIf` | Conhecimento na área de peças de concessionárias. | `conhecimento_na__rea_de_pe_as_de_concession_rias_` | 42 | False | `{}` |
| `bTXIg` | Conhecimento em gestão de estoque. | `conhecimento_em_gest_o_de_estoque_` | 43 | False | `{}` |
| `bTXIy` | Conhecimento da área de agendamento do Sistema de Gestão da Concessionária. | `conhecimento_da__rea_de_agendamento_do_sistema_de_gest_o_da_concession_ria_` | 44 | False | `{}` |
| `bTXIz` | Conhecimento dos serviços oferecidos pela concessionária . | `conhecimento_dos_servi_os_oferecidos_pela_concession_ria__` | 45 | False | `{}` |
| `bTXJD` | Desejável Experiência na área Administrativa. | `desej_vel_experi_ncia_na__rea_administrativa_` | 46 | False | `{}` |
| `bTXJE` | Conhecimento dos processo internos da área de Pós-Venda. | `conhecimento_dos_processo_internos_da__rea_de_p_s_venda_` | 47 | False | `{}` |
| `bTXJF` | Conhecimento técnico elevado em manutenção de veículos Nissan. | `conhecimento_t_cnico_elevado_em_manuten__o_de_ve_culos_nissan_` | 48 | False | `{}` |
| `bTXJJ` | Conhecimento dos processo de Pós-Venda. | `conhecimento_dos_processo_de_p_s_venda_` | 49 | False | `{}` |
| `bTXJK` | Conhecimentos administrativos da oficina. | `conhecimentos_administrativos_da_oficina_` | 50 | False | `{}` |
| `bTXJL` | Possuir CNH para realização de testes. | `possuir_cnh_para_realiza__o_de_testes_` | 51 | False | `{}` |
| `bTXJP` | Desejável conhecimento em mecânica. | `desej_vel_conhecimento_em_mec_nica_` | 52 | False | `{}` |
| `bTXJQ` | Conhecimento técnico em mecânica. | `conhecimento_t_cnico_em_mec_nica_` | 53 | False | `{}` |
| `bTXJR` | Conhecimento dos processo chave de Pós-Venda. | `conhecimento_dos_processo_chave_de_p_s_venda_` | 54 | False | `{}` |
| `bTXJV` | Conhecimento no mercado de reparo automobilístico. | `conhecimento_no_mercado_de_reparo_automobil_stico_` | 55 | False | `{}` |
| `bTXJW` | Conhecimento de técnicas de garantia automotiva. | `conhecimento_de_t_cnicas_de_garantia_automotiva_` | 56 | False | `{}` |
| `bTXJX` | Conhecimento em instalação de acessórios automotivos. | `conhecimento_em_instala__o_de_acess_rios_automotivos_` | 57 | False | `{}` |
| `bTXJb` | Métodos de lavagem de veículos | `m_todos_de_lavagem_de_ve_culos` | 58 | False | `{}` |
| `bTXJc` | Processos de Vendas e Pós-Venda relacionados à lavagem | `processos_de_vendas_e_p_s_venda_relacionados___lavagem` | 59 | False | `{}` |
| `bTXJd` | Conhecimento técnico em acessibilidade a equipamentos de diagnósticos. | `conhecimento_t_cnico_em_acessibilidade_a_equipamentos_de_diagn_sticos_` | 60 | False | `{}` |
| `bTXJh` | Conhecimento elevado em manutenção de veículos Nissan. | `conhecimento_elevado_em_manuten__o_de_ve_culos_nissan_` | 61 | False | `{}` |
| `bTXKp` | Conhecimento da parte de entrada de produtos e serviços e de emissão de notas do Sistema de Gestão da Concessionária. | `conhecimento_da_parte_de_entrada_de_produtos_e_servi_os_e_de_emiss_o_de_notas_do_sistema_de_gest_o_da_concession_ria_` | 62 | False | `{}` |
| `bTXKq` | Conhecimento dos Produtos  serviços da Concessionária. | `conhecimento_dos_produtos__servi_os_da_concession_ria_` | 63 | False | `{}` |
| `bTXKr` | Relação de documentos e comprovantes para emissão da Nota Fiscal. | `rela__o_de_documentos_e_comprovantes_para_emiss_o_da_nota_fiscal_` | 64 | False | `{}` |
| `bTXKv` | Abrir e Fechar caixa. | `abrir_e_fechar_caixa_` | 65 | False | `{}` |
| `bTXKw` | Rotinas admistrativas da Concessionária. | `rotinas_admistrativas_da_concession_ria_` | 66 | False | `{}` |
| `bTXKx` | Todos os indicadores contábeis da Concessionária. | `todos_os_indicadores_cont_beis_da_concession_ria_` | 67 | False | `{}` |
| `bTXLB` | Indicadores de Performance financeiros por área. | `indicadores_de_performance_financeiros_por__rea_` | 68 | False | `{}` |
| `bTXLC` | Conhecimento em Modelos de gestão de Marketing | `conhecimento_em_modelos_de_gest_o_de_marketing` | 69 | False | `{}` |
| `bTXLD` | Conhecimento dos processos chave de Vendas e Pós-venda. | `conhecimento_dos_processos_chave_de_vendas_e_p_s_venda_` | 70 | False | `{}` |
| `bTXLH` | Conhecimento dos métodos das pesquisas de satisfação. | `conhecimento_dos_m_todos_das_pesquisas_de_satisfa__o_` | 71 | False | `{}` |
| `bTXLI` | Conhecimento dos processos de recuperação de Clientes. | `conhecimento_dos_processos_de_recupera__o_de_clientes_` | 72 | False | `{}` |
| `bTXLJ` | Conhecimento em indicadores de performance. | `conhecimento_em_indicadores_de_performance_` | 73 | False | `{}` |
| `bTXLN` | Desejável conhecimento no segmento automobilístico. | `desej_vel_conhecimento_no_segmento_automobil_stico_` | 74 | False | `{}` |
| `bTXLO` | Conhecimento das principais marcas concorrentes. | `conhecimento_das_principais_marcas_concorrentes_2` | 75 | True | `{}` |
| `bTXLP` | Conhecimento dos processos de Vendas e Pós-venda. | `conhecimento_dos_processos_de_vendas_e_p_s_venda_` | 76 | False | `{}` |
| `bTXLT` | Conhecimento em Modelos de gestão. | `conhecimento_em_modelos_de_gest_o_` | 77 | False | `{}` |
| `bTXLU` | Conhecimento do Mapa de Competências Nissan. | `conhecimento_do_mapa_de_compet_ncias_nissan_` | 78 | False | `{}` |
| `bTXLV` | Conhecimento do mapa de competências da Concessionária. | `conhecimento_do_mapa_de_compet_ncias_da_concession_ria_` | 79 | False | `{}` |
| `bTXLZ` | Conhecimento de modelos de capacitação (técnica e comportamental). | `conhecimento_de_modelos_de_capacita__o__t_cnica_e_comportamental__` | 80 | False | `{}` |
| `bTXLa` | Experiência na elaboração e análise de demonstrativos contábeis. | `experi_ncia_na_elabora__o_e_an_lise_de_demonstrativos_cont_beis_` | 81 | False | `{}` |
| `bTXLb` | Conhecimento em legislação fiscal e tributária. | `conhecimento_em_legisla__o_fiscal_e_tribut_ria_` | 82 | False | `{}` |
| `bTXLf` | Experiência em implantação e controle de rotinas administrativas. | `experi_ncia_em_implanta__o_e_controle_de_rotinas_administrativas_` | 83 | False | `{}` |
| `bTXLg` | Desejável conhecimento em processos de ISO 9000. | `desej_vel_conhecimento_em_processos_de_iso_9000_` | 84 | False | `{}` |
| `bTXLh` | Conhecimento dos canais de contato com Clientes. | `conhecimento_dos_canais_de_contato_com_clientes_` | 85 | False | `{}` |
| `bTXLl` | Conhecimento dos processos e rotinas administrativas. | `conhecimento_dos_processos_e_rotinas_administrativas_` | 86 | False | `{}` |
| `bTXLm` | Conhecimento básico dos canais de contato com Clientes | `conhecimento_b_sico_dos_canais_de_contato_com_clientes` | 87 | False | `{}` |
| `bTXLn` | Experiência anterior em operações de telemarketing. | `experi_ncia_anterior_em_opera__es_de_telemarketing_` | 88 | False | `{}` |
| `bTXLr` | Desejável conhecimento da estrutura organizacional de uma concessionária. | `desej_vel_conhecimento_da_estrutura_organizacional_de_uma_concession_ria_` | 89 | False | `{}` |
| `bTXLs` | Conhecimento de modelos de gestão de pessoas. | `conhecimento_de_modelos_de_gest_o_de_pessoas_` | 90 | False | `{}` |
| `bTXLt` | Desejável experiência anterior na área de SAC. | `desej_vel_experi_ncia_anterior_na__rea_de_sac_` | 91 | False | `{}` |
| `bTXLx` | Conhecimento do sistema Salesforce e processo de Vendas e Pós-Venda. | `conhecimento_do_sistema_salesforce_e_processo_de_vendas_e_p_s_venda_` | 92 | False | `{}` |
| `bTXLy` | Conhecimento no Código de Defesa do Consumidor. | `conhecimento_no_c_digo_de_defesa_do_consumidor_` | 93 | False | `{}` |
| `bTXLz` | Conhecimento em infraestrutura de TI. | `conhecimento_em_infraestrutura_de_ti_` | 94 | False | `{}` |
| `bTXMD` | Conhecimento de implementação e manutenção de computadores em Redes. | `conhecimento_de_implementa__o_e_manuten__o_de_computadores_em_redes_` | 95 | False | `{}` |
| `bTXME` | Conhecimento do sistema de gestão da Concessionária. | `conhecimento_do_sistema_de_gest_o_da_concession_ria_0` | 96 | True | `{}` |
| `bTXMF` | Conhecimento do sistema de gestão da Concessionária. | `conhecimento_do_sistema_de_gest_o_da_concession_ria_1` | 97 | False | `{}` |
| `bTXMJ` | Conhecimento de sistemas de indicadores de performance. | `conhecimento_de_sistemas_de_indicadores_de_performance_` | 98 | False | `{}` |

## `competencia_tipo` — Competencia tipo

Atributos extras: `tipo - deleted`:`option.competencia_tipo`, `Peso`:`number`

| Key | Display | db_value | Sort | Deleted | Extras |
|---|---|---|---:|---|---|
| `bTWoX` | Específica | `espec_fica` | 1 | False | `{'divisor': 10}` |
| `bTWob` | SerNissan | `sernissan` | 2 | False | `{'divisor': 20}` |
| `1763437206769x474919464966719360` | Hábito | `h_bito` | 3 | True | `{}` |
| `1763437476610x679996466691551440` | Hábito | `h_bito0` | 4 | False | `{'divisor': 70}` |

## `competencia_habito` — Competencia Habito

> Option set marcado como deletado no Bubble. Manter apenas para compatibilidade histórica.

Atributos extras: `MV`:`text`, `ID`:`text`, `Area`:`text`, `Peso`:`number`, `Trilha`:`number`, `Pergunta`:`text`, `Descricao`:`text`, `Essencial`:`boolean`, `Momento de Verdade`:`text`

| Key | Display | db_value | Sort | Deleted | Extras |
|---|---|---|---:|---|---|
| `bTXez` | MV | `mv` | 1 | True | `{}` |
| `bTXqb` | Estrutura das Equipes | `estrutura_das_equipes` | 2 | True | `{}` |
| `bTXqc` | Seleção e Integração | `sele__o_e_integra__o` | 3 | True | `{}` |
| `bTXqd` | Recursos e Instalações | `recursos_e_instala__es` | 4 | True | `{}` |
| `bTXqh` | 1 | `1_` | 5 | True | `{'mv': 'MV 1', 'id0': 'CH1', 'area': 'I', 'peso': 9, 'trilha': 1, 'pergunta': 'Teve pessoas capacitadas para todas as Funções-Chave, direcionados ao Encantamento do Cliente?', 'descricao': 'Tenha pessoas capacitadas para todas as Funções-Chave, direcionados ao Encantamento do Cliente.', 'essencial': True, 'momento_de_verdade': 'Estrutura das Equipes'}` |
| `bTXqi` | 2 | `2_` | 6 | True | `{'mv': 'MV 2', 'id0': 'CH2', 'area': 'I', 'peso': 1, 'trilha': 1, 'pergunta': 'Realizou o recrutamento e seleção para contratar colaboradores adequados?', 'descricao': 'Realize o recrutamento e seleção para contratar colaboradores adequados.', 'essencial': False, 'momento_de_verdade': 'Seleção e Integração'}` |
| `bTXqj` | 3 | `3_` | 7 | True | `{'mv': 'MV 3', 'id0': 'CH3', 'area': 'I', 'peso': 1, 'trilha': 1, 'pergunta': 'Garantiu que todos os colaboradores utilizem os recursos necessários para o seu desempenho?', 'descricao': 'Garanta que todos os colaboradores utilizem os recursos necessários para o seu desempenho.', 'essencial': False, 'momento_de_verdade': 'Recursos e Instalações'}` |
| `bTXqn` | 4 | `4_` | 8 | True | `{'mv': 'MV 3', 'id0': 'CH4', 'area': 'PV', 'peso': 6, 'trilha': 1, 'pergunta': 'Teve box equipados e ferramentas adequadas para a execução dos serviços?', 'descricao': 'Possui boxes equipados e ferramentas adequadas para a execução dos serviços.', 'essencial': True, 'momento_de_verdade': 'Recursos e Instalações'}` |
| `bTXqo` | 5 | `5_` | 9 | True | `{'mv': 'MV 3', 'id0': 'CH5', 'area': 'I', 'peso': 3, 'trilha': 1, 'pergunta': 'Manteve as instalações da Concessionária em perfeitas condições?', 'descricao': 'Mantenha as instalações da Concessionária em perfeitas condições.', 'essencial': False, 'momento_de_verdade': 'Recursos e Instalações'}` |
| `bTXqp` | 6 | `6_` | 10 | True | `{'mv': 'MV 4', 'id0': 'CH6', 'area': 'I', 'peso': 6, 'trilha': 1, 'pergunta': 'Capacitou e desenvolveu continuamente a equipe?', 'descricao': 'Capacite e desenvolva continuamente a equipe.', 'essencial': True, 'momento_de_verdade': 'Treinamento e Desenvolvimento'}` |
| `bTXqt` | 7 | `7_` | 11 | True | `{'mv': 'MV 4', 'id0': 'CH7', 'area': 'I', 'peso': 6, 'trilha': 1, 'pergunta': 'Desenvolveu continuamente os colaboradores com foco na alta performance?', 'descricao': 'Desenvolve e reconhece os colaboradores, por mérito ou bonificação, com foco em alta performance.', 'essencial': True, 'momento_de_verdade': 'Treinamento e Desenvolvimento'}` |
| `bTXqu` | 8 | `8_` | 12 | True | `{'mv': 'MV 5', 'id0': 'CH8', 'area': 'I', 'peso': 1, 'trilha': 1, 'pergunta': 'Reconheceu e bonificou todos os colaboradores com foco na redução da rotatividade?', 'descricao': 'Realize ações de melhoria continua.', 'essencial': False, 'momento_de_verdade': 'Performance e Reconhecimento'}` |
| `bTXqv` | 9 | `9_` | 13 | True | `{'mv': 'MV 6', 'id0': 'CH9', 'area': 'I', 'peso': 6, 'trilha': 1, 'pergunta': 'Realizou ações de melhoria contínua?', 'descricao': 'Realize ações de relacionamento e marketing.', 'essencial': True, 'momento_de_verdade': 'Cultura Kaizen'}` |
| `bTXqz` | 10 | `10_` | 14 | True | `{'mv': 'MV 7', 'id0': 'CH10', 'area': 'I', 'peso': 1, 'trilha': 2, 'pergunta': 'Realizou ações de relacionamento e marketing?', 'descricao': 'Realize campanhas e ações de prospecção de Clientes.', 'essencial': False, 'momento_de_verdade': 'Ações de Relacionamento e Marketing'}` |
| `bTXrA` | 11 | `11_` | 15 | True | `{'mv': 'MV 8', 'id0': 'CH11', 'area': 'I', 'peso': 6, 'trilha': 2, 'pergunta': 'Realizou campanhas e ações de prospecção de Clientes?', 'descricao': 'Posicione os veículos no showroom conforme recomendação da Nissan.', 'essencial': True, 'momento_de_verdade': 'Ações de Prospecção'}` |
| `bTXrB` | 12 | `12_` | 16 | True | `{'mv': 'MV 9', 'id0': 'CH12', 'area': 'V', 'peso': 1, 'trilha': 2, 'pergunta': 'Posicionou os veículos no showroom conforme recomendação da Nissan?', 'descricao': 'Posicione os veículos no showroom conforme recomendação da Nissan.', 'essencial': False, 'momento_de_verdade': 'Preparação para receber o Cliente de Vendas'}` |
| `bTXrF` | 13 | `13_` | 17 | True | `{'mv': 'MV 10', 'id0': 'CH13', 'area': 'PV', 'peso': 9, 'trilha': 2, 'pergunta': 'Teve Operadores dedicados ao Agendamento Ativo e Receptivo para atendimentos e campanhas?', 'descricao': 'Tenha Operadores dedicados ao Agendamento Ativo e Receptivo para atendimentos e campanhas.', 'essencial': True, 'momento_de_verdade': 'Agendamento ativo e receptivo'}` |
| `bTXrG` | 14 | `14_` | 18 | True | `{'mv': 'MV 11', 'id0': 'CH14', 'area': 'PV', 'peso': 3, 'trilha': 2, 'pergunta': 'Revisou a programação do dia seguinte e assegurou a disponibilidade do Consultor de Serviços para receber os Clientes agendados?', 'descricao': 'Revise a programação do dia seguinte e assegure a disponibilidade do Consultor de Serviços para receber os Clientes agendados.', 'essencial': False, 'momento_de_verdade': 'Preparação para receber o Cliente de Pós-Vendas'}` |
| `bTXrH` | 15 | `15_` | 19 | True | `{'mv': 'MV 12', 'id0': 'CH15', 'area': 'V', 'peso': 3, 'trilha': 3, 'pergunta': 'Teve uma pessoa ou central responsável pelo atendimento e registro dos Clientes Digitais?', 'descricao': 'Tenha uma pessoa ou central responsável pelo atendimento e registro dos Clientes Digitais.', 'essencial': False, 'momento_de_verdade': 'Atendimento Clientes Digitais'}` |
| `bTXrL` | 16 | `16_` | 20 | True | `{'mv': 'MV 13', 'id0': 'CH16', 'area': 'I', 'peso': 1, 'trilha': 3, 'pergunta': 'Teve um sistema efetivo de atendimento telefônico e de distribuição das ligações?', 'descricao': 'Tenha um sistema efetivo de atendimento telefônico e de distribuição das ligações.', 'essencial': False, 'momento_de_verdade': 'Atendimento Telefônico'}` |
| `bTXrM` | 17 | `17_` | 21 | True | `{'mv': 'MV 14', 'id0': 'CH17', 'area': 'I', 'peso': 1, 'trilha': 3, 'pergunta': 'Atendeu de forma ágil, cumprimentou pelo nome, confirmou a finalidade da visita e compartilhou os próximos passos do atendimento?', 'descricao': 'Atenda de forma ágil, cumprimente pelo nome, confirme a finalidade da visita e compartilhe os próximos passos do atendimento.', 'essencial': False, 'momento_de_verdade': 'Atendimento Presencial'}` |
| `bTXrN` | 18 | `18_` | 22 | True | `{'mv': 'MV 15', 'id0': 'CH18', 'area': 'V', 'peso': 1, 'trilha': 3, 'pergunta': 'Utilizou perguntas abertas, identificou o perfil do Cliente e explicou as características e benefícios do veículo?', 'descricao': 'Utilize perguntas abertas, identifique o perfil do Cliente e explique as características e benefícios do veículo.', 'essencial': False, 'momento_de_verdade': 'Qualificação e Apresentação do Veículo'}` |
| `bTXrR` | 19 | `19_` | 23 | True | `{'mv': 'MV 16', 'id0': 'CH19', 'area': 'V', 'peso': 6, 'trilha': 3, 'pergunta': 'Teve um processo estruturado de Test Drive visando que o Cliente experimente completamente os recursos dos veículos?', 'descricao': 'Tenha um processo estruturado de Test Drive visando que o Cliente experimente completamente os recursos dos veículos?', 'essencial': True, 'momento_de_verdade': 'Test Drive'}` |
| `bTXrS` | 20 | `20_` | 24 | True | `{'mv': 'MV 17', 'id0': 'CH20', 'area': 'V', 'peso': 1, 'trilha': 3, 'pergunta': 'Manteve o processo ágil e transparente de avaliação e captação de veículos Seminovos?', 'descricao': 'Mantenha o processo ágil e transparente de avaliação e captação de veículos Seminovos.', 'essencial': False, 'momento_de_verdade': 'Avaliação do Seminovo'}` |
| `bTXrT` | 21 | `21_` | 25 | True | `{'mv': 'MV 18', 'id0': 'CH21', 'area': 'V', 'peso': 3, 'trilha': 3, 'pergunta': 'Registrou imediatamente a negociação no CRM/Sistema ao finalizar cada atendimento e garantiu a medição da taxa de conversão?', 'descricao': 'Registre imediatamente a negociação no CRM/Sistema ao finalizar cada atendimento e garanta a medição da taxa de conversão.', 'essencial': False, 'momento_de_verdade': 'Negociação'}` |
| `bTXrX` | 22 | `22_` | 26 | True | `{'mv': 'MV 19', 'id0': 'CH22', 'area': 'V', 'peso': 1, 'trilha': 3, 'pergunta': 'Teve um processo estruturado de recuperação de negócios e acompanhamento dos Clientes que não compraram?', 'descricao': 'Tenha um processo estruturado de recuperação de negócios e acompanhamento dos Clientes que não compraram.', 'essencial': False, 'momento_de_verdade': 'Recuperação de negócios e acompanhamento do Cliente'}` |
| `bTXrY` | 23 | `23_` | 27 | True | `{'mv': 'MV 20', 'id0': 'CH23', 'area': 'V', 'peso': 9, 'trilha': 3, 'pergunta': 'Realizou o Check-in de Vendas para 100% dos Clientes presenciais e digitais, entendendo suas necessidades, gerando transparência no processo?', 'descricao': 'Realize o Check-in de Vendas para 100% dos Clientes presenciais e digitais, entendendo suas necessidades, gerando transparência no processo.', 'essencial': True, 'momento_de_verdade': 'Fechamento e Check-in de Vendas'}` |
| `bTXrZ` | 24 | `24_` | 28 | True | `{'mv': 'MV 21', 'id0': 'CH24', 'area': 'PV', 'peso': 9, 'trilha': 3, 'pergunta': 'Realizou o Check-in de Serviços com 100% dos Clientes no ND+ (Tablet de Serviços), registrando as suas necessidades e gerando transparência no processo?', 'descricao': 'Realize o Check-in de Serviços com 100% dos Clientes no ND+ (Tablet de Serviços), registrando as suas necessidades e gerando transparência no processo.', 'essencial': True, 'momento_de_verdade': 'Recepção e Check-in de Serviços'}` |
| `bTXrd` | 25 | `25_` | 29 | True | `{'mv': 'MV 22', 'id0': 'CH25', 'area': 'I', 'peso': 1, 'trilha': 3, 'pergunta': 'Teve um processo estruturado para a Venda de Acessórios?', 'descricao': 'Tenha um processo estruturado para a Venda de Acessórios.', 'essencial': False, 'momento_de_verdade': 'Vendas de Acessórios, Nissan Protect e Agregados'}` |
| `bTXre` | 26 | `26_` | 30 | True | `{'mv': 'MV 23', 'id0': 'CH26', 'area': 'V', 'peso': 3, 'trilha': 4, 'pergunta': 'Teve um processo estruturado para garantir a transparência da negociação e o contato com o Cliente?', 'descricao': 'Tenha um processo estruturado para garantir a transparência da negociação e o contato com o Cliente?', 'essencial': False, 'momento_de_verdade': 'Gestão de Vendas'}` |
| `bTXrf` | 27 | `27_` | 31 | True | `{'mv': 'MV 24', 'id0': 'CH27', 'area': 'V', 'peso': 1, 'trilha': 4, 'pergunta': 'Acompanhou a localização dos veículos, disponibilidade, tempo estimado de chegada e estoque atual?', 'descricao': 'Acompanhe a localização dos veículos, disponibilidade, tempo estimado de chegada e estoque atual.', 'essencial': False, 'momento_de_verdade': 'Preparação para Entrega de Veículos Novos'}` |
| `bTXrj` | 28 | `28_` | 32 | True | `{'mv': 'MV 24', 'id0': 'CH28', 'area': 'I', 'peso': 9, 'trilha': 4, 'pergunta': 'Realizou a revisão do 0km e a instalação acessórios, garantindo que o veículo esteja em perfeitas condições?', 'descricao': 'Realize a revisão do 0km e a instalação acessórios, garantindo que o veículo esteja em perfeitas condições.', 'essencial': True, 'momento_de_verdade': 'Preparação para Entrega de Veículos Novos'}` |
| `bTXrk` | 29 | `29_` | 33 | True | `{'mv': 'MV 25', 'id0': 'CH29', 'area': 'PV', 'peso': 1, 'trilha': 4, 'pergunta': 'Atualizou e compartilhou com os colaboradores envolvidos o Menu de Revisões e Serviços (TMO) e a Programação de Serviços?', 'descricao': 'Atualize e compartilhe com os colaboradores envolvidos o Menu de Revisões e Serviços (TMO) e a Programação de Serviços.', 'essencial': False, 'momento_de_verdade': 'Planejamento e Controle dos Serviços'}` |
| `bTXrl` | 30 | `30_` | 34 | True | `{'mv': 'MV 25', 'id0': 'CH30', 'area': 'PV', 'peso': 1, 'trilha': 4, 'pergunta': 'Localizou e identificou os veículos nas vagas operacionais e a etapa de serviço em que se encontram?', 'descricao': 'Localize e identifique os veículos nas vagas operacionais e a etapa de serviço em que se encontram.', 'essencial': False, 'momento_de_verdade': 'Planejamento e Controle dos Serviços'}` |
| `bTXrp` | 31 | `31_` | 35 | True | `{'mv': 'MV 26', 'id0': 'CH31', 'area': 'PV', 'peso': 1, 'trilha': 4, 'pergunta': 'Garantiu um estoque de peças eficiente e organizado, acompanhando giro e disponibilidade?', 'descricao': 'Garanta um estoque de peças eficiente e organizado, acompanhando giro e disponibilidade:', 'essencial': False, 'momento_de_verdade': 'Estoque de Peças e Acessórios'}` |
| `bTXrq` | 32 | `32_` | 36 | True | `{'mv': 'MV 26', 'id0': 'CH32', 'area': 'PV', 'peso': 3, 'trilha': 4, 'pergunta': 'Realizou gestão efetiva e comunicação assertiva com os Clientes em todas as etapas do monitoramento dos pedidos de peças?', 'descricao': 'Realiza gestão efetiva e comunicação assertiva com os Clientes em todas as etapas do monitoramento dos pedidos de peças?', 'essencial': False, 'momento_de_verdade': 'Estoque de Peças e Acessórios'}` |
| `bTXrr` | 33 | `33_` | 37 | True | `{'mv': 'MV 27', 'id0': 'CH33', 'area': 'PV', 'peso': 1, 'trilha': 4, 'pergunta': 'Garantiu que todos os Técnicos utilizem os recursos necessários para a execução do serviço?', 'descricao': 'Garanta que todos os Técnicos utilizem os recursos necessários para a execução do serviço.', 'essencial': False, 'momento_de_verdade': 'Execução dos Serviços'}` |
| `bTXrv` | 34 | `34_` | 38 | True | `{'mv': 'MV 27', 'id0': 'CH34', 'area': 'PV', 'peso': 9, 'trilha': 4, 'pergunta': 'Executou corretamente o Serviço, preenchendo com qualidade o Check-up de Serviços no ND+ (Tablet de Serviços)?', 'descricao': 'Execute corretamente o Serviço, preenchendo com qualidade o Check-up de Serviços no ND+ (Tablet de Serviços).', 'essencial': True, 'momento_de_verdade': 'Execução dos Serviços'}` |
| `bTXrw` | 35 | `35_` | 39 | True | `{'mv': 'MV 28', 'id0': 'CH35', 'area': 'PV', 'peso': 3, 'trilha': 4, 'pergunta': 'Garantiu a excelência na explicação da necessidade de Serviço Adicional, utilizando o ND+ (Tablet de Serviços)?', 'descricao': 'Garanta a excelência na explicação da necessidade de Serviço Adicional, utilizando o ND+ (Tablet de Serviços).', 'essencial': False, 'momento_de_verdade': 'Gestão do Serviço Adicional '}` |
| `bTXrx` | 36 | `36_` | 40 | True | `{'mv': 'MV 29', 'id0': 'CH36', 'area': 'PV', 'peso': 6, 'trilha': 4, 'pergunta': 'Garantiu que 100% dos serviços tenham Controle de Qualidade?', 'descricao': 'Garanta que 100% dos serviços tenham Controle de Qualidade.', 'essencial': True, 'momento_de_verdade': 'Controle de Qualidade'}` |
| `bTXsB` | 37 | `37_` | 41 | True | `{'mv': 'MV 30', 'id0': 'CH37', 'area': 'I', 'peso': 6, 'trilha': 4, 'pergunta': 'Agendou e lavou com excelência os veículos em uma área exclusiva e adequada ao fluxo?', 'descricao': 'Agende e lave com excelência os veículos em uma área exclusiva e adequada ao fluxo.', 'essencial': True, 'momento_de_verdade': 'Área de Lavagem'}` |
| `bTXsC` | 38 | `38_` | 42 | True | `{'mv': 'MV 31', 'id0': 'CH38', 'area': 'PV', 'peso': 1, 'trilha': 4, 'pergunta': 'Realizou corretamente e no prazo as Garantias?', 'descricao': 'Realize corretamente e no prazo as Garantias.', 'essencial': False, 'momento_de_verdade': 'Gestão de Garantia'}` |
| `bTXsD` | 39 | `39_` | 43 | True | `{'mv': 'MV 32', 'id0': 'CH39', 'area': 'V', 'peso': 6, 'trilha': 5, 'pergunta': 'Teve um Preparador de Entrega que acompanhou todas as etapas e um Programador de Entrega que realizou o agendamento apenas quando o veículo estava pronto?', 'descricao': 'Tenha um Preparador de Entrega que acompanhe todas as etapas e um Programador de Entrega que realize o agendamento apenas quando o veículo está pronto.', 'essencial': True, 'momento_de_verdade': 'Programação de Entrega'}` |
| `bTXsH` | 40 | `40_` | 44 | True | `{'mv': 'MV 33', 'id0': 'CH40', 'area': 'V', 'peso': 3, 'trilha': 5, 'pergunta': 'Realizou a inspeção final de entrega em até 2 horas antes do horário agendado e garantiu que estivesse em perfeitas condições?', 'descricao': 'Realize a inspeção final de entrega em até 2 horas antes do horário agendado e garanta que esteja em perfeitas condições.', 'essencial': False, 'momento_de_verdade': 'Inspeção Final de Vendas'}` |
| `bTXsI` | 41 | `41_` | 45 | True | `{'mv': 'MV 34', 'id0': 'CH41', 'area': 'V', 'peso': 9, 'trilha': 5, 'pergunta': 'Criou uma experiência personalizada para o Cliente durante a Entrega do veículo (Check-out)?', 'descricao': 'Crie uma experiência personalizada para o Cliente durante a Entrega do veículo (Check-out).', 'essencial': True, 'momento_de_verdade': 'Entrega do Veículo Novo (Check-out)'}` |
| `bTXsJ` | 42 | `42_` | 46 | True | `{'mv': 'MV 34', 'id0': 'CH42', 'area': 'V', 'peso': 1, 'trilha': 5, 'pergunta': 'Realizou a Entrega do veículo novo dentro do prazo acordado com o Cliente, e cadastrou no GNB em até 24 horas?', 'descricao': 'Realize a Entrega do veículo novo dentro do prazo acordado com o Cliente, e cadastre no GNB em até 24 horas.', 'essencial': False, 'momento_de_verdade': 'Entrega do Veículo Novo (Check-out)'}` |
| `bTXsN` | 43 | `43_` | 47 | True | `{'mv': 'MV 35', 'id0': 'CH43', 'area': 'PV', 'peso': 3, 'trilha': 5, 'pergunta': 'Realizou a Inspeção final de serviços para garantir que o veículo fosse entregue em perfeitas condições?', 'descricao': 'Realize a Inspeção final de serviços para garantir que o veículo seja entregue em perfeitas condições.', 'essencial': False, 'momento_de_verdade': 'Inspeção Final de Serviços'}` |
| `bTXsO` | 44 | `44_` | 48 | True | `{'mv': 'MV 36', 'id0': 'CH44', 'area': 'PV', 'peso': 6, 'trilha': 5, 'pergunta': 'Recebeu e direcionou o Cliente ao veículo utilizando o ND+ (Tablet de Serviços) e demonstrou visualmente os serviços executados e as peças substituídas?', 'descricao': 'Receba e direcione o Cliente ao veículo utilizando o ND+ (Tablet de Serviços) e demonstre visualmente os serviços executados e as peças substituídas.', 'essencial': True, 'momento_de_verdade': 'Início do Check-out de Serviços'}` |
| `bTXsP` | 45 | `45_` | 49 | True | `{'mv': 'MV 36', 'id0': 'CH45', 'area': 'PV', 'peso': 1, 'trilha': 5, 'pergunta': 'Garantiu o prazo de Check-out combinado com o Cliente e realizou o Teste de Rodagem Final (quando necessário)?', 'descricao': 'Garanta o prazo de Check-out combinado com o Cliente e realize o Teste de Rodagem Final (quando necessário).', 'essencial': False, 'momento_de_verdade': 'Início do Check-out de Serviços'}` |
| `bTXsT` | 46 | `46_` | 50 | True | `{'mv': 'MV 37', 'id0': 'CH46', 'area': 'PV', 'peso': 9, 'trilha': 5, 'pergunta': 'Explicou os serviços realizados, valores cobrados e obteve a assinatura do Cliente no Check-out no ND+ (Tablet de Serviços)?', 'descricao': 'Explique os serviços realizados, valores cobrados e obtenha a assinatura do Cliente no Check-out no ND+ (Tablet de Serviços).', 'essencial': True, 'momento_de_verdade': 'Explicação da OS, valores e Check-out'}` |
| `bTXsU` | 47 | `47_` | 51 | True | `{'mv': 'MV 38', 'id0': 'CH47', 'area': 'I', 'peso': 3, 'trilha': 6, 'pergunta': 'Garantiu a satisfação do Cliente ainda na Concessionária e informou sobre a Pesquisa Nissan?', 'descricao': 'Garanta a satisfação do Cliente ainda na Concessionária e informe sobre a Pesquisa Nissan.', 'essencial': False, 'momento_de_verdade': 'Início do acompanhamento da Satisfação (Check-out)'}` |
| `bTXsV` | 48 | `48_` | 52 | True | `{'mv': 'MV 39', 'id0': 'CH48', 'area': 'I', 'peso': 6, 'trilha': 6, 'pergunta': 'Acompanhou o VOC diariamente, garantiu as tratativas, compartilhando resultados e melhorias?', 'descricao': 'Acompanhe o VOC diariamente, garanta as tratativas, compartilhando resultados e melhorias.', 'essencial': True, 'momento_de_verdade': 'Acompanhamento VOC'}` |
| `bTXsZ` | 49 | `49_` | 53 | True | `{'mv': 'MV 40', 'id0': 'CH49', 'area': 'I', 'peso': 1, 'trilha': 6, 'pergunta': 'Realizou APE/APS e monitorou o Portal VOC, garantindo o Encantamento do Cliente?', 'descricao': 'Realize APE/APS e monitore o Portal VOC, garantindo o Encantamento do Cliente.', 'essencial': False, 'momento_de_verdade': 'Contato de acompanhamento (APE/APS)'}` |
| `bTXsa` | 50 | `50_` | 54 | True | `{'mv': 'MV 41', 'id0': 'CH50', 'area': 'I', 'peso': 3, 'trilha': 6, 'pergunta': 'Realizou o PRC (Processo de recuperação de Clientes) dentro de 24 horas em todos os canais?', 'descricao': 'Realize o PRC (Processo de recuperação de Clientes) dentro de 24 horas em todos os canais.', 'essencial': False, 'momento_de_verdade': 'Processo de Recuperação de Cliente (PRC)'}` |

## `competencia_para_que` — Competencia Para Que

> Option set marcado como deletado no Bubble. Manter apenas para compatibilidade histórica.

| Key | Display | db_value | Sort | Deleted | Extras |
|---|---|---|---:|---|---|
| `bTXDz` | Ser responsável pela gestão do fluxo de loja da concessionária e excelência na recepção dos Clientes. Realizar o primeiro atendimento na área de vendas, registrando os dados dos clientes e direcionando-os aos Consultores de Vendas, Entregadores e outros setores. | `ser_respons_vel_pela_gest_o_do_fluxo_de_loja_da_concession_ria_e_excel_ncia_na_recep__o_dos_clientes__realizar_o_primeiro_atendimento_na__rea_de_vendas__registrando_os_dados_dos_clientes_e_direcionando_os_aos_consultores_de_vendas__entregadores_e_outros_setores_` | 1 | True | `{}` |
| `bTXEA` | Responsável por dar suporte à liderança e aos Consultores de Vendas. | `respons_vel_por_dar_suporte___lideran_a_e_aos_consultores_de_vendas_` | 2 | True | `{}` |
| `bTXEB` | Organizar e acompanhar os processos da área, sendo o ponto focal de comunicação com o Cliente para o faturamento dos pedidos. | `organizar_e_acompanhar_os_processos_da__rea__sendo_o_ponto_focal_de_comunica__o_com_o_cliente_para_o_faturamento_dos_pedidos_` | 3 | True | `{}` |
| `bTXEF` | Responsável por dar suporte à equipe de Vendas Diretas, auxiliar na organização e andamento dos processos da área, acompanhamento dos pedidos de veículos junto a montadora e documentação necessária (cartas de isenção / prazos de validade) para faturamento. | `respons_vel_por_dar_suporte___equipe_de_vendas_diretas__auxiliar_na_organiza__o_e_andamento_dos_processos_da__rea__acompanhamento_dos_pedidos_de_ve_culos_junto_a_montadora_e_documenta__o_necess_ria__cartas_de_isen__o___prazos_de_validade__para_faturamento_` | 4 | True | `{}` |
| `bTXEG` | Avaliar os veículos usados oferecidos em troca por veículos novos ou usados da concessionária. | `avaliar_os_ve_culos_usados_oferecidos_em_troca_por_ve_culos_novos_ou_usados_da_concession_ria_` | 5 | True | `{}` |
| `bTXEH` | Ser o responsável pelo recebimento do veículo seminovo avaliado no momento da entrega do veículo adquirido pelo cliente. | `ser_o_respons_vel_pelo_recebimento_do_ve_culo_seminovo_avaliado_no_momento_da_entrega_do_ve_culo_adquirido_pelo_cliente_` | 6 | True | `{}` |
| `bTXEL` | Atender aos objetivos de vendas de veículos, realizando o atendimento, acompanhamento e conversão de Clientes Digitais (leads), garantindo 100% deles respondidos com foco na experiência do Cliente e qualificados com agilidade e clareza, contribuindo para a lucratividade, satisfação e recomendações. | `atender_aos_objetivos_de_vendas_de_ve_culos__realizando_o_atendimento__acompanhamento_e_convers_o_de_clientes_digitais__leads___garantindo_100__deles_respondidos_com_foco_na_experi_ncia_do_cliente_e_qualificados_com_agilidade_e_clareza__contribuindo_para_a_lucratividade__satisfa__o_e_recomenda__es_` | 7 | True | `{}` |
| `bTXEM` | Conhecer e utilizar técnicas de marketing digital, rede sociais e e-commerce. Acompanhar e analisar os resultados dessas ações através das métricas, visando refinar e ajustar as ações de forma ágil. | `conhecer_e_utilizar_t_cnicas_de_marketing_digital__rede_sociais_e_e_commerce__acompanhar_e_analisar_os_resultados_dessas_a__es_atrav_s_das_m_tricas__visando_refinar_e_ajustar_as_a__es_de_forma__gil_` | 8 | True | `{}` |
| `bTXEN` | Oferecer a melhor solução financeira e produtos adicionais aos clientes, contribuindo para a lucratividade e efetivação dos negócios. | `oferecer_a_melhor_solu__o_financeira_e_produtos_adicionais_aos_clientes__contribuindo_para_a_lucratividade_e_efetiva__o_dos_neg_cios_` | 9 | True | `{}` |
| `bTXER` | Atender aos objetivos de vendas de veículos seminovos, dos produtos e agregados (acessórios, financiamento, seguro e documentação), contribuindo para a lucratividade e garantindo a satisfação total do Cliente. | `atender_aos_objetivos_de_vendas_de_ve_culos_seminovos__dos_produtos_e_agregados__acess_rios__financiamento__seguro_e_documenta__o___contribuindo_para_a_lucratividade_e_garantindo_a_satisfa__o_total_do_cliente_` | 10 | True | `{}` |
| `bTXES` | Contribuir com os objetivos do Nissan Move e para a lucratividade da operação. | `contribuir_com_os_objetivos_do_nissan_move_e_para_a_lucratividade_da_opera__o_` | 11 | True | `{}` |
| `bTXET` | Realizar atendimentos no showroom, visitas externas e ações de prospecção para captação de novas oportunidades. | `realizar_atendimentos_no_showroom__visitas_externas_e_a__es_de_prospec__o_para_capta__o_de_novas_oportunidades_` | 12 | True | `{}` |
| `bTXEX` | Dominar todos os processos específicos de atendimento e negociação do Nissan Move. | `dominar_todos_os_processos_espec_ficos_de_atendimento_e_negocia__o_do_nissan_move_` | 13 | True | `{}` |
| `bTXEY` | Proporcionar excelente experiência no acompanhamento de todas as etapas, principalmente a Entrega (Check-out), garantindo a total satisfação dos Clientes. | `proporcionar_excelente_experi_ncia_no_acompanhamento_de_todas_as_etapas__principalmente_a_entrega__check_out___garantindo_a_total_satisfa__o_dos_clientes_` | 14 | True | `{}` |
| `bTXEZ` | Atender aos objetivos de vendas de veículos e agregados (acessórios originais, financiamentos, seguros e consórcio), contribuindo para a lucratividade e garantindo a satisfação total dos Clientes. Dominar todos os processos de atendimento (fluxo de loja, telefone e leads), negociação e processo de entrega dos veículos. | `atender_aos_objetivos_de_vendas_de_ve_culos_e_agregados__acess_rios_originais__financiamentos__seguros_e_cons_rcio___contribuindo_para_a_lucratividade_e_garantindo_a_satisfa__o_total_dos_clientes__dominar_todos_os_processos_de_atendimento__fluxo_de_loja__telefone_e_leads___negocia__o_e_processo_de_entrega_dos_ve_culos_` | 15 | True | `{}` |
| `bTXEd` | Atender aos objetivos de Vendas PCD e agregados e satisfação do Cliente, contribuindo para o aumento do retorno, indicação e lucratividade. Conhecimento sobre a legislação pertinente, adaptações de veículos, Entrega e Venda Direta. Realizar visitas externas para captação de novas oportunidades. | `atender_aos_objetivos_de_vendas_pcd_e_agregados_e_satisfa__o_do_cliente__contribuindo_para_o_aumento_do_retorno__indica__o_e_lucratividade__conhecimento_sobre_a_legisla__o_pertinente__adapta__es_de_ve_culos__entrega_e_venda_direta__realizar_visitas_externas_para_capta__o_de_novas_oportunidades_` | 16 | True | `{}` |
| `bTXEe` | Atender aos objetivos de Vendas Direta, agregados, contribuindo para a lucratividade e garantindo a satisfação total dos Clientes. | `atender_aos_objetivos_de_vendas_direta__agregados__contribuindo_para_a_lucratividade_e_garantindo_a_satisfa__o_total_dos_clientes_` | 17 | True | `{}` |
| `bTXEf` | Realizar visitas externas para captação de novas oportunidades e dominar todos os processos específicos de atendimento para Venda Direta (Licitações, Frotas, Locadoras, Táxis, PCD e Produtor Rural), negociação e entrega dos veículos. | `realizar_visitas_externas_para_capta__o_de_novas_oportunidades_e_dominar_todos_os_processos_espec_ficos_de_atendimento_para_venda_direta__licita__es__frotas__locadoras__t_xis__pcd_e_produtor_rural___negocia__o_e_entrega_dos_ve_culos_` | 18 | True | `{}` |
| `bTXEj` | Atender aos objetivos de vendas de acessórios originais nas áreas de vendas de novos, usados e assistência técnica. Contribuindo para a lucratividade, garantindo a satisfação total dos Clientes e acompanhando a disponibilidade e instalação dos produtos. | `atender_aos_objetivos_de_vendas_de_acess_rios_originais_nas__reas_de_vendas_de_novos__usados_e_assist_ncia_t_cnica__contribuindo_para_a_lucratividade__garantindo_a_satisfa__o_total_dos_clientes_e_acompanhando_a_disponibilidade_e_instala__o_dos_produtos_` | 19 | True | `{}` |
| `bTXEk` | Realizar a entrega Técnica dos veículos, garantido que os clientes recebam todas as explicações relacionadas ao Veículo, acessórios instalados, Manual de Garantia e documentos. | `realizar_a_entrega_t_cnica_dos_ve_culos__garantido_que_os_clientes_recebam_todas_as_explica__es_relacionadas_ao_ve_culo__acess_rios_instalados__manual_de_garantia_e_documentos_` | 20 | True | `{}` |
| `bTXEl` | Garantir os objetivos de venda de veículos seminovos e usados, com rentabilidade e venda de agregados (acessórios, financiamento, seguro e documentação), garantindo a qualidade do atendimento, a satisfação e a fidelização dos Clientes, suportando e facilitando à venda dos veículos novos. | `garantir_os_objetivos_de_venda_de_ve_culos_seminovos_e_usados__com_rentabilidade_e_venda_de_agregados__acess_rios__financiamento__seguro_e_documenta__o___garantindo_a_qualidade_do_atendimento__a_satisfa__o_e_a_fideliza__o_dos_clientes__suportando_e_facilitando___venda_dos_ve_culos_novos_` | 21 | True | `{}` |
| `bTXEp` | Promover a gestão da equipe de Vendas garantindo os objetivos de venda de veículos novos, seminovos e usados em relação ao volume, rentabilidade, e venda de agregados (acessórios, financiamento, seguro e emplacamento), garantindo a qualidade do atendimento, a satisfação e a fidelização dos Clientes. | `promover_a_gest_o_da_equipe_de_vendas_garantindo_os_objetivos_de_venda_de_ve_culos_novos__seminovos_e_usados_em_rela__o_ao_volume__rentabilidade__e_venda_de_agregados__acess_rios__financiamento__seguro_e_emplacamento___garantindo_a_qualidade_do_atendimento__a_satisfa__o_e_a_fideliza__o_dos_clientes_` | 22 | True | `{}` |
| `bTXEq` | Promover a gestão da equipe de Vendas Diretas buscando atingir os objetivos de volume da área, venda de agregados (acessórios, financiamento, seguro e emplacamento) e rentabilidade,  garantindo a qualidade do atendimento, a satisfação e a fidelização dos Clientes de Vendas Diretas. | `promover_a_gest_o_da_equipe_de_vendas_diretas_buscando_atingir_os_objetivos_de_volume_da__rea__venda_de_agregados__acess_rios__financiamento__seguro_e_emplacamento__e_rentabilidade___garantindo_a_qualidade_do_atendimento__a_satisfa__o_e_a_fideliza__o_dos_clientes_de_vendas_diretas_` | 23 | True | `{}` |
| `bTXEr` | Acompanhar todo processo de recebimento, tratamento e conversão de Clientes Digitais (leads), garantindo que 100% deles sejam avaliados e devidamente distribuídos à força de vendas. | `acompanhar_todo_processo_de_recebimento__tratamento_e_convers_o_de_clientes_digitais__leads___garantindo_que_100__deles_sejam_avaliados_e_devidamente_distribu_dos___for_a_de_vendas_` | 24 | True | `{}` |
| `bTXEv` | Realizar, checar e acompanhar todo o processo de recebimento, preparação e deslocamento dos veículos até o momento da entrega, garantindo com que estejam em perfeitas condições. | `realizar__checar_e_acompanhar_todo_o_processo_de_recebimento__prepara__o_e_deslocamento_dos_ve_culos_at__o_momento_da_entrega__garantindo_com_que_estejam_em_perfeitas_condi__es_` | 25 | True | `{}` |
| `bTXEw` | Coordenar a agenda de entregas e acompanhar a preparação dos veículos de acordo com a data acordada com o cliente. | `coordenar_a_agenda_de_entregas_e_acompanhar_a_prepara__o_dos_ve_culos_de_acordo_com_a_data_acordada_com_o_cliente_` | 26 | True | `{}` |
| `bTXEx` | Suportar a gestão da equipe de Vendas garantindo os objetivos de venda de veículos novos, seminovos e usados em relação ao volume, rentabilidade, e venda de agregados (acessórios, financiamento, seguro e emplacamento), garantindo a qualidade do atendimento, a satisfação e a fidelização dos Clientes. | `suportar_a_gest_o_da_equipe_de_vendas_garantindo_os_objetivos_de_venda_de_ve_culos_novos__seminovos_e_usados_em_rela__o_ao_volume__rentabilidade__e_venda_de_agregados__acess_rios__financiamento__seguro_e_emplacamento___garantindo_a_qualidade_do_atendimento__a_satisfa__o_e_a_fideliza__o_dos_clientes_` | 27 | True | `{}` |
| `bTXFB` | Realizar o recebimento de veículos 0Km, armazenamento e a organização do Pátio, garantido os procedimentos conforme recomendações da Nissan. | `realizar_o_recebimento_de_ve_culos_0km__armazenamento_e_a_organiza__o_do_p_tio__garantido_os_procedimentos_conforme_recomenda__es_da_nissan_` | 28 | True | `{}` |
| `bTXFC` | Atender 100% das chamadas recebidas com excelência (rapidez e qualidade),  direcionando para as áreas e/ou pessoas solicitadas, organizando e controlando o fluxo de ligações. | `atender_100__das_chamadas_recebidas_com_excel_ncia__rapidez_e_qualidade____direcionando_para_as__reas_e_ou_pessoas_solicitadas__organizando_e_controlando_o_fluxo_de_liga__es_` | 29 | True | `{}` |
| `bTXIa` | Atender as solicitações de peças realizadas pela oficina e balcão público além de contribuir com formação dos pedidos junto à montadora. | `atender_as_solicita__es_de_pe_as_realizadas_pela_oficina_e_balc_o_p_blico_al_m_de_contribuir_com_forma__o_dos_pedidos_junto___montadora_` | 30 | True | `{}` |
| `bTXIb` | Receber, armazenar e disponibilizar as peças com agilidade. Manter o estoque organizado e sistema atualizado com a quantidade correta de itens físicos. | `receber__armazenar_e_disponibilizar_as_pe_as_com_agilidade__manter_o_estoque_organizado_e_sistema_atualizado_com_a_quantidade_correta_de_itens_f_sicos_` | 31 | True | `{}` |

## `competencia_habilidade` — Competencia Habilidade

Atributos extras: `ID`:`text`

| Key | Display | db_value | Sort | Deleted | Extras |
|---|---|---|---:|---|---|
| `bTXHR` | Excelência no Atendimento ao Cliente | `excel_ncia_no_atendimento_ao_cliente` | 1 | False | `{'id0': 'CH1'}` |
| `bTXHS` | Gestão de Conflitos | `gest_o_de_conflitos` | 2 | False | `{}` |
| `bTXHT` | Construção de relatórios gerenciais | `constru__o_de_relat_rios_gerenciais` | 3 | False | `{}` |
| `bTXHX` | Gestão de Processos | `gest_o_de_processos` | 4 | False | `{}` |
| `bTXHY` | Gestão do Tempo | `gest_o_do_tempo` | 5 | False | `{}` |
| `bTXHZ` | Saber dirigir (possuir CNH válida) | `saber_dirigir__possuir_cnh_v_lida_` | 6 | False | `{}` |
| `bTXHd` | Executar com velocidade e qualidade | `executar_com_velocidade_e_qualidade` | 7 | False | `{}` |
| `bTXHe` | Vendas | `vendas` | 8 | False | `{}` |
| `bTXHf` | Excelência no Atendimento ao Cliente | `excel_ncia_no_atendimento_ao_cliente0` | 9 | True | `{}` |
| `bTXHj` | Persuasão | `persuas_o` | 10 | False | `{}` |
| `bTXHk` | Gestão Financeira e de Indicadores | `gest_o_financeira_e_de_indicadores` | 11 | False | `{}` |
| `bTXHl` | Vendas para Clientes PCD | `vendas_para_clientes_pcd` | 12 | False | `{}` |
| `bTXHp` | Análise de Cenários | `an_lise_de_cen_rios` | 13 | False | `{}` |
| `bTXHq` | Delegar | `delegar` | 14 | False | `{}` |
| `bTXHr` | Gestão de Recursos | `gest_o_de_recursos` | 15 | False | `{}` |
| `bTXIh` | Construção de Campanhas | `constru__o_de_campanhas` | 16 | False | `{}` |
| `bTXJi` | Gestão de Pessoas | `gest_o_de_pessoas` | 17 | False | `{}` |
| `bTXJj` | Negociação | `negocia__o` | 18 | False | `{}` |
| `bTXMK` | Criar e Inovar | `criar_e_inovar` | 19 | False | `{}` |
| `bTXML` | Implantação e manutenção de Redes de computadores | `implanta__o_e_manuten__o_de_redes_de_computadores` | 20 | False | `{}` |
| `bTXMP` | Implantação e manutenção de infraestrutura de TI | `implanta__o_e_manuten__o_de_infraestrutura_de_ti` | 21 | False | `{}` |
| `bTXMQ` | Implantação de Sistemas | `implanta__o_de_sistemas` | 22 | False | `{}` |
| `bTXMR` | Integração de Sistemas | `integra__o_de_sistemas` | 23 | False | `{}` |

## `competencia_treinamento` — Competencia Treinamento

Atributos extras: `ID - deleted`:`text`, `tipo`:`option.competencia_treinamento_tipo`

| Key | Display | db_value | Sort | Deleted | Extras |
|---|---|---|---:|---|---|
| `bTXCx` | Consultar trilha de desenvolvimento no portal da Academia SERNISSAN. | `consultar_trilha_de_desenvolvimento_no_portal_da_academia_sernissan_` | 1 | False | `{'id0': 'CT1', 'tipo': 'e_learning'}` |
| `bTXCy` | Consultar trilha de desenvolvimento no portal da Academia SERNISSAN. | `consultar_trilha_de_desenvolvimento_no_portal_da_academia_sernissan_0` | 2 | True | `{'tipo': 'presencial'}` |
| `bTXHv` | Consultar trilha de desenvolvimento no portal da Academia SERNISSAN. | `consultar_trilha_de_desenvolvimento_no_portal_da_academia_sernissan_1` | 3 | False | `{'tipo': 'presencial'}` |

## `competencia_treinamento_tipo` — Competencia Treinamento Tipo

| Key | Display | db_value | Sort | Deleted | Extras |
|---|---|---|---:|---|---|
| `bTWoc` | E-Learning | `e_learning` | 1 | False | `{}` |
| `bTWod` | Presencial | `presencial` | 2 | False | `{}` |

## `icones` — icones

Atributos extras: `svg`:`image`

| Key | Display | db_value | Sort | Deleted | Extras |
|---|---|---|---:|---|---|
| `bTHAD` | dados | `dados` | 1 | False | `{'svg': '//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719346961257x581158097397277400/Dados.svg'}` |
| `bTHAH` | troféu | `trof_u` | 2 | False | `{'svg': '//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719346988675x747924339874472300/Placar.svg'}` |
| `bTHAI` | comentário | `coment_rio` | 3 | False | `{'svg': '//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719347027164x177137820345139500/Comment.svg'}` |
| `bTHAJ` | olho fechado | `olho_fechado` | 4 | False | `{'svg': '//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719347071052x376350558859630500/View%20Not.svg'}` |
| `bTHAN` | olho aberto | `olho_aberto` | 5 | False | `{'svg': '//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719347091056x875260540102825700/View.svg'}` |
| `bTHAO` | grupo | `grupo` | 6 | False | `{'svg': '//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719347117353x508627711273238900/Group.svg'}` |
| `bTHAP` | calendário | `calend_rio` | 7 | False | `{'svg': '//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719347143994x569714672135760640/Captions.svg'}` |
| `bTHAT` | editar | `editar` | 8 | False | `{'svg': '//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719347174036x719188520815560000/edit.svg'}` |
| `bTHAU` | lixeira | `lixeira` | 9 | False | `{'svg': '//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719347196821x820576195182167900/trash.svg'}` |
| `bTHAV` | camera | `camera` | 10 | False | `{'svg': '//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719347260061x948785346433962400/camera.svg'}` |
| `bTHAZ` | seta esq | `_` | 12 | False | `{'svg': '//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719347293930x619340360814001500/Seta%20Esq.svg'}` |
| `bTHAa` | seta dir | `seta_dir` | 13 | False | `{'svg': '//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719347329481x249639812086393180/Seta%20Dir.svg'}` |
| `bTHAb` | mais | `mais` | 15 | False | `{'svg': '//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719347373313x911151682870333400/Plus.svg'}` |
| `bTHAf` | x | `x` | 16 | False | `{'svg': '//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719347414044x931446785328205200/X.svg'}` |
| `bTHAg` | admin | `admin` | 17 | False | `{'svg': '//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719347436788x533908429438484800/admin.svg'}` |
| `bTHAh` | usuário | `usu_rio` | 18 | False | `{'svg': '//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719347466002x336525260699362940/user.svg'}` |
| `bTHAl` | envelope | `envelope` | 19 | False | `{'svg': '//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719347485242x696393676734479900/envelope%201.svg'}` |
| `bTHAm` | lupa | `lupa` | 20 | False | `{'svg': '//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719347502949x405919008430887700/search.svg'}` |
| `bTHAn` | resultado | `resultado` | 21 | False | `{'svg': '//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719347533807x729355414654817400/results.svg'}` |
| `bTHIf` | seta baixo | `seta_baixo` | 14 | False | `{'svg': '//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719543444511x432359007789133700/Vector%201.svg'}` |
| `bTHYT` | seta cima | `seta_cima` | 11 | False | `{'svg': '//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719506625778x459315814469473540/Vector%201.svg'}` |
| `bTJRj` | fechar | `fechar` | 22 | False | `{'svg': '//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719886681300x791419301644328700/Frame.svg'}` |
| `bTJcz` | check | `check` | 23 | False | `{'svg': '//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719896925943x808916248639669900/Frame.svg'}` |
| `bTJoP` | drop seta baixo | `drop_seta_baixo` | 24 | False | `{'svg': '//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1720645130016x571445749791472600/chevron-down-svgrepo-com%20%281%29.svg'}` |
| `bTJoT` | drop seta up | `drop_seta_up` | 25 | False | `{'svg': '//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1720645166678x251306770362024640/chevron-up-svgrepo-com%20%281%29.svg'}` |
| `bTUkp` | livro | `livro` | 26 | False | `{'svg': '//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1746402416305x585602722730239100/book-open-svgrepo-com%20%282%29.svg'}` |
| `bTXpz` | relatorios | `relatorios` | 27 | False | `{'svg': '//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1762288488593x767029633601585800/bar-chart%20%281%29%20%281%29-converted.svg'}` |
| `bTXqD` | competencias | `competencias` | 28 | False | `{'svg': '//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1762288495460x824831203798772600/profile%20%282%29%20%281%29-converted.svg'}` |

## `foooter_menu` — Foooter Menu

Atributos extras: `link`:`text`

| Key | Display | db_value | Sort | Deleted | Extras |
|---|---|---|---:|---|---|
| `bTVTb` | Política de Privacidade | `pol_tica_de_privacidade` | 1 | False | `{}` |

## `faq_categorias` — FAQ Categorias

| Key | Display | db_value | Sort | Deleted | Extras |
|---|---|---|---:|---|---|
| `bTTAU` | Acesso | `acesso` | 1 | False | `{}` |
| `bTTAV` | Ajuda (Suporte) | `ajuda__suporte_` | 2 | False | `{}` |
| `bTTAZ` | Equipe | `equipe` | 3 | False | `{}` |
| `bTTAa` | Placar de Performance | `placar_de_performance` | 4 | False | `{}` |

## `destacar_opcoes` — Destacar opcoes

| Key | Display | db_value | Sort | Deleted | Extras |
|---|---|---|---:|---|---|
| `bTQdZ` | Zerou | `zerou` | 1 | False | `{}` |
| `bTQdd` | Não atingiu | `n_o_atingiu` | 2 | False | `{}` |
| `bTQde` | Atingiu | `atingiu` | 3 | False | `{}` |

## `estrutura_concessionaria` — Estrutura Concessionaria

| Key | Display | db_value | Sort | Deleted | Extras |
|---|---|---|---:|---|---|
| `bTOij` | 1S | `1s` | 1 | False | `{}` |
| `bTOik` | 2S | `2s` | 2 | False | `{}` |
| `bTOil` | 3S | `3s` | 3 | False | `{}` |

## `meses` — Calendario (Meses)

| Key | Display | db_value | Sort | Deleted | Extras |
|---|---|---|---:|---|---|
| `bTMUK` | Janeiro | `janeiro` | 1 | False | `{}` |
| `bTMUL` | Fevereiro | `fevereiro` | 2 | False | `{}` |
| `bTMUP` | Março | `mar_o` | 3 | False | `{}` |
| `bTMUQ` | Abril | `abril` | 4 | False | `{}` |
| `bTMUR` | Maio | `maio` | 5 | False | `{}` |
| `bTMUV` | Junho | `junho` | 6 | False | `{}` |
| `bTMUW` | Julho | `julho` | 7 | False | `{}` |
| `bTMUX` | Agosto | `agosto` | 8 | False | `{}` |
| `bTMUb` | Setembro | `setembro` | 9 | False | `{}` |
| `bTMUc` | Outubro | `outubro` | 10 | False | `{}` |
| `bTMUd` | Novembro | `novembro` | 11 | False | `{}` |
| `bTMUh` | Dezembro | `dezembro` | 12 | False | `{}` |

## `log_type` — Log Type

| Key | Display | db_value | Sort | Deleted | Extras |
|---|---|---|---:|---|---|
| `bTVpt` | Usuário | `user` | 1 | False | `{}` |
| `bTVpu` | Placar | `placar` | 2 | False | `{}` |
| `bTVqR` | Concessionária | `concession_ria` | 3 | False | `{}` |
| `bTVqS` | Divisão | `divis_o` | 4 | False | `{}` |
| `bTVqT` | País | `pa_s` | 5 | False | `{}` |
| `bTVqX` | Grupo | `grupo` | 6 | False | `{}` |
| `bTVqY` | Indicador | `indicador` | 7 | False | `{}` |
| `bTVqx` | Feedback | `feedback` | 8 | False | `{}` |
| `bTVrD` | Solicitação | `solicita__o` | 9 | False | `{}` |

## `medalhas` — Medalhas

Atributos extras: `image`:`image`

| Key | Display | db_value | Sort | Deleted | Extras |
|---|---|---|---:|---|---|
| `bTRJE` | Sem Classificacao | `sem_classificacao` | 1 | False | `{'image': '//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1736856978220x970370333508810800/imagem%20%281%29.png'}` |
| `bTRJF` | Bronze | `bronze` | 2 | False | `{'image': '//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1736856982995x661822829249319800/imagem%20%281%29.jpeg'}` |
| `bTRJJ` | Prata | `prata` | 3 | False | `{'image': '//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1736856990318x447531328461124200/imagem.jpeg'}` |
| `bTRJK` | Ouro | `ouro` | 4 | False | `{'image': '//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1736856995048x741650248734915100/imagem.png'}` |
| `bTRJL` | Novo | `novo` | 5 | False | `{'image': '//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1736857000032x495143330536301600/imagem%20%282%29.jpeg'}` |

## `log_action` — Log Action

| Key | Display | db_value | Sort | Deleted | Extras |
|---|---|---|---:|---|---|
| `bTVqZ` | Deletou | `delete` | 1 | False | `{}` |
| `bTVqd` | Criou | `create` | 2 | False | `{}` |
| `bTVqe` | Aceitou | `aceitou` | 3 | False | `{}` |
| `bTVqf` | Rejeitou | `rejeitou` | 4 | False | `{}` |
| `bTVtd` | Alterou | `alterou` | 5 | False | `{}` |
| `bTVtj` | Adicionou | `adicionou` | 6 | False | `{}` |
| `bTVtk` | Removeu | `removeu` | 7 | False | `{}` |
| `bTWGf` | Erro | `erro` | 8 | False | `{}` |

## `importancias` — Indicador Importancia 

Atributos extras: `peso`:`number`

| Key | Display | db_value | Sort | Deleted | Extras |
|---|---|---|---:|---|---|
| `bTLth` | Baixo | `baixa` | 3 | False | `{'pontos': 10}` |
| `bTLti` | Médio | `media` | 2 | False | `{'pontos': 20}` |
| `bTLtj` | Alto | `alta` | 1 | False | `{'pontos': 30}` |

## `perfil` — Niveis de Perfil

Atributos extras: `nivel`:`number`

| Key | Display | db_value | Sort | Deleted | Extras |
|---|---|---|---:|---|---|
| `bTOiS` | 07 - Colaborador | `usu_rio` | 9 | False | `{'nivel': 7}` |
| `bTOiT` | 05 - Dealer Adm | `marketing_admin` | 7 | False | `{'nivel': 5}` |
| `bTOiX` | 04 - Grupo Adm | `administrador_de_dom_nio` | 6 | False | `{'nivel': 4}` |
| `bTOiZ` | 02 - Nissan | `gerente_regional` | 4 | False | `{'nivel': 2}` |
| `bTOid` | 01 - Individuando | `gerente_do_dom_nio` | 3 | False | `{'nivel': 1}` |
| `bTPRt` | 03 - Nissan Setor | `setor_adm` | 5 | False | `{'nivel': 3}` |
| `bTPpu` | 06 - Area Adm | `area_adm` | 8 | False | `{'nivel': 6}` |

## `ndp_data` — NDP Data

Atributos extras: `Mês`:`text`

| Key | Display | db_value | Sort | Deleted | Extras |
|---|---|---|---:|---|---|
| `1769436674308x836139676720640800` | 01 | `01_` | 1 | False | `{'m_s': 'Janeiro'}` |
| `1769436674924x758951685950750600` | 02 | `02_` | 2 | False | `{'m_s': 'Fevereiro'}` |
| `1769436676197x596566327589985500` | 03 | `03_` | 3 | False | `{'m_s': 'Março'}` |
| `1769436677237x584279117511126000` | 04 | `04_` | 4 | False | `{'m_s': 'Abril'}` |
| `1769436677671x924141793476140900` | 05 | `15_` | 5 | False | `{'m_s': 'Maio'}` |
| `1769436683833x563365462224866200` | 06 | `06_` | 6 | False | `{'m_s': 'Junho'}` |
| `1769436684725x139059328209793500` | 07 | `07_` | 7 | False | `{'m_s': 'Julho'}` |
| `1769436686328x904010541797519400` | 08 | `08_` | 8 | False | `{'m_s': 'Agosto'}` |
| `1769436687283x756670709889365200` | 09 | `09_` | 9 | False | `{'m_s': 'Setembro'}` |
| `1769436687997x604063988146092800` | 10 | `10_` | 10 | False | `{'m_s': 'Outubro'}` |
| `1769436688700x901578897447342300` | 11 | `11_` | 11 | False | `{'m_s': 'Novembro'}` |
| `1769436689448x772339489602258000` | 12 | `12_` | 12 | False | `{'m_s': 'Dezembro'}` |

## `ordena__o` — Ordenar Placar

Atributos extras: `campo`:`text`, `decrescente`:`boolean`

| Key | Display | db_value | Sort | Deleted | Extras |
|---|---|---|---:|---|---|
| `bTQaY` | Nome | `alfab_tica` | 1 | False | `{'campo': 'nome', 'crescente': False}` |
| `bTQad` | Pontos | `pontos` | 2 | False | `{'campo': 'pontos_ranking', 'crescente': True}` |

## `opcoes_api` — Opcao API

Atributos extras: `tipo`:`text`

| Key | Display | db_value | Sort | Deleted | Extras |
|---|---|---|---:|---|---|
| `1766989748309x148396749902407040` | 3M | `3m` | 1 | False | `{'tipo': 'acumulado'}` |
| `1766989749400x418199603421146200` | 1M | `1m` | 2 | False | `{'tipo': 'acumulado'}` |
| `1766989751508x929260175438108200` | Colaborador | `colaborador` | 3 | False | `{'tipo': 'origem'}` |
| `1766989756112x872928058316297500` | Concessionária | `bir` | 4 | False | `{'tipo': 'origem'}` |

## `ordenar_equipe` — Ordenar Equipe

Atributos extras: `campo`:`text`, `decrescente`:`boolean`

| Key | Display | db_value | Sort | Deleted | Extras |
|---|---|---|---:|---|---|
| `bTRHZ` | Nome | `nome` | 1 | False | `{'campo': 'nome', 'crescente': False}` |
| `bTRHd` | Área | `area` | 2 | False | `{'campo': 'area', 'crescente': False}` |
| `bTRHe` | Função | `fun__o` | 3 | False | `{'campo': 'funcao', 'crescente': False}` |

## `status` — Status

| Key | Display | db_value | Sort | Deleted | Extras |
|---|---|---|---:|---|---|
| `1762659082440x297677605605256800` | A fazer | `a_fazer` | 1 | False | `{}` |
| `1762659086972x385529209728181500` | Em andamento | `em_andamento` | 2 | False | `{}` |
| `1762659088253x548740363979742900` | Feito | `feito` | 3 | False | `{}` |

## `videos` — Videos

Atributos extras: `link`:`text`, `titulo - deleted`:`text`

| Key | Display | db_value | Sort | Deleted | Extras |
|---|---|---|---:|---|---|
| `1778096343952x295103212340576100` | Integrações VOC | `titulo` | 1 | False | `{'link': 'https://06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1778092553359x452338741727707840/Integra%C3%A7%C3%B5es_VOC.mp4?_gl=1*1lm1obu*_gcl_au*MjEwMDI0NzYxNS4xNzc1NjA5MTEx*_ga*NDE2MTA5MDYzLjE3NzUyNzI4MTU.*_ga_BFPVR2DEE2*czE3NzgwODk2ODckbzEwJGcxJHQxNzc4MDkyNTg5JGo2MCRsMCRoMA..'}` |
| `1778096347017x835959978701977600` | Integrações Dados de Vendas Nissan | `link` | 2 | False | `{'link': 'https://06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1778092569574x242797240994396380/Integra%C3%A7%C3%B5es%20Dados%20de%20Vendas%20Nissan.mp4?_gl=1*15q5kv5*_gcl_au*MjEwMDI0NzYxNS4xNzc1NjA5MTEx*_ga*NDE2MTA5MDYzLjE3NzUyNzI4MTU.*_ga_BFPVR2DEE2*czE3NzgwODk2ODckbzEwJGcxJHQxNzc4MDkyNjIzJGoyNiRsMCRoMA..'}` |

## `unidade` — Indicador Unidade

Atributos extras: `simbolo`:`text`

| Key | Display | db_value | Sort | Deleted | Extras |
|---|---|---|---:|---|---|
| `bTLwz` | Moeda | `dinheiro` | 1 | False | `{'simbolo': 'R$ '}` |
| `bTLxA` | Porcento | `porcentagem` | 2 | False | `{'simbolo': '%'}` |
| `bTLxF` | Número | `numero0` | 4 | False | `{'simbolo': '#'}` |
| `bTMiT` | S/N | `v_ou_f` | 5 | False | `{'simbolo': '✓'}` |

## `site_options` — site options

Atributos extras: `text`:`text`, `image`:`image`, `arquivo - deleted`:`file`

| Key | Display | db_value | Sort | Deleted | Extras |
|---|---|---|---:|---|---|
| `bTGyP` | nome | `nome` | 1 | False | `{'text': 'SERNISSAN'}` |
| `bTGyQ` | email | `email` | 2 | False | `{'text': 'placar.sernissan.dev@gmail.com'}` |
| `bTGyR` | logo fundo branco | `logo` | 3 | False | `{'text': 'iVBORw0KGgoAAAANSUhEUgAAAqUAAABwCAYAAAAntAmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAE7mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgOS4xLWMwMDIgNzkuYTZhNjM5NiwgMjAyNC8wMy8xMi0wNzo0ODoyMyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI1LjkgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyNC0wNi0xOVQyMjoyNzozMS0wMzowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjQtMDYtMTlUMjI6Mjk6MjItMDM6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjQtMDYtMTlUMjI6Mjk6MjItMDM6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmJhZjQzYjIyLTk4ODMtMWY0Ny1hZjkwLTc0NjkyNzNkNTUzYiIgeG1wTU06RG9jdW1lbnRJRD0i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', 'image': '//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1719345421514x986045590354050200/10e3c5c0b67dda6bac6606a9f281d1df.png'}` |
| `1777624956566x961950507366158200` | ilustração PDF | `ilustra__o_pdf` | 4 | False | `{'image': '//06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1777657499799x531644167384926600/pdf-ilustration.png'}` |
| `1778091213582x841785304842359000` | Video Integrações VOC | `video_integra__es_voc` | 5 | True | `{'text': 'https://06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1778092553359x452338741727707840/Integra%C3%A7%C3%B5es_VOC.mp4?_gl=1*1lm1obu*_gcl_au*MjEwMDI0NzYxNS4xNzc1NjA5MTEx*_ga*NDE2MTA5MDYzLjE3NzUyNzI4MTU.*_ga_BFPVR2DEE2*czE3NzgwODk2ODckbzEwJGcxJHQxNzc4MDkyNTg5JGo2MCRsMCRoMA..'}` |
| `1778091248023x383685634982068300` | Video Integrações Dados de vendas | `video_integra__es_dados_de_vendas` | 6 | True | `{'text': 'https://06fcf5899dd3f3daf85b97ec54edb9eb.cdn.bubble.io/f1778092569574x242797240994396380/Integra%C3%A7%C3%B5es%20Dados%20de%20Vendas%20Nissan.mp4?_gl=1*15q5kv5*_gcl_au*MjEwMDI0NzYxNS4xNzc1NjA5MTEx*_ga*NDE2MTA5MDYzLjE3NzUyNzI4MTU.*_ga_BFPVR2DEE2*czE3NzgwODk2ODckbzEwJGcxJHQxNzc4MDkyNjIzJGoyNiRsMCRoMA..'}` |

## `status_de_visita` — Status de visita

Atributos extras: `cor claro`:`text`, `cor escuro`:`text`

| Key | Display | db_value | Sort | Deleted | Extras |
|---|---|---|---:|---|---|
| `1777239309898x614321615391328900` | Rascunho | `rascunho` | 1 | False | `{'cor_claro': '#eeeeee', 'cor_escuro': '#616161'}` |
| `1777239318613x398954120019566400` | Enviado | `enviado` | 2 | False | `{'cor_claro': '#e3f2fd', 'cor_escuro': '#1976d2'}` |
| `1777239329015x426535725520629100` | Lembrete 1 | `lembrete_1` | 3 | False | `{'cor_claro': '#fff3e0', 'cor_escuro': '#f57c00'}` |
| `1777239339517x672131354498422800` | Lembrete 2 | `lembrete_2` | 4 | False | `{'cor_claro': '#fff3e0', 'cor_escuro': '#e65100'}` |
| `1777239349680x592379673579840300` | Assinado | `assinado` | 5 | False | `{'cor_claro': '#e8f5e9', 'cor_escuro': '#388e3c'}` |
| `1777239357329x426662735772113100` | Expirado | `expirado` | 6 | False | `{'cor_claro': '#ffebee', 'cor_escuro': '#d32f2f'}` |

## `tipo_de_instru__o` — Tipo de Instrução

| Key | Display | db_value | Sort | Deleted | Extras |
|---|---|---|---:|---|---|
| `1779741919378x518647753238956600` | Mapa de Competências | `mapa_de_compet_ncias` | 1 | False | `{}` |

## `solicitacoes_opcoes` — Tipo Solicitacao

| Key | Display | db_value | Sort | Deleted | Extras |
|---|---|---|---:|---|---|
| `bTPtp` | Indicador | `indicador` | 1 | False | `{}` |
| `bTPtq` | País | `pa_s` | 2 | False | `{}` |
| `bTPtr` | Setor | `setor` | 3 | False | `{}` |
| `bTPtv` | Divisão | `divis_o` | 4 | False | `{}` |
| `bTPtw` | Concessionária | `concession_ria` | 5 | False | `{}` |
| `bTPtx` | Grupo | `grupo` | 6 | False | `{}` |

## `toggle_ativo_inativo` — toggle ativo/inativo

| Key | Display | db_value | Sort | Deleted | Extras |
|---|---|---|---:|---|---|
| `bTLTF` | Ativo | `ativo` | 1 | False | `{}` |
| `bTLTG` | Inativo | `inativo` | 2 | False | `{}` |
