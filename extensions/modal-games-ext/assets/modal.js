document.addEventListener('DOMContentLoaded', function () {
    const modal = document.createElement('div');
    modal.id = 'myModal';
    modal.className = 'modal';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    const closeBtn = document.createElement('span');
    closeBtn.className = 'close';
    closeBtn.innerHTML = '&times;';

    const contentParagraph = document.createElement('p');
    contentParagraph.textContent = 'Модальное окно появляется спустя 5 секунд!';

    const customButton = document.createElement('button');
    customButton.textContent = 'Нажми меня!!!!';


    customButton.addEventListener('click', function () {
        // alert(transporter.sendMail(mailOptions));
        // helloWorld();
    });

    modalContent.appendChild(closeBtn);
    modalContent.appendChild(contentParagraph);
    modalContent.appendChild(customButton); 
    modal.appendChild(modalContent);

    document.body.appendChild(modal);

    setTimeout(function () {
        modal.style.display = 'block';
    }, 5000);

    closeBtn.addEventListener('click', function () {
        modal.style.display = 'none';
    });
});
