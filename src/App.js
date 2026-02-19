import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import "./App.css";
import airportData from "./airportData.json";
import linesData from "./linesData.json";

// Toggle this off to disable fade transition between poem and codes.
const ENABLE_FADE_TRANSITION = true;
const FADE_OUT_DURATION = 220; // milliseconds
const FADE_IN_DURATION = 260; // milliseconds

const airportCodes = `CON-CEA-LED-ATL-ASO-FOU-RAP-PRO-ACH-ING-DEM-ISE

INT-HED-IST-ORT-EDW-ORL-DTR-UTH-ISJ-UST-AMO-MEN-TOF-IMP-OST-URE
GUY-DEB-ORD

ATD-AWN-THE-LIL-TOF-ASM-ALL-ROB-INS-SON-GPI-ERC-EST-HED-USH
AND-HIG-HAB-OVE-CON-TRA-ILS-WRI-TET-HEI-RLO-NGS-YMB-OLI-CSC-ARS
EAR-LYR-ISE-RSW-ATE-RGA-RDE-NSL-IST-ENI-NGI-NTE-NTL-YCO-MMU-TER-BUS-TLE
DOE-SNO-TYE-TFI-LLT-HES-TRE-ETS-AND-THE-ROB-INC-HIR-PSI-TST-UNE
EAR-THC-RUM-BLE-SBE-TWE-ENF-ING-ERS-AND-WEH-ARV-EST-AIR
THI-NAS-COD-ETH-ISI-STH-EWO-RLD-WEH-OLD-WET-HIN-KAG-AIN
SEN-SIN-GMI-NER-ALL-OSS

ATE-IGH-TTH-EMA-RKE-TSF-ILL-WIT-HBR-ILL-IAN-TCA-RGO
VAL-ENC-IAB-LOO-DOR-ANG-ESR-IPE-CAM-BRI-DGE-STR-AWB-ERR-IES
HUN-GAR-IAN-MAR-ASC-HIN-OCH-ERR-IES-IRA-NIA-NPE-ARL-CAV-IAR
TUR-KIS-HGO-LDS-AFF-RON-THE-LIF-TIN-GST-ACK-ING-AND-ARR-ANG-ING
OFJ-ARS-BOX-ESB-UND-LES-CRA-TES-CRE-ATE-SMO-UNT-AIN-SOF-RIC-HES
VOI-CES-BLE-NDA-GAI-NST-THE-MAR-KET-STA-LLS
AND-WEL-EAR-NTO-REA-DTH-EWO-RLD

THE-MIN-DTA-KES-FLI-GHT-MID-MOR-NIN-GST-RIV-ING-FOR
ASW-ANS-HIG-HRE-ACH-OVE-RST-ORM-SWO-LLE-NSK-IES
FLI-GHT-PAT-HSR-EVE-ALT-HEE-ART-HIN-STE-ADY-MOT-ION
WET-RAC-ETH-EMA-RKS-ACR-OSS-THI-SCO-DED-POE-TRY
WEA-RET-HES-YMB-OLS-AND-WRI-TER-SOF-THE-SYS-TEM
WEA-RET-HEH-ARD-WAR-EAN-DSO-FTW-ARE-OFI-TSF-LUX
WEA-RET-HEW-ATC-HER-SAN-DTH-EDO-OMO-FWA-TCH-ING

DEE-PIN-TOA-FTE-RNO-ONL-IGH-TSP-ANS-RIV-ERS-AND-FIE-LDS
AND-FAR-MSF-ORM-GRI-DSO-URE-YES-ABS-ORB-ING
FRO-MUP-HIG-HVA-RIE-TIE-SOF-TEX-TUR-ESE-ETH-ISP-LAN-ETS
VAS-TPL-AIN-SME-ETB-LUE-BLA-CKS-KIE-SAL-ONG-ASI-LKY-ARC
ASC-LOU-DSV-ANI-SHI-NCO-MMO-TIO-NPA-STT-HEM-OUN-TAI-NRA-NGE
TIM-EDW-IND-LES-TOA-NIN-STA-NTO-FFL-ASH-EAR-THD-ARK-ENS
AND-ADO-OMS-DAY-PRA-YER-HOV-ERS-OVE-RLO-NGB-LAD-ESO-FNI-GHT`;

