/**
 * Parses and validates map coordinates from input data object.
 */
export function parseMapFields(data: {
  latitude?: string | number | null;
  longitude?: string | number | null;
  mapAddress?: string | null;
  mapPlaceId?: string | null;
  mapProvider?: string | null;
}) {
  const latitudeStr = data.latitude?.toString().trim();
  const longitudeStr = data.longitude?.toString().trim();
  const mapAddress = data.mapAddress?.toString().trim() || null;
  const mapPlaceId = data.mapPlaceId?.toString().trim() || null;
  const mapProviderStr = data.mapProvider?.toString().trim() || null;

  let latitude: number | null = null;
  let longitude: number | null = null;

  if (latitudeStr) {
    latitude = parseFloat(latitudeStr);
    if (isNaN(latitude)) {
      throw new Error("위도는 숫자여야 합니다.");
    }
    if (latitude < -90 || latitude > 90) {
      throw new Error("위도는 -90에서 90 사이의 값이어야 합니다.");
    }
  }

  if (longitudeStr) {
    longitude = parseFloat(longitudeStr);
    if (isNaN(longitude)) {
      throw new Error("경도는 숫자여야 합니다.");
    }
    if (longitude < -180 || longitude > 180) {
      throw new Error("경도는 -180에서 180 사이의 값이어야 합니다.");
    }
  }

  if ((latitude !== null && longitude === null) || (latitude === null && longitude !== null)) {
    throw new Error("위도와 경도는 둘 다 입력하거나 둘 다 비워두어야 합니다.");
  }

  let mapProvider = null;
  if (mapProviderStr) {
    const validProviders = ["manual", "naver", "kakao", "google"];
    if (!validProviders.includes(mapProviderStr)) {
      throw new Error("지원하지 않는 지도 제공자입니다.");
    }
    mapProvider = mapProviderStr;
  }

  return {
    latitude,
    longitude,
    mapAddress,
    mapPlaceId,
    mapProvider,
  };
}
