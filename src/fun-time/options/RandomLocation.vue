<script lang="ts" setup>
import { ref, watch } from 'vue';

const apiKey = (import.meta as any).env.VITE_GEO;

const panoramaRef = ref<HTMLElement | null>(null);
const mapRef = ref<HTMLElement | null>(null);
const guessLat = ref<number | null>(null);
const guessLng = ref<number | null>(null);
const submitted = ref(false);
const distance = ref<number | null>(null);
const score = ref<number | null>(null);
const panoramaError = ref(false);
const mapExpanded = ref(false);
const loading = ref(true);
const initialized = ref(false);

let gMap: any = null;
let guessMarker: any = null;
let panorama: any = null;
let initialPano = '';
let actualLat = 0;
let actualLng = 0;

const knownLocations: { lat: number; lng: number }[] = [
  // USA
  { lat: 40.758, lng: -73.9855 }, { lat: 40.6782, lng: -73.9442 },
  { lat: 34.0195, lng: -118.4912 }, { lat: 34.0522, lng: -118.2437 },
  { lat: 37.7749, lng: -122.4194 }, { lat: 37.8716, lng: -122.2727 },
  { lat: 41.8827, lng: -87.6233 }, { lat: 41.8369, lng: -87.6862 },
  { lat: 29.7604, lng: -95.3698 }, { lat: 33.4484, lng: -112.074 },
  { lat: 39.7392, lng: -104.9903 }, { lat: 47.6062, lng: -122.3321 },
  { lat: 25.7617, lng: -80.1918 }, { lat: 30.2672, lng: -97.7431 },
  { lat: 32.7767, lng: -96.797 }, { lat: 36.1699, lng: -115.1398 },
  { lat: 42.3601, lng: -71.0589 }, { lat: 39.9526, lng: -75.1652 },
  { lat: 45.5231, lng: -122.6765 }, { lat: 38.9072, lng: -77.0369 },
  { lat: 35.2271, lng: -80.8431 }, { lat: 44.9778, lng: -93.265 },
  { lat: 36.1627, lng: -86.7816 }, { lat: 30.3322, lng: -81.6557 },
  // Canada
  { lat: 43.6532, lng: -79.3832 }, { lat: 45.5017, lng: -73.5673 },
  { lat: 49.2827, lng: -123.1207 }, { lat: 51.0447, lng: -114.0719 },
  { lat: 45.4215, lng: -75.6972 }, { lat: 53.5461, lng: -113.4938 },
  // UK
  { lat: 51.5074, lng: -0.1278 }, { lat: 51.4816, lng: -3.1791 },
  { lat: 53.4808, lng: -2.2426 }, { lat: 55.8642, lng: -4.2518 },
  { lat: 53.8008, lng: -1.5491 }, { lat: 51.4545, lng: -2.5879 },
  { lat: 52.4862, lng: -1.8904 }, { lat: 53.2307, lng: -0.5406 },
  // France
  { lat: 48.8566, lng: 2.3522 }, { lat: 43.2965, lng: 5.3698 },
  { lat: 45.764, lng: 4.8357 }, { lat: 43.6047, lng: 1.4442 },
  { lat: 47.2184, lng: -1.5536 }, { lat: 50.6292, lng: 3.0573 },
  // Germany
  { lat: 52.52, lng: 13.405 }, { lat: 48.1351, lng: 11.582 },
  { lat: 53.5753, lng: 10.0153 }, { lat: 51.2277, lng: 6.7735 },
  { lat: 50.1109, lng: 8.6821 }, { lat: 50.9333, lng: 6.95 },
  // Spain & Portugal
  { lat: 40.4168, lng: -3.7038 }, { lat: 41.3851, lng: 2.1734 },
  { lat: 37.3891, lng: -5.9845 }, { lat: 39.4699, lng: -0.3763 },
  { lat: 38.7223, lng: -9.1393 }, { lat: 41.1496, lng: -8.6109 },
  // Italy
  { lat: 41.9028, lng: 12.4964 }, { lat: 45.4654, lng: 9.1859 },
  { lat: 40.8518, lng: 14.2681 }, { lat: 43.7696, lng: 11.2558 },
  { lat: 45.4408, lng: 12.3155 }, { lat: 44.4949, lng: 11.3426 },
  // Benelux
  { lat: 52.3676, lng: 4.9041 }, { lat: 51.9244, lng: 4.4777 },
  { lat: 50.8503, lng: 4.3517 }, { lat: 49.6116, lng: 6.1319 },
  // Nordics
  { lat: 59.9139, lng: 10.7522 }, { lat: 59.3293, lng: 18.0686 },
  { lat: 55.6761, lng: 12.5683 }, { lat: 60.1699, lng: 24.9384 },
  { lat: 57.7089, lng: 11.9746 }, { lat: 63.8258, lng: 20.263 },
  // Central/East Europe
  { lat: 52.2297, lng: 21.0122 }, { lat: 50.0755, lng: 14.4378 },
  { lat: 47.4979, lng: 19.0402 }, { lat: 48.2082, lng: 16.3738 },
  { lat: 48.1486, lng: 17.1077 }, { lat: 46.0569, lng: 14.5058 },
  { lat: 44.8176, lng: 20.4633 }, { lat: 45.815, lng: 15.9819 },
  // Turkey & Greece
  { lat: 41.0082, lng: 28.9784 }, { lat: 37.9838, lng: 23.7275 },
  { lat: 38.4192, lng: 27.1287 }, { lat: 40.6401, lng: 22.9444 },
  // Japan
  { lat: 35.6762, lng: 139.6503 }, { lat: 35.709, lng: 139.732 },
  { lat: 34.6937, lng: 135.5023 }, { lat: 35.0116, lng: 135.7681 },
  { lat: 43.0642, lng: 141.3469 }, { lat: 33.5904, lng: 130.4017 },
  { lat: 34.3853, lng: 132.4553 }, { lat: 35.3912, lng: 136.7223 },
  // South Korea
  { lat: 37.5665, lng: 126.978 }, { lat: 37.4979, lng: 127.0276 },
  { lat: 35.1796, lng: 129.0756 }, { lat: 35.8714, lng: 128.6014 },
  // Australia
  { lat: -33.8688, lng: 151.2093 }, { lat: -33.749, lng: 150.8793 },
  { lat: -37.8136, lng: 144.9631 }, { lat: -37.9716, lng: 145.1319 },
  { lat: -27.4698, lng: 153.0251 }, { lat: -31.9505, lng: 115.8605 },
  { lat: -34.9285, lng: 138.6007 }, { lat: -35.2809, lng: 149.13 },
  // New Zealand
  { lat: -36.8485, lng: 174.7633 }, { lat: -41.2866, lng: 174.7756 },
  { lat: -43.5321, lng: 172.6362 }, { lat: -37.7833, lng: 175.2833 },
  // Brazil
  { lat: -23.5505, lng: -46.6333 }, { lat: -23.1896, lng: -45.8841 },
  { lat: -22.9068, lng: -43.1729 }, { lat: -22.8822, lng: -43.3519 },
  { lat: -19.9167, lng: -43.9345 }, { lat: -30.0346, lng: -51.2177 },
  { lat: -25.4284, lng: -49.2733 }, { lat: -12.9714, lng: -38.5014 },
  // Argentina
  { lat: -34.6037, lng: -58.3816 }, { lat: -34.9205, lng: -57.9536 },
  { lat: -31.4201, lng: -64.1888 }, { lat: -32.8908, lng: -68.8272 },
  // Mexico
  { lat: 19.4326, lng: -99.1332 }, { lat: 19.0414, lng: -98.2063 },
  { lat: 25.6866, lng: -100.3161 }, { lat: 20.9674, lng: -89.6237 },
  { lat: 20.6597, lng: -103.3496 }, { lat: 17.0732, lng: -96.7266 },
  // South Africa
  { lat: -33.9249, lng: 18.4241 }, { lat: -33.96, lng: 25.6022 },
  { lat: -26.2041, lng: 28.0473 }, { lat: -29.8579, lng: 31.0292 },
  // Singapore / SE Asia
  { lat: 1.3521, lng: 103.8198 }, { lat: 1.284, lng: 103.8509 },
  { lat: 13.7563, lng: 100.5018 }, { lat: 3.139, lng: 101.6869 },
  // India (cities with good coverage)
  { lat: 28.6139, lng: 77.209 }, { lat: 19.076, lng: 72.8777 },
  { lat: 12.9716, lng: 77.5946 }, { lat: 17.385, lng: 78.4867 },
  // Taiwan
  { lat: 25.033, lng: 121.5654 }, { lat: 22.6273, lng: 120.3014 },
];