const poem = `Concealed Atlas of Our Approaching Demise

"In the distorted world, truth is just a moment of imposture"
                                – Guy Debord

At dawn, the lilt of a small robin's song pierces the hush
and high above contrails write their long symbolic scars.
Early risers water gardens, listening intently. Commuter bustle
does not yet fill the streets, and the robin chirps its tune.
Earth crumbles between fingers and we harvest air
thin as code. This is the world we hold, we think again,
sensing mineral loss.

At eight, the markets fill with brilliant cargo:
Valencia blood oranges, ripe Cambridge strawberries,
Hungarian maraschino cherries, Iranian pearl caviar,
Turkish gold saffron. The lifting, stacking, and arranging
of jars, boxes, bundles, and crates creates mountains of riches.
Voices blend against the market stalls
and we learn to read the world.

The mind takes flight, midmorning, striving for
a swan's high reach over stormswollen skies.
Flight paths reveal the Earth in steady motion.
We trace the marks across this coded poetry.
We are the symbols and writers of the system.
We are the hardware and software of its flux.
We are the watchers and the doom of watching.

Deep into afternoon, light spans rivers and fields,
and farms form grids, our eyes absorbing
from up high, varieties of texture. See this planet's
vast plains meet blueblack skies along a silky arc.
As clouds vanish in commotion past the mountain range,
time dwindles to an instant of flash, Earth darkens,
and a doomsday prayer hovers over long blades of night.`;

const findAirportByCode = (code) => {
  return airportData.find((a) => a.code === code);
};

