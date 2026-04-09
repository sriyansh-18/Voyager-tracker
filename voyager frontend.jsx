import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@r128/build/three.module.js';

const VoyagerMissionControl = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const [probeData, setProbeData] = useState({ v1: null, v2: null });
  const [selectedTab, setSelectedTab] = useState('overview');
  const [anomalies, setAnomalies] = useState([]);
  const [timeline, setTimeline] = useState([]);

  // Initialize 3D scene
  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e27);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100000);
    camera.position.set(0, 25, 35);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xffffff, 1.5, 0);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // Sun
    const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xFDB813 });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Sun glow
    const glowGeometry = new THREE.SphereGeometry(2.5, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xFDB813,
      transparent: true,
      opacity: 0.2,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glow);

    // Orbital paths
    const orbitalPath = (radius, color) => {
      const points = [];
      for (let i = 0; i <= 64; i++) {
        const angle = (i / 64) * Math.PI * 2;
        points.push(
          new THREE.Vector3(
            Math.cos(angle) * radius,
            0,
            Math.sin(angle) * radius
          )
        );
      }
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const lineMaterial = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.3,
      });
      return new THREE.Line(lineGeometry, lineMaterial);
    };

    // Add orbital paths for reference
    scene.add(orbitalPath(20, 0x4a90e2)); // Inner
    scene.add(orbitalPath(45, 0x7ed321)); // Outer

    // Voyager probes
    const createProbe = (color) => {
      const group = new THREE.Group();
      const geometry = new THREE.OctahedronGeometry(0.5, 2);
      const material = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.5 });
      const mesh = new THREE.Mesh(geometry, material);
      group.add(mesh);

      // Antenna
      const antennaGeometry = new THREE.CylinderGeometry(0.15, 0.15, 1.5);
      const antennaMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc });
      const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
      antenna.position.y = 1;
      group.add(antenna);

      return group;
    };

    const v1Probe = createProbe(0x00ff88);
    const v2Probe = createProbe(0xff6b9d);
    scene.add(v1Probe);
    scene.add(v2Probe);

    // Trajectory trails
    const trailGeometry = new THREE.BufferGeometry();
    const trailMaterial = new THREE.LineBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.5,
    });
    const trail1 = new THREE.Line(trailGeometry, trailMaterial);
    scene.add(trail1);

    const trail2Geometry = new THREE.BufferGeometry();
    const trail2Material = new THREE.LineBasicMaterial({
      color: 0xff6b9d,
      transparent: true,
      opacity: 0.5,
    });
    const trail2 = new THREE.Line(trail2Geometry, trail2Material);
    scene.add(trail2);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate sun
      sun.rotation.y += 0.001;
      glow.rotation.y -= 0.0005;

      // Update probe positions
      if (probeData.v1) {
        const v1Pos = probeData.v1.position;
        v1Probe.position.set(v1Pos.x * 2, v1Pos.y * 2, v1Pos.z * 2);
        v1Probe.rotation.x += 0.01;
        v1Probe.rotation.y += 0.02;
      }

      if (probeData.v2) {
        const v2Pos = probeData.v2.position;
        v2Probe.position.set(v2Pos.x * 2, v2Pos.y * 2, v2Pos.z * 2);
        v2Probe.rotation.x -= 0.01;
        v2Probe.rotation.y += 0.015;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [probeData]);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [v1, v2, anomData, timelineData] = await Promise.all([
          fetch('http://localhost:8000/probes/v1/status').then(r => r.json()),
          fetch('http://localhost:8000/probes/v2/status').then(r => r.json()),
          Promise.all([
            fetch('http://localhost:8000/probes/v1/analysis').then(r => r.json()),
            fetch('http://localhost:8000/probes/v2/analysis').then(r => r.json())
          ]),
          fetch('http://localhost:8000/timeline').then(r => r.json())
        ]);

        setProbeData({ v1, v2 });
        setAnomalies([
          ...(anomData[0]?.anomalies || []),
          ...(anomData[1]?.anomalies || [])
        ]);
        setTimeline(timelineData.events || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>▌ VOYAGER MISSION CONTROL ▌</h1>
          <div style={styles.statusLine}>
            <span style={styles.statusDot}></span>
            <span>LIVE TELEMETRY • 24.9 BILLION KM AWAY • SIGNAL STRENGTH: 99.2%</span>
          </div>
        </div>
      </header>

      <div style={styles.mainContent}>
        <div style={styles.sceneContainer} ref={containerRef}></div>

        <div style={styles.sidebar}>
          <div style={styles.tabBar}>
            {['overview', 'timeline', 'anomalies', 'instruments'].map(tab => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                style={{
                  ...styles.tabButton,
                  ...(selectedTab === tab ? styles.tabButtonActive : {})
                }}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          <div style={styles.sidebarContent}>
            {selectedTab === 'overview' && (
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>VOYAGER 1</h3>
                {probeData.v1 && (
                  <div style={styles.dataGrid}>
                    <div style={styles.dataItem}>
                      <span style={styles.dataLabel}>DISTANCE</span>
                      <span style={styles.dataValue}>{probeData.v1.distance_billion_km.toFixed(1)}B km</span>
                    </div>
                    <div style={styles.dataItem}>
                      <span style={styles.dataLabel}>VELOCITY</span>
                      <span style={styles.dataValue}>{probeData.v1.speed_km_s} km/s</span>
                    </div>
                    <div style={styles.dataItem}>
                      <span style={styles.dataLabel}>MISSION AGE</span>
                      <span style={styles.dataValue}>{probeData.v1.age_years.toFixed(1)}y</span>
                    </div>
                    <div style={styles.dataItem}>
                      <span style={styles.dataLabel}>STATUS</span>
                      <span style={styles.dataValue}>● OPERATIONAL</span>
                    </div>
                  </div>
                )}

                <h3 style={{ ...styles.sectionTitle, marginTop: '2rem' }}>VOYAGER 2</h3>
                {probeData.v2 && (
                  <div style={styles.dataGrid}>
                    <div style={styles.dataItem}>
                      <span style={styles.dataLabel}>DISTANCE</span>
                      <span style={styles.dataValue}>{probeData.v2.distance_billion_km.toFixed(1)}B km</span>
                    </div>
                    <div style={styles.dataItem}>
                      <span style={styles.dataLabel}>VELOCITY</span>
                      <span style={styles.dataValue}>{probeData.v2.speed_km_s} km/s</span>
                    </div>
                    <div style={styles.dataItem}>
                      <span style={styles.dataLabel}>MISSION AGE</span>
                      <span style={styles.dataValue}>{probeData.v2.age_years.toFixed(1)}y</span>
                    </div>
                    <div style={styles.dataItem}>
                      <span style={styles.dataLabel}>STATUS</span>
                      <span style={styles.dataValue}>● OPERATIONAL</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedTab === 'timeline' && (
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>MISSION TIMELINE</h3>
                <div style={styles.timelineList}>
                  {timeline.slice(0, 8).map((event, idx) => (
                    <div key={idx} style={styles.timelineItem}>
                      <div style={styles.timelineDate}>{event.date}</div>
                      <div style={styles.timelineEvent}>{event.event}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'anomalies' && (
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>ANOMALY DETECTION</h3>
                {anomalies.length > 0 ? (
                  <div style={styles.anomalyList}>
                    {anomalies.map((anom, idx) => (
                      <div key={idx} style={{
                        ...styles.anomalyItem,
                        borderLeftColor: anom.severity === 'high' ? '#ff6b6b' : '#ffd93d'
                      }}>
                        <div style={styles.anomalySeverity}>{anom.severity.toUpperCase()}</div>
                        <div style={styles.anomalyText}>{anom.instrument}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={styles.noData}>NO ANOMALIES DETECTED</div>
                )}
              </div>
            )}

            {selectedTab === 'instruments' && (
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>INSTRUMENT STATUS</h3>
                <div style={styles.instrumentsList}>
                  <div style={styles.instrumentItem}>
                    <span>Cosmic Ray Subsystem</span>
                    <span style={styles.statusGood}>✓</span>
                  </div>
                  <div style={styles.instrumentItem}>
                    <span>Magnetometer</span>
                    <span style={styles.statusGood}>✓</span>
                  </div>
                  <div style={styles.instrumentItem}>
                    <span>Plasma Wave System</span>
                    <span style={styles.statusGood}>✓</span>
                  </div>
                  <div style={styles.instrumentItem}>
                    <span>Power Generation</span>
                    <span style={styles.statusWarning}>⚠</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100vw',
    height: '100vh',
    background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
    color: '#0ff',
    fontFamily: '"Courier New", monospace',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    background: 'rgba(10, 14, 39, 0.8)',
    borderBottom: '2px solid #0ff',
    padding: '1.5rem 2rem',
    backdropFilter: 'blur(10px)',
  },
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    margin: '0 0 0.5rem',
    textShadow: '0 0 10px #0ff',
    letterSpacing: '3px',
  },
  statusLine: {
    fontSize: '0.9rem',
    color: '#0f0',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  statusDot: {
    display: 'inline-block',
    width: '8px',
    height: '8px',
    background: '#0f0',
    borderRadius: '50%',
    animation: 'pulse 2s infinite',
  },
  mainContent: {
    display: 'flex',
    flex: 1,
    gap: '1rem',
    padding: '1rem',
    overflow: 'hidden',
  },
  sceneContainer: {
    flex: 1,
    background: 'rgba(10, 14, 39, 0.4)',
    borderRadius: '4px',
    border: '1px solid rgba(0, 255, 136, 0.2)',
    overflow: 'hidden',
  },
  sidebar: {
    width: '380px',
    background: 'rgba(26, 31, 58, 0.8)',
    border: '1px solid rgba(0, 255, 136, 0.3)',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column',
    backdropFilter: 'blur(10px)',
  },
  tabBar: {
    display: 'flex',
    borderBottom: '1px solid rgba(0, 255, 136, 0.2)',
  },
  tabButton: {
    flex: 1,
    padding: '0.75rem',
    background: 'transparent',
    color: '#0ff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontFamily: '"Courier New", monospace',
    borderBottom: '2px solid transparent',
    transition: 'all 0.2s',
  },
  tabButtonActive: {
    borderBottomColor: '#0ff',
    textShadow: '0 0 5px #0ff',
  },
  sidebarContent: {
    flex: 1,
    overflow: 'auto',
    padding: '1.5rem',
  },
  section: {
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontSize: '0.9rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: '#0f0',
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },
  dataGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  dataItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
    padding: '0.8rem',
    background: 'rgba(0, 255, 136, 0.05)',
    border: '1px solid rgba(0, 255, 136, 0.2)',
    borderRadius: '3px',
  },
  dataLabel: {
    fontSize: '0.7rem',
    color: '#0f0',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  dataValue: {
    fontSize: '1.1rem',
    color: '#0ff',
    fontWeight: 'bold',
  },
  timelineList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  timelineItem: {
    paddingLeft: '1rem',
    borderLeft: '2px solid #0f0',
  },
  timelineDate: {
    fontSize: '0.75rem',
    color: '#0f0',
  },
  timelineEvent: {
    fontSize: '0.9rem',
    color: '#0ff',
  },
  anomalyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
  },
  anomalyItem: {
    padding: '0.8rem',
    background: 'rgba(255, 0, 0, 0.05)',
    borderLeft: '3px solid #ff6b6b',
    borderRadius: '2px',
  },
  anomalySeverity: {
    fontSize: '0.7rem',
    color: '#ff6b6b',
    fontWeight: 'bold',
  },
  anomalyText: {
    fontSize: '0.9rem',
    color: '#0ff',
    marginTop: '0.3rem',
  },
  noData: {
    padding: '2rem 1rem',
    textAlign: 'center',
    color: '#0f0',
    opacity: 0.6,
  },
  instrumentsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
  },
  instrumentItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.7rem 0.8rem',
    background: 'rgba(0, 255, 136, 0.05)',
    border: '1px solid rgba(0, 255, 136, 0.2)',
    borderRadius: '3px',
    fontSize: '0.85rem',
  },
  statusGood: {
    color: '#0f0',
  },
  statusWarning: {
    color: '#ffd93d',
  },
};

// CSS keyframes injection
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;
document.head.appendChild(styleSheet);

export default VoyagerMissionControl;