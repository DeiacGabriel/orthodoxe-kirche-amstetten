// Orthodoxer Rumänischer Kalender
class OrthodoxCalendar {
    constructor() {
        this.currentDate = new Date();
        this.displayDate = new Date();
        this.monthNames = [
            'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
            'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
        ];
        this.dayNames = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică'];
        
        this.orthodoxEvents = this.initOrthodoxEvents();
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderCalendar();
        this.renderEvents();
    }

    bindEvents() {
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.previousMonth();
        });
        
        document.getElementById('nextMonth').addEventListener('click', () => {
            this.nextMonth();
        });
    }

    initOrthodoxEvents() {
        return {
            // Feste Feiertage (Datum)
            '01-01': { title: 'Circumcizia Domnului', type: 'feast', description: 'Beschneidung des Herrn' },
            '01-06': { title: 'Boboteaza', type: 'feast', description: 'Epiphanie - Taufe des Herrn' },
            '01-07': { title: 'Soborul Sf. Ioan Botezătorul', type: 'saint', description: 'Synaxis des Hl. Johannes des Täufers' },
            '01-30': { title: 'Sfinții Trei Ierarhi', type: 'saint', description: 'Die Drei Heiligen Hierarchen' },
            
            '02-02': { title: 'Întâmpinarea Domnului', type: 'feast', description: 'Mariä Lichtmess' },
            
            '03-25': { title: 'Buna Vestire', type: 'feast', description: 'Mariä Verkündigung' },
            
            '04-23': { title: 'Sf. Gheorghe', type: 'saint', description: 'Heiliger Georg' },
            
            '05-21': { title: 'Sf. Constantin și Elena', type: 'saint', description: 'Heilige Konstantin und Helena' },
            
            '06-24': { title: 'Nașterea Sf. Ioan Botezătorul', type: 'saint', description: 'Geburt Johannes des Täufers' },
            '06-29': { title: 'Sf. Petru și Pavel', type: 'saint', description: 'Heilige Petrus und Paulus' },
            
            '08-06': { title: 'Schimbarea la Față', type: 'feast', description: 'Verklärung des Herrn' },
            '08-15': { title: 'Adormirea Maicii Domnului', type: 'feast', description: 'Mariä Himmelfahrt' },
            '08-29': { title: 'Tăierea Capului Sf. Ioan', type: 'saint', description: 'Enthauptung Johannes des Täufers' },
            
            '09-08': { title: 'Nașterea Maicii Domnului', type: 'feast', description: 'Mariä Geburt' },
            '09-14': { title: 'Înălțarea Sfintei Cruci', type: 'feast', description: 'Kreuzerhöhung' },
            
            '10-01': { title: 'Acoperământul Maicii Domnului', type: 'feast', description: 'Schutz der Gottesmutter' },
            '10-14': { title: 'Sf. Parascheva', type: 'saint', description: 'Heilige Parascheva' },
            '10-26': { title: 'Sf. Dumitru', type: 'saint', description: 'Heiliger Demetrius' },
            
            '11-08': { title: 'Soborul Sf. Arhanghel Mihail', type: 'saint', description: 'Synaxis des Erzengels Michael' },
            '11-21': { title: 'Intrarea în Biserică', type: 'feast', description: 'Mariä Opferung' },
            '11-30': { title: 'Sf. Apostol Andrei', type: 'saint', description: 'Heiliger Apostel Andreas' },
            
            '12-06': { title: 'Sf. Nicolae', type: 'saint', description: 'Heiliger Nikolaus' },
            '12-25': { title: 'Nașterea Domnului', type: 'feast', description: 'Weihnachten - Geburt Christi' },
            '12-26': { title: 'Soborul Maicii Domnului', type: 'feast', description: 'Synaxis der Gottesmutter' },
            '12-27': { title: 'Sf. Ștefan', type: 'saint', description: 'Heiliger Stephanus' }
        };
    }

    getMovableFeast(year) {
        // Berechnung des orthodoxen Osterdatums (julianischer Kalender)
        const easter = this.calculateOrthodoxEaster(year);
        
        return {
            [`${easter.getMonth() + 1}-${easter.getDate()}`]: {
                title: 'Învierea Domnului',
                type: 'feast',
                description: 'Ostern - Auferstehung Christi'
            }
        };
    }

    calculateOrthodoxEaster(year) {
        // Vereinfachte Berechnung für orthodoxes Ostern
        // Für eine exakte Berechnung wäre eine komplexere Algorithmus nötig
        const a = year % 4;
        const b = year % 7;
        const c = year % 19;
        const d = (19 * c + 15) % 30;
        const e = (2 * a + 4 * b - d + 34) % 7;
        const month = Math.floor((d + e + 114) / 31);
        const day = ((d + e + 114) % 31) + 1;
        
        // Für orthodoxes Ostern +13 Tage (Julianischer Kalender Unterschied)
        let easterDate = new Date(year, month - 1, day + 13);
        return easterDate;
    }

    previousMonth() {
        this.displayDate.setMonth(this.displayDate.getMonth() - 1);
        this.renderCalendar();
        this.renderEvents();
    }

    nextMonth() {
        this.displayDate.setMonth(this.displayDate.getMonth() + 1);
        this.renderCalendar();
        this.renderEvents();
    }

    renderCalendar() {
        const year = this.displayDate.getFullYear();
        const month = this.displayDate.getMonth();
        
        // Update Monat/Jahr Anzeige
        document.getElementById('monthYear').textContent = 
            `${this.monthNames[month]} ${year}`;

        // Kalender Grid leeren (außer Headers)
        const grid = document.querySelector('.calendar-grid');
        const dayHeaders = grid.querySelectorAll('.day-header');
        grid.innerHTML = '';
        
        // Headers wieder hinzufügen
        dayHeaders.forEach(header => grid.appendChild(header));

        // Ersten Tag des Monats finden
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        // Montag als erster Tag der Woche (0 = Sonntag, 1 = Montag, etc.)
        let startDay = firstDay.getDay();
        startDay = startDay === 0 ? 6 : startDay - 1; // Sonntag = 6, Montag = 0

        // Tage des vorherigen Monats
        for (let i = startDay - 1; i >= 0; i--) {
            const day = new Date(firstDay.getTime() - (i + 1) * 24 * 60 * 60 * 1000);
            this.createDayElement(day, true);
        }

        // Tage des aktuellen Monats
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(year, month, day);
            this.createDayElement(date, false);
        }

        // Tage des nächsten Monats (um das Grid zu füllen)
        const totalCells = grid.children.length - 7; // Minus die Header
        const remainingCells = 42 - totalCells; // 6 Wochen * 7 Tage = 42
        
        for (let day = 1; day <= remainingCells; day++) {
            const date = new Date(year, month + 1, day);
            this.createDayElement(date, true);
        }
    }

    createDayElement(date, isOtherMonth) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        if (isOtherMonth) {
            dayElement.classList.add('other-month');
        }
        
        // Heute markieren
        if (this.isSameDay(date, this.currentDate)) {
            dayElement.classList.add('today');
        }

        // Tag Nummer
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = date.getDate();
        dayElement.appendChild(dayNumber);

        // Events für diesen Tag
        const events = this.getEventsForDate(date);
        if (events.length > 0) {
            dayElement.classList.add('has-event');
            
            const eventsContainer = document.createElement('div');
            eventsContainer.className = 'day-events';
            
            events.forEach(event => {
                const eventDot = document.createElement('div');
                eventDot.className = 'event-dot';
                eventsContainer.appendChild(eventDot);
            });
            
            dayElement.appendChild(eventsContainer);
        }

        document.querySelector('.calendar-grid').appendChild(dayElement);
    }

    getEventsForDate(date) {
        const dateKey = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        const events = [];
        
        if (this.orthodoxEvents[dateKey]) {
            events.push(this.orthodoxEvents[dateKey]);
        }
        
        // Bewegliche Feste hinzufügen
        const movableFeasts = this.getMovableFeast(date.getFullYear());
        if (movableFeasts[dateKey]) {
            events.push(movableFeasts[dateKey]);
        }
        
        return events;
    }

    renderEvents() {
        const eventsList = document.getElementById('eventsList');
        eventsList.innerHTML = '';
        
        const year = this.displayDate.getFullYear();
        const month = this.displayDate.getMonth();
        
        // Events für den aktuellen Monat sammeln
        const monthEvents = [];
        
        for (let day = 1; day <= new Date(year, month + 1, 0).getDate(); day++) {
            const date = new Date(year, month, day);
            const events = this.getEventsForDate(date);
            
            events.forEach(event => {
                monthEvents.push({
                    date: date,
                    ...event
                });
            });
        }
        
        // Events sortieren und anzeigen
        monthEvents.sort((a, b) => a.date - b.date);
        
        monthEvents.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.className = `event-item ${event.type}-day`;
            
            eventElement.innerHTML = `
                <div class="event-date">${event.date.getDate()}. ${this.monthNames[event.date.getMonth()]}</div>
                <div class="event-title">${event.title}</div>
                <div class="event-description">${event.description}</div>
            `;
            
            eventsList.appendChild(eventElement);
        });
        
        if (monthEvents.length === 0) {
            eventsList.innerHTML = '<p>Keine besonderen Feiertage in diesem Monat.</p>';
        }
    }

    isSameDay(date1, date2) {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    }
}

// Kalender initialisieren wenn die Seite geladen ist
document.addEventListener('DOMContentLoaded', () => {
    new OrthodoxCalendar();
});