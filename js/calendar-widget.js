/* ============================================================
   Delfosse Properties — Widget calendrier (client)
   ============================================================
   Affiche un calendrier visuel des disponibilites pour un
   appartement, en fetchant /api/calendar?id=XX.

   Usage HTML :
     <div data-dp-calendar="01" data-airbnb-url="https://www.airbnb.fr/rooms/..."></div>

   Le data-airbnb-url est utilise pour le CTA "Reserver sur Airbnb".

   Auto-init : tous les elements [data-dp-calendar] sont detectes
   au DOMContentLoaded.
   ============================================================ */
(function () {
  'use strict';

  const MONTH_NAMES_FR = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  const MONTH_NAMES_EN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const WEEKDAYS_FR = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];
  const WEEKDAYS_EN = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

  function isEN() {
    return (document.documentElement.lang || 'fr').toLowerCase().startsWith('en');
  }
  function t(key) {
    const T = {
      title:        ['Calendrier · Disponibilités','Calendar · Availability'],
      status_loading: ['Chargement…','Loading…'],
      status_live:   ['Live · synchronisé avec Airbnb','Live · synced with Airbnb'],
      status_error:  ['Calendrier indisponible','Calendar unavailable'],
      legend_avail:  ['Disponible','Available'],
      legend_booked: ['Réservé','Booked'],
      legend_today:  ['Aujourd\'hui','Today'],
      cta:           ['Voir les disponibilités précises sur Airbnb','See exact availability on Airbnb'],
      error_msg:     ['Le calendrier sera disponible bientôt. En attendant, consultez les dates sur Airbnb.','Calendar coming soon. Meanwhile, check availability on Airbnb.'],
      prev_aria:     ['Mois précédent','Previous month'],
      next_aria:     ['Mois suivant','Next month'],
    };
    return T[key][isEN() ? 1 : 0];
  }

  class DPCalendar {
    constructor(el) {
      this.el = el;
      this.aptId = el.getAttribute('data-dp-calendar') || '01';
      this.airbnbUrl = el.getAttribute('data-airbnb-url') || '#';
      // Etat
      this.now = new Date();
      this.viewMonth = new Date(this.now.getFullYear(), this.now.getMonth(), 1);
      this.bookedRanges = [];   // array de { start: Date, end: Date }
      this.loading = true;
      this.error = false;
      // Render initial (loading)
      this.renderLoading();
      this.fetchData();
    }

    async fetchData() {
      try {
        const res = await fetch('/api/calendar?id=' + encodeURIComponent(this.aptId));
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        // Parse les events en Date objects
        this.bookedRanges = (data.events || []).map(e => ({
          start: this.parseISO(e.start),
          end: this.parseISO(e.end),    // end est exclusif selon RFC 5545
          summary: e.summary || '',
        })).filter(r => r.start && r.end);
        this.loading = false;
        this.render();
      } catch (err) {
        console.warn('[dp-calendar]', this.aptId, err);
        this.loading = false;
        this.error = true;
        this.renderError();
      }
    }

    parseISO(s) {
      if (!s) return null;
      const [y, m, d] = s.split('-').map(Number);
      return new Date(y, m - 1, d);
    }

    isBooked(date) {
      // Verifie si une date donnee tombe dans une plage reservee
      for (const r of this.bookedRanges) {
        // end est exclusif : date doit etre >= start et < end
        if (date >= r.start && date < r.end) return true;
      }
      return false;
    }

    isPast(date) {
      const today = new Date();
      today.setHours(0,0,0,0);
      return date < today;
    }

    isToday(date) {
      const today = new Date();
      return date.getFullYear() === today.getFullYear() &&
             date.getMonth() === today.getMonth() &&
             date.getDate() === today.getDate();
    }

    renderLoading() {
      this.el.innerHTML = '<div class="dp-cal-loading">' + t('status_loading') + '</div>';
    }

    renderError() {
      this.el.innerHTML = `
        <div class="dp-cal-head">
          <span class="dp-cal-title">${t('title')}</span>
          <span class="dp-cal-status">${t('status_error')}</span>
        </div>
        <div class="dp-cal-error">
          ${t('error_msg')}
        </div>
        <div class="dp-cal-cta">
          <a href="${this.airbnbUrl}" target="_blank" rel="noopener" class="btn">${t('cta')} →</a>
        </div>
      `;
    }

    render() {
      const m1 = new Date(this.viewMonth);
      const m2 = new Date(this.viewMonth.getFullYear(), this.viewMonth.getMonth() + 1, 1);

      const html = `
        <div class="dp-cal-head">
          <span class="dp-cal-title">${t('title')}</span>
          <span class="dp-cal-status">${t('status_live')}</span>
        </div>

        <div class="dp-cal-grid">
          ${this.renderMonth(m1, true)}
          ${this.renderMonth(m2, false)}
        </div>

        <div class="dp-cal-legend">
          <span class="dp-cal-legend-item">
            <span class="dp-cal-legend-swatch available"></span>${t('legend_avail')}
          </span>
          <span class="dp-cal-legend-item">
            <span class="dp-cal-legend-swatch booked"></span>${t('legend_booked')}
          </span>
          <span class="dp-cal-legend-item">
            <span class="dp-cal-legend-swatch today"></span>${t('legend_today')}
          </span>
        </div>

        <div class="dp-cal-cta">
          <a href="${this.airbnbUrl}" target="_blank" rel="noopener" class="btn">${t('cta')} →</a>
        </div>
      `;
      this.el.innerHTML = html;

      // Bind nav buttons
      this.el.querySelectorAll('[data-nav]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const dir = btn.getAttribute('data-nav') === 'next' ? 1 : -1;
          this.viewMonth = new Date(
            this.viewMonth.getFullYear(),
            this.viewMonth.getMonth() + dir,
            1
          );
          this.render();
        });
      });
    }

    renderMonth(monthDate, showNavPrev) {
      const year = monthDate.getFullYear();
      const month = monthDate.getMonth();
      const monthNames = isEN() ? MONTH_NAMES_EN : MONTH_NAMES_FR;
      const weekdays = isEN() ? WEEKDAYS_EN : WEEKDAYS_FR;

      // Premier jour du mois (0 = dim, 1 = lun en JS, on veut lun=0)
      const firstDayJs = new Date(year, month, 1).getDay();
      const firstDayMon0 = (firstDayJs + 6) % 7;  // shift : lun=0, dim=6
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      // Cellules vides au debut
      let cells = '';
      for (let i = 0; i < firstDayMon0; i++) {
        cells += '<div class="dp-cal-day empty"></div>';
      }
      // Cellules des jours
      for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month, d);
        const classes = ['dp-cal-day'];
        if (this.isPast(date)) classes.push('past');
        else if (this.isBooked(date)) classes.push('booked');
        else classes.push('available');
        if (this.isToday(date)) classes.push('today');
        cells += `<div class="${classes.join(' ')}">${d}</div>`;
      }

      // Header du mois avec nav (prev sur premier mois uniquement, next sur dernier)
      const isPrevAllowed = monthDate.getFullYear() > this.now.getFullYear() ||
                            (monthDate.getFullYear() === this.now.getFullYear() && monthDate.getMonth() > this.now.getMonth());

      const nav = showNavPrev ? `
        <div class="nav">
          <button type="button" class="dp-cal-month-nav-btn" data-nav="prev"
                  aria-label="${t('prev_aria')}" ${isPrevAllowed ? '' : 'disabled'}>‹</button>
        </div>
      ` : `
        <div class="nav">
          <button type="button" class="dp-cal-month-nav-btn" data-nav="next"
                  aria-label="${t('next_aria')}">›</button>
        </div>
      `;

      return `
        <div class="dp-cal-month">
          <div class="dp-cal-month-head">
            <span>${monthNames[month]} ${year}</span>
            ${nav}
          </div>
          <div class="dp-cal-weekdays">
            ${weekdays.map(w => `<span class="dp-cal-weekday">${w}</span>`).join('')}
          </div>
          <div class="dp-cal-days">
            ${cells}
          </div>
        </div>
      `;
    }
  }

  function init() {
    document.querySelectorAll('[data-dp-calendar]').forEach(el => {
      if (!el.dataset.dpCalendarInit) {
        new DPCalendar(el);
        el.dataset.dpCalendarInit = '1';
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose pour re-trigger si besoin
  window.DPCalendar = { init };
})();
