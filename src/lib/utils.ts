/**
 * Simplifies iRacing track names by removing redundant descriptors 
 * while preserving the important configuration/variant name.
 * 
 * Example: "Algarve International Circuit - Grand Prix" -> "Algarve - Grand Prix"
 */
export function formatTrackName(name: string): string {
  if (!name) return "";
  
  let formatted = name;
  
  // common redundant terms
  const redundant = [
    "International Circuit",
    "Motorsports Park",
    "Motor Speedway",
    "National Speedway",
    "Raceway",
    "Speedway",
    "International",
    "Circuit",
    "Park",
    "Road Course",
    "Facility"
  ];
  
  // Split by " - " to isolate the variant
  const parts = name.split(" - ");
  if (parts.length > 1) {
    let base = parts[0];
    const variant = parts[1];
    
    redundant.forEach(term => {
      base = base.replace(new RegExp(`\\s${term}`, 'gi'), "").trim();
    });
    
    return `${base} - ${variant}`;
  }
  
  // No variant found, just try to clean up the base name slightly but not too much 
  // so it's still recognizable.
  return formatted;
}
