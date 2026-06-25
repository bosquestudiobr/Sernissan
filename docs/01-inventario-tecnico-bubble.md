# Inventário técnico do app Bubble atual

Fonte analisada: `sernissan-15044 (2).bubble`  
Data da documentação: 2026-06-25

## Números gerais extraídos

| Item | Quantidade |
|---|---:|
| Páginas Bubble | 10 |
| Reusable elements | 32 |
| Tipos de dados Bubble | 48 |
| Option sets | 46 |
| Backend/API workflows | 40 |
| Workflows de UI | 749 |
| Ações de UI | 1619 |
| Elementos `Search` em telas/reusables | 349 |
| Mensagens `filtered` encontradas | 243 |
| Advanced search constraints encontradas | 46 |
| `ChangeListOfThings` em UI | 65 |

## Componentes mais pesados por ações de workflow

| Tipo | Nome | Elementos | Workflows | Ações | Searches | filtered | Advanced filters | Change lists | Top ações |
|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| reusable | `placar` | 2147 | 102 | 269 | 39 | 74 | 2 | 0 | SetCustomState(54), ChangeThing(30), AnimateElement(27), 1515787032525x876315403042684900-ACb(25), HideElement(23), PauseWFClient(15) |
| reusable | `equipe` | 860 | 39 | 103 | 11 | 9 | 2 | 2 | HideElement(23), ShowElement(13), SetCustomState(11), ChangeThing(11), 1688932322326x593266464861716500-AAD(10), 1515787032525x876315403042684900-ACb(8) |
| reusable | `xr_reuniao_resultados` | 1181 | 36 | 87 | 10 | 21 | 1 | 0 | SetCustomState(22), HideElement(11), 1488796042609x768734193128308700-AAg(7), AnimateElement(7), ListShowNext(6), ListShowPrevious(6) |
| reusable | `competencias-calibracao` | 1313 | 40 | 85 | 8 | 84 | 3 | 2 | SetCustomState(22), HideElement(10), ResetGroup(8), DisplayGroupData(8), AnimateElement(6), ChangeThing(6) |
| reusable | `indicadores` | 658 | 40 | 82 | 26 | 10 | 0 | 4 | SetCustomState(17), ChangeThing(12), 1515787032525x876315403042684900-ACb(12), HideElement(11), NewThing(7), ResetGroup(5) |
| reusable | `grupos` | 464 | 33 | 77 | 11 | 0 | 0 | 2 | HideElement(14), ChangeThing(12), AnimateElement(10), 1515787032525x876315403042684900-ACb(9), ShowElement(7), SetCustomState(5) |
| reusable | `usuarios` | 714 | 35 | 70 | 40 | 4 | 2 | 2 | HideElement(19), SetCustomState(11), ShowElement(8), 1515787032525x876315403042684900-ACb(5), ChangeThing(5), ResetGroup(4) |
| page | `updates` | 243 | 27 | 64 | 98 | 3 | 1 | 45 | ChangeListOfThings(45), 1515787032525x876315403042684900-ACb(14), ChangePage(1), SetTemporaryPassword(1), ChangeThing(1), DeleteListOfThings(1) |
| reusable | `visitas` | 808 | 35 | 61 | 4 | 14 | 11 | 0 | DisplayListData(14), ToggleElement(10), DisplayGroupData(6), TerminateWorkflow(5), SetCustomState(4), TriggerCustomEvent(4) |
| reusable | `competencias-mapa` | 534 | 30 | 57 | 9 | 3 | 3 | 1 | SetCustomState(14), ToggleElement(7), AnimateElement(6), DisplayGroupData(6), HideElement(4), ChangeThing(4) |
| reusable | `agenda` | 371 | 29 | 54 | 8 | 1 | 0 | 0 | SetCustomState(12), ResetGroup(7), AnimateElement(7), ShowElement(5), ChangeThing(4), HideElement(3) |
| reusable | `paises` | 318 | 23 | 52 | 2 | 0 | 0 | 0 | NewThing(9), SetCustomState(7), 1515787032525x876315403042684900-ACb(6), HideElement(5), ChangeThing(5), AnimateElement(5) |
| reusable | `_header` | 248 | 34 | 50 | 6 | 0 | 0 | 0 | SetCustomState(17), MakeChangeCurrentUser(9), HideElement(5), TriggerCustomEventFromReusable(5), ToggleElement(4), ChangePage(4) |
| reusable | `indicadores-admin` | 365 | 27 | 49 | 8 | 5 | 0 | 2 | 1515787032525x876315403042684900-ACb(12), SetCustomState(12), HideElement(6), ChangeThing(5), ShowElement(3), NewThing(2) |
| reusable | `concessionaria` | 354 | 22 | 48 | 5 | 0 | 0 | 1 | AnimateElement(8), HideElement(6), ChangeThing(6), 1515787032525x876315403042684900-ACb(6), SetCustomState(4), ShowElement(3) |
| reusable | `setores` | 248 | 18 | 42 | 5 | 0 | 0 | 1 | HideElement(7), AnimateElement(6), 1515787032525x876315403042684900-ACb(5), ChangeThing(5), ResetGroup(4), ShowElement(4) |
| reusable | `divisoes` | 235 | 16 | 38 | 5 | 0 | 0 | 1 | HideElement(6), 1515787032525x876315403042684900-ACb(5), AnimateElement(5), ShowElement(4), NewThing(3), ChangeThing(3) |
| reusable | `areas-funcoes` | 205 | 15 | 36 | 3 | 0 | 0 | 0 | HideElement(6), AnimateElement(6), ChangeThing(5), SetCustomState(4), 1515787032525x876315403042684900-ACb(4), ResetInputs(4) |
| reusable | `xr_indicadores` | 261 | 13 | 34 | 3 | 0 | 0 | 0 | HideElement(5), ResetGroup(5), 1515787032525x876315403042684900-ACb(4), SetCustomState(4), ResetInputs(3), ShowElement(3) |
| reusable | `pp hierarquia` | 135 | 16 | 32 | 1 | 0 | 0 | 0 | MakeChangeCurrentUser(11), SetCustomState(10), HideElement(5), ChangePage(4), RefreshPage(2) |
| reusable | `solicitações` | 277 | 15 | 32 | 8 | 1 | 0 | 0 | AnimateElement(7), ChangeThing(5), HideElement(4), 1515787032525x876315403042684900-ACb(4), DisplayGroupData(3), DeleteUploadedFile(2) |
| page | `entrar` | 244 | 14 | 27 | 18 | 0 | 0 | 0 | HideElement(5), AnimateElement(5), ChangePage(5), 1531310660066x700901076712292400-AAK(3), 1688932322326x593266464861716500-AAD(3), LogIn(1) |
| page | `index` | 316 | 19 | 24 | 1 | 10 | 17 | 0 | SetCustomState(10), ChangePage(7), TriggerCustomEventFromReusable(4), OpenURL(3) |
| reusable | `xr_areas` | 143 | 9 | 22 | 1 | 0 | 0 | 0 | HideElement(5), 1515787032525x876315403042684900-ACb(4), ShowElement(3), NewThing(2), ResetGroup(2), ChangeThing(2) |
| reusable | `xr_indicadores` | 143 | 9 | 22 | 1 | 0 | 0 | 0 | HideElement(5), 1515787032525x876315403042684900-ACb(4), ShowElement(3), NewThing(2), ResetGroup(2), ChangeThing(2) |
| reusable | `preferencias` | 134 | 10 | 19 | 0 | 0 | 0 | 0 | ChangeThing(3), 1531310660066x700901076712292400-AAK(3), HideElement(2), 1515787032525x876315403042684900-ACb(2), ScrollToElement(2), NewThing(1) |
| reusable | `empresa` | 115 | 9 | 17 | 7 | 0 | 0 | 2 | 1515787032525x876315403042684900-ACb(3), ChangeListOfThings(2), 1520524904151x890914947846373400-AIO(2), ResetInputs(2), DisplayGroupData(1), ShowElement(1) |
| reusable | `Seletor Calibracao` | 127 | 4 | 16 | 0 | 0 | 0 | 0 | ChangeThing(9), ToggleElement(1), DisplayGroupData(1), HideElement(1), TriggerCustomEvent(1), TerminateWorkflow(1) |
| reusable | `calendario` | 95 | 8 | 12 | 0 | 3 | 4 | 0 | DisplayGroupData(8), TriggerCustomEvent(3), ResetGroup(1) |
| reusable | `habitos` | 100 | 5 | 10 | 1 | 0 | 0 | 0 | ToggleElement(5), ResetGroup(1), DisplayGroupData(1), ChangeThing(1), NewThing(1), DeleteThing(1) |
| page | `reset_pw` | 69 | 5 | 9 | 1 | 0 | 0 | 0 | 1531310660066x700901076712292400-AAK(2), ChangePage(2), 1688932322326x593266464861716500-AAD(2), ResetPassword(1), 1515787032525x876315403042684900-ACb(1), PauseWFClient(1) |
| reusable | `Cookies-Popup` | 16 | 4 | 8 | 0 | 0 | 0 | 0 | ToggleElement(3), MakeChangeCurrentUser(2), CookieOptOut(1), CookieOptIn(1), ChangePage(1) |
| reusable | `ajuda` | 85 | 3 | 6 | 0 | 1 | 0 | 0 | SetCustomState(2), 1688932322326x593266464861716500-AAD(2), ResetInputs(1), 1515787032525x876315403042684900-ACb(1) |
| page | `404` | 11 | 1 | 1 | 0 | 0 | 0 | 0 | ChangePage(1) |
| page | `termos` | 12 | 1 | 1 | 1 | 0 | 0 | 0 | 1488796042609x768734193128308700-AAg(1) |
| page | `test` | 6 | 1 | 1 | 1 | 0 | 0 | 0 | ChangePage(1) |
| page | `pilulas` | 4 | 1 | 1 | 0 | 0 | 0 | 0 | ChangePage(1) |
| reusable | `pp - reprodutor de videos` | 12 | 1 | 1 | 0 | 0 | 0 | 0 | ToggleElement(1) |
| page | `offline` | 12 | 0 | 0 | 1 | 0 | 0 | 0 |  |
| page | `rv-publico` | 135 | 0 | 0 | 4 | 0 | 0 | 0 |  |
| reusable | `home` | 32 | 0 | 0 | 2 | 0 | 0 | 0 |  |
| reusable | `loading` | 3 | 0 | 0 | 0 | 0 | 0 | 0 |  |


