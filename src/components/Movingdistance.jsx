import React, { useEffect, useRef, useState } from "react";
import "../css/Movingdistance.css";

const Movingdistance = ({ address, onDistanceChange }) => {
  const mapRef = useRef(null);
  const [totalDistance, setTotalDistance] = useState(0); // 총거리 상태

  useEffect(() => {
    const loadKakaoMap = () => {
      if (!window.kakao) {
        const script = document.createElement("script");
        script.src =
          "https://dapi.kakao.com/v2/maps/sdk.js?appkey=0b4766e4ceb0f40563062b8b95efcbda&libraries=services&autoload=false";
        script.async = true;
        script.onload = () => window.kakao.maps.load(initMap);
        document.head.appendChild(script);
      } else {
        window.kakao.maps.load(initMap);
      }
    };

    const initMap = () => {
      const { kakao } = window;

      if (!kakao || !mapRef.current) return;

      const geocoder = new kakao.maps.services.Geocoder();

      // 주소 -> 좌표 변환
      geocoder.addressSearch(address, (result, status) => {
        let mapCenter;
        if (status === kakao.maps.services.Status.OK) {
          mapCenter = new kakao.maps.LatLng(result[0].y, result[0].x);
        } else {
          mapCenter = new kakao.maps.LatLng(33.450701, 126.570667);
        }

        const map = new kakao.maps.Map(mapRef.current, {
          center: mapCenter,
          level: 3,
        });

        // 거리 측정 변수
        let drawingFlag = false;
        let clickLine, moveLine, distanceOverlay;
        let dots = [];

        // 지도 클릭 이벤트
        kakao.maps.event.addListener(map, "click", (mouseEvent) => {
          const clickPosition = mouseEvent.latLng;

          if (!drawingFlag) {
            drawingFlag = true;
            deleteClickLine();
            deleteDistance();
            deleteCircleDot();

            clickLine = new kakao.maps.Polyline({
              map,
              path: [clickPosition],
              strokeWeight: 3,
              strokeColor: "#1E90FF",
              strokeOpacity: 1,
              strokeStyle: "solid",
            });

            moveLine = new kakao.maps.Polyline({
              strokeWeight: 3,
              strokeColor: "#1E90FF",
              strokeOpacity: 0.5,
              strokeStyle: "solid",
            });

            displayCircleDot(clickPosition, 0);
            setTotalDistance(0);
          } else {
            const path = clickLine.getPath();
            path.push(clickPosition);
            clickLine.setPath(path);

            const distance = Math.round(clickLine.getLength());
            displayCircleDot(clickPosition, distance);
            setTotalDistance(distance); // React 상태로 총거리 업데이트
            if(onDistanceChange) onDistanceChange(distance);
          }
        });

        // 마우스 이동 이벤트
        kakao.maps.event.addListener(map, "mousemove", (mouseEvent) => {
          if (!drawingFlag) return;

          const mousePosition = mouseEvent.latLng;
          const path = clickLine.getPath();
          const movepath = [path[path.length - 1], mousePosition];

          moveLine.setPath(movepath);
          moveLine.setMap(map);

          const distance = Math.round(clickLine.getLength() + moveLine.getLength());
          const content = getTimeHTML(distance);
          showDistance(content, mousePosition);
        });

        // 우클릭 이벤트 (측정 종료)
        kakao.maps.event.addListener(map, "rightclick", () => {
          if (!drawingFlag) return;

          moveLine.setMap(null);
          moveLine = null;

          const path = clickLine.getPath();
          if (path.length > 1) {
            if (dots[dots.length - 1].distance) {
              dots[dots.length - 1].distance.setMap(null);
              dots[dots.length - 1].distance = null;
            }
            const distance = Math.round(clickLine.getLength());
            const content = getTimeHTML(distance);
            showDistance(content, path[path.length - 1]);
            setTotalDistance(distance);
            if(onDistanceChange) onDistanceChange(distance);
          } else {
            deleteClickLine();
            deleteCircleDot();
            deleteDistance();
            setTotalDistance(0);
          }

          drawingFlag = false;
        });

        // 헬퍼 함수
        function deleteClickLine() {
          if (clickLine) {
            clickLine.setMap(null);
            clickLine = null;
          }
        }

        function showDistance(content, position) {
          if (distanceOverlay) {
            distanceOverlay.setPosition(position);
            distanceOverlay.setContent(content);
          } else {
            distanceOverlay = new kakao.maps.CustomOverlay({
              map,
              content,
              position,
              xAnchor: 0,
              yAnchor: 0,
              zIndex: 3,
            });
          }
        }

        function deleteDistance() {
          if (distanceOverlay) {
            distanceOverlay.setMap(null);
            distanceOverlay = null;
          }
        }

        function displayCircleDot(position, distance) {
          const circleOverlay = new kakao.maps.CustomOverlay({
            content: '<span class="dot"></span>',
            position,
            zIndex: 1,
          });
          circleOverlay.setMap(map);

          let distanceOverlay;
          if (distance > 0) {
            distanceOverlay = new kakao.maps.CustomOverlay({
              content: `<div class="dotOverlay">거리 <span class="number">${distance}</span>m</div>`,
              position,
              yAnchor: 1,
              zIndex: 2,
            });
            distanceOverlay.setMap(map);
          }

          dots.push({ circle: circleOverlay, distance: distanceOverlay });
        }

        function deleteCircleDot() {
          for (let i = 0; i < dots.length; i++) {
            if (dots[i].circle) dots[i].circle.setMap(null);
            if (dots[i].distance) dots[i].distance.setMap(null);
          }
          dots = [];
        }

        function getTimeHTML(distance) {
          const walkTime = (distance / 67) | 0;
          const walkHour = walkTime >= 60 ? `<span class="number">${Math.floor(walkTime / 60)}</span>시간 ` : "";
          const walkMin = `<span class="number">${walkTime % 60}</span>분`;

          const bicycleTime = (distance / 227) | 0;
          const bicycleHour = bicycleTime >= 60 ? `<span class="number">${Math.floor(bicycleTime / 60)}</span>시간 ` : "";
          const bicycleMin = `<span class="number">${bicycleTime % 60}</span>분`;

          return `
            <ul class="dotOverlay distanceInfo">
              <li><span class="label">총거리</span><span class="number">${distance}</span>m</li>
              <li><span class="label">도보</span>${walkHour}${walkMin}</li>
              <li><span class="label">자전거</span>${bicycleHour}${bicycleMin}</li>
            </ul>
          `;
        }
      });
    };

    loadKakaoMap();
  }, [address, onDistanceChange]);

  return(
    <div>
        <div ref={mapRef} style={{ width: "100%", height: "500px" }} />
    </div>
  );
  
};

export default Movingdistance;
