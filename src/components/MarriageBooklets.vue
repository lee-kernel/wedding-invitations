<template>
  <div class="marriage-booklets">
    <svg viewBox="0 0 280 170" role="img" aria-label="一对手绘红色结婚证，寓意携手共度余生">
      <path d="M34 146q99 16 210-3" fill="none" stroke="#f5e2e8" stroke-width="9" stroke-linecap="round" />
      <g transform="translate(48 23) rotate(-12 48 63)">
        <path d="M4 9Q2 3 11 3L88 5Q96 5 95 14L93 124Q93 132 84 131L8 129Q1 128 2 119Z" fill="#f8dde5" stroke="#ad526c" stroke-width="2" />
        <path d="M8 1Q5-1 4 8L3 119Q3 125 10 125L91 127Q97 126 97 119L99 9Q99 2 91 2Z" fill="#c96b83" stroke="#963c57" stroke-width="2.5" stroke-linejoin="round" />
        <path d="M12 7 10 117M18 11l72 1-2 104-71-1" fill="none" stroke="#f5c2b2" stroke-width="1" opacity=".8" />
        <path d="M43 31C30 17 23 38 43 48 63 38 57 19 43 31Z" fill="none" stroke="#f8dba6" stroke-width="1.8" transform="translate(7 0)" />
        <text x="53" y="75" text-anchor="middle" class="book-title">结婚证</text>
        <path d="M37 90q15-3 31 0" fill="none" stroke="#efc89c" stroke-width="1" />
        <text x="53" y="106" text-anchor="middle" class="book-english">MARRIAGE</text>
      </g>
      <g transform="translate(139 31) rotate(11 48 63)">
        <path d="M4 9Q2 3 11 3L88 5Q96 5 95 14L93 124Q93 132 84 131L8 129Q1 128 2 119Z" fill="#f8dde5" stroke="#ad526c" stroke-width="2" />
        <path d="M8 1Q5-1 4 8L3 119Q3 125 10 125L91 127Q97 126 97 119L99 9Q99 2 91 2Z" fill="#b95370" stroke="#963c57" stroke-width="2.5" stroke-linejoin="round" />
        <path d="M12 7 10 117M18 11l72 1-2 104-71-1" fill="none" stroke="#f5c2b2" stroke-width="1" opacity=".8" />
        <path d="M43 31C30 17 23 38 43 48 63 38 57 19 43 31Z" fill="none" stroke="#f8dba6" stroke-width="1.8" transform="translate(7 0)" />
        <text x="53" y="75" text-anchor="middle" class="book-title">结婚证</text>
        <path d="M37 90q15-3 31 0" fill="none" stroke="#efc89c" stroke-width="1" />
        <text x="53" y="106" text-anchor="middle" class="book-english">MARRIAGE</text>
      </g>
      <g fill="none" stroke="#d58b9f" stroke-width="2" stroke-linecap="round">
        <path d="m30 42-9-5m12-6-3-9M249 99l9-4m-9 15 10 2M130 13l1-6m-5 4h10" />
        <path d="M136 27c-10-12-19 4 0 13 18-9 11-25 0-13Z" fill="#f4c8d6" stroke-width="1.5" />
      </g>
    </svg>
    <p>往后余生，持证同行。</p>
  </div>
</template>

<style scoped>
.marriage-booklets { grid-column: 1 / -1; margin-top: 20px; text-align: center; }
.marriage-booklets svg { display: block; width: clamp(190px, 34vw, 250px); height: auto; margin: auto; filter: drop-shadow(0 7px 10px #9c435a0b); }
.book-title { fill: #ffe0aa; font: 21px var(--hand); letter-spacing: 1px; }
.book-english { fill: #f3d0ad; font: 6px Georgia, serif; letter-spacing: 1.2px; }
.marriage-booklets p { margin: 10px 0 0; color: #b57e91; font: 12px/1.7 var(--sans); letter-spacing: .14em; }
</style>
