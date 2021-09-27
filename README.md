# FamilyFeud
Браузерная версия игры Family Feud или 100 к 1 для игры с друзьями на телевизорах или проекторах

# Как играть:
1. Скачайте файл data.xlsx на свой телефон. Вы можете быстро найти нужный вопрос, введя в поиск номер вопроса.
2. Заходите на https://niqp.github.io/FamilyFeud/
3. При нажатии на кнопку "Отвечающая команда" можно определить команду, которая будет отвечать на вопрос - нажимайте левый ctrl для красной команды и Enter в цифровом блоке для синей команды.
4. При нажатии на кнопку "Начать игру" начнёт появляться первый вопрос. Нажмите на кнопку "Отвечающая команда" заранее, чтобы игроки нажимали на соответствующие кнопки, если знают ответ.
5. Как только игрок нажал на кнопку ответа, начинается отсчёт таймера. Если ответ верный, останавливаем таймер кнопкой "Остановить таймер" и открываем нужный ответ на табло. Очки зачислятся в общий пул.
6. При необходимости сами нажимаем на кнопки нужных команд, чтобы включать таймер.
6.1 Когда отвечает первая команда, считать страйки можно при помощи кнопки "Страйк!"
7. После конца раунда нажимаем на кнопку "Зачислить команде", чтобы очки из общего пула зачислились нужной команде.
8. После трёх обычных раундов начинаются раунды Fast Money:
9. Первой отвечает команда, набравшая больше очков. Каждая команда выбирает, кто будет отвечать. Участник команды, который отвечает вторым, удаляется, чтобы не видеть ответов первого.
10. После нажатия на кнопку "Начать Fast Money" на экране начнут появляться вопросы и поле для ответов. Ответы набираются членом команды на клавиатуре и отправляются по нажатию Enter
11. После ответа на 5 вопросов, появляется экран "Отвечает следующая команда"
12. Второй игрок отвечает на те же вопросы, но вначале проговаривает их вслух, чтобы ведущий мог запретить варианты ответа, уже отвеченные первым игроком.
13. Появляется таблица с ответами участников. Ведущий ищет подходящие варианты ответов в файле data.xlsx, и выставляет в белые поля нужные баллы (Если ответа нет в списке, выставляется 0).
14. Ведущий зачитывает ответы на вопрос, и нажатием на кнопку открывает оба ответа. Выставленные баллы зачисляются командам автоматически.
15. После подсчёта баллов за все вопросы, нажмите кнопку "Закончить игру". Выведется сообщение о победившей команде. При наличии в базе нужного количества вопросов для новой игры, появится кнопка "Новая игра"

# Как редактировать список вопросов

Структура вопросов представлена в файле /data/data.json.
Можно скачать архивом данный проект и запустить у себя локально через index.html.
После этого можно будет редактировать файл data.json для изменения или добавления новых вопросов.
Не забывайте добавлять вопросы и ответы ещё и в data.xlsx, для поиска нужных ответов.
Для удобства дальнейшего поиска, в начале пишется порядковый номер вопроса.
Вопросы стоит добавлять пачками в количестве 8 штук, т.к именно такое количество нужно для одной полноценной игры.
