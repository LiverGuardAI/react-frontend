#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Pharmacy Finder Server
CSV 데이터 기반 약국 검색 서버
"""

from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import pandas as pd
import math

# CSV 데이터 미리 로드
print('Loading pharmacy data...')
pharmacy_df = pd.read_csv('find/pha_data.csv', encoding='utf-8')
# 컬럼명 변경: 좌표(x) -> lon, 좌표(y) -> lat
pharmacy_df = pharmacy_df.rename(columns={'좌표(x)': 'lon', '좌표(y)': 'lat', '요양기관명': 'name', '주소': 'address', '전화번호': 'phone'})
pharmacy_df = pharmacy_df.dropna(subset=['lat', 'lon'])
print(f'Loaded {len(pharmacy_df)} pharmacies')

def get_distance(lat1, lon1, lat2, lon2):
    """Haversine formula로 거리 계산 (미터)"""
    R = 6371e3
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)

    a = math.sin(dphi/2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))

    return R * c

class ProxyHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        # 약국 검색 API (위치 기반)
        if self.path.startswith('/api/search'):
            try:
                # 쿼리 파라미터 파싱
                from urllib.parse import urlparse, parse_qs
                parsed = urlparse(self.path)
                params = parse_qs(parsed.query)

                lat = float(params.get('lat', [37.5665])[0])
                lng = float(params.get('lng', [126.9780])[0])
                radius = int(params.get('radius', [1000])[0])

                print(f'Searching pharmacies near ({lat}, {lng}) within {radius}m')

                # 약국 필터링
                result = []
                for _, row in pharmacy_df.iterrows():
                    dist = get_distance(lat, lng, row['lat'], row['lon'])
                    if dist <= radius:
                        # NaN 값 처리
                        name = row['name'] if pd.notna(row['name']) else '약국'
                        address = row['address'] if pd.notna(row['address']) else ''
                        phone = row['phone'] if pd.notna(row['phone']) else ''

                        result.append({
                            'name': str(name),
                            'address': str(address),
                            'phone': str(phone),
                            'lat': float(row['lat']),
                            'lon': float(row['lon']),
                            'distance': round(dist)
                        })

                # 거리순 정렬
                result.sort(key=lambda x: x['distance'])

                print(f'Found {len(result)} pharmacies')

                # JSON 응답
                self.send_response(200)
                self.send_header('Content-type', 'application/json; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()

                response_data = json.dumps(result, ensure_ascii=False)
                self.wfile.write(response_data.encode('utf-8'))

            except Exception as e:
                print(f'Error: {e}')
                self.send_error(500, f'Search error: {str(e)}')

        # 일반 파일 서빙
        else:
            # 일반 파일 서빙
            super().do_GET()

    def end_headers(self):
        # 모든 응답에 CORS 헤더 추가
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

if __name__ == '__main__':
    PORT = 7988

    print(f'''
===========================================
Pharmacy Finder Server
===========================================
서버 주소: http://localhost:{PORT}
약국 찾기: http://localhost:{PORT}/find/find_pharmacy_osm.html
검색 API: http://localhost:{PORT}/api/search?lat=37.5665&lng=126.978&radius=1000

서버를 종료하려면 Ctrl+C를 누르세요.
===========================================
''')

    httpd = HTTPServer(('', PORT), ProxyHandler)
    httpd.serve_forever()