const randomLocation = () => knownLocations[Math.floor(Math.random() * knownLocations.length)];

const haversine = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const loadGoogleMapsApi = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if ((globalThis as any).google?.maps) { resolve(); return; }
    const existing = document.getElementById('google-maps-script');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', reject);
      return;
    }
    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

const returnToStart = () => {
  if (panorama && initialPano) {
    panorama.setPano(initialPano);
  }
};

const triggerMapResize = () => {
  if (gMap) {
    (globalThis as any).google.maps.event.trigger(gMap, 'resize');
  }
};

watch(mapExpanded, () => {
  setTimeout(triggerMapResize, 320);
});

const init = async () => {
  initialized.value = true;
  guessLat.value = null;
  guessLng.value = null;
  submitted.value = false;
  distance.value = null;
  score.value = null;
  panoramaError.value = false;
  mapExpanded.value = false;
  loading.value = true;
  gMap = null;
  guessMarker = null;
  panorama = null;
  initialPano = '';
  actualLat = 0;
  actualLng = 0;

  if (!apiKey) { loading.value = false; return; }
  try {
    await loadGoogleMapsApi();
    const google = (globalThis as any).google;

    gMap = new google.maps.Map(mapRef.value!, {
      center: { lat: 2, lng: 0 },
      zoom: 2,
      disableDefaultUI: true,
      zoomControl: true,
      clickableIcons: false,
      gestureHandling: 'greedy',
    });

    gMap.addListener('click', (e: any) => {
      if (submitted.value) return;
      guessLat.value = e.latLng.lat();
      guessLng.value = e.latLng.lng();
      if (guessMarker) guessMarker.setMap(null);
      guessMarker = new google.maps.Marker({ position: e.latLng, map: gMap });
    });

    const location = randomLocation();
    actualLat = location.lat;
    actualLng = location.lng;

    panorama = new google.maps.StreetViewPanorama(panoramaRef.value!, {
      position: location,
      addressControl: false,
      showRoadLabels: false,
      linksControl: true,
      motionTracking: false,
      motionTrackingControl: false,
      fullscreenControl: false,
      panControl: true,
      panControlOptions: { position: google.maps.ControlPosition.LEFT_CENTER },
    });

    panorama.addListener('status_changed', () => {
      if (panorama.getStatus() === 'OK') {
        initialPano = panorama.getPano();
      } else {
        panoramaError.value = true;
      }
      loading.value = false;
    });
  } catch {
    panoramaError.value = true;
    loading.value = false;
  }
};

