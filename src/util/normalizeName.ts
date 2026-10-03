// Names are matched by exact string, so store them trimmed with single spaces.
export const normalizeName = (name: any) => typeof name === 'string' ? name.replace(/\s+/g, ' ').trim() : name