## Tipos de workflow mais usados

| Tipo | Quantidade |
|---|---:|
| `ButtonClicked` | 631 |
| `InputChanged` | 26 |
| `PageLoaded` | 24 |
| `ConditionTrue` | 22 |
| `CustomEvent` | 19 |
| `PopupClosed` | 8 |
| `?` | 3 |
| `1701167433790x572377910433808400-AAP` | 3 |
| `draggableui-DroppedOn` | 3 |
| `LoggedOut` | 2 |
| `fullcalendar-CalendarEventClicked` | 2 |
| `LoggedIn` | 1 |
| `1588519026841x844443848468070400-AAI` | 1 |
| `fullcalendar-CalendarDayClicked` | 1 |
| `1580238841425x582072028873097200-AAf` | 1 |


## Tipos de ação mais usados

| Tipo | Quantidade |
|---|---:|
| `SetCustomState` | 247 |
| `HideElement` | 194 |
| `1515787032525x876315403042684900-ACb` | 150 |
| `ChangeThing` | 147 |
| `AnimateElement` | 120 |
| `ShowElement` | 86 |
| `ResetGroup` | 85 |
| `DisplayGroupData` | 78 |
| `ChangeListOfThings` | 65 |
| `NewThing` | 62 |
| `MakeChangeCurrentUser` | 49 |
| `ToggleElement` | 40 |
| `ChangePage` | 39 |
| `DeleteThing` | 26 |
| `PauseWFClient` | 20 |
| `1688932322326x593266464861716500-AAD` | 19 |
| `ResetInputs` | 16 |
| `DisplayListData` | 16 |
| `1488796042609x768734193128308700-AAg` | 13 |
| `TerminateWorkflow` | 12 |
| `ScheduleAPIEventOnList` | 11 |
| `RefreshPage` | 10 |
| `TriggerCustomEventFromReusable` | 9 |
| `TriggerCustomEvent` | 9 |
| `1531310660066x700901076712292400-AAK` | 8 |
| `DeleteUploadedFile` | 8 |
| `ListShowNext` | 8 |
| `ListShowPrevious` | 8 |
| `ScrollToElement` | 8 |
| `SendPasswordResetEmail` | 6 |
| `1497473108162x748255442121523200-AAU` | 5 |
| `ScheduleAPIEvent` | 5 |
| `1519740402471x919002267936096300-AAC` | 4 |
| `OpenURL` | 3 |
| `DeleteListOfThings` | 3 |
| `LogOut` | 2 |
| `CreateUserAccount` | 2 |
| `ChangeEmailForAnotherUser` | 2 |
| `ListClear` | 2 |
| `1520524904151x890914947846373400-AIO` | 2 |
| `ResetPassword` | 1 |
| `LogIn` | 1 |
| `SignUp` | 1 |
| `SetTemporaryPassword` | 1 |
| `SetRecurringEvent` | 1 |
| `apiconnector2-bTVca.1768419135213x307133239560824800` | 1 |
| `ListGoToPage` | 1 |
| `apiconnector2-bTVca.bTVdz` | 1 |
| `apiconnector2-bTVca.1764707144426x334796885165391550` | 1 |
| `1588519026841x844443848468070400-AAJ` | 1 |
| `1539124824422x194279356396994560-AAC` | 1 |
| `1543086664409x454646894723334140-ARG` | 1 |
| `1543086664409x454646894723334140-AQt` | 1 |
| `1543086664409x454646894723334140-AQR` | 1 |
| `1543086664409x454646894723334140-ARR` | 1 |
| `1543086664409x454646894723334140-AQm` | 1 |
| `UpdateCredentials` | 1 |
| `CookieOptOut` | 1 |
| `CookieOptIn` | 1 |
| `1580238841425x582072028873097200-ABB` | 1 |


