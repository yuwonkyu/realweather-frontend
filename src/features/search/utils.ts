import districts from "@/shared/constants/korea_districts.json";

interface DistrictItem {
  raw: string;
  display: string;
  joined: string;
}

const nomalized: DistrictItem[] = districts.map((raw) => {
  const tokens = raw.split("-");
  return {
    raw,
    display: tokens.join(" "),
    joined: tokens.join(""),
  };
});

const isSubsequence = (text: string, pattern: string) => {
  let i = 0;
  let j = 0;

  while (i < text.length && j < pattern.length) {
    if (text[i] === pattern[j]) j++;
    i++;
  }

  return j === pattern.length;
};

export const searchDistricts = (keyword: string, limit = 10) => {
  if (!keyword.trim()) return [];

  const pattern = keyword.replace(/\s+/g, "");

  const results = nomalized.filter((item) =>
    isSubsequence(item.joined, pattern)
  );

  return results.slice(0, limit);
};
