export type CategoryGroup = "men" | "lady" | "boy" | "child" | "baby" | "other";

export function getCategoryGroup(category: string | null): CategoryGroup {
  if (!category) return "other";
  const text = category.toLowerCase();

  if (text.includes("baby") || text.includes("infant")) return "baby";
  if (text.includes("boy")) return "boy";
  if (text.includes("girl") || text.includes("child") || text.includes("kid"))
    return "child";
  if (
    text.includes("women") ||
    text.includes("ladies") ||
    text.includes("lady")
  )
    return "lady";
  if (text.includes("men")) return "men";

  return "other";
}

export const categoryGroupLabels: Record<CategoryGroup, string> = {
  men: "رجالي",
  lady: "حريمي",
  boy: "أولاد",
  child: "أطفال",
  baby: "رضّع",
  other: "أخرى",
};