## Tipos de elemento mais usados

| Tipo | Quantidade |
|---|---:|
| `GetElement` | 2868 |
| `State` | 1709 |
| `Group` | 1396 |
| `Text` | 1253 |
| `Message` | 799 |
| `ButtonClicked` | 631 |
| `OptionValue` | 488 |
| `Button` | 376 |
| `Search` | 349 |
| `OneOptionValue` | 309 |
| `SetCustomState` | 247 |
| `HideElement` | 194 |
| `1515787032525x876315403042684900-ACb` | 150 |
| `ChangeThing` | 147 |
| `Input` | 140 |
| `RepeatingGroup` | 134 |
| `ArbitraryText` | 133 |
| `AnimateElement` | 120 |
| `PreviousStep` | 119 |
| `PageData` | 116 |
| `TableCell` | 114 |
| `ElementAncestor` | 103 |
| `GetParamFromUrl` | 86 |
| `Dropdown` | 86 |
| `ShowElement` | 86 |
| `ResetGroup` | 85 |
| `DisplayGroupData` | 78 |
| `Popup` | 75 |
| `Icon` | 72 |
| `1660986320633x930868553717645300-AAC` | 70 |
| `ChangeListOfThings` | 65 |
| `NewThing` | 62 |
| `TableMainAxis` | 57 |
| `ThisElement` | 52 |
| `MakeChangeCurrentUser` | 49 |
| `CustomElement` | 41 |
| `GroupFocus` | 41 |
| `ToggleElement` | 40 |
| `ChangePage` | 39 |
| `1498171554228x105618760361836540-AAC` | 39 |
| `Image` | 37 |
| `1674224743499x705196870684377100-AAC` | 34 |
| `HTML` | 33 |
| `CustomDefinition` | 32 |
| `CurrentWorkflowItem` | 28 |
| `select2-MultiDropdown` | 27 |
| `DeleteThing` | 26 |
| `InputChanged` | 26 |
| `ConditionTrue` | 22 |
| `TableCrossAxis` | 22 |
| `PageLoaded` | 20 |
| `AllOptionValue` | 20 |
| `1688932322326x593266464861716500-AAD` | 19 |
| `CustomEvent` | 19 |
| `PauseWFClient` | 19 |
| `DateInput` | 17 |
| `MultiLineInput` | 16 |
| `DisplayListData` | 16 |
| `1701167433790x572377910433808400-AAC` | 14 |
| `1488796042609x768734193128308700-AAg` | 13 |
| `TerminateWorkflow` | 12 |
| `1656156230536x298565765509152800-ABV` | 12 |
| `ScheduleAPIEventOnList` | 11 |
| `Table` | 11 |
| `Shape` | 11 |
| `Page` | 10 |
| `1580238841425x582072028873097200-AAC` | 10 |
| `FloatingGroup` | 9 |
| `TriggerCustomEventFromReusable` | 9 |
| `TriggerCustomEvent` | 9 |
| `1531310660066x700901076712292400-AAH` | 8 |
| `1531310660066x700901076712292400-AAK` | 8 |
| `Breakpoint` | 8 |
| `DeleteUploadedFile` | 8 |
| `PopupClosed` | 8 |
| `ListShowNext` | 8 |
| `ListShowPrevious` | 8 |
| `ScrollToElement` | 8 |
| `SendPasswordResetEmail` | 6 |
| `PictureInput` | 6 |
