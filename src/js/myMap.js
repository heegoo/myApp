import $ from 'dom7';
// window.myMap.map = null;
// window.myMap.mapContainer = null;
// // 장소 검색 객체를 생성합니다
// window.myMap.ps = null;
// // 마커를 클릭하면 장소명을 표출할 인포윈도우 입니다
// window.myMap.infowindow = null;

// // 마커를 담을 배열입니다
// window.myMap.markers = [];
const myMap = {
    kakao : {},
    map : {},
    mapContainer : undefined,
    // 장소 검색 객체를 생성합니다
    ps : {},
    // 마커를 클릭하면 장소명을 표출할 인포윈도우 입니다
    infowindow : {},
    
    // 마커를 담을 배열입니다
    markers : [],
    fn_search: undefined,

    CreateMap: function (kakao, mapContainer,  mapOption) {
            // mapContainer = document.getElementById('map'); // 지도를 표시할 div 
            // var mapOption = { 
            //     center: new kakao.maps.LatLng(startPos.coords.latitude, startPos.coords.longitude), // 지도의 중심좌표
            //     level: 3 // 지도의 확대 레벨
            // };
            this.kakao = kakao;
            this.mapContainer = mapContainer;
            // 지도를 표시할 div와  지도 옵션으로  지도를 생성합니g다
            this.map = new kakao.maps.Map(mapContainer, mapOption); 
            // 장소 검색 객체를 생성합니다
            this.ps = new kakao.maps.services.Places(); 
            
            this.infowindow = new kakao.maps.InfoWindow({zIndex:1});

            // this.mapContainer.addEventListener('resize', function() {
            //     myMap.resizeMap();
            // });
    },

    SearchMap: function (mapOption, fn_search) {
        this.map.setCenter(mapOption.center); 
        this.map.setLevel(mapOption.level); 
        
        this.fn_search = fn_search;
    },
    // 지도를 표시하는 div 크기를 변경하는 함수입니다
    resizeMap: function () {
        // var mapContainer = document.getElementById('map');
        var mapWrap = $('div.map_wrap');
        // document.querySelector('div.map_wrap');
        // console.log('resize',mapWrap.style)
        this.mapContainer.style.width = mapWrap.width();
        this.mapContainer.style.height = mapWrap.height(); 
        $(this.mapContainer).trigger('resize');
        console.log('resize',mapWrap.width())
        this.map.relayout();
    },

    
    relayout: function () {    
        console.log('relayout')
        // 지도를 표시하는 div 크기를 변경한 이후 지도가 정상적으로 표출되지 않을 수도 있습니다
        // 크기를 변경한 이후에는 반드시  map.relayout 함수를 호출해야 합니다 
        // window의 resize 이벤트에 의한 크기변경은 map.relayout 함수가 자동으로 호출됩니다
        // this.map.relayout();
    },

// 검색 결과 목록과 마커를 표출하는 함수입니다
    displayPlaces: function (places) {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
        var listEl = document.querySelector('#placesList'), 
        menuEl = document.querySelector('#menu_wrap'),
        fragment = document.createDocumentFragment(), 
        bounds = new this.kakao.maps.LatLngBounds(), 
        listStr = '';
        
        // 검색 결과 목록에 추가된 항목들을 제거합니다
        this.removeAllChildNods(listEl);

        // 지도에 표시되고 있는 마커를 제거합니다
        this.removeMarker();
        
        for ( var i=0; i<places.length; i++ ) {

            // 마커를 생성하고 지도에 표시합니다
            var placePosition = new this.kakao.maps.LatLng(places[i].y, places[i].x),
                marker = this.addMarker(placePosition, i), 
                itemEl = this.getListItem(i, places[i]), // 검색 결과 항목 Element를 생성합니다
                searchEl = this.getSearchButton(places[i]);

            // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
            // LatLngBounds 객체에 좌표를 추가합니다
            bounds.extend(placePosition);

            // 마커와 검색결과 항목에 mouseover 했을때
            // 해당 장소에 인포윈도우에 장소명을 표시합니다
            // mouseout 했을 때는 인포윈도우를 닫습니다
            (function(marker, title, x, y) {
                kakao.maps.event.addListener(marker, 'mouseover', function() {
                    myMap.displayInfowindow(marker, title);
                });

                kakao.maps.event.addListener(marker, 'mouseout', function() {
                    myMap.infowindow.close();
                });

                itemEl.onmouseover =  function () {
                    myMap.displayInfowindow(marker, title);
                };

                itemEl.onmouseout =  function () {
                    myMap.infowindow.close();
                };
                // searchEl.addEventListener('click', 
                //                             function () {
                //                                 console.log('click searchByPosition')
                //                                 myMap.fn_search(places[i].x, places[i].y);
                //                                 return false;
                //                             }, false);
                // searchEl.onclick = 
                //                             function () {
                //                                 console.log('click searchByPosition')
                //                                 myMap.fn_search(x, y);
                //                                 // return false;
                //                             };
    
            })(marker, places[i].place_name, places[i].x, places[i].y);

            fragment.appendChild(itemEl);
            fragment.appendChild(searchEl);
        }

        // 검색결과 항목들을 검색결과 목록 Element에 추가합니다
        listEl.appendChild(fragment);
        menuEl.scrollTop = 0;

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
        this.map.setBounds(bounds);
    },

    // 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수입니다
    // 인포윈도우에 장소명을 표시합니다
    displayInfowindow: function (marker, title) {
        var content = '<div style="padding:5px;z-index:1;">' + title + '</div>';

        this.infowindow.setContent(content);
        this.infowindow.open(this.map, marker);
    },


    // 검색결과 항목을 Element로 반환하는 함수입니다
    getListItem: function (index, places) {

        var el = document.createElement('li'),
        itemStr = '<span class="markerbg marker_' + (index+1) + '"></span>' +
                    '<div class="info">' +
                    '   <h5>' + places.place_name + '</h5>';

        if (places.road_address_name) {
            itemStr += '    <span>' + places.road_address_name + '</span>' +
                        '   <span class="jibun gray">' +  places.address_name  + '</span>';
        } else {
            itemStr += '    <span>' +  places.address_name  + '</span>'; 
        }

        itemStr += '  <span class="tel">' + places.phone  + '</span>' +
        '</div>';           

// itemStr += ' <a href="#" class="searchByPosition" >검색</a>';
        // itemStr += ' <button id="place_'+places.id+'" class="searchByPosition" onclick="(function(x,y){myMap.fn_search(x,y);})('+places.x+','+places.y+')">검색</button>';
        // itemStr += ' <button id="place_'+places.id+'" class="searchByPosition" onclick="(function(x,y){searchPlacesByPosition(x,y)})('+places.x+','+places.y+')">검색</button>';
        // itemStr += ' <button id="place_'+places.id+'" class="searchByPosition" onclick="searchPlacesByPosition('+places.x+','+places.y+')">검색</button>';

        el.innerHTML = itemStr;
        el.className = 'item';

        return el;
    },

    // 검색결과 항목을 Element로 반환하는 함수입니다
    getSearchButton: function (places) {

        var el = document.createElement('button');
        el.innerHTML = '검색';
        el.className = 'searchByPosition';
        el.id = 'place_'+places.id;
        // el.addEventListener('click', 
        //                                     function () {
        //                                         console.log('click searchByPosition')
        //                                         myMap.fn_search(places.x, places.y);
        //                                     }, false);
        el.onclick = function() { myMap.fn_search(places.x, places.y) };
        // el.onclick = (function(x,y){
        //     myMap.fn_search(x,y);
        // })(places.x, places.y);

        return el;
    },

    // searchPlacesByPosition: function (x, y, callback_seach) {
    //     x = Number(x);
    //     y = Number(y);
    //     // 마커를 생성하고 지도에 표시합니다
    //     var placePosition = new kakao.maps.LatLng(y, x),
    //     bounds = new kakao.maps.LatLngBounds();

    //     // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
    //     // LatLngBounds 객체에 좌표를 추가합니다
    //     bounds.extend(placePosition);
    //     // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
    //     this.map.setBounds(bounds);

    //     // searchPlaces();
    //     console.log('searchPlacesByPosition!');

    //     var keyword = $('#keyword').val();
    //     // var keyword = document.getElementById('keyword').value;
    //     console.log('키워드를 입력!', keyword);

    //     if (!keyword.replace(/^\s+|\s+$/g, '')) {
    //         console.log('키워드를 입력해주세요!');
    //         return; // false;
    //     }

    //     // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
    //     this.ps.keywordSearch( keyword, callback_seach); 
    // },


    // 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
    addMarker: function (position, idx, title) {
        var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
            imageSize = new this.kakao.maps.Size(36, 37),  // 마커 이미지의 크기
            imgOptions =  {
                spriteSize : new this.kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
                spriteOrigin : new this.kakao.maps.Point(0, (idx*46)+10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
                offset: new this.kakao.maps.Point(13, 37) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
            },
            markerImage = new this.kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
            marker = new this.kakao.maps.Marker({
                position: position, // 마커의 위치
                image: markerImage 
            });

        marker.setMap(this.map); // 지도 위에 마커를 표출합니다
        this.markers.push(marker);  // 배열에 생성된 마커를 추가합니다

        return marker;
    },

    // 지도 위에 표시되고 있는 마커를 모두 제거합니다
    removeMarker: function () {
        for ( var i = 0; i < this.markers.length; i++ ) {
            this.markers[i].setMap(null);
        }   
        this.markers = [];
    },

    // 검색결과 목록 하단에 페이지번호를 표시는 함수입니다
    displayPagination: function (pagination) {
        var paginationEl = document.querySelector('#pagination'),
            fragment = document.createDocumentFragment(),
            i; 

        // 기존에 추가된 페이지번호를 삭제합니다
        while (paginationEl.hasChildNodes()) {
            paginationEl.removeChild (paginationEl.lastChild);
        }

        for (i=1; i<=pagination.last; i++) {
            var el = document.createElement('a');
            el.href = "#";
            el.innerHTML = "<"+i+">";

            if (i===pagination.current) {
                el.className = 'on';
            } else {
                el.onclick = (function(i) {
                    return function() {
                        pagination.gotoPage(i);
                    }
                })(i);
            }

            fragment.appendChild(el);
        }
        paginationEl.appendChild(fragment);
    },


    // 검색결과 목록의 자식 Element를 제거하는 함수입니다
    removeAllChildNods: function (el) {   
        while (el.hasChildNodes()) {
            el.removeChild (el.lastChild);
        }
    },

}

export default myMap