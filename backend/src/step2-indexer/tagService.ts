import { Contribution } from '../step1-datasource/types'

export interface TagIndex {
  [tag: string]: string[] // tag -> contributionIds
}

export function buildTagIndex(contributions: Contribution[]): TagIndex {
  const index: TagIndex = {}

  for (const contribution of contributions) {
    for (const tag of contribution.tags) {
      const normalizedTag = tag.toLowerCase()
      if (!index[normalizedTag]) {
        index[normalizedTag] = []
      }
      index[normalizedTag].push(contribution.id)
    }
  }

  return index
}

export function getTopTags(tagIndex: TagIndex, limit = 10): Array<{ tag: string; count: number }> {
  return Object.entries(tagIndex)
    .map(([tag, ids]) => ({ tag, count: ids.length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

export function searchByTags(
  tagIndex: TagIndex,
  contributions: Contribution[],
  query: string
): Contribution[] {
  const queryTerms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 0)

  const matchingIds = new Set<string>()

  for (const term of queryTerms) {
    // Exact tag match
    if (tagIndex[term]) {
      tagIndex[term].forEach((id) => matchingIds.add(id))
    }
    // Partial tag match
    for (const [tag, ids] of Object.entries(tagIndex)) {
      if (tag.includes(term) || term.includes(tag)) {
        ids.forEach((id) => matchingIds.add(id))
      }
    }
  }

  return contributions.filter((c) => matchingIds.has(c.id))
}
