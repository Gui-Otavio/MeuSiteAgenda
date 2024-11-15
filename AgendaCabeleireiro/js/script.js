let currentYear = 2024;
let currentMonth = 0; // Janeiro

const yearElement = document.getElementById("year");
const monthElement = document.getElementById("month-name");
const daysContainer = document.getElementById("calendar-days");

const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

// Variáveis para armazenar dados do calendário e agendamentos
let selectedDate = '';
let bookings = JSON.parse(localStorage.getItem('bookings')) || {};

// Atualiza o ano exibido
function updateYear() {
    yearElement.textContent = currentYear;
}

// Muda o ano com as setinhas
function changeYear(direction) {
    const newYear = currentYear + direction;

    // Limita o ano entre 2024 e 2026
    if (newYear >= 2024 && newYear <= 2026) {
        currentYear = newYear;
        updateYear();
        renderCalendar();
    }
}

// Atualiza o mês exibido
function updateMonth() {
    monthElement.textContent = monthNames[currentMonth];
}

// Muda o mês com as setinhas
function changeMonth(direction) {
    currentMonth += direction;

    if (currentMonth < 0) {
        currentMonth = 11;
        changeYear(-1);
    } else if (currentMonth > 11) {
        currentMonth = 0;
        changeYear(1);
    }

    updateMonth();
    renderCalendar();
}

// Renderiza os dias do mês atual
function renderCalendar() {
    daysContainer.innerHTML = ""; // Limpa os dias anteriores

    // Obtém o número de dias no mês
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement("div");
        dayElement.className = "day";
        dayElement.textContent = day;

        // Adiciona evento de clique para abrir o modal de agendamento
        dayElement.onclick = () => openBookingModal(currentYear, currentMonth, day);

        // Marca o dia atual, se for o mês e ano atual
        const today = new Date();
        if (
            day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear()
        ) {
            dayElement.classList.add("today");
        }

        // Exibe o nome do cliente se houver agendamento
        const dateKey = `${currentYear}-${currentMonth + 1}-${day}`;
        if (bookings[dateKey]) {
            dayElement.style.backgroundColor = '#ccc'; // Marca o dia com agendamento
            dayElement.title = `Agendado: ${bookings[dateKey].join(', ')}`;
        }

        daysContainer.appendChild(dayElement);
    }
}

// Abre o modal de agendamento para o dia selecionado
function openBookingModal(year, month, day) {
    selectedDate = `${year}-${month + 1}-${day}`;
    const modal = document.getElementById('booking-modal');
    const availableTimes = document.getElementById('available-times');
    
    // Exibe os horários disponíveis
    availableTimes.innerHTML = '';
    for (let hour = 8; hour <= 18; hour++) {
        const timeSlot = document.createElement('div');
        timeSlot.textContent = `${hour}:00`;
        timeSlot.className = 'time-slot';
        
        // Se já houver um agendamento nesse horário, marca como "indisponível"
        const booked = bookings[selectedDate] && bookings[selectedDate].includes(`${hour}:00`);
        if (booked) {
            timeSlot.style.textDecoration = 'line-through';
        } else {
            timeSlot.onclick = () => selectTimeSlot(`${hour}:00`);
        }

        availableTimes.appendChild(timeSlot);
    }

    modal.style.display = 'block'; // Exibe o modal
}

// Fecha o modal de agendamento
function closeModal() {
    const modal = document.getElementById('booking-modal');
    modal.style.display = 'none';
}

// Salva o agendamento
function saveBooking() {
    const clientName = document.getElementById('client-name').value;
    if (!clientName) {
        alert('Por favor, insira o nome do cliente!');
        return;
    }

    // Salva o agendamento no localStorage
    if (!bookings[selectedDate]) {
        bookings[selectedDate] = [];
    }
    bookings[selectedDate].push(selectedTime);
    localStorage.setItem('bookings', JSON.stringify(bookings));

    // Atualiza o calendário com os agendamentos
    renderCalendar();

    closeModal();
}

// Função para selecionar o horário
function selectTimeSlot(time) {
    selectedTime = time;
    const timeSlots = document.querySelectorAll('.time-slot');
    timeSlots.forEach(slot => {
        if (slot.textContent === time) {
            slot.style.backgroundColor = '#4CAF50';
            slot.style.color = '#fff';
        } else {
            slot.style.backgroundColor = '';
            slot.style.color = '';
        }
    });
}

// Inicializa o calendário com o ano e mês atuais
updateYear();
updateMonth();
renderCalendar();