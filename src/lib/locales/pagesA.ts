import type { Bundle } from "./types";

/** Home, Timeline, Wage Estimate, analysis banner and shared empty states. */
export const pagesA: Bundle = {
  en: {
    "home.title": "Home",
    "home.signedInAs": "Signed in as {email}",
    "home.empty.title": "Your case is empty",
    "home.empty.description":
      "You haven't added any evidence yet. Start with a pay stub, a schedule, a screenshot of a message — whatever you have. Nothing has to be perfect.",
    "home.addEvidence": "Add Evidence",
    "home.summary.eyebrow": "Where your case stands",
    "home.summary.readyNoAnalysis":
      "Your files have been read. Run a review to turn them into a timeline and recommendations.",
    "home.summary.processing":
      "Your files are still being read. A summary of your case will appear here once they're done.",
    "home.stat.itemsAdded": "Items added",
    "home.stat.readAndUsable": "Read and usable",
    "home.stat.stillProcessing": "Still processing",
    "home.stat.couldntBeRead": "Couldn't be read",
    "home.doThisNext": "Do this next",
    "home.continueMyCase": "Continue My Case",
    "home.filesNeedAttention.one": "{count} file needs attention",
    "home.filesNeedAttention.other": "{count} files need attention",
    "home.safety.title": "Worth being aware of",
    "home.safety.disclaimer": "These are things to look into — not legal conclusions about your case.",
    "home.missing.title": "What's still missing",
    "home.missing.description": "These gaps are normal. Adding any one of them makes your story easier to follow.",
    "home.processingNotice":
      "Once your files finish processing, we'll build a timeline and recommendations from them.",

    "timeline.title": "Case Timeline",
    "timeline.description": "Built from the evidence you've added — where the hours and the pay stopped matching.",
    "timeline.empty.title": "No timeline yet",
    "timeline.empty.description": "Your timeline will appear here once your evidence has been processed and reviewed.",
    "timeline.event.fallbackTitle": "Event",
    "timeline.event.dateNotStated": "Date not stated in the evidence",
    "timeline.discrepancies.title": "Possible discrepancies",

    "wage.title": "Wage Estimate",
    "wage.description": "What your records say about hours, rates and payments.",
    "wage.empty.title": "No wage estimate yet",
    "wage.empty.description":
      "Your wage estimate will appear once enough verified pay and work information is available. We won't show a total until it can be calculated from your own records.",
    "wage.group.hours": "Hours found in your evidence",
    "wage.group.rates": "Pay rates found",
    "wage.group.amounts": "Amounts found",
    "wage.disclaimer":
      "These figures are read directly from your uploaded files and may contain mistakes. They are not added up into a total owed — only a person or an agency reviewing your records can decide what you're formally owed.",

    "analysis.staleNoEvidence":
      "Your evidence changed since this review was made, so what's shown below may be out of date. It will refresh once a file finishes processing.",
    "analysis.evidenceChanged": "Your evidence has changed",
    "analysis.readyToReview": "Ready to review your evidence",
    "analysis.refreshPrompt": "Refresh the review so your timeline and next steps match what's in your case now.",
    "analysis.canBuildFrom.one": "We can now build a timeline and recommendations from {count} processed item.",
    "analysis.canBuildFrom.other": "We can now build a timeline and recommendations from {count} processed items.",
    "analysis.reviewing": "Reviewing…",
    "analysis.refreshReview": "Refresh review",
    "analysis.reviewMyEvidence": "Review my evidence",
  },
  es: {
    "home.title": "Inicio",
    "home.signedInAs": "Sesión iniciada como {email}",
    "home.empty.title": "Tu caso está vacío",
    "home.empty.description":
      "Aún no has añadido ninguna evidencia. Empieza con un recibo de pago, un horario, una captura de un mensaje — lo que tengas. Nada tiene que ser perfecto.",
    "home.addEvidence": "Añadir evidencia",
    "home.summary.eyebrow": "Cómo va tu caso",
    "home.summary.readyNoAnalysis":
      "Tus archivos ya fueron leídos. Ejecuta una revisión para convertirlos en una línea de tiempo y recomendaciones.",
    "home.summary.processing":
      "Tus archivos aún se están leyendo. Un resumen de tu caso aparecerá aquí en cuanto terminen.",
    "home.stat.itemsAdded": "Elementos añadidos",
    "home.stat.readAndUsable": "Leídos y utilizables",
    "home.stat.stillProcessing": "Aún procesando",
    "home.stat.couldntBeRead": "No se pudieron leer",
    "home.doThisNext": "Haz esto a continuación",
    "home.continueMyCase": "Continuar mi caso",
    "home.filesNeedAttention.one": "{count} archivo necesita atención",
    "home.filesNeedAttention.other": "{count} archivos necesitan atención",
    "home.safety.title": "Vale la pena tenerlo en cuenta",
    "home.safety.disclaimer": "Esto son cosas para investigar — no conclusiones legales sobre tu caso.",
    "home.missing.title": "Qué falta todavía",
    "home.missing.description": "Estos vacíos son normales. Añadir cualquiera de ellos facilita seguir tu historia.",
    "home.processingNotice":
      "Cuando tus archivos terminen de procesarse, construiremos una línea de tiempo y recomendaciones a partir de ellos.",

    "timeline.title": "Línea de tiempo del caso",
    "timeline.description":
      "Construida a partir de la evidencia que has añadido — dónde las horas y el pago dejaron de coincidir.",
    "timeline.empty.title": "Todavía no hay línea de tiempo",
    "timeline.empty.description":
      "Tu línea de tiempo aparecerá aquí una vez que tu evidencia haya sido procesada y revisada.",
    "timeline.event.fallbackTitle": "Evento",
    "timeline.event.dateNotStated": "Fecha no indicada en la evidencia",
    "timeline.discrepancies.title": "Posibles discrepancias",

    "wage.title": "Estimación salarial",
    "wage.description": "Lo que tus registros dicen sobre horas, tarifas y pagos.",
    "wage.empty.title": "Todavía no hay estimación salarial",
    "wage.empty.description":
      "Tu estimación salarial aparecerá cuando haya suficiente información verificada de pago y trabajo. No mostraremos un total hasta que pueda calcularse a partir de tus propios registros.",
    "wage.group.hours": "Horas encontradas en tu evidencia",
    "wage.group.rates": "Tarifas de pago encontradas",
    "wage.group.amounts": "Montos encontrados",
    "wage.disclaimer":
      "Estas cifras se leen directamente de tus archivos subidos y pueden contener errores. No se suman en un total adeudado — solo una persona o una agencia que revise tus registros puede decidir qué se te debe formalmente.",

    "analysis.staleNoEvidence":
      "Tu evidencia cambió desde que se hizo esta revisión, así que lo mostrado abajo puede estar desactualizado. Se actualizará en cuanto un archivo termine de procesarse.",
    "analysis.evidenceChanged": "Tu evidencia ha cambiado",
    "analysis.readyToReview": "Listo para revisar tu evidencia",
    "analysis.refreshPrompt":
      "Actualiza la revisión para que tu línea de tiempo y próximos pasos coincidan con lo que hay en tu caso ahora.",
    "analysis.canBuildFrom.one": "Ahora podemos construir una línea de tiempo y recomendaciones a partir de {count} elemento procesado.",
    "analysis.canBuildFrom.other": "Ahora podemos construir una línea de tiempo y recomendaciones a partir de {count} elementos procesados.",
    "analysis.reviewing": "Revisando…",
    "analysis.refreshReview": "Actualizar revisión",
    "analysis.reviewMyEvidence": "Revisar mi evidencia",
  },
  fr: {
    "home.title": "Accueil",
    "home.signedInAs": "Connecté en tant que {email}",
    "home.empty.title": "Votre dossier est vide",
    "home.empty.description":
      "Vous n'avez pas encore ajouté de preuve. Commencez par une fiche de paie, un planning, une capture d'écran d'un message — ce que vous avez. Rien ne doit être parfait.",
    "home.addEvidence": "Ajouter une preuve",
    "home.summary.eyebrow": "Où en est votre dossier",
    "home.summary.readyNoAnalysis":
      "Vos fichiers ont été lus. Lancez une révision pour les transformer en chronologie et recommandations.",
    "home.summary.processing":
      "Vos fichiers sont encore en cours de lecture. Un résumé de votre dossier apparaîtra ici une fois terminé.",
    "home.stat.itemsAdded": "Éléments ajoutés",
    "home.stat.readAndUsable": "Lus et utilisables",
    "home.stat.stillProcessing": "En cours de traitement",
    "home.stat.couldntBeRead": "Illisibles",
    "home.doThisNext": "À faire ensuite",
    "home.continueMyCase": "Continuer mon dossier",
    "home.filesNeedAttention.one": "{count} fichier nécessite votre attention",
    "home.filesNeedAttention.other": "{count} fichiers nécessitent votre attention",
    "home.safety.title": "À prendre en compte",
    "home.safety.disclaimer": "Ce sont des points à examiner — pas des conclusions juridiques sur votre dossier.",
    "home.missing.title": "Ce qu'il manque encore",
    "home.missing.description":
      "Ces manques sont normaux. Ajouter l'un d'eux rend votre histoire plus facile à suivre.",
    "home.processingNotice":
      "Une fois vos fichiers traités, nous construirons une chronologie et des recommandations à partir d'eux.",

    "timeline.title": "Chronologie du dossier",
    "timeline.description":
      "Construite à partir des preuves que vous avez ajoutées — là où les heures et la paie ont cessé de correspondre.",
    "timeline.empty.title": "Pas encore de chronologie",
    "timeline.empty.description":
      "Votre chronologie apparaîtra ici une fois vos preuves traitées et examinées.",
    "timeline.event.fallbackTitle": "Événement",
    "timeline.event.dateNotStated": "Date non indiquée dans la preuve",
    "timeline.discrepancies.title": "Écarts possibles",

    "wage.title": "Estimation du salaire",
    "wage.description": "Ce que vos documents disent sur les heures, les taux et les paiements.",
    "wage.empty.title": "Pas encore d'estimation salariale",
    "wage.empty.description":
      "Votre estimation salariale apparaîtra dès que suffisamment d'informations vérifiées sur la paie et le travail seront disponibles. Nous n'afficherons pas de total tant qu'il ne pourra pas être calculé à partir de vos propres documents.",
    "wage.group.hours": "Heures trouvées dans vos preuves",
    "wage.group.rates": "Taux de rémunération trouvés",
    "wage.group.amounts": "Montants trouvés",
    "wage.disclaimer":
      "Ces chiffres sont lus directement dans vos fichiers téléversés et peuvent contenir des erreurs. Ils ne sont pas additionnés en un total dû — seule une personne ou un organisme examinant vos documents peut déterminer ce qui vous est formellement dû.",

    "analysis.staleNoEvidence":
      "Vos preuves ont changé depuis cette révision, donc ce qui est affiché ci-dessous peut être obsolète. Cela se mettra à jour dès qu'un fichier aura fini d'être traité.",
    "analysis.evidenceChanged": "Vos preuves ont changé",
    "analysis.readyToReview": "Prêt à examiner vos preuves",
    "analysis.refreshPrompt":
      "Actualisez la révision pour que votre chronologie et vos prochaines étapes correspondent à l'état actuel de votre dossier.",
    "analysis.canBuildFrom.one":
      "Nous pouvons maintenant construire une chronologie et des recommandations à partir de {count} élément traité.",
    "analysis.canBuildFrom.other":
      "Nous pouvons maintenant construire une chronologie et des recommandations à partir de {count} éléments traités.",
    "analysis.reviewing": "Examen en cours…",
    "analysis.refreshReview": "Actualiser la révision",
    "analysis.reviewMyEvidence": "Examiner mes preuves",
  },
  pt: {
    "home.title": "Início",
    "home.signedInAs": "Sessão iniciada como {email}",
    "home.empty.title": "Seu caso está vazio",
    "home.empty.description":
      "Você ainda não adicionou nenhuma evidência. Comece com um contracheque, uma escala, uma captura de tela de uma mensagem — o que você tiver. Nada precisa ser perfeito.",
    "home.addEvidence": "Adicionar evidência",
    "home.summary.eyebrow": "Como está o seu caso",
    "home.summary.readyNoAnalysis":
      "Seus arquivos já foram lidos. Execute uma revisão para transformá-los em uma linha do tempo e recomendações.",
    "home.summary.processing":
      "Seus arquivos ainda estão sendo lidos. Um resumo do seu caso aparecerá aqui assim que forem concluídos.",
    "home.stat.itemsAdded": "Itens adicionados",
    "home.stat.readAndUsable": "Lidos e utilizáveis",
    "home.stat.stillProcessing": "Ainda processando",
    "home.stat.couldntBeRead": "Não puderam ser lidos",
    "home.doThisNext": "Faça isto a seguir",
    "home.continueMyCase": "Continuar meu caso",
    "home.filesNeedAttention.one": "{count} arquivo precisa de atenção",
    "home.filesNeedAttention.other": "{count} arquivos precisam de atenção",
    "home.safety.title": "Vale a pena estar ciente",
    "home.safety.disclaimer": "Estas são coisas para investigar — não conclusões legais sobre o seu caso.",
    "home.missing.title": "O que ainda falta",
    "home.missing.description":
      "Essas lacunas são normais. Adicionar qualquer uma delas facilita seguir a sua história.",
    "home.processingNotice":
      "Assim que seus arquivos terminarem de processar, construiremos uma linha do tempo e recomendações a partir deles.",

    "timeline.title": "Linha do tempo do caso",
    "timeline.description":
      "Construída a partir das evidências que você adicionou — onde as horas e o pagamento pararam de coincidir.",
    "timeline.empty.title": "Ainda não há linha do tempo",
    "timeline.empty.description":
      "Sua linha do tempo aparecerá aqui assim que suas evidências forem processadas e revisadas.",
    "timeline.event.fallbackTitle": "Evento",
    "timeline.event.dateNotStated": "Data não indicada na evidência",
    "timeline.discrepancies.title": "Possíveis discrepâncias",

    "wage.title": "Estimativa salarial",
    "wage.description": "O que seus registros dizem sobre horas, taxas e pagamentos.",
    "wage.empty.title": "Ainda não há estimativa salarial",
    "wage.empty.description":
      "Sua estimativa salarial aparecerá quando houver informações verificadas suficientes sobre pagamento e trabalho. Não mostraremos um total até que possa ser calculado a partir dos seus próprios registros.",
    "wage.group.hours": "Horas encontradas na sua evidência",
    "wage.group.rates": "Taxas de pagamento encontradas",
    "wage.group.amounts": "Valores encontrados",
    "wage.disclaimer":
      "Esses valores são lidos diretamente dos seus arquivos enviados e podem conter erros. Eles não são somados em um total devido — apenas uma pessoa ou agência que revise seus registros pode decidir o que é formalmente devido a você.",

    "analysis.staleNoEvidence":
      "Suas evidências mudaram desde que esta revisão foi feita, então o que é mostrado abaixo pode estar desatualizado. Será atualizado assim que um arquivo terminar de processar.",
    "analysis.evidenceChanged": "Suas evidências mudaram",
    "analysis.readyToReview": "Pronto para revisar sua evidência",
    "analysis.refreshPrompt":
      "Atualize a revisão para que sua linha do tempo e próximos passos correspondam ao estado atual do seu caso.",
    "analysis.canBuildFrom.one":
      "Agora podemos construir uma linha do tempo e recomendações a partir de {count} item processado.",
    "analysis.canBuildFrom.other":
      "Agora podemos construir uma linha do tempo e recomendações a partir de {count} itens processados.",
    "analysis.reviewing": "Revisando…",
    "analysis.refreshReview": "Atualizar revisão",
    "analysis.reviewMyEvidence": "Revisar minha evidência",
  },
  zh: {
    "home.title": "首页",
    "home.signedInAs": "已登录：{email}",
    "home.empty.title": "您的案件目前为空",
    "home.empty.description":
      "您还没有添加任何证据。可以从一张工资单、一张排班表、一条消息的截图开始——有什么就用什么。不必完美。",
    "home.addEvidence": "添加证据",
    "home.summary.eyebrow": "案件目前的状况",
    "home.summary.readyNoAnalysis": "您的文件已读取完成。运行一次审查即可生成时间线和建议。",
    "home.summary.processing": "您的文件仍在读取中。读取完成后，这里会显示案件摘要。",
    "home.stat.itemsAdded": "已添加项目",
    "home.stat.readAndUsable": "可读取并可用",
    "home.stat.stillProcessing": "仍在处理中",
    "home.stat.couldntBeRead": "无法读取",
    "home.doThisNext": "接下来该做的事",
    "home.continueMyCase": "继续我的案件",
    "home.filesNeedAttention.one": "{count} 个文件需要处理",
    "home.filesNeedAttention.other": "{count} 个文件需要处理",
    "home.safety.title": "值得留意的事项",
    "home.safety.disclaimer": "这些是值得关注的问题——并非对您案件的法律结论。",
    "home.missing.title": "仍然缺少的内容",
    "home.missing.description": "这些缺口是正常的。补充任意一项都会让您的情况更容易被理解。",
    "home.processingNotice": "文件处理完成后，我们会据此生成时间线和建议。",

    "timeline.title": "案件时间线",
    "timeline.description": "根据您添加的证据生成——标出工时与工资对不上的地方。",
    "timeline.empty.title": "暂无时间线",
    "timeline.empty.description": "证据处理并审查完成后，您的时间线将显示在这里。",
    "timeline.event.fallbackTitle": "事件",
    "timeline.event.dateNotStated": "证据中未注明日期",
    "timeline.discrepancies.title": "可能存在的差异",

    "wage.title": "工资估算",
    "wage.description": "您的记录中关于工时、时薪和付款的信息。",
    "wage.empty.title": "暂无工资估算",
    "wage.empty.description":
      "当有足够经过核实的薪资和工作信息时，工资估算才会显示。在能够根据您自己的记录计算出结果之前，我们不会显示总额。",
    "wage.group.hours": "证据中找到的工时",
    "wage.group.rates": "找到的时薪",
    "wage.group.amounts": "找到的金额",
    "wage.disclaimer":
      "这些数字是直接从您上传的文件中读取的，可能存在错误。它们不会被汇总为应付总额——只有审阅您记录的人员或机构才能决定正式应付的金额。",

    "analysis.staleNoEvidence": "自本次审查生成以来，您的证据已发生变化，因此下方内容可能已过期。文件处理完成后将自动刷新。",
    "analysis.evidenceChanged": "您的证据已发生变化",
    "analysis.readyToReview": "已准备好审查您的证据",
    "analysis.refreshPrompt": "刷新审查，使您的时间线和后续步骤与当前案件保持一致。",
    "analysis.canBuildFrom.one": "现在我们可以根据 {count} 个已处理项目生成时间线和建议。",
    "analysis.canBuildFrom.other": "现在我们可以根据 {count} 个已处理项目生成时间线和建议。",
    "analysis.reviewing": "正在审查…",
    "analysis.refreshReview": "刷新审查",
    "analysis.reviewMyEvidence": "审查我的证据",
  },
};
