export function formatMoney(value: number) {
  return new Intl.NumberFormat("uz-UZ").format(value) + " UZS";
}

export function typeLabel(type: "DORMITORY" | "HOSTEL" | "APARTMENT") {
  if (type === "DORMITORY") return "Dormitory";
  if (type === "HOSTEL") return "Hostel";
  return "Apartment";
}
