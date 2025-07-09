// types/google-maps.d.ts
// Add this file to your project's types directory

declare namespace google {
    namespace maps {
      class Map {
        constructor(mapDiv: Element | null, opts?: MapOptions);
        setCenter(latlng: LatLng | LatLngLiteral): void;
        setZoom(zoom: number): void;
        setMapTypeId(mapTypeId: MapTypeId): void;
      }
  
      class Marker {
        constructor(opts?: MarkerOptions);
        setPosition(latlng: LatLng | LatLngLiteral | null): void;
        getPosition(): LatLng | null;
        setMap(map: Map | null): void;
        setTitle(title: string): void;
        setAnimation(animation: Animation | null): void;
        addListener(eventName: string, handler: () => void): MapsEventListener;
      }
  
      class InfoWindow {
        constructor(opts?: InfoWindowOptions);
        open(map?: Map | StreetViewPanorama, anchor?: Marker): void;
        close(): void;
        setContent(content: string | Element): void;
      }
  
      class LatLng {
        constructor(lat: number, lng: number);
        lat(): number;
        lng(): number;
      }
  
      class Size {
        constructor(width: number, height: number, widthUnit?: string, heightUnit?: string);
      }
  
      interface MapOptions {
        center?: LatLng | LatLngLiteral;
        zoom?: number;
        mapTypeId?: MapTypeId;
        disableDefaultUI?: boolean;
        zoomControl?: boolean;
        streetViewControl?: boolean;
        fullscreenControl?: boolean;
        styles?: MapTypeStyle[];
      }
  
      interface MarkerOptions {
        position?: LatLng | LatLngLiteral;
        map?: Map;
        title?: string;
        icon?: string | Icon | Symbol;
        animation?: Animation;
      }
  
      interface InfoWindowOptions {
        content?: string | Element;
        position?: LatLng | LatLngLiteral;
        maxWidth?: number;
      }
  
      interface LatLngLiteral {
        lat: number;
        lng: number;
      }
  
      interface Icon {
        url: string;
        scaledSize?: Size;
        size?: Size;
        origin?: Point;
        anchor?: Point;
      }
  
      interface MapTypeStyle {
        featureType?: string;
        elementType?: string;
        stylers?: MapTypeStyler[];
      }
  
      interface MapTypeStyler {
        visibility?: string;
        color?: string;
        weight?: number;
        gamma?: number;
        hue?: string;
        lightness?: number;
        saturation?: number;
      }
  
      interface MapsEventListener {
        remove(): void;
      }
  
      interface Point {
        x: number;
        y: number;
      }
  
      interface Symbol {
        path: string | SymbolPath;
        fillColor?: string;
        fillOpacity?: number;
        strokeColor?: string;
        strokeOpacity?: number;
        strokeWeight?: number;
        scale?: number;
      }
  
      enum MapTypeId {
        ROADMAP = 'roadmap',
        SATELLITE = 'satellite',
        HYBRID = 'hybrid',
        TERRAIN = 'terrain'
      }
  
      enum Animation {
        BOUNCE = 1,
        DROP = 2
      }
  
      enum SymbolPath {
        CIRCLE = 0,
        FORWARD_CLOSED_ARROW = 1,
        FORWARD_OPEN_ARROW = 2,
        BACKWARD_CLOSED_ARROW = 3,
        BACKWARD_OPEN_ARROW = 4
      }
  
      class StreetViewPanorama {
        constructor(container: Element, opts?: StreetViewPanoramaOptions);
      }
  
      interface StreetViewPanoramaOptions {
        position?: LatLng | LatLngLiteral;
        pov?: StreetViewPov;
        zoom?: number;
        visible?: boolean;
      }
  
      interface StreetViewPov {
        heading?: number;
        pitch?: number;
      }
    }
  }