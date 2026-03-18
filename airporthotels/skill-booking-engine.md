# Booking Engine — Airport Hotels
## Source analysis: www.holidayextras.com/airport-hotels.html
## Captured: March 2026

---

## 1. SEARCH FORM (Homepage)

### Product tabs
Four tabs across the top of the search widget:
1. Airport Hotel & Parking (default) — hotel + parking package
2. Airport Hotels — room-only, no parking
3. Airport Lounges
4. Airport Parking

### Hotel & Parking form fields

| Field | Type | Options / Notes |
|-------|------|-----------------|
| Flying from | Dropdown | All UK airports (see full list below) |
| Staying in | Dropdown | Room type + occupancy (see room codes below) |
| Add another room | Link | Adds a second room selector |
| Hotel check in | Date picker | Label: "Hotel check in" |
| Stay on my return | Toggle link | Flips to return stay mode |
| Destination airport | Text input | e.g. "Tenerife" — where you are flying to |
| Choose a destination | Dropdown | Populated after text input |
| Collect car | Date picker | When you collect car on return |
| Search | CTA button | Purple, right-aligned |

### Airport codes (Flying from)
```
ABZ = Aberdeen
BHD = Belfast City (George Best)
BFS = Belfast International
BHX = Birmingham
BOH = Bournemouth
BRS = Bristol
CWL = Cardiff
DSA = Doncaster-Sheffield (Robin Hood)
DUB = Dublin
EMA = East Midlands
EDI = Edinburgh
EXT = Exeter
LGW = Gatwick
GLA = Glasgow International
PIK = Glasgow Prestwick
LHR = Heathrow
HUY = Humberside
LBA = Leeds Bradford
LPL = Liverpool
LCY = London City
LTN = Luton
MAN = Manchester
NCL = Newcastle
NWI = Norwich
SOU = Southampton
SEN = Southend
STN = Stansted
MME = Teesside International
```

### Room type codes
```
D20 = Double - 2 adults
TW2 = Twin - 2 adults
TW1C = Twin - 1 adult 1 child
S1 = Single - 1 adult
TR1C2 = Triple - 1 adult 2 children
TR2C1 = Triple - 2 adults 1 child
TR3 = Triple - 3 adults
FM1C3 = Family - 1 adult 3 children
FM2C2 = Family - 2 adults 2 children
FM2C3 = Family - 2 adults 3 children
FM3C1 = Family - 3 adults 1 child
FM3C2 = Family - 3 adults 2 children
```

---

## 2. SEARCH RESULTS PAGE

### URL structure
```
/static/?selectProduct=hcp&#/hotel_with_parking
  ?agent=WEB1
  &ppts=0
  &lang=en
  &depart={AIRPORT_CODE}     ← Flying from
  &terminal=                  ← Optional terminal
  &arrive=                    ← Optional destination
  &flight=default
  &in={YYYY-MM-DD}           ← Hotel check-in date
  &out={YYYY-MM-DD}          ← Car collect date
  &stay={YYYY-MM-DD}         ← Hotel stay date (= check-in)
  &room_1={ROOM_CODE}        ← Room type
  &room_2=                    ← Second room (if added)
  &sortCriterion=
  &sortOrder=
```

### Active filter chips (top of results)
Pill/chip buttons showing current search params:
- Airport name
- "(Add flight details)"
- "1 x Double room"
- "Stay before I fly"
- "Hotel Check-in Thu 19th Mar"
- "Until Thu 26th Mar"

### Sort buttons
Four sort options displayed as buttons:
1. **Recommended** (default, highlighted)
2. **Cheapest**
3. **Distance**
4. **Best Rated**

### Hotel result card structure
Each card contains:

```
[Hotel logo image — brand colour background]
[Badge text — e.g. "Free hotel shuttle" / "Short walk to terminal" / "Newly refurbished"]

[Star rating — e.g. ★★★★]

[Sub-nav tabs]: Map | Photos | Packages | Reviews
(sometimes also: Info | Video)

[Hotel name — h3]
[Distance badge]: "On the airport grounds" OR "X.X miles to the airport"
[EV charging icon — if available]

"Hotel packages from"
[Price — e.g. £171.60] [Rating badge — e.g. 7.9 Rating]

[Trust badges — pills]:
- Flextras: Free Cancellation
- Never Beaten on Price
- 15% Off Travel Insurance
- Late Return Cover (not always shown)
- Tried, Tested, Recommended
- The Extracare Guarantee

[Description — 1-2 sentences]

[Show Packages (N)] button — expands inline
OR
[Choose] button — single-package hotels
```