const App = () => {
  const [bubbleStyle, setBubbleStyle] = useState({ top: "-1000px", left: "-1000px" });
  const transitionTimeoutRef = useRef(null);

  const setBubblePosition = (rect, type) => {
    const contentRect = displayRef.current.getBoundingClientRect();
    const infoBubbleRect = bubbleRef.current.getBoundingClientRect();

    const AL = rect.left;
    const AR = contentRect.width - rect.right;
    const AT = rect.top;
    const AB = contentRect.height - rect.bottom;

    const maxHorizontalSpace = Math.max(AL, AR);
    const maxVerticalSpace = Math.max(AT, AB);

    const bubbleStyle = {};

    if (type === "line") {
      bubbleStyle.left = rect.left + (rect.width - infoBubbleRect.width) / 2;
    } else {
      bubbleStyle.left = (maxHorizontalSpace === AL)
        ? rect.left - infoBubbleRect.width
        : rect.right;
    }

    bubbleStyle.top = (maxVerticalSpace === AT)
      ? rect.top - infoBubbleRect.height
      : rect.bottom;

    setBubbleStyle(bubbleStyle);
  };

  const [selectedAirport, setSelectedAirport] = useState(null);
  const [displayPoem, setDisplayPoem] = useState(true);
  const [transitionPhase, setTransitionPhase] = useState("idle");
  const displayRef = useRef();
  const [selectedLineData, setSelectedLineData] = useState(null);
  const [selectedCode, setSelectedCode] = useState(null);
  const bubbleRef = useRef();
  const [highlightedLine, setHighlightedLine] = useState(null);

  // classify emissions (optional styling hook)
  const getEmissionsIntensity = (carbonFootprint) => {
    const match = carbonFootprint.match(/[\d,]+\.?\d*/);
    if (!match) return "normal";
    const emissions = parseFloat(match[0].replace(/,/g, ""));
    const highEmissionThreshold = 1500000;
    return emissions > highEmissionThreshold ? "high" : "normal";
  };

  // Static map via proxy
  const getSecureMapUrl = (airport) => {
    if (!airport || !airport.lat || !airport.lon) return null;
    const params = new URLSearchParams({
      center: `${airport.lat},${airport.lon}`,
      zoom: "6",
      size: "600x400",
      maptype: "roadmap",
      markers: `color:red|${airport.lat},${airport.lon}`,
    });
    return `/.netlify/functions/maps?${params.toString()}`;
  };

  useEffect(() => {
    if (selectedAirport && selectedCode && bubbleRef.current && displayRef.current) {
      const codeTarget = document.querySelector(`.code.selected-code`);
      if (codeTarget) {
        const rect = codeTarget.getBoundingClientRect();
        setBubblePosition(rect, "code");
      }
    }
  }, [selectedAirport, selectedCode]);

  useLayoutEffect(() => {
    if (selectedLineData && bubbleRef.current && displayRef.current) {
      const lineElement = document.querySelector(`.poem-line.highlighted-line`);
      if (lineElement) {
        const rect = lineElement.getBoundingClientRect();
        setBubblePosition(rect, "line");
      }
    }
  }, [selectedLineData]);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  const toggleDisplayMode = () => {
    if (!ENABLE_FADE_TRANSITION) {
      setDisplayPoem((prev) => !prev);
      return;
    }

    if (transitionPhase !== "idle") return;

    setTransitionPhase("out");
    transitionTimeoutRef.current = setTimeout(() => {
      setDisplayPoem((prev) => !prev);
      setTransitionPhase("in");
      transitionTimeoutRef.current = setTimeout(() => {
        setTransitionPhase("idle");
      }, FADE_IN_DURATION);
    }, FADE_OUT_DURATION);
  };

  const handleLineClick = (event, globalLineIndex) => {
    event.stopPropagation();
    if (linesData[globalLineIndex]) {
      setSelectedLineData(linesData[globalLineIndex]);
      setHighlightedLine(globalLineIndex);
      const rect = event.target.getBoundingClientRect();
      setBubblePosition(rect, "line");
    }
  };

  const handleClick = (event) => {
    // In poem mode, open line info bubbles.
    if (event.target.classList.contains("poem-text") && displayPoem) {
      const lineElement = event.target.closest(".poem-line");
      if (lineElement) {
        handleLineClick(event, parseInt(lineElement.dataset.index, 10));
        return;
      }
    }

    const codeTarget = event.target.closest(".code");
    if (codeTarget) {
      const tappedCode = codeTarget.textContent;
      const airport = findAirportByCode(tappedCode);
      setSelectedAirport(airport);
      setSelectedCode(tappedCode);
      setHighlightedLine(null);
      if (bubbleRef.current && displayRef.current) {
        const rect = codeTarget.getBoundingClientRect();
        setBubblePosition(rect, "code");
      }
      return;
    }

    if (!event.target.closest(".info-bubble")) {
      if (!selectedAirport && !selectedLineData) {
        toggleDisplayMode();
      } else {
        setSelectedAirport(null);
        setSelectedLineData(null);
        setSelectedCode(null);
        setHighlightedLine(null);
        setBubbleStyle({ top: "-1000px", left: "-1000px" });
      }
    }
  };

  let globalLineIndex = 0;

  return (
    <div className="App" ref={displayRef} onClick={handleClick}>
      <div className="content-container">
        <div className="credits-container">
          <span className="credits-text">Poem: Pedro Poitevin | Photo: Arturo Godoy</span>
        </div>

        <div
          className={`content-window${
            selectedAirport ? " selected-airport"
            : selectedLineData ? " selected-line-data"
            : ""
          }`}
        >
          <div className="content-window">
            <div className="responsive-container">
              <div className={`monospace transition-${transitionPhase}`}>
                {displayPoem
                  ? poem.split("\n\n").map((stanza, stanzaIndex) => (
                      <div
                        key={stanzaIndex}
                        className={`stanza${stanzaIndex === 0 ? " poem-title-stanza" : ""}`}
                      >
                        {stanza.split("\n").map((line) => {
                          const currentLineIndex = globalLineIndex++;
                          return (
                            <div
                              key={currentLineIndex}
                              data-index={currentLineIndex}
                              className={`poem-line ${
                                highlightedLine === currentLineIndex ? "highlighted-line" : ""
                              }`}
                            >
                              <div className="poem-text-container">
                                <span
                                  className={`poem-text${
                                    stanzaIndex === 0 ? " poem-title-text" : ""
                                  }`}
                                >
                                  {line}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))
                  : airportCodes.split("\n\n").map((stanza, stanzaIndex) => (
                      <div key={stanzaIndex} className="stanza">
                        {stanza.split("\n").map((line, lineIndex) => (
                          <div
                            key={`${stanzaIndex}-${lineIndex}`}
                            className={lineIndex === 0 ? "airport-codes-title" : ""}
                          >
                            {line.split("-").map((code, idx) => (
                              <React.Fragment key={idx}>
                                <span
                                  className={`code${selectedCode === code ? " selected-code" : ""}`}
                                >
                                  {code}
                                </span>
                                {idx !== line.split("-").length - 1 && "-"}
                              </React.Fragment>
                            ))}
                          </div>
                        ))}
                      </div>
                    ))}
              </div>
            </div>

            <div
              ref={bubbleRef}
              className={`info-bubble${
                (selectedAirport || (selectedLineData && displayPoem)) ? " show-info" : ""
              }`}
              style={{
                ...bubbleStyle,
                backgroundImage: selectedAirport ? `url(${getSecureMapUrl(selectedAirport)})` : "none",
                backgroundSize: selectedAirport ? "cover" : "none",
              }}
            >
              {selectedAirport && (
                <div className="airport-info-window info-window">
                  <div className="info">
                    <div className="airport-name">
                      <strong>{selectedAirport.name}</strong>
                    </div>
                    <div className="country">
                      <strong>{selectedAirport.country}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Only show per-line info bubble in Poem view */}
              {selectedLineData && (
                <div
                  className="line-data-window info-window line-data-window-custom"
                  data-high-emissions={getEmissionsIntensity(selectedLineData["carbon-footprint"]) === "high"}
                >
                  <div className="line-data">
                    <div className="itinerary">
                      <strong>{selectedLineData.itinerary}</strong>
                    </div>
                    <div style={{ margin: "10px 0" }} />
                    <div className="length">
                      <strong>{selectedLineData.length}</strong>
                    </div>
                    <div style={{ margin: "10px 0" }} />
                    <div className="carbon-footprint">
                      <strong>{selectedLineData["carbon-footprint"]}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="cta-container">
          <button className="cta-button">Tap Anywhere to Explore</button>
        </div>
      </div>
    </div>
  );
};

export default App;
