export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")     // remove non-word
    .replace(/\s+/g, "-")         // spaces -> dashes
    .replace(/-+/g, "-");         // collapse dashes
}