const submitGuess = () => {
  if (guessLat.value === null || guessLng.value === null || !gMap) return;
  submitted.value = true;
  mapExpanded.value = true;

  const dist = haversine(guessLat.value, guessLng.value, actualLat, actualLng);
  distance.value = Math.round(dist);
  score.value = Math.max(0, Math.round(5000 * Math.exp(-dist / 2000)));

  const google = (globalThis as any).google;

  const _actualMarker = new google.maps.Marker({
    position: { lat: actualLat, lng: actualLng },
    map: gMap,
    title: 'Actual location',
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 1,
      fillColor: '#ff6b6b',
      fillOpacity: 1,
      strokeColor: '#fff',
      strokeWeight: 2,
    },
  });

  const _line = new google.maps.Polyline({
    path: [
      { lat: guessLat.value, lng: guessLng.value },
      { lat: actualLat, lng: actualLng },
    ],
    geodesic: true,
    strokeColor: '#ff6b6b',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    map: gMap,
  });

  const bounds = new google.maps.LatLngBounds();
  bounds.extend({ lat: guessLat.value, lng: guessLng.value });
  bounds.extend({ lat: actualLat, lng: actualLng });
  gMap.fitBounds(bounds, 40);
};

defineExpose({ load: init });
</script>

<template>
  <div v-if="initialized" class="geoguessr-container">
    <div ref="panoramaRef" class="panorama"></div>

    <div v-if="loading" class="center-warning">
      🌍 Finding a location with Street View coverage…
    </div>
    <div v-else-if="!apiKey" class="center-warning">
      ⚠️ Add <code>VITE_GEO</code> to your <code>.env</code> to enable Street View.
    </div>
    <div v-else-if="panoramaError" class="center-warning">
      ⚠️ Could not find Street View coverage after several attempts. Try again!
    </div>

    <button
      v-if="!loading && !submitted && !panoramaError && apiKey"
      class="return-btn"
      title="Return to starting location"
      @click="returnToStart"
    >
      ⌂
    </button>

    <div v-show="!loading && !panoramaError && apiKey" class="map-overlay" :class="{ expanded: mapExpanded, submitted }">
      <div class="map-toolbar">
        <span v-if="!submitted" class="map-hint">Click to place your pin</span>
        <button class="expand-btn" :title="mapExpanded ? 'Shrink map' : 'Expand map'" @click="mapExpanded = !mapExpanded">
          {{ mapExpanded ? '⊟' : '⊞' }}
        </button>
      </div>
      <div ref="mapRef" class="map-canvas"></div>
      <div v-if="!submitted" class="map-footer">
        <button class="sort confirm-btn" :disabled="guessLat === null" @click="submitGuess">
          Confirm guess
        </button>
      </div>
      <div v-if="submitted" class="result-row">
        <span class="result-badge distance">📏 <strong>{{ distance?.toLocaleString() }} km</strong></span>
        <span class="result-badge score">🏆 <strong>{{ score?.toLocaleString() }}</strong> / 5 000</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.geoguessr-container {
  position: relative;
  width: 100%;
  height: 75vh;
  min-height: 400px;
  border-radius: 10px;
  overflow: hidden;
  background: #1a1a1a;
  user-select: none;
}