### Package accordion (expanded)
When "Show Packages (N)" is clicked, inline accordion opens below the card showing individual packages. Each package row shows:
- Package name (e.g. "Deluxe room with JetParks 3")
- Parking type + duration
- Total price
- Book button

---

## 3. HOTEL DETAIL MODAL

Clicking hotel name or Map/Photos/Reviews links opens a modal overlay:

```
[Hotel Name]
[Full address]

[Trust badge pills — same as on card]

[Tab bar]: Map | Photos | Transfers | Reviews | T&Cs | Help

[Tab content]:
  - Map: Interactive map showing hotel + terminals
  - Photos: Gallery of hotel images
  - Transfers: Shuttle/transport info
  - Reviews: Guest reviews with scores
  - T&Cs: Booking terms
  - Help: FAQ for this hotel
```

---

## 4. TRUST BADGE DEFINITIONS

| Badge | Meaning |
|-------|---------|
| Flextras: Free Cancellation | Free cancellation up to 24-48hrs before |
| Never Beaten on Price | Price match guarantee |
| 15% Off Travel Insurance | Discount on HX travel insurance |
| Late Return Cover | Cover if flight delayed on return |
| Tried, Tested, Recommended | HX quality approved |
| The Extracare Guarantee | If something goes wrong, HX sorts it |

---

## 5. IMPLEMENTATION FOR STATIC SITE

### Deep-link approach
For a static site, the search form can redirect to the HX booking engine using the URL structure above. Replace `agent=WEB1` with the correct affiliate agent code.

### Search form → Results URL builder
```javascript
function buildSearchURL(airport, checkin, collectDate, roomType, lang) {
  const base = 'https://www.holidayextras.com/static/?selectProduct=hcp&#/hotel_with_parking';
  const params = new URLSearchParams({
    agent: 'WEB1', // Replace with affiliate code
    ppts: '0',
    lang: lang || 'en',
    depart: airport,
    flight: 'default',
    in: checkin,
    out: collectDate,
    stay: checkin,
    room_1: roomType || 'D20'
  });
  return base + '?' + params.toString();
}
```

### Results page (on-site mockup)
Build a static results page that:
1. Reads URL params (airport, dates, room type)
2. Displays hotel cards for that airport (pre-populated JSON data)
3. Each "Book" button deep-links into HX engine with correct params
4. Sort by: Price / Distance / Rating (client-side JS sort)
5. Filter by: Distance from terminal, star rating, price range

### Hotel data JSON structure
```json
{
  "hotels": [
    {
      "id": "CLAYTON_MAN",
      "name": "Clayton",
      "airport": "MAN",
      "stars": 4,
      "rating": 7.9,
      "distance": "On the airport grounds",
      "distanceMiles": 0,
      "badge": "Free hotel shuttle",
      "description": "Ride the free 24-hour shuttle bus or walk to terminals. Dine and relax in the Grill Restaurant or Aviator Bar. Free wifi and gym. Spacious family rooms.",
      "priceFrom": 171.60,
      "image": "/images/hotels/clayton-man.jpg",
      "trust": ["free-cancellation", "price-match", "insurance", "recommended", "extracare"],
      "packages": [
        {
          "name": "Deluxe room with JetParks 3",
          "parking": "JetParks 3",
          "parkingDays": 8,
          "price": 171.60,
          "hxCode": "HMCLAYTONMAN01"
        }
      ]
    }
  ]
}
```

---

## 6. KEY UX PATTERNS TO REPLICATE

1. **Filter chips** — Show active search params as dismissable pills at top of results
2. **Sort buttons** — Horizontal group, one active state at a time
3. **Card accordion** — "Show Packages (N)" expands inline, doesn't navigate away
4. **Rating badge** — Green score badge, large number + decimal in smaller text
5. **Distance label** — "On the airport grounds" vs "X.X miles to the airport"
6. **Hotel photo header** — Brand colour background with logo, not a photo
7. **Trust badges** — Small pill badges, shown in sequence, toggle details on click
8. **Modal detail view** — Overlay with tabbed content (Map/Photos/Reviews etc.)
9. **Add another room** — Appends second room type selector to form
10. **Stay on my return** — Toggle that flips check-in to return journey

---

## 7. DESIGN TOKENS (from HX)

```css
--hx-purple: #5C2D91;
--hx-yellow: #FFC600;
--hx-green: #00A650;    /* Rating badges */
--hx-orange: #E8590C;   /* Featured hotel banners */
--hx-blue: #0066CC;     /* Links */
--hx-text: #1A1A1A;
--hx-border: #E0E0E0;
--hx-card-radius: 8px;
```

NOTE: airporthotels.co.uk uses navy/gold brand colours, not HX purple/yellow.
