# Holiday Extras Search URL — Integration Guide

This documents how to build a valid search URL for Holiday Extras car parking, based on the working implementation in `searchParking()` (`index.html` ~line 1604).

---

## Working URL Template

```
https://www.holidayextras.com/static/?Referer=https%3A%2F%2Fwww.holidayextras.com%2F&agent=WEB1&domain=www.holidayextras.com&lang=en&product=cp&request=1&rule_set=hx&selectProduct=cp&tc=1&search=&Location={LOCATION}&Arrival={ARRIVAL_HUMAN}&ArrivalDate={ARRIVAL_DATE}&ArrivalTime={ARRIVAL_TIME}&Depart={DEPART_HUMAN}&DepartDate={DEPART_DATE}&DepartTime={DEPART_TIME}&flightTime=&flight_number=default&terminal=&CampaignID=65642
```

---

## Parameter Reference

### Fixed / Boilerplate
| Param | Value | Notes |
|---|---|---|
| `Referer` | `https%3A%2F%2Fwww.holidayextras.com%2F` | URL-encoded, always this value |
| `agent` | `WEB1` | |
| `domain` | `www.holidayextras.com` | |
| `lang` | `en` | |
| `product` | `cp` | cp = car park |
| `request` | `1` | |
| `rule_set` | `hx` | |
| `selectProduct` | `cp` | |
| `tc` | `1` | |
| `search` | *(empty)* | |
| `flightTime` | *(empty)* | |
| `flight_number` | `default` | |
| `terminal` | *(empty)* | |
| `CampaignID` | `65642` | Affiliate/partner ID — do not change |

### Dynamic Parameters
| Param | Example | Description |
|---|---|---|
| `Location` | `LHR` | IATA airport code (see list below) |
| `ArrivalDate` | `28%2F03%2F26` | Drop-off date: DD/MM/YY, URL-encoded (`/` → `%2F`) |
| `ArrivalTime` | `1300` | Drop-off hour as HHMM (whole hours only, e.g. 13:00 → `1300`) |
| `Arrival` | `Sat+28th+Mar+26` | Drop-off date human-readable, `+` as space separator |
| `DepartDate` | `04%2F04%2F26` | Return date: DD/MM/YY, URL-encoded |
| `DepartTime` | `1400` | Return hour as HHMM |
| `Depart` | `Sat+4th+Apr+26` | Return date human-readable |

---

## Critical Naming Trap

Holiday Extras uses **car park** terminology, not traveller terminology:

| HX Param | Means | Your variable |
|---|---|---|
| `Arrival` / `ArrivalDate` / `ArrivalTime` | When the car **arrives** at the car park (drop-off, outbound) | `dropoffDate` / `dropoffTime` |
| `Depart` / `DepartDate` / `DepartTime` | When the car **departs** the car park (pick-up, return) | `returnDate` / `returnTime` |

Getting these swapped will produce results for the wrong dates.

---

## JavaScript Format Helpers

```js
// DD/MM/YY URL-encoded → "28%2F03%2F26"
function toDDMMYY(d) {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(2);
    return encodeURIComponent(`${day}/${month}/${year}`);
}

// Human date with + separators → "Sat+28th+Mar+26"
function toHumanDate(d) {
    const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const day = d.getDate();
    const suffix = ['th','st','nd','rd'][day % 10 > 3 ? 0 : (day % 100 - day % 10 !== 10) * day % 10];
    return `${DAY_NAMES[d.getDay()]}+${day}${suffix}+${MONTH_NAMES[d.getMonth()]}+${String(d.getFullYear()).slice(2)}`;
}

// Hour integer to HHMM → 13 → "1300"
function toHHMM(h) {
    return `${String(h).padStart(2, '0')}00`;
}
```

---

## Supported Airport Codes

These are the airports currently used in the game. Holiday Extras supports more.

| IATA | Airport |
|---|---|
| `LHR` | London Heathrow |
| `LGW` | London Gatwick |
| `STN` | London Stansted |
| `LTN` | London Luton |
| `MAN` | Manchester |
| `BHX` | Birmingham |

---

## URL Path — Important

- **Correct:** `https://www.holidayextras.com/static/?...`
- **Wrong:** `https://www.holidayextras.com/en/static/?...` — will not work
- **Wrong:** `https://www.holidayextras.com/#/categories?...` — old hash-based format, broken

---

## Minimum Required Fields for a Valid Search

A search will fail or misbehave without:
1. `Location` — a valid IATA code
2. `ArrivalDate` + `ArrivalTime` — drop-off date/time
3. `DepartDate` + `DepartTime` — return date/time
4. `Arrival` + `Depart` — human-readable counterparts (required alongside dates)
5. `CampaignID` — must be `65642`

---

## Dev Setup

- Single-file app: `index.html`
- Served via: `npx http-server . -p 8080 -c-1`
- Preview config: `.claude/launch.json` (server name: `parkquest`)
- Remote: `https://github.com/matthewpack/parkquest.git` (also deployed to Heroku via `heroku` remote)
