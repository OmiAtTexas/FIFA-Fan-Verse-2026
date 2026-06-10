import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const venueMap: Record<string, { stadium: string; city: string; citySlug: string; country: string }> = {
  'Mexico City': { stadium: 'Estadio Azteca', city: 'Mexico City', citySlug: 'mexico_city', country: 'MEX' },
  'Zapopan': { stadium: 'Estadio Akron', city: 'Guadalajara', citySlug: 'guadalajara', country: 'MEX' },
  'Monterrey': { stadium: 'Estadio BBVA', city: 'Monterrey', citySlug: 'monterrey', country: 'MEX' },
  'Toronto': { stadium: 'BMO Field', city: 'Toronto', citySlug: 'toronto', country: 'CAN' },
  'Vancouver': { stadium: 'BC Place', city: 'Vancouver', citySlug: 'vancouver', country: 'CAN' },
  'Los Angeles': { stadium: 'SoFi Stadium', city: 'Los Angeles', citySlug: 'los_angeles', country: 'USA' },
  'Inglewood': { stadium: 'SoFi Stadium', city: 'Los Angeles', citySlug: 'los_angeles', country: 'USA' },
  'San Francisco': { stadium: "Levi's Stadium", city: 'San Francisco', citySlug: 'san_francisco', country: 'USA' },
  'Santa Clara': { stadium: "Levi's Stadium", city: 'San Francisco', citySlug: 'san_francisco', country: 'USA' },
  'Seattle': { stadium: 'Lumen Field', city: 'Seattle', citySlug: 'seattle', country: 'USA' },
  'Dallas': { stadium: 'AT&T Stadium', city: 'Dallas', citySlug: 'dallas', country: 'USA' },
  'Arlington': { stadium: 'AT&T Stadium', city: 'Dallas', citySlug: 'dallas', country: 'USA' },
  'Houston': { stadium: 'NRG Stadium', city: 'Houston', citySlug: 'houston', country: 'USA' },
  'Kansas City': { stadium: 'Arrowhead Stadium', city: 'Kansas City', citySlug: 'kansas_city', country: 'USA' },
  'Atlanta': { stadium: 'Mercedes-Benz Stadium', city: 'Atlanta', citySlug: 'atlanta', country: 'USA' },
  'Miami': { stadium: 'Hard Rock Stadium', city: 'Miami', citySlug: 'miami', country: 'USA' },
  'Miami Gardens': { stadium: 'Hard Rock Stadium', city: 'Miami', citySlug: 'miami', country: 'USA' },
  'Philadelphia': { stadium: 'Lincoln Financial Field', city: 'Philadelphia', citySlug: 'philadelphia', country: 'USA' },
  'Boston': { stadium: 'Gillette Stadium', city: 'Boston', citySlug: 'boston', country: 'USA' },
  'Foxborough': { stadium: 'Gillette Stadium', city: 'Boston', citySlug: 'boston', country: 'USA' },
  'New York': { stadium: 'MetLife Stadium', city: 'New York', citySlug: 'new_york', country: 'USA' },
  'East Rutherford': { stadium: 'MetLife Stadium', city: 'New York', citySlug: 'new_york', country: 'USA' },
};

async function main() {
  // Fetch real venue data from football-data.org
  const res = await fetch('https://api.football-data.org/v4/competitions/WC/matches', {
    headers: { 'X-Auth-Token': '296b6235a5444d12bea5839c814c4b48' }
  });
  const data: any = await res.json();
  
  console.log('Updating venues for all matches...');
  let updated = 0;
  
  for (const match of data.matches) {
    const venue = match.fixture?.venue?.city || '';
    let venueData = venueMap[venue];
    
    if (!venueData) {
      // Try partial match
      for (const [key, val] of Object.entries(venueMap)) {
        if (venue.includes(key) || key.includes(venue)) {
          venueData = val;
          break;
        }
      }
    }
    
    if (venueData) {
      await prisma.worldCupMatch.updateMany({
        where: { externalId: String(match.id) },
        data: venueData,
      });
      updated++;
    }
  }
  
  console.log(`✅ Updated ${updated} match venues`);
  await prisma.$disconnect();
}
main().catch(console.error);
