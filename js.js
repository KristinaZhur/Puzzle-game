    const puzzleDifficulty = 4; // создаем поле 4*4 
    var puzzleHover = '#AFEEEE';
    var ctx;
    var canvas;
    var img; //картинка
    var pieces;//кусочки
    var puzzleWidth; //ширина всей картинки
    var puzzleHeight;
    var pieceWidth;
    var pieceHeight;
    var currentPiece; // текущий кусочек
    var currentDropPiece;  // кусочек, который перемещаем
    var mouse; // будет содержать текущую позицию по x  и у, при перемещении будем определять какой кусочек взяли, над каким переносим и куда опустим        
    var count = 60;
    var timer;
    var timeUser;
    var timeBack; // отсчет обратного времени

        function start(){ // должно быть body onload = '(unit)' - куда вставить????
            img = new Image(); // Создает новый элемент изображения
            img.addEventListener('load',onImage,false); // необходимо , чтобы вначале загрузилось изображение, а потом вызвать функцию (событие будет поймано при всплытии)
            // здесь выполняет drawImage функцию
            img.src = './images/puzzle.jpg'; // Устанавливает путь
            img.alt = 'puzzle game';
        }
        
        //  ДЕлим картинку на равные части, и вызываем функции для отрисовки 
        function onImage(){
            pieceWidth = Math.floor(img.width / puzzleDifficulty)// чтобы построить картинку, нужно ширину / количество частей ( 4)
            pieceHeight = Math.floor(img.height / puzzleDifficulty)
            puzzleWidth = pieceWidth * puzzleDifficulty;
            puzzleHeight = pieceHeight * puzzleDifficulty;
            setCanvas(); // появится  квадрат (холст поля, когда вызовем ниже функцию)
            initPuzzle(); // инициализируем , позже можно вызвать для игры заново          
        }
        function setCanvas() { // рисуем поле, где будет картинка 
            canvas = document.getElementById('canvas');
            ctx = canvas.getContext('2d'); // хослт
            canvas.width = puzzleWidth;
            canvas.height = puzzleHeight;
            canvas.style.border = "1px solid white";
        }
        function initPuzzle(){ // устанавливаем нужные компоненты до начала игры, позже можем вызывать эту функции, когда нужно переиграть
            pieces = []; //создаем массив , куда будем складывать кусочки паззла
            mouse = {x:0,y:0}; //устанавливаем координаты начала
            currentPiece = null;
            currentDropPiece = null; 
            // после появится картинка
            ctx.drawImage(img, mouse.x, 0, puzzleWidth, puzzleHeight, 0, 0, puzzleWidth, puzzleHeight); //dx - Координата по оси Х, обозначающая стартовую точку холста-приемника, в которую будет помещен верхний левый угол исходного image. sx,sy - указывем точку , ширину, высоту и вырезаем нужную часть картинки
            createTitle('Click to start puzzle');
            buildPieces();
        }
        function createTitle(title){
            ctx.fillStyle = 'grey';
            ctx.globalAlpha = 0.4; //(прозрачность) значение, которое будет применено  к тексту внизу картинки, чтобы пользователь видел его и картинку позади.
            ctx.fillRect(66,puzzleHeight - 40,puzzleWidth - 135,40); // рисуем прямоугольник по клику на который будет происходит микс паззла (x y w h)
            ctx.fillStyle = "#FFFFFF";
            ctx.globalAlpha = 1;// возвращаем непрозрачность текста 
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = "20px Arial";
            ctx.fillText(title,puzzleWidth / 2,puzzleHeight - 20);
        }
        /* в каждом цикле, это увеличиваем  xPos на pieceWidth. 
        Прежде чем продолжить цикл, мы определяем, нужно ли нам переходить 
        к следующему ряду частей, проверяя, находится ли xPos за пределами ширины холста. 
        Если это так, мы сбрасываем xPos обратно на 0 и увеличиваем yPos на pieceHeight. 
        Теперь у нас есть все кусочки, которые хранятся в массиве pieces.
         На этом этапе код,  перестает выполняться и ожидает взаимодействия с пользователем. 
         Мы установили прослушиватель щелчка для запуска функции shufflePuzzle (), которая начнет игру.*/
        
        function buildPieces(){
            var piece;
            var xPos = 0; //на начальной позиции координаты =0, откуда будем рисовать
            var yPos = 0;
            for(var i = 0 ; i < puzzleDifficulty * puzzleDifficulty; i ++){ //строим цикл, чтобы перебирать части паззла , итого 16 их
                piece = {}; 
                piece.sx = xPos; // 
                piece.sy = yPos;
                pieces.push(piece); //заполняем пустой массив кусочками паззла
                xPos += pieceWidth; // след.кусочек становится на фиксированную ширину на след.позицию
                if (xPos >= puzzleWidth){ // проверяем, если след. кусочек картинки выходит за поле, переходим на след.ряд
                    xPos = 0;
                    yPos += pieceHeight;
                } 
            }       
            document.getElementById('btn').onmousedown = shufflePuzzle; // без (), т.к. при открытии страницы тогда сразу кусочки перемешаются
        }
        function shufflePuzzle(){ //функция перемешивания
            pieces = shuffleArray(pieces); // рандомно будут кусочки(вставляем  массив с кусочками)
            ctx.clearRect(0,0,puzzleWidth,puzzleHeight); //очищаем холст для кусочков  ( можно и не делать)
            var piece;
            var xPos = 0;
            var yPos = 0; //снова обнуляем позиции начальные и проходим по циклу
            for(var i = 0; i < pieces.length; i++){
                piece = pieces[i]; //берем по индексу части паззла
                piece.xPos = xPos;
                piece.yPos = yPos;
                ctx.drawImage(img, piece.sx, piece.sy, pieceWidth, pieceHeight, xPos, yPos, pieceWidth, pieceHeight); //посл.4 параметра указывают куда мы хотим нарисовать часть картинки
                ctx.strokeRect(xPos, yPos, pieceWidth,pieceHeight);
                ctx.strokeStyle = 'grey'; // цвет вокруг кусочков паззла
                xPos += pieceWidth;
                if(xPos >= puzzleWidth){
                    xPos = 0;
                    yPos += pieceHeight;
                }
            }
            drawCount();
            document.onmousedown = onPuzzleClick; // клик Теперь мы ждем, пока пользователь захватит кусок, установив еще один прослушиватель щелчков. На этот раз он запустит функцию onPuzzleClick ().           
        }
    
        function drawCount(){
            timer = setInterval( () => {    // отсчет
                if (count > 0) {
                count --;}
                if (count === 0){       
                    clearInterval(timer);
                    count = 60;

                } //else if (count< 0) {
                     //count =60;
                //}
                timeback =   document.getElementById ('counttime')
                timeback.innerHTML= `${count}`;

            }, 1000);    
                //document.onmousedown = onPuzzleClick;  
        };

        function onPuzzleClick(e){
            /* offset означает положение указателя мыши относительно целевого элемента
            (от левого края элемента до левего края контейнера (предка). clientX???*/
            if (e.clientX || e.clientX == 0) {
                mouse.x = e.clientX - canvas.offsetLeft; // корректируем положение мыши 
                mouse.y = e.clientY - canvas.offsetTop;
            } 
            mouse.x = e.pageX-canvas.offsetLeft;
            mouse.y  = e.pageY- canvas.offsetTop;

            currentPiece = checkPieceClicked(); // будем использовтаь позже, на какой кусочке был клик
            if(currentPiece != null){
                ctx.clearRect(currentPiece.xPos,currentPiece.yPos,pieceWidth,pieceHeight); // нужно очистить часть холста под картинкой, которую мы берем
                ctx.save(); //Прежде чем перерисовать его, мы хотим сохранить () контекст холста, прежде чем продолжить. Это гарантирует, что все, что мы рисуем после сохранения, не будет поверх чего-либо. 
                ctx.globalAlpha = 0.9;
                ctx.drawImage(img, currentPiece.sx, currentPiece.sy, pieceWidth, pieceHeight, mouse.x - (pieceWidth / 2), mouse.y - (pieceHeight / 2), pieceWidth, pieceHeight);
                ctx.restore(); //Теперь мы рисуем изображение так, чтобы его центр располагался у указателя мыши. Первые 5 параметров drawImage всегда будут одинаковыми во всем приложении. При щелчке следующие два параметра будут обновлены, чтобы центрироваться по указателю мыши. Последние два параметра, ширина и высота для рисования, также никогда не изменятся.Наконец, мы вызываем метод restore (). По сути это означает, что мы закончили с использованием нового альфа-значения и хотим восстановить все свойства туда, где они были. Чтобы завершить эту функцию, мы добавим еще двух слушателей. Один для того, когда мы перемещаем мышь (перетаскивая часть головоломки), и один для того, когда мы отпускаем (опускаем часть головоломки).
                document.onmousemove = updatePuzzle;
                document.onmouseup = pieceDropped;
            }
        }

        function checkPieceClicked(){
            var piece;
            for(var i = 0;i < pieces.length; i++) {
                piece = pieces[i];
                if (!(mouse.x < piece.xPos || mouse.x > (piece.xPos + pieceWidth) || mouse.y < piece.yPos || mouse.y > (piece.yPos + pieceHeight))) {  //проверяем был ли клик в наших пределах
                    return piece;
                }
            }
        }
        function updatePuzzle(e){ //  обновляем , когда юзер перемещает част картинки ( dragging)
            currentDropPiece = null; //Нам нужно сбросить это значение на ноль при обновлении из-за вероятности, что наш кусок был перетащен обратно к себе домой. Мы не хотим, чтобы предыдущее значение currentDropPiece оставалось без изменений.
            if(e.clientX || e.clientX == 0){
                mouse.x = e.clientX - canvas.offsetLeft;
                mouse.y = e.clientY - canvas.offsetTop;
            } 
                mouse.x = e.pageX-canvas.offsetLeft; //от тек.края страницы  - до левого края эл до ближ.предка
                mouse.y  = e.pageY- canvas.offsetTop;

            ctx.clearRect(0,0,puzzleWidth,puzzleHeight); //нужно очистить холст, т.к. на нем будет перерисовка полсе перемещения
            var piece;
            for(var i = 0;i < pieces.length;i++){
                piece = pieces[i];
                if(piece == currentPiece){
                    continue;
                } // проверяем совпадает ли часть, на которую мы ссылаемся с частью, которую мы перетаскиваем, 
                    //если так, продолжаем
                ctx.drawImage(img, piece.sx, piece.sy, pieceWidth, pieceHeight, piece.xPos, piece.yPos, pieceWidth, pieceHeight);
                ctx.strokeRect(piece.xPos, piece.yPos, pieceWidth,pieceHeight);
                /*?  мышь находится в середине перетаскиваемой части,что нам нужно сделать, это определить, над какой 
                другой частью находится наша мышь. Затем использ. функцию checkPieceClicked (), чтобы определить, 
                находится ли мышь над текущим объектом в цикле. Если это так, мы устанавливаем переменную
                 currentDropPiece и рисуем закрашенный прямоугольник над частью головоломки, указывая, 
                 что теперь она является целью отбрасывания. 
                надо сохранить () и восстановить (). */
                if(currentDropPiece == null){
                    if (!(mouse.x < piece.xPos || mouse.x > (piece.xPos + pieceWidth) || mouse.y < piece.yPos || mouse.y > (piece.yPos + pieceHeight))) {
                    
                        currentDropPiece = piece;
                        ctx.save();
                        ctx.globalAlpha = 0.4;
                        ctx.fillStyle = puzzleHover;
                        ctx.fillRect(currentDropPiece.xPos,currentDropPiece.yPos,pieceWidth, pieceHeight);
                        ctx.restore();
                    }
                }
            } 
            ctx.save();
            ctx.globalAlpha =0.6;
            ctx.drawImage(img, currentPiece.sx, currentPiece.sy, pieceWidth, pieceHeight, mouse.x - (pieceWidth / 2), mouse.y - (pieceHeight / 2), pieceWidth, pieceHeight);
            ctx.restore();
            ctx.strokeRect( mouse.x - (pieceWidth / 2), mouse.y - (pieceHeight / 2), pieceWidth,pieceHeight); //// нам нужно перерисовать перетянутый кусок. Код такой же, как и при первом щелчке по нему, но мышь переместилась, поэтому его положение будет обновлено.
        }
        /*сначала сразу удалим слушателей, так как ничего не перетаскиваем.
        Затем проверка, что currentDropPiece не является нулевым. Если это так, это означает, 
        что мы перетащили его обратно в область канваса. Если это не ноль, 
        мы продолжаем с функцией.меняем местами xPos и ​​yPos каждого элемента. 
        делаем быстрый временный объект как буфер для хранения одного из значений объекта в процессе обмена. 
        На этом этапе обе части имеют новые значения xPos и ​​yPos и ​​будут привязаны к своим новым положения
         на следующем шаге. */
        function pieceDropped(){ //!! Происходит обмен кусочками картинки
            document.onmousemove = null;
            document.onmouseup = null;
            if (currentDropPiece != null){ //currentDropPiece
                var memoryPiece = {xPos:currentPiece.xPos,yPos:currentPiece.yPos};
                console.log(memoryPiece)
                currentPiece.xPos = currentDropPiece.xPos;
                console.log (currentPiece.xPos,currentPiece.yPos)
                currentPiece.yPos = currentDropPiece.yPos;
                currentDropPiece.xPos = memoryPiece.xPos; // картинке, на место которой ложим новую картинку присваиваем положение картинки, которую подняли!!!
                currentDropPiece.yPos = memoryPiece.yPos;
                console.log (currentDropPiece.xPos,currentDropPiece.yPos);
            }
            resetPuzzleAndCheckWin();
        }

        function resetPuzzleAndCheckWin(){ //проверяем, совпадают ли  sx и sy с xPos и ​​yPos. Если нет, то не сможем победить в пазле, и установим для gameWin значение false.
            ctx.clearRect(0,0,puzzleWidth,puzzleHeight);
            var gameWin = true;
            var piece;
            for(var i = 0;i < pieces.length;i++){
                piece = pieces[i];
                ctx.drawImage(img, piece.sx, piece.sy, pieceWidth, pieceHeight, piece.xPos, piece.yPos, pieceWidth, pieceHeight);
                ctx.strokeRect(piece.xPos, piece.yPos, pieceWidth,pieceHeight);
                if(piece.xPos != piece.sx || piece.yPos != piece.sy){
                    gameWin = false;
                    //clearInterval(timer);
                }
            }
            if(gameWin){
                timeBack =  `${60-count} sec `; // сколько времени ушло для того, чтобы собрать паззл
                console.log(timeBack);
                window.localStorage.setItem('time',timeBack);
                clearInterval(timer);
                if (count<0) { count = 60;}
                document.getElementById('btn').onmousedown = shufflePuzzle;
                    
                 // clearInterval(timer);
                setTimeout(gameOver,1000);
                //document.location.reload();
            }
        }
            /*var t = window.localStorage.setItem('time',timeBack);
            
            var user = {
            name: window.localStorage.getItem("login"),
            time: window.localStorage.getItem('time')
        
            };

            window.localStorage.setItem("user2", JSON.stringify(user));
            var savedUser2 = JSON.parse(window.localStorage.getItem("user2"));
            console.log(savedUser2.name + " " +" " + savedUser2.time +" "); // */
        function gameOver(){
            document.onmousedown = null;
            document.onmousemove = null;
            document.onmouseup = null;
            initPuzzle();
        }
        function shuffleArray(arrPieces){ // генерация случайной неповторяющейся картинки через деструктуризацию. Суть заключается в том, чтобы проходить по массиву в обратном порядке и менять местами каждый элемент со случайным элементом, который находится перед ним.
            for (var j, x, i = arrPieces.length; i; j = parseInt ( Math.random() * i ) , x = arrPieces[--i], arrPieces[i] = arrPieces[j], arrPieces[j] = x);
            return arrPieces;
        }
        /*Тасование Фишера–Йетса в варианте Дуршенфельда является тасованием на месте. 
        То есть, при задании заполненного массива, он тасует элементы в том же массиве, 
        а не создает копию массива с переставленными элементами.*/
    