.panorama {
  position: absolute;
  inset: 0;
}

.center-warning {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;
  background: rgba(0, 0, 0, 0.7);
  color: #ffcc66;
  font-size: 15px;

  code {
    background: rgba(255, 255, 255, 0.1);
    padding: 2px 6px;
    border-radius: 4px;
  }
}

.return-btn {
  position: absolute;
  top: 14px;
  left: 14px;
  z-index: 10;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 18px;
  width: 38px;
  height: 38px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
}

$map-w-sm: 480px;
$map-h-sm: 340px;
$map-w-lg: 960px;
$map-h-lg: 510px;

.map-overlay {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 10;
  width: $map-w-sm;
  border-radius: 10px;
  overflow: visible;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.6);
  background: #1f1f1f;
  transition: width 0.3s ease, box-shadow 0.2s;

  &:hover {
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.8);
  }

  &.expanded {
    width: $map-w-lg;
  }

  @media (max-width: 600px) {
    left: 10px;
    right: 10px;
    width: auto !important;
    bottom: 10px;
  }
}

.map-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px 10px 0 0;
  gap: 8px;
}

.map-hint {
  font-size: 11px;
  color: #aaa;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.expand-btn {
  background: transparent;
  border: none;
  color: #ccc;
  font-size: 16px;
  cursor: pointer;
  line-height: 1;
  padding: 0 2px;
  flex-shrink: 0;

  &:hover { color: #fff; }
}

.map-canvas {
  width: 100%;
  height: $map-h-sm;
  overflow: hidden;
  transition: height 0.3s ease;

  .expanded & {
    height: $map-h-lg;
  }

  @media (max-width: 600px) {
    height: 200px !important;
  }
}

.map-footer {
  padding: 8px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 0 0 10px 10px;
}

.confirm-btn {
  width: 100%;
  padding: 8px;
  font-size: 14px;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.result-row {
  display: flex;
  gap: 8px;
  padding: 8px;
  flex-wrap: nowrap;
  border-radius: 0 0 10px 10px;
  background: rgba(0, 0, 0, 0.4);
}

.result-badge {
  flex: 1 1 auto;
  text-align: center;
  font-size: 13px;
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0.07);
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  &.distance strong { color: #00ff00; }
  &.score strong { color: #ffd700; }
}
</style>
