// src/pages/Pharmacy/Pharmacy.jsx
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import Papa from 'papaparse';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import "./Pharmacy.css";

// Leaflet 아이콘 설정 (기본 마커 아이콘 문제 해결)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// 빨간색 마커 (현재 위치용)
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// 지도 중심 이동 컴포넌트
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

// 두 좌표 사이의 거리 계산 (Haversine formula, 단위: 미터)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // 지구 반지름 (미터)
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c); // 미터 단위로 반환
}

const Pharmacy = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [allPharmacies, setAllPharmacies] = useState([]);
  const [nearbyPharmacies, setNearbyPharmacies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState({ lat: 37.5665, lng: 126.9780, name: '서울시청' }); // 기본: 서울시청
  const [mapCenter, setMapCenter] = useState([37.5665, 126.9780]);
  const [mapZoom, setMapZoom] = useState(13);

  // CSV 파일 로드
  useEffect(() => {
    fetch('/pha_data.csv')
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const pharmacies = results.data.map((row, index) => ({
              id: index,
              name: row['요양기관명'],
              address: row['주소'],
              phone: row['전화번호'],
              lat: parseFloat(row['좌표(y)']),
              lng: parseFloat(row['좌표(x)']),
              city: row['시도코드명'],
              district: row['시군구코드명']
            })).filter(p => p.lat && p.lng); // 좌표가 있는 것만

            setAllPharmacies(pharmacies);
            setIsLoading(false);
            console.log(`Loaded ${pharmacies.length} pharmacies from CSV`);
          }
        });
      })
      .catch(error => {
        console.error('Error loading CSV:', error);
        setIsLoading(false);
      });
  }, []);

  // 현재 위치 기준으로 근처 약국 찾기
  useEffect(() => {
    if (allPharmacies.length > 0 && currentLocation) {
      searchNearbyPharmacies(currentLocation.lat, currentLocation.lng);
    }
  }, [currentLocation, allPharmacies]);

  // 근처 약국 검색 (1km 반경)
  const searchNearbyPharmacies = (lat, lng) => {
    const nearby = allPharmacies
      .map(pharmacy => ({
        ...pharmacy,
        distance: calculateDistance(lat, lng, pharmacy.lat, pharmacy.lng)
      }))
      .filter(pharmacy => pharmacy.distance <= 1000) // 1km 이내
      .sort((a, b) => a.distance - b.distance) // 거리순 정렬
      .slice(0, 20); // 최대 20개

    setNearbyPharmacies(nearby);
    console.log(`Found ${nearby.length} pharmacies within 1km`);
  };

  // 주소 검색
  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      alert('위치를 입력해주세요');
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchKeyword + ' 대한민국')}&countrycodes=kr&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const place = data[0];
        const lat = parseFloat(place.lat);
        const lng = parseFloat(place.lon);

        setCurrentLocation({ lat, lng, name: searchKeyword });
        setMapCenter([lat, lng]);
        setMapZoom(15);
      } else {
        alert('검색 결과가 없습니다');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('위치 검색에 실패했습니다');
    }
  };

  // 서울시청으로 이동
  const setDefaultLocation = () => {
    setCurrentLocation({ lat: 37.5665, lng: 126.9780, name: '서울시청' });
    setMapCenter([37.5665, 126.9780]);
    setMapZoom(13);
    setSearchKeyword('서울시청');
  };

  // 약국 카드 클릭 시 지도 포커스
  const focusPharmacy = (lat, lng) => {
    setMapCenter([lat, lng]);
    setMapZoom(17);
  };

  // 전화 걸기
  const handleCallPhone = (phone) => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  };

  // 길찾기
  const handleGetDirections = (address) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://map.kakao.com/link/search/${encodedAddress}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="pharmacy-container" style={{ backgroundImage: 'url(/images/background.avif)' }}>
        <div className="pharmacy-loading">약국 데이터를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="pharmacy-container" style={{ backgroundImage: 'url(/images/background.avif)' }}>
      <div className="pharmacy-content">
        <div className="pharmacy-header">
          <h2 className="pharmacy-title">본인의 위치를 입력하세요</h2>
          <div className="search-box">
            <input
              type="text"
              className="search-input"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="예: 강남역, 서울시 강남구"
            />
            <div className="search-buttons">
              <button className="btn btn-default" onClick={setDefaultLocation}>
                서울시청
              </button>
              <button className="btn btn-search" onClick={handleSearch}>
                🔍
              </button>
            </div>
          </div>
        </div>

        <div className="pharmacy-main-content">
          <div className="map-container">
            <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%' }}>
              <ChangeView center={mapCenter} zoom={mapZoom} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* 현재 위치 마커 */}
              <Marker position={[currentLocation.lat, currentLocation.lng]} icon={redIcon}>
                <Popup>
                  <strong>현재 위치: {currentLocation.name}</strong>
                </Popup>
              </Marker>

              {/* 약국 마커들 */}
              {nearbyPharmacies.map(pharmacy => (
                <Marker key={pharmacy.id} position={[pharmacy.lat, pharmacy.lng]}>
                  <Popup>
                    <strong>{pharmacy.name}</strong><br />
                    {pharmacy.address}<br />
                    {pharmacy.phone && `📞 ${pharmacy.phone}`}
                    📍 {pharmacy.distance}m
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          <div className="pharmacy-list-container">
            <div className="pharmacy-list-header">
              <h3 className="pharmacy-list-title">주변 약국 (반경 1km)</h3>
              <span className="pharmacy-count">{nearbyPharmacies.length}개</span>
            </div>

            <div className="pharmacy-list">
              {nearbyPharmacies.length === 0 ? (
                <div className="no-results">
                  1km 이내에 약국이 없습니다
                </div>
              ) : (
                nearbyPharmacies.map((pharmacy, index) => (
                  <div
                    key={pharmacy.id}
                    className="pharmacy-card"
                    onClick={() => focusPharmacy(pharmacy.lat, pharmacy.lng)}
                  >
                    <div className="pharmacy-info">
                      <h4 className="pharmacy-name">{index + 1}. {pharmacy.name}</h4>
                      <p className="pharmacy-address">{pharmacy.address}</p>
                      {pharmacy.phone && (
                        <p className="pharmacy-phone">📞 {pharmacy.phone}</p>
                      )}
                      <p className="pharmacy-distance">📍 {pharmacy.distance}m</p>
                    </div>
                    <div className="pharmacy-actions">
                      <button
                        className="action-btn call-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCallPhone(pharmacy.phone);
                        }}
                      >
                        전화
                      </button>
                      <button
                        className="action-btn direction-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGetDirections(pharmacy.address);
                        }}
                      >
                        길찾기
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pharmacy;
