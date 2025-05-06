import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import Trafficlight from './Trafficlight';

export default class LiveTraffic extends Component {
  static defaultProps = {
    center: { lat: 25.467663, lng: 78.623961 }, // Madhya Pradesh center
    zoom: 15,
  };

  constructor() {
    super();
    this.state = {
      countdown: 0,
      lights: ['red', 'red', 'red', 'red'],
      carCounts: [0, 0, 0, 0]
    };
  }

  sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  carf = (total) => {
    if (total < 20) return 20;
    if (total < 40) return 40;
    if (total < 60) return 60;
    if (total < 80) return 80;
    if (total < 100) return 100;
    return 120;
  };

  generateRandomTraffic = () => {
    return Array.from({ length: 4 }, () => Math.floor(Math.random() * 20) + 1);
  };

  updateTraffic = (burst_time, activeLane) => {
    const updated = burst_time.map((count, idx) => {
      const change = Math.floor(Math.random() * (idx === activeLane ? count / 2 : 3)) + 1;
      return Math.max(count + (idx === activeLane ? -change : change), 0);
    });
    this.setState({ carCounts: updated });
    return updated;
  };

  async cycleTraffic() {
    let laneIndex = 0;
    while (true) {
      let burst_time = this.generateRandomTraffic();
      this.setState({ carCounts: burst_time });

      const totalCars = burst_time.reduce((sum, count) => sum + count, 0);
      const totalTime = this.carf(totalCars);

      const laneTime = burst_time.map(count =>
        Math.ceil((count / totalCars) * totalTime)
      );

      const activeTime = Math.max(totalTime / 10, Math.min(laneTime[laneIndex], totalTime / 3));

      const lights = ['red', 'red', 'red', 'red'];
      lights[laneIndex] = 'green';
      this.setState({ lights });

      let timePassed = 0;
      while (burst_time[laneIndex] > 0 && timePassed <= activeTime) {
        await this.sleep(3000);
        burst_time = this.updateTraffic(burst_time, laneIndex);
        timePassed += 3;
      }

      lights[laneIndex] = 'yellow';
      this.setState({ lights });
      await this.sleep(3000);

      lights[laneIndex] = 'red';
      this.setState({ lights });

      laneIndex = (laneIndex + 1) % 4;
    }
  }

  componentDidMount() {
    this.cycleTraffic();
  }

  render() {
    const { carCounts, lights } = this.state;

    const locations = [
      { lat: 23.2521, lng: 77.4308 }, // Prabhat Chauraha, Bhopal
      { lat: 23.257544, lng: 77.477512 }, // Ayodhya Bypass, Bhopal
      { lat: 22.754639, lng: 75.894718 }, // Vijay Nagar, Indore
      { lat: 26.199411, lng: 78.148670 }, // Maharaj Bada, Gwalior
      { lat: 23.167000, lng: 79.933000 }, // Jabalpur Main Road
      { lat: 24.600500, lng: 80.832200 }, // Satna City Road
    ];
    
    // const api_key = 'AIzaSyAtx_lIJ0GsFLKtlaCsMyo7K7Rq8IeTCx4';
    // cinst API =   "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"

    return (
      <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyA99skK_9Nbs0XIn340PKxdPbtN4xL30G0' } | {client: '516291369738-7hgc7ccvghu0trge61ptsqi5786peuro.apps.googleusercontent.com' } }
        defaultCenter={this.props.center}
        defaultZoom={this.props.zoom}
        layerTypes={['TrafficLayer']}
        options={{ styles: mapStyle }}
      >
        {locations.map((loc, idx) => (
          <Trafficlight
            key={idx}
            lat={loc.lat}
            lng={loc.lng}
            color={lights[idx % 4]}
            count={carCounts[idx % 4]}
          />
        ))}
      </GoogleMapReact>
    );
  }
}

// Custom Google Map styles
const mapStyle = [
  {
    featureType: 'all',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#7c93a3'
      },
      {
        lightness: '-10'
      }
    ]
  },
  {
    featureType: 'administrative.country',
    elementType: 'geometry',
    stylers: [
      {
        visibility: 'on'
      }
    ]
  },
  {
    featureType: 'administrative.country',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#a0a4a5'
      }
    ]
  },
  {
    featureType: 'administrative.province',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#62838e'
      }
    ]
  },
  {
    featureType: 'landscape',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#dde3e3'
      }
    ]
  },
  {
    featureType: 'landscape.man_made',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#3f4a51'
      },
      {
        weight: '0.30'
      }
    ]
  },
  {
    featureType: 'poi',
    elementType: 'all',
    stylers: [
      {
        visibility: 'simplified'
      }
    ]
  },
  {
    featureType: 'poi.attraction',
    elementType: 'all',
    stylers: [
      {
        visibility: 'on'
      }
    ]
  },
  {
    featureType: 'poi.business',
    elementType: 'all',
    stylers: [
      {
        visibility: 'off'
      }
    ]
  },
  {
    featureType: 'poi.government',
    elementType: 'all',
    stylers: [
      {
        visibility: 'off'
      }
    ]
  },
  {
    featureType: 'poi.park',
    elementType: 'all',
    stylers: [
      {
        visibility: 'on'
      }
    ]
  },
  {
    featureType: 'poi.place_of_worship',
    elementType: 'all',
    stylers: [
      {
        visibility: 'off'
      }
    ]
  },
  {
    featureType: 'poi.school',
    elementType: 'all',
    stylers: [
      {
        visibility: 'off'
      }
    ]
  },
  {
    featureType: 'poi.sports_complex',
    elementType: 'all',
    stylers: [
      {
        visibility: 'off'
      }
    ]
  },
  {
    featureType: 'road',
    elementType: 'all',
    stylers: [
      {
        saturation: '-100'
      },
      {
        visibility: 'on'
      }
    ]
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [
      {
        visibility: 'on'
      }
    ]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#bbcacf'
      }
    ]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [
      {
        lightness: '0'
      },
      {
        color: '#bbcacf'
      },
      {
        weight: '0.50'
      }
    ]
  },
  {
    featureType: 'road.highway',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'on'
      }
    ]
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text',
    stylers: [
      {
        visibility: 'on'
      }
    ]
  },
  {
    featureType: 'road.highway.controlled_access',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#ffffff'
      }
    ]
  },
  {
    featureType: 'road.highway.controlled_access',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#a9b4b8'
      }
    ]
  },
  {
    featureType: 'road.arterial',
    elementType: 'labels.icon',
    stylers: [
      {
        invert_lightness: true
      },
      {
        saturation: '-7'
      },
      {
        lightness: '3'
      },
      {
        gamma: '1.80'
      },
      {
        weight: '0.01'
      }
    ]
  },
  {
    featureType: 'transit',
    elementType: 'all',
    stylers: [
      {
        visibility: 'off'
      }
    ]
  },
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#a3c7df'
      }
    ]
  }
]; 