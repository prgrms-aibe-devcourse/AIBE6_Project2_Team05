const JOB_REGIONS = [
  "서울",
  "경기",
  "인천",
  "부산",
  "대구",
  "대전",
  "광주",
  "울산",
  "세종",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
];

export const JOB_REGION_OTHER_VALUE = "__other__";

/**
 * @param {string} region
 * @returns {{ selectedRegion: string, customRegion: string }}
 */
export function createInitialRegionSelection(region) {
  const trimmedRegion = region.trim();

  if (trimmedRegion === "") {
    return {
      selectedRegion: "",
      customRegion: "",
    };
  }

  if (JOB_REGIONS.includes(trimmedRegion)) {
    return {
      selectedRegion: trimmedRegion,
      customRegion: "",
    };
  }

  return {
    selectedRegion: JOB_REGION_OTHER_VALUE,
    customRegion: trimmedRegion,
  };
}

/**
 * @param {string} selectedRegion
 * @param {string} customRegion
 * @returns {string}
 */
export function resolveJobRegionValue(selectedRegion, customRegion) {
  if (selectedRegion === JOB_REGION_OTHER_VALUE) {
    return customRegion.trim();
  }

  return selectedRegion;
